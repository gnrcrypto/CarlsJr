import * as ethers from 'ethers';
import { parentPort } from 'worker_threads';
import { JsonRpcProvider, Contract, isAddress, formatUnits } from 'ethers';
import dotenv from 'dotenv';
dotenv.config();

import {
  UNISWAP_V2_ROUTER_ABI,
  BALANCER_VAULT_ABI,
  ADDRESSES,
  SwapType,
  UNISWAP_V3_QUOTER_ABI,
  NETWORK_CONFIGS
} from './dynamicAbi.mjs';

const RPC_URL = process.env.RPC_URL;
if (!RPC_URL) throw new Error('RPC_URL not set in .env');

const provider = new JsonRpcProvider(RPC_URL);

// Resolve network and config lazily
let cachedNetworkConfig = null;
async function getNetworkConfig() {
  if (cachedNetworkConfig) return cachedNetworkConfig;
  const net = await provider.getNetwork();
  const cfg = NETWORK_CONFIGS[Number(net.chainId)] || NETWORK_CONFIGS[56]; // default BSC
  cachedNetworkConfig = cfg;
  return cfg;
}

// Helper: log with level
function log(level, ...args) {
  console.log(`[${new Date().toISOString()}] [${level.toUpperCase()}]`, ...args);
}

function normalizeSwapType(raw) {
  if (raw === undefined || raw === null) return Number(SwapType.UNISWAP_V2);
  if (typeof raw === 'number') return raw;
  if (!Number.isNaN(Number(raw))) return Number(raw);
  const s = String(raw).trim().toUpperCase();
  if (s.includes('UNISWAP') && s.includes('V3')) return Number(SwapType.UNISWAP_V3);
  if (s.includes('BALANCER')) return Number(SwapType.BALANCER_V2);
  return Number(SwapType.UNISWAP_V2);
}

async function quoteUniswapV2(routerAddr, amountIn, path) {
  try {
    const router = new Contract(routerAddr, UNISWAP_V2_ROUTER_ABI, provider);
    const amounts = await router.getAmountsOut(amountIn, path);
    const last = amounts[amounts.length - 1];
    return typeof last === 'bigint' ? last : BigInt(last.toString());
  } catch (err) {
    log('error', `UniswapV2 quote failed for router ${routerAddr}:`, err?.message || err);
    return null;
  }
}

async function bestQuoteForV2(amountIn, step) {
  const cfg = await getNetworkConfig();
  const routers = Array.from(new Set([step.router, ...(cfg?.v2Routers || [])])).filter(Boolean);
  let best = null;
  for (const r of routers) {
    const out = await quoteUniswapV2(r, amountIn, step.path);
    if (out !== null && (best === null || out > best)) best = out;
  }
  return best;
}

async function quoteBalancer(poolId, amountIn, path) {
  try {
    const cfg = await getNetworkConfig();
    if (!cfg?.balancerVault) return null;
    const vault = new Contract(cfg.balancerVault, BALANCER_VAULT_ABI, provider);
    // Minimalistic single-hop query; extend as needed
    const assets = path;
    const swaps = [{
      poolId,
      assetInIndex: 0,
      assetOutIndex: path.length - 1,
      amount: amountIn,
      userData: '0x'
    }];
    const funds = { sender: ethers.ZeroAddress, fromInternalBalance: false, recipient: ethers.ZeroAddress, toInternalBalance: false };
    const result = await vault.queryBatchSwap(0, swaps, assets, funds);
    const out = result[result.length - 1];
    return typeof out === 'bigint' ? -out : BigInt(String(out)) * -1n; // Balancer returns signed deltas
  } catch (err) {
    log('error', 'Balancer quote failed:', err?.message || err);
    return null;
  }
}

async function bestQuoteForV3(amountIn, step) {
  try {
    const cfg = await getNetworkConfig();
    // Try configured Quoters
    for (const quoter of (cfg?.v3Quoters || [])) {
      try {
        const q = new Contract(quoter, UNISWAP_V3_QUOTER_ABI, provider);
        // Prefer v1 interface first
        const bytesPath = ethers.getBytes('0x'); // placeholder if you build encoded path elsewhere
        const out = await q.quoteExactInput(bytesPath, amountIn);
        if (out) return typeof out === 'bigint' ? out : BigInt(out.toString());
      } catch {}
    }
    return null;
  } catch (err) {
    log('error', 'UNISWAP_V3 quote failed:', err?.message || err);
    return null;
  }
}

async function computeAmountIn(pair, loanTokenAddr) {
  // Placeholder: derive amountIn per strategy, liquidity, or config
  return 10n ** 18n;
}

parentPort.on('message', async (msg) => {
  if (msg.type !== 'SCAN_PAIR') return;

  const { pair, liveMode } = msg;
  try {
    const loanTokenAddr = pair.tokens[0];
    let decimals = 18;
    try {
      const erc = new Contract(loanTokenAddr, ['function decimals() view returns (uint8)'], provider);
      decimals = await erc.decimals();
    } catch {}

    for (const trade of (pair.tradePaths || [])) {
      const steps = trade.steps || [];
      let currentAmount = 0n;
      let couldQuote = true;

      // Amount to start with
      const initialAmount = await computeAmountIn(pair, loanTokenAddr);
      currentAmount = initialAmount;

      for (const stepRaw of steps) {
        const swapType = normalizeSwapType(stepRaw.swapType);

        if (swapType === Number(SwapType.UNISWAP_V2)) {
          const router = stepRaw.router;
          if (!router || !isAddress(router)) {
            parentPort.postMessage({ type: 'SCAN_ERROR', pair: pair.name, error: `invalid router address: ${router}` });
            couldQuote = false;
            break;
          }
          const best = await bestQuoteForV2(currentAmount, stepRaw);
          if (best === null) {
            parentPort.postMessage({ type: 'SCAN_ERROR', pair: pair.name, error: 'no quote available for step (multi-dex V2)' });
            couldQuote = false;
            break;
          }
          currentAmount = best;

        } else if (swapType === Number(SwapType.BALANCER_V2)) {
          const out = await quoteBalancer(stepRaw.poolId, currentAmount, stepRaw.path);
          if (out === null) {
            parentPort.postMessage({ type: 'SCAN_ERROR', pair: pair.name, error: 'Balancer quote failed' });
            couldQuote = false;
            break;
          }
          currentAmount = out;

        } else if (swapType === Number(SwapType.UNISWAP_V3)) {
          const bestV3 = await bestQuoteForV3(currentAmount, stepRaw);
          if (bestV3 === null) {
            parentPort.postMessage({ type: 'SCAN_ERROR', pair: pair.name, error: 'UNISWAP_V3 quote unavailable' });
            couldQuote = false;
            break;
          }
          currentAmount = bestV3;

        } else {
          parentPort.postMessage({ type: 'SCAN_ERROR', pair: pair.name, error: `unknown swapType: ${swapType}` });
          couldQuote = false;
          break;
        }
      }

      if (!couldQuote) continue;

      log('info', `Worker: ${pair.name} - initial: ${initialAmount}, current: ${currentAmount}`);

      if (currentAmount > initialAmount) {
        const grossProfit = currentAmount - initialAmount;
        const profitReadable = formatUnits(grossProfit, decimals);
        parentPort.postMessage({ type: 'CANDIDATE', pair: pair.name, profit: profitReadable });

        // Prepare tradePath using validated steps; default to PancakeSwap on BSC
        const validatedTradePath = steps.map(step => ({
          swapType: Number(step.swapType) || 0,
          router: step.router || ADDRESSES.PANCAKESWAP_V2_ROUTER,
          path: step.path.map(t => t.toLowerCase()),
          fee: Number(step.fee) || 0,
          poolId: step.poolId || '0x' + '00'.repeat(32)
        }));

        const payload = {
          tradePath: validatedTradePath,
          amountIn: initialAmount.toString(),
          minProfit: grossProfit.toString(),
          amountOutMinimum: '0'
        };

        parentPort.postMessage({ type: 'ARBITRAGE_FOUND', payload });
      }
    }
  } catch (err) {
    log('error', `Error processing ${pair.name}:`, err?.message || err);
    parentPort.postMessage({ type: 'SCAN_ERROR', pair: pair.name, error: err?.message || String(err), stack: err?.stack });
  }
});
