// simulator.mjs
import { JsonRpcProvider, Contract, isAddress, parseUnits, formatUnits, Wallet } from 'ethers';
import dotenv from 'dotenv';
dotenv.config();

import {
  UNISWAP_V2_ROUTER_ABI,
  BALANCER_VAULT_ABI,
  ADDRESSES,
  SwapType,
  CARLSJR_ABI,
  WETH_ABI,
  CARLSJR_ADDRESS,
  ERC20_MIN_ABI
} from './dynamicAbi.mjs';

const RPC_URL = process.env.RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
if (!RPC_URL) throw new Error('RPC_URL not set in .env');
if (!PRIVATE_KEY) throw new Error('PRIVATE_KEY not set in .env');

const provider = new JsonRpcProvider(RPC_URL);
const signer = new Wallet(PRIVATE_KEY, provider);
const carlsJr = new Contract(CARLSJR_ADDRESS, CARLSJR_ABI, signer);

// Gas configuration (align with scannerManager)
const GAS_LIMIT = BigInt(process.env.GAS_LIMIT || '2500000');
const MAX_FEE_PER_GAS_GWEI = process.env.MAX_FEE_PER_GAS_GWEI;
const PRIORITY_FEE_GWEI    = process.env.PRIORITY_FEE_GWEI;
const GAS_PRICE_GWEI       = process.env.GAS_PRICE_GWEI;

function resolveTxOpts() {
  if (MAX_FEE_PER_GAS_GWEI && PRIORITY_FEE_GWEI) {
    return {
      gasLimit: GAS_LIMIT,
      maxFeePerGas: parseUnits(String(MAX_FEE_PER_GAS_GWEI), 'gwei'),
      maxPriorityFeePerGas: parseUnits(String(PRIORITY_FEE_GWEI), 'gwei')
    };
  }
  if (GAS_PRICE_GWEI) {
    return {
      gasLimit: GAS_LIMIT,
      gasPrice: parseUnits(String(GAS_PRICE_GWEI), 'gwei')
    };
  }
  return { gasLimit: GAS_LIMIT };
}

// Helper logger
function log(level, ...args) {
  console.log(`[${new Date().toISOString()}] [${level.toUpperCase()}]`, ...args);
}

async function getTxResult(txHash) {
  try {
    const receipt = await provider.getTransactionReceipt(txHash);
    return receipt;
  } catch (err) {
    log('warn', `Failed to get tx receipt for ${txHash}:`, err?.message || err);
    return { status: 0 };
  }
}

function validateTradeStep(step) {
  if (!step) return false;
  if (typeof step.swapType === 'undefined') return false;
  if (!step.router || !isAddress(step.router)) return false;
  if (!Array.isArray(step.path) || step.path.length < 2) return false;
  if (step.path.some(token => !isAddress(token))) return false;
  return true;
}

async function sendLiveTransaction(encodedData) {
  let nonce = await provider.getTransactionCount(signer.address, 'pending');
  let lastError = null;

  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const txRequest = {
        to: CARLSJR_ADDRESS,
        data: encodedData,
        nonce,
        ...resolveTxOpts()
      };
      const tx = await signer.sendTransaction(txRequest);
      log('info', `TX sent: ${tx.hash}`);
      const receipt = await tx.wait();
      log('info', `TX confirmed: ${receipt.transactionHash} status=${receipt.status}`);
      return { ok: receipt.status === 1, txHash: receipt.transactionHash, receipt };
    } catch (err) {
      lastError = err;
      log('error', `Send TX attempt ${attempt + 1} failed:`, err?.message || err);
      // Increment nonce to avoid replacement issues
      nonce++;
    }
  }
  return { ok: false, reason: 'send_failed', detail: lastError?.message || String(lastError) };
}

// Clamp amountIn by token decimals using MIN/MAX units in env, scale minProfit, add flash fee
async function clampAndRebuildParams(params) {
  const validatedTradePath = [];
  for (const step of params.tradePath) {
    if (!validateTradeStep(step)) throw new Error('invalid_trade_step');
    validatedTradePath.push({
      swapType: Number(step.swapType) || 0,
      router: step.router,
      path: step.path.map(t => t.toLowerCase()),
      fee: Number(step.fee) || 0,
      poolId: step.poolId || '0x' + '00'.repeat(32)
    });
  }

  const firstStep = validatedTradePath[0];
  const loanToken = firstStep.path[0];

  // Token decimals
  let decimals = 18;
  try {
    const tokenContract = new Contract(loanToken, ERC20_MIN_ABI, provider);
    decimals = await tokenContract.decimals();
  } catch {}

  const requestedAmountIn = BigInt(params.amountIn || 0);
  const minProfitWei = BigInt(params.minProfit || 0);

  const minUnitsStr = String(process.env.MIN_FLASHLOAN_UNITS || '1');
  const maxUnitsStr = String(process.env.MAX_FLASHLOAN_UNITS || '10000');
  const minUnits = parseUnits(minUnitsStr, decimals);
  const maxUnits = parseUnits(maxUnitsStr, decimals);

  let amountIn = requestedAmountIn;
  if (amountIn < minUnits) amountIn = minUnits;
  if (amountIn > maxUnits) amountIn = maxUnits;

  // Scale minProfit to the clamped notional
  let scaledMinProfit = 0n;
  if (requestedAmountIn > 0n) {
    scaledMinProfit = (minProfitWei * amountIn) / requestedAmountIn;
  }

  // Safety and Aave fee buffers
  const SAFETY_MARGIN_BPS = 300n;
  const AAVE_FEE_BPS      = 5n;
  const BPS_DIV           = 10000n;

  const flashFee = (amountIn * AAVE_FEE_BPS) / BPS_DIV;
  const profitWithMargin = (scaledMinProfit * (BPS_DIV - SAFETY_MARGIN_BPS)) / BPS_DIV;

  const txParams = {
    tradePath: validatedTradePath,
    amountIn,
    minProfit: profitWithMargin + flashFee,
    amountOutMinimum: BigInt(params.amountOutMinimum || 0)
  };

  return { txParams, decimals, loanToken };
}

async function simulateAndMaybeExecute(params) {
  try {
    const { txParams, decimals } = await clampAndRebuildParams(params);
    const encodedData = carlsJr.interface.encodeFunctionData('executePreciseArbitrage', [txParams]);

    if (params.live) {
      log('info', 'SIMULATOR: Live mode - sending transaction.');
      return await sendLiveTransaction(encodedData);
    } else {
      log('info', 'SIMULATOR: Simulation mode - no on-chain TX sent');
      // Simulated "profit" here is just echoing amountIn in human terms for inspection
      return {
        ok: true,
        reason: 'simulated',
        profit: formatUnits(txParams.amountIn, decimals),
        details: {
          amountIn: txParams.amountIn.toString(),
          minProfit: txParams.minProfit.toString()
        }
      };
    }
  } catch (err) {
    log('error', 'SIMULATOR: Unexpected error:', err);
    return { ok: false, reason: 'unexpected_error', detail: err?.message || err };
  }
}

export { simulateAndMaybeExecute };
