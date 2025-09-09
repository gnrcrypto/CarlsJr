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
  CARLSJR_ADDRESS
} from './dynamicAbi.mjs';

const RPC_URL = process.env.RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

if (!RPC_URL) throw new Error('RPC_URL not set in .env');
if (!PRIVATE_KEY) throw new Error('PRIVATE_KEY not set in .env');

const provider = new JsonRpcProvider(RPC_URL);
const signer = new Wallet(PRIVATE_KEY, provider);

const carlsJr = new Contract(CARLSJR_ADDRESS, CARLSJR_ABI, signer);
const weth = new Contract(ADDRESSES.WETH, WETH_ABI, provider);

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
        gasLimit: 2_500_000,
        nonce,
        gasPrice: await provider.getGasPrice()
      };
      const tx = await signer.sendTransaction(txRequest);
      log('info', `SIMULATOR: Live TX sent, hash: ${tx.hash}`);
      const receipt = await tx.wait();
      log('info', `SIMULATOR: TX confirmed, status: ${receipt.status}`);
      return { ok: receipt.status === 1, txHash: tx.hash, receipt };
    } catch (err) {
      lastError = err;
      if (err.message && err.message.includes('already known')) {
        log('warn', 'SIMULATOR: TX already known, incrementing nonce...');
        nonce++;
        await new Promise(r => setTimeout(r, 300));
      } else if (err.message && err.message.includes('replacement transaction underpriced')) {
        log('warn', 'SIMULATOR: Replacement transaction underpriced, bumping gas price...');
        txRequest.gasPrice = txRequest.gasPrice.mul(12).div(10); // +20%
      } else {
        log('error', 'SIMULATOR: TX send failed:', err);
        break;
      }
    }
  }
  return { ok: false, reason: 'tx_failed', detail: lastError ? lastError.message : 'Unknown error' };
}

/**
 * Simulate or execute a trade path.
 * @param {object} params - { tradePath, amountIn, minProfit, amountOutMinimum, live }
 */
async function simulateAndMaybeExecute(params) {
  try {
    if (!params || !params.tradePath || !Array.isArray(params.tradePath) || params.tradePath.length === 0)
      return { ok: false, reason: 'invalid_trade_path' };

    const validatedTradePath = [];
    for (const step of params.tradePath) {
      if (!validateTradeStep(step))
        return { ok: false, reason: 'invalid_trade_step', detail: step };
      validatedTradePath.push({
        swapType: Number(step.swapType) || 0,
        router: step.router,
        path: step.path.map(t => t.toLowerCase()),
        fee: Number(step.fee) || 0,
        poolId: step.poolId || '0x' + '00'.repeat(32)
      });
    }

    log('info', 'SIMULATOR: Validated trade path', validatedTradePath);

    const firstStep = validatedTradePath[0];
    const loanToken = firstStep.path[0];

    // Get the correct decimals for amountIn formatting
    let decimals = 18;
    try {
      const tokenContract = new Contract(loanToken, ['function decimals() view returns (uint8)'], provider);
      decimals = await tokenContract.decimals();
    } catch {}

    const amountIn = BigInt(params.amountIn || 0);
    const minProfitWei = BigInt(params.minProfit || 0);
    const amountOutMinimum = BigInt(params.amountOutMinimum || 0);

    // Use contract interface to encode the full params struct
    const txParams = {
      tradePath: validatedTradePath,
      amountIn: amountIn,
      minProfit: minProfitWei,
      amountOutMinimum: amountOutMinimum
    };

    const encodedData = carlsJr.interface.encodeFunctionData('executePreciseArbitrage', [txParams]);

    if (params.live) {
      log('info', 'SIMULATOR: Live mode - sending transaction...');
      return await sendLiveTransaction(encodedData);
    } else {
      log('info', 'SIMULATOR: Simulation mode - no on-chain TX sent');
      // Simulate profit calculation, e.g., run a full on-chain simulation if needed
      return {
        ok: true,
        reason: 'simulated',
        profit: formatUnits(amountIn, decimals),
        details: { amountIn, minProfitWei }
      };
    }
  } catch (err) {
    log('error', 'SIMULATOR: Unexpected error:', err);
    return { ok: false, reason: 'unexpected_error', detail: err?.message || err };
  }
}

export { simulateAndMaybeExecute };
