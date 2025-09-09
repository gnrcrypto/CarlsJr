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
  const cfg = NETWORK_CONFIGS[Number(net.chainId)] || NETWORK_CONFIGS[137]; // default Polygon
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

// Encode a V3 path: tokenA (20 bytes) | fee (3 bytes) | tokenB (20 bytes) | fee | tokenC ...
function encodeV3Path(tokens, fee) {
  const FEE_HEX = fee.toString(16).padStart(6, '0'); // uint24
  let hex = '0x';
  for (let i = 0; i < tokens.length; i++) {
    hex += tokens[i].slice(2).toLowerCase();
    if (i < tokens.length - 1) hex += FEE_HEX;
  }
  return hex;
}

async function quoteUniswapV3WithQuoter(quoterAddr, amountIn, path, fee) {
  try {
    const quoter = new Contract(quoterAddr, UNISWAP_V3_QUOTER_ABI, provider);
    // Prefer single-hop when possible
    if (path.length === 2) {
      // Try V1 signature
      try {
        const out = await quoter.quoteExactInputSingle(path[0], path[1], fee || 3000, amountIn, 0);
        return typeof out === 'bigint' ? out : BigInt(out.toString());
      } catch (_) {
        // Try V2 signature
        try {
          const params = {
            tokenIn: path[0],
            tokenOut: path[1],
            fee: fee || 3000,
            amountIn,
            sqrtPriceLimitX96: 0
          };
          const res = await quoter.quoteExactInputSingle(params);
          // Some deployments return tuple; first item is amountOut
          const out = Array.isArray(res) ? res[0] : res;
          return typeof out === 'bigint' ? out : BigInt(out.toString());
        } catch (err2) {
          log('error', `UniswapV3 single-hop quote failed on quoter ${quoterAddr}:`, err2?.message || err2);
          return null;
        }
      }
    } else {
      const encoded = encodeV3Path(path, fee || 3000);
      // Try V1 signature
      try {
        const out = await quoter.quoteExactInput(encoded, amountIn);
        return typeof out === 'bigint' ? out : BigInt(out.toString());
      } catch (_) {
        // Try V2 signature
        try {
          const res = await quoter.quoteExactInput(encoded);
          const out = Array.isArray(res) ? res[0] : res;
          return typeof out === 'bigint' ? out : BigInt(out.toString());
        } catch (err3) {
          log('error', `UniswapV3 multi-hop quote failed on quoter ${quoterAddr}:`, err3?.message || err3);
          return null;
        }
      }
    }
  } catch (err) {
    log('error', `UniswapV3 quoter call failed:`, err?.message || err);
    return null;
  }
}

async function quoteBalancer(poolId, amountIn, path) {
  try {
    const cfg = await getNetworkConfig();
    const vaultAddr = cfg.balancerVault || ADDRESSES.BALANCER_VAULT;
    const vault = new Contract(vaultAddr, BALANCER_VAULT_ABI, provider);
    const swaps = [{
      poolId: poolId || '0x' + '00'.repeat(32),
      assetInIndex: 0,
      assetOutIndex: 1,
      amount: amountIn.toString(),
      userData: '0x'
    }];
    const funds = {
      sender: '0x0000000000000000000000000000000000000000',
      fromInternalBalance: false,
      recipient: '0x0000000000000000000000000000000000000000',
      toInternalBalance: false
    };
    const deltas = await vault.queryBatchSwap(0, swaps, path, funds);
    const out = deltas[1];
    return typeof out === 'bigint' ? out : BigInt(out.toString());
  } catch (err) {
    log('error', 'Balancer quote failed:', err?.message || err);
    return null;
  }
}

async function bestQuoteForV2(amountIn, step) {
  const cfg = await getNetworkConfig();
  const routers = [];
  if (step.router && isAddress(step.router)) routers.push(step.router);
  routers.push(...(cfg.v2Routers || []));
  // De-dup
  const uniqRouters = [...new Set(routers.filter(isAddress))];
  const results = await Promise.all(uniqRouters.map(r => quoteUniswapV2(r, amountIn, step.path)));
  const filtered = results.filter(r => r !== null);
  if (!filtered.length) return null;
  return filtered.reduce((a, b) => a > b ? a : b);
}

async function bestQuoteForV3(amountIn, step) {
  const cfg = await getNetworkConfig();
  const quoters = cfg.v3Quoters || [];
  const uniqQuoters = [...new Set(quoters.filter(isAddress))];
  const results = await Promise.all(uniqQuoters.map(q => quoteUniswapV3WithQuoter(q, amountIn, step.path, Number(step.fee) || 3000)));
  const filtered = results.filter(r => r !== null);
  if (!filtered.length) return null;
  return filtered.reduce((a, b) => a > b ? a : b);
}

async function computeAmountIn(pairInfo, loanTokenAddr) {
  try {
    const decimals = (pairInfo.decimals && pairInfo.decimals[loanTokenAddr]) || 18;
    if (pairInfo.address && isAddress(pairInfo.address)) {
      const PAIR_ABI = [
        'function getReserves() view returns (uint112,uint112,uint32)',
        'function token0() view returns(address)',
        'function token1() view returns(address)'
      ];
      const pairC = new Contract(pairInfo.address, PAIR_ABI, provider);
      const reserves = await pairC.getReserves();
      const token0 = await pairC.token0();
      const reserve = token0.toLowerCase() === loanTokenAddr.toLowerCase() ? reserves[0] : reserves[1];
      const reserveBig = BigInt(reserve.toString());
      let amount = reserveBig / 1000n;
      const minUnit = 1n * (10n ** BigInt(decimals));
      if (amount < minUnit) amount = minUnit;
      return amount;
    }
  } catch (err) {
    log('error', 'Error computing amount from reserves:', err?.message || err);
  }
  const fallbackDecimals = ((pairInfo.decimals && Object.values(pairInfo.decimals)[0]) || 18);
  return 1n * (10n ** BigInt(fallbackDecimals));
}

function extractStepsFromTradePath(tradePathEntry) {
  if (Array.isArray(tradePathEntry)) return tradePathEntry;
  if (tradePathEntry && typeof tradePathEntry === 'object' && Array.isArray(tradePathEntry.steps)) return tradePathEntry.steps;
  if (tradePathEntry && typeof tradePathEntry === 'object' && tradePathEntry.path) return [tradePathEntry];
  return null;
}

parentPort.on('message', async (msg) => {
  if (msg.type !== 'SCAN_PAIR') return;
  const pair = msg.pair;
  log('info', `ScannerWorker: analyzing ${pair.name}`);

  for (const rawTradePath of pair.tradePaths || []) {
    try {
      const steps = extractStepsFromTradePath(rawTradePath);
      if (!steps || steps.length === 0) {
        parentPort.postMessage({ type: 'SCAN_ERROR', pair: pair.name, error: 'tradePath invalid shape or empty' });
        continue;
      }

      const firstStep = steps[0];
      if (!firstStep || !Array.isArray(firstStep.path) || firstStep.path.length === 0) {
        parentPort.postMessage({ type: 'SCAN_ERROR', pair: pair.name, error: 'invalid first step path' });
        continue;
      }

      const loanTokenAddr = firstStep.path[0];
      if (!isAddress(loanTokenAddr)) {
        parentPort.postMessage({ type: 'SCAN_ERROR', pair: pair.name, error: `invalid loanTokenAddr: ${loanTokenAddr}` });
        continue;
      }

      let currentAmount = await computeAmountIn(pair, loanTokenAddr);
      let couldQuote = true;
      let decimals = 18;

      // Try to get decimals for correct profit calculation
      try {
        const tokenContract = new Contract(loanTokenAddr, ['function decimals() view returns (uint8)'], provider);
        decimals = Number(await tokenContract.decimals());
      } catch {}

      for (const stepRaw of steps) {
        const swapType = normalizeSwapType(stepRaw.swapType);
        const router = stepRaw.router || ADDRESSES.QUICKSWAP_ROUTER;

        if (!Array.isArray(stepRaw.path) || stepRaw.path.length < 2) {
          parentPort.postMessage({ type: 'SCAN_ERROR', pair: pair.name, error: `invalid step.path: ${JSON.stringify(stepRaw.path)}` });
          couldQuote = false;
          break;
        }

        const badToken = stepRaw.path.find(p => typeof p !== 'string' || !isAddress(p));
        if (badToken) {
          parentPort.postMessage({ type: 'SCAN_ERROR', pair: pair.name, error: `invalid token address in path: ${String(badToken)}` });
          couldQuote = false;
          break;
        }

        if (swapType === Number(SwapType.UNISWAP_V2)) {
          if (!isAddress(router)) {
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

      const initialAmount = await computeAmountIn(pair, loanTokenAddr);
      log('info', `Worker: ${pair.name} - initial: ${initialAmount}, current: ${currentAmount}`);

      if (currentAmount > initialAmount) {
        // Use correct decimals for profit
        const grossProfit = currentAmount - initialAmount;
        const profitReadable = formatUnits(grossProfit, decimals);
        parentPort.postMessage({ type: 'CANDIDATE', pair: pair.name, profit: profitReadable });

        // Prepare tradePath using validated steps
        const validatedTradePath = steps.map(step => ({
          swapType: Number(step.swapType) || 0,
          router: step.router || ADDRESSES.QUICKSWAP_ROUTER,
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
    } catch (err) {
      log('error', `Error processing ${pair.name}:`, err?.message || err);
      parentPort.postMessage({ type: 'SCAN_ERROR', pair: pair.name, error: err?.message || String(err), stack: err?.stack });
    }
  }
});
