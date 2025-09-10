// scannerManager.mjs
import fs from 'fs';
import path from 'path';
import { Worker } from 'node:worker_threads';
import { ethers } from 'ethers';
import dotenv from 'dotenv';
dotenv.config();

import { CARLSJR_ABI, CARLSJR_ADDRESS, ERC20_MIN_ABI } from './dynamicAbi.mjs';

const GENERATED_FILE = path.resolve('./generatedPairs.json');
const WORKER_PATH    = path.resolve('./scannerWorker.mjs');

// Local minimal ABI for allowance/approve to fix "token.allowance is not a function"
const ERC20_APPROVE_ABI = [
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)'
];

// Use env var or fallback to on-chain default
const contractAddress = process.env.CONTRACT_ADDRESS || CARLSJR_ADDRESS;
const privateKey      = process.env.PRIVATE_KEY;
const rpcUrl          = process.env.RPC_URL;
const MAX_WORKERS     = 2;

if (!privateKey || !rpcUrl) {
  console.error(`[${new Date().toISOString()}] Missing PRIVATE_KEY or RPC_URL. Exiting.`);
  process.exit(1);
}

const provider = new ethers.JsonRpcProvider(rpcUrl);
const wallet   = new ethers.Wallet(privateKey, provider);
const carlsJrContract = new ethers.Contract(contractAddress, CARLSJR_ABI, wallet);

// Manual gas settings (no auto gas)
const GAS_LIMIT = BigInt(process.env.GAS_LIMIT || '2500000');
const MAX_FEE_PER_GAS_GWEI = process.env.MAX_FEE_PER_GAS_GWEI;      // total max fee cap
const PRIORITY_FEE_GWEI     = process.env.PRIORITY_FEE_GWEI;         // gas tip
const GAS_PRICE_GWEI        = process.env.GAS_PRICE_GWEI;            // legacy fallback

function resolveTxOpts() {
  if (MAX_FEE_PER_GAS_GWEI && PRIORITY_FEE_GWEI) {
    return {
      gasLimit: GAS_LIMIT,
      maxFeePerGas: ethers.parseUnits(String(MAX_FEE_PER_GAS_GWEI), 'gwei'),
      maxPriorityFeePerGas: ethers.parseUnits(String(PRIORITY_FEE_GWEI), 'gwei')
    };
  }
  if (GAS_PRICE_GWEI) {
    return {
      gasLimit: GAS_LIMIT,
      gasPrice: ethers.parseUnits(String(GAS_PRICE_GWEI), 'gwei')
    };
  }
  return { gasLimit: GAS_LIMIT };
}

function log(level, ...args) {
  console.log(`[${new Date().toISOString()}] [${level.toUpperCase()}]`, ...args);
}

function validatePairs(pairs) {
  return Array.isArray(pairs) &&
    pairs.every(p => p.name && Array.isArray(p.tokens) && p.tokens.length >= 2 && Array.isArray(p.tradePaths));
}

// Batch aggregator for combining multiple profitable routes sharing the same loan token
const BATCH_WINDOW_MS = Number(process.env.BATCH_WINDOW_MS || '1500');
const pendingBatches = new Map(); // loanToken -> { payloads: [], timer: Timeout }

// New helper: clamp amountIn by token decimals using MIN/MAX units in env
async function clampAmountInByToken(loanToken, requested) {
  let decimals = 18;
  try {
    const erc20 = new ethers.Contract(loanToken, ERC20_MIN_ABI, provider);
    decimals = await erc20.decimals();
  } catch {}
  const minUnitsStr = String(process.env.MIN_FLASHLOAN_UNITS || '1');
  const maxUnitsStr = String(process.env.MAX_FLASHLOAN_UNITS || '10');
  const minUnits = ethers.parseUnits(minUnitsStr, decimals);
  const maxUnits = ethers.parseUnits(maxUnitsStr, decimals);

  let amount = requested;
  if (amount < minUnits) amount = minUnits;
  if (amount > maxUnits) amount = maxUnits;

  return { amount, decimals, minUnits, maxUnits };
}

// Nonce management to prevent collisions across concurrent sends
let nonceLock = Promise.resolve();
let managedNonce = null;

async function sendArbTx(params) {
  const txOpts = resolveTxOpts();
  return (nonceLock = nonceLock.then(async () => {
    if (managedNonce === null) {
      managedNonce = await provider.getTransactionCount(wallet.address, 'pending');
    }
    const nonce = managedNonce;
    try {
      const tx = await carlsJrContract.executePreciseArbitrage(params, { ...txOpts, nonce });
      managedNonce++; // increment only after successful submission
      return tx;
    } catch (err) {
      // do not increment on failure; retry will reuse the same nonce
      throw err;
    }
  }));
}

function scheduleBatchSend(loanToken /* string */) {
  if (pendingBatches.get(loanToken)?.timer) return;

  const timer = setTimeout(async () => {
    const entry = pendingBatches.get(loanToken);
    if (!entry) return;
    pendingBatches.delete(loanToken);

    const payloads = entry.payloads;

    // Optimize route selection:
    // 1) Prefer payloads that both start and end with the loan token (round-trip).
    // 2) If none, try to stitch two payloads: lt -> X then X -> lt.
    // 3) If still none, fall back to any payloads that start with lt.
    const lt = String(loanToken).toLowerCase();

    const startsWith = (p) => p?.tradePath?.[0]?.path?.[0]?.toLowerCase() === lt;
    const endTokenOf = (p) => {
      const lastStep = p?.tradePath?.[p.tradePath.length - 1];
      return lastStep?.path?.[lastStep.path.length - 1]?.toLowerCase();
    };

    const roundTrip = payloads.filter(p => startsWith(p) && endTokenOf(p) === lt);

    let chosen = [];
    if (roundTrip.length > 0) {
      chosen = roundTrip; // concatenate multiple round-trip routes
    } else {
      // Attempt to stitch two payloads: lt->X then X->lt
      const startLT = payloads.filter(p => startsWith(p));
      // Build index by start token for quick lookup
      const byStart = new Map();
      for (const p of payloads) {
        const s = p?.tradePath?.[0]?.path?.[0]?.toLowerCase();
        if (!s) continue;
        if (!byStart.has(s)) byStart.set(s, []);
        byStart.get(s).push(p);
      }
      let stitched = null;
      for (const p of startLT) {
        const mid = endTokenOf(p);
        if (!mid) continue;
        const cands = byStart.get(mid) || [];
        const q = cands.find(x => endTokenOf(x) === lt);
        if (q) { stitched = [p, q]; break; }
      }
      if (stitched) {
        chosen = stitched;
      } else {
        // Fallback: any payloads that at least start at lt
        chosen = startLT;
      }
    }

    if (chosen.length === 0) {
      log('warn', `No round-trip-safe routes for loanToken ${loanToken}. Skipping batch.`);
      return;
    }

    // Merge tradePaths sequentially from chosen set
    let combinedTradePath = [];
    let totalMinProfit = 0n;

    for (const p of chosen) {
      combinedTradePath = combinedTradePath.concat(p.tradePath);
      totalMinProfit += BigInt(p.minProfit);
    }

    // Use the first payload's amountIn, then clamp it
    const requestedAmountIn = BigInt(chosen[0].amountIn || '0');
    const { amount: effectiveAmountIn } = await clampAmountInByToken(loanToken, requestedAmountIn);

    // Proportionally scale the profit expectation to the clamped amount
    let scaledMinProfit = 0n;
    if (requestedAmountIn > 0n) {
      scaledMinProfit = (totalMinProfit * effectiveAmountIn) / requestedAmountIn;
    }

    // Safety and flash fee buffers
    const SAFETY_MARGIN_BPS = 300n;
    const AAVE_FEE_BPS      = 5n;
    const BPS_DIV           = 10000n;

    const flashFee = (effectiveAmountIn * AAVE_FEE_BPS) / BPS_DIV;
    const profitWithMargin = (scaledMinProfit * (BPS_DIV - SAFETY_MARGIN_BPS)) / BPS_DIV;

    const params = {
      tradePath: combinedTradePath,
      amountIn: effectiveAmountIn,
      minProfit: profitWithMargin + flashFee,
      amountOutMinimum: 0n
    };

    log('info', `💰 Executing batched arbitrage for loanToken ${loanToken} with ${chosen.length} routes`, params);

    for (let i = 0; i < 3; i++) {
      try {
        const tx  = await sendArbTx(params);
        log('info', `TX sent: ${tx.hash}`);
        await tx.wait();
        log('info', `TX confirmed: ${tx.hash}`);
        break;
      } catch (err) {
        log('error', `Batched arb exec failed (attempt ${i+1}):`, err.message || err);
      }
    }
  }, BATCH_WINDOW_MS);

  const entry = pendingBatches.get(loanToken) || { payloads: [], timer: null };
  entry.timer = timer;
  pendingBatches.set(loanToken, entry);
}

// ---------- New: Pre-approval flow ----------
function collectRoutersAndTokens(pairs) {
  const routers = new Set();
  const tokens = new Set();
  for (const p of pairs) {
    for (const path of (p.tradePaths || [])) {
      for (const step of (path.steps || [])) {
        if (step.router && ethers.isAddress(step.router)) routers.add(step.router.toLowerCase());
        for (const t of (step.path || [])) {
          if (t && ethers.isAddress(t)) tokens.add(t.toLowerCase());
        }
      }
    }
  }
  return { routers: [...routers], tokens: [...tokens] };
}

async function ensureApprovals(pairs) {
  const { routers, tokens } = collectRoutersAndTokens(pairs);
  const spenders = new Set([...routers.map(r => r), contractAddress.toLowerCase()]); // routers + CarlsJr (defensive)
  const threshold = ethers.MaxUint256 / 2n;

  log('info', `Approval plan -> tokens: ${tokens.length}, spenders: ${spenders.size}`);

  for (const tokenAddr of tokens) {
    const token = new ethers.Contract(tokenAddr, ERC20_APPROVE_ABI, wallet);
    for (const spender of spenders) {
      try {
        const current = await token.allowance(wallet.address, spender);
        if (current && BigInt(current.toString()) >= threshold) {
          log('info', `Allowance OK token=${tokenAddr} -> spender=${spender}`);
          continue;
        }
        log('info', `Approving token=${tokenAddr} -> spender=${spender} to MaxUint`);
        const tx = await token.approve(spender, ethers.MaxUint256, resolveTxOpts());
        log('info', `Approve TX sent: ${tx.hash}`);
        await tx.wait();
        log('info', `Approve TX confirmed: ${tx.hash}`);
      } catch (err) {
        log('error', `Approve failed token=${tokenAddr} spender=${spender}:`, err?.message || err);
      }
    }
  }

  // Note: Flashloans generally do not need ERC20 approvals; lenders transfer to borrower.
  // This placeholder remains in case a future lender requires approvals.
  return true;
}
// ---------- End: Pre-approval flow ----------

export function spawnScannerManager(liveMode = false) {
  let pairs;
  try {
    pairs = JSON.parse(fs.readFileSync(GENERATED_FILE, 'utf8'));
  } catch (err) {
    log('error', 'Cannot read generatedPairs.json:', err);
    process.exit(1);
  }

  if (!validatePairs(pairs)) {
    log('error', 'No valid pairs. Exiting.');
    process.exit(1);
  }

  // Defer scanning until approvals complete
  ensureApprovals(pairs).then(() => {
    let nextPairIndex = 0;
    let activeWorkers  = 0;

    function spawnNext() {
      if (nextPairIndex >= pairs.length) return;
      if (activeWorkers >= MAX_WORKERS) return;

      const pair = pairs[nextPairIndex++];
      const w    = new Worker(WORKER_PATH);
      activeWorkers++;

      w.on('online', () => {
        log('info', `Worker started for ${pair.name}`);
        w.postMessage({ type: 'SCAN_PAIR', pair, liveMode });
      });

      w.on('message', async (msg) => {
        if (msg.type === 'ARBITRAGE_FOUND') {
          const { tradePath, amountIn, minProfit } = msg.payload;
          // Determine loan token (first token of first step)
          const loanToken = tradePath?.[0]?.path?.[0];
          if (!loanToken) {
            log('error', 'Invalid payload: missing loan token');
            return;
          }
          // Queue payload for batching by loan token
          const entry = pendingBatches.get(loanToken) || { payloads: [], timer: null };
          entry.payloads.push({ tradePath, amountIn, minProfit });
          pendingBatches.set(loanToken, entry);
          scheduleBatchSend(loanToken);
        } else {
          log('info', 'Worker msg:', msg);
        }
      });

      w.on('exit', (code) => {
        log('info', `Worker for ${pair.name} exited (${code})`);
        activeWorkers--;
        spawnNext();
      });

      w.on('error', (err) => log('error', 'Worker error:', err));
    }

    // initial burst
    for (let i = 0; i < Math.min(MAX_WORKERS, pairs.length); i++) {
      spawnNext();
    }
    log('info', 'Scanner Manager ready.');
  }).catch((err) => {
    log('error', 'Approval workflow failed:', err?.message || err);
    process.exit(1);
  });
}
