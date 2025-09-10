// dynamicAbi.mjs (enhanced)
// Central single source for router/factory/vault addresses + tiny ABIs used by scanner

export const SwapType = {
  UNISWAP_V2: 0,
  UNISWAP_V3: 1,
  BALANCER_V2: 2
};

// Canonical addresses (double-check for your target network)
export const ADDRESSES = {
  // QuickSwap (UniswapV2 fork) — router + factory (Polygon)
  QUICKSWAP_ROUTER: '0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff',
  QUICKSWAP_FACTORY: '0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32',

  // SushiSwap router (multi-chain; used here for Polygon and BSC as a fallback)
  SUSHISWAP_ROUTER: '0x1b02da8cb0d097eb8d57a175b88c7d8b47997506',
  SUSHISWAP_FACTORY: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',

  // PancakeSwap V2 router (BSC)
  PANCAKESWAP_V2_ROUTER: '0x10ED43C718714eb63d5aA57B78B54704E256024E',

  // Balancer V2 Vault (Polygon)
  BALANCER_VAULT: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',

  // Aave v3 AddressesProvider on Polygon (used by CarlsJr)
  AAVE_ADDRESSES_PROVIDER: '0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb',

  // WETH (Polygon)
  WETH: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619'
};

// Export the deployed CarlsJr address
export const CARLSJR_ADDRESS = "0x58628bf934A7111bE2A8052B658E03c49C31b61E";

// Minimal ABIs — only the pieces we call from the scanner/simulator
export const UNISWAP_V2_ROUTER_ABI = [
  // getAmountsOut(amountIn, path) -> amounts[]
  'function getAmountsOut(uint256,address[]) view returns (uint256[])'
];

export const UNISWAP_V2_PAIR_ABI = [
  'function getReserves() view returns (uint112,uint112,uint32)',
  'function token0() view returns (address)',
  'function token1() view returns (address)'
];

export const BALANCER_VAULT_ABI = [
  // queryBatchSwap(kind, swaps[], assets[], funds) returns (int256[])
  'function queryBatchSwap(int256, tuple(bytes32 poolId,uint256 assetInIndex,uint256 assetOutIndex,uint256 amount,bytes userData)[] , address[] , tuple(address sender,bool fromInternalBalance,address recipient,bool toInternalBalance) ) view returns (int256[])'
];

// Uniswap V3 Quoter ABIs (v1 & v2 compatibility where available)
export const UNISWAP_V3_QUOTER_ABI = [
  // V1-style
  'function quoteExactInput(bytes path, uint256 amountIn) external returns (uint256 amountOut)',
  'function quoteExactInputSingle(address tokenIn, address tokenOut, uint24 fee, uint256 amountIn, uint160 sqrtPriceLimitX96) external returns (uint256 amountOut)',

  // V2-style (some deployments return additional data; we only need amountOut)
  'function quoteExactInput(bytes path) external returns (uint256 amountOut, uint160[] memory, uint32[] memory, uint256)',
  'function quoteExactInputSingle((address tokenIn,address tokenOut,uint24 fee,uint256 amountIn,uint160 sqrtPriceLimitX96) params) external returns (uint256 amountOut, uint160, uint32, uint256)'
];

// Minimal ERC20 view
export const ERC20_MIN_ABI = [
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function name() view returns (string)'
];

// CarlsJr ABI
export const CARLSJR_ABI = [
  {
    "inputs": [
      {
        "components": [
          {
            "components": [
              { "internalType": "enum CarlsJr.SwapType", "name": "swapType", "type": "uint8" },
              { "internalType": "address", "name": "router", "type": "address" },
              { "internalType": "address[]", "name": "path", "type": "address[]" },
              { "internalType": "uint24", "name": "fee", "type": "uint24" },
              { "internalType": "bytes32", "name": "poolId", "type": "bytes32" }
            ],
            "internalType": "struct CarlsJr.SwapStep[]",
            "name": "tradePath",
            "type": "tuple[]"
          },
          { "internalType": "uint256", "name": "amountIn", "type": "uint256" },
          { "internalType": "uint256", "name": "minProfit", "type": "uint256" },
          { "internalType": "uint256", "name": "amountOutMinimum", "type": "uint256" }
        ],
        "internalType": "struct CarlsJr.ArbitrageParams",
        "name": "params",
        "type": "tuple"
      }
    ],
    "name": "executePreciseArbitrage",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

export const WETH_ABI = [
  "function decimals() view returns (uint8)"
];

// Network-aware router/quoter configuration
export const NETWORK_CONFIGS = {
  137: {
    name: 'polygon',
    v2Routers: [
      ADDRESSES.QUICKSWAP_ROUTER,
      ADDRESSES.SUSHISWAP_ROUTER
    ],
    // Uniswap V3 QuoterV2 on Polygon (per Uniswap docs)
    v3Quoters: [
      '0x61fFE014bA17989E743c5F6cB21bF9697530B21e'
    ],
    balancerVault: ADDRESSES.BALANCER_VAULT
  },
  56: {
    name: 'bsc',
    v2Routers: [
      ADDRESSES.PANCAKESWAP_V2_ROUTER,
      ADDRESSES.SUSHISWAP_ROUTER
    ],
    // Uniswap V3 QuoterV2 on BSC (deployments mirror Polygon; confirm for production)
    v3Quoters: [
      '0x61fFE014bA17989E743c5F6cB21bF9697530B21e'
    ],
    // Balancer may be absent on BSC; keep placeholder for interface compatibility
    balancerVault: ADDRESSES.BALANCER_VAULT
  }
};

// Small helper for consumers that expect a mapping (optional)
export default {
  SwapType,
  ADDRESSES,
  UNISWAP_V2_ROUTER_ABI,
  UNISWAP_V2_PAIR_ABI,
  BALANCER_VAULT_ABI,
  UNISWAP_V3_QUOTER_ABI,
  ERC20_MIN_ABI,
  CARLSJR_ABI,
  WETH_ABI,
  CARLSJR_ADDRESS,
  NETWORK_CONFIGS
};
