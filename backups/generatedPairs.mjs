[
  {
    "name": "USDC/WETH",
    "address": "0x34965ba0ac2451a34a0471f04cca3f990b8dea27",
    "tokens": [
      "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619"
    ],
    "paths": [
      [
        "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
        "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619"
      ],
      [
        "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
        "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
        "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619"
      ]
    ],
    "tradePaths": [
      {
        "description": "QuickSwap direct",
        "steps": [
          {
            "swapType": 0,
            "router": "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff",
            "path": [
              "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
              "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619"
            ],
            "fee": 0,
            "poolId": "0x0000000000000000000000000000000000000000000000000000000000000000"
          }
        ],
        "preferredDex": "QuickSwap",
        "minLiquidityUSD": 3000,
        "maxSlippageBps": 50
      },
      {
        "description": "QuickSwap reverse",
        "steps": [
          {
            "swapType": 0,
            "router": "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff",
            "path": [
              "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
              "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
            ],
            "fee": 0,
            "poolId": "0x0000000000000000000000000000000000000000000000000000000000000000"
          }
        ],
        "preferredDex": "QuickSwap",
        "minLiquidityUSD": 3000,
        "maxSlippageBps": 50
      },
      {
        "description": "SushiSwap direct",
        "steps": [
          {
            "swapType": 0,
            "router": "0x1b02da8cb0d097eb8d57a175b88c7d8b47997506",
            "path": [
              "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
              "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619"
            ],
            "fee": 0,
            "poolId": "0x0000000000000000000000000000000000000000000000000000000000000000"
          }
        ],
        "preferredDex": "SushiSwap",
        "minLiquidityUSD": 3000,
        "maxSlippageBps": 50
      },
      {
        "description": "SushiSwap reverse",
        "steps": [
          {
            "swapType": 0,
            "router": "0x1b02da8cb0d097eb8d57a175b88c7d8b47997506",
            "path": [
              "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
              "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
            ],
            "fee": 0,
            "poolId": "0x0000000000000000000000000000000000000000000000000000000000000000"
          }
        ],
        "preferredDex": "SushiSwap",
        "minLiquidityUSD": 3000,
        "maxSlippageBps": 50
      }
    ]
  },
  {
    "name": "USDT/WETH",
    "address": "0x4B1F1eC906aD2cBfE7E1bD3e1FfA0c7D3fC1fE5A",
    "tokens": [
      "0x3813e82e6f7098b9583FC0F33a962D02018B6803",
      "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619"
    ],
    "paths": [
      [
        "0x3813e82e6f7098b9583FC0F33a962D02018B6803",
        "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619"
      ],
      [
        "0x3813e82e6f7098b9583FC0F33a962D02018B6803",
        "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
        "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619"
      ]
    ],
    "tradePaths": [
      {
        "description": "QuickSwap direct",
        "steps": [
          {
            "swapType": 0,
            "router": "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff",
            "path": [
              "0x3813e82e6f7098b9583FC0F33a962D02018B6803",
              "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619"
            ],
            "fee": 0,
            "poolId": "0x0000000000000000000000000000000000000000000000000000000000000000"
          }
        ],
        "preferredDex": "QuickSwap",
        "minLiquidityUSD": 3000,
        "maxSlippageBps": 50
      },
      {
        "description": "QuickSwap reverse",
        "steps": [
          {
            "swapType": 0,
            "router": "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff",
            "path": [
              "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
              "0x3813e82e6f7098b9583FC0F33a962D02018B6803"
            ],
            "fee": 0,
            "poolId": "0x0000000000000000000000000000000000000000000000000000000000000000"
          }
        ],
        "preferredDex": "QuickSwap",
        "minLiquidityUSD": 3000,
        "maxSlippageBps": 50
      },
      {
        "description": "SushiSwap direct",
        "steps": [
          {
            "swapType": 0,
            "router": "0x1b02da8cb0d097eb8d57a175b88c7d8b47997506",
            "path": [
              "0x3813e82e6f7098b9583FC0F33a962D02018B6803",
              "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619"
            ],
            "fee": 0,
            "poolId": "0x0000000000000000000000000000000000000000000000000000000000000000"
          }
        ],
        "preferredDex": "SushiSwap",
        "minLiquidityUSD": 3000,
        "maxSlippageBps": 50
      },
      {
        "description": "SushiSwap reverse",
        "steps": [
          {
            "swapType": 0,
            "router": "0x1b02da8cb0d097eb8d57a175b88c7d8b47997506",
            "path": [
              "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
              "0x3813e82e6f7098b9583FC0F33a962D02018B6803"
            ],
            "fee": 0,
            "poolId": "0x0000000000000000000000000000000000000000000000000000000000000000"
          }
        ],
        "preferredDex": "SushiSwap",
        "minLiquidityUSD": 3000,
        "maxSlippageBps": 50
      },
      {
        "description": "QuickSwap triangular via hub",
        "steps": [
          {
            "swapType": 0,
            "router": "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff",
            "path": [
              "0x3813e82e6f7098b9583FC0F33a962D02018B6803",
              "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
            ],
            "fee": 0,
            "poolId": "0x0000000000000000000000000000000000000000000000000000000000000000"
          },
          {
            "swapType": 0,
            "router": "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff",
            "path": [
              "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
              "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619"
            ],
            "fee": 0,
            "poolId": "0x0000000000000000000000000000000000000000000000000000000000000000"
          }
        ],
        "preferredDex": "QuickSwap",
        "minLiquidityUSD": 3000,
        "maxSlippageBps": 75
      },
      {
        "description": "QuickSwap triangular via hub (reverse)",
        "steps": [
          {
            "swapType": 0,
            "router": "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff",
            "path": [
              "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
              "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
            ],
            "fee": 0,
            "poolId": "0x0000000000000000000000000000000000000000000000000000000000000000"
          },
          {
            "swapType": 0,
            "router": "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff",
            "path": [
              "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
              "0x3813e82e6f7098b9583FC0F33a962D02018B6803"
            ],
            "fee": 0,
            "poolId": "0x0000000000000000000000000000000000000000000000000000000000000000"
          }
        ],
        "preferredDex": "QuickSwap",
        "minLiquidityUSD": 3000,
        "maxSlippageBps": 75
      },
      {
        "description": "SushiSwap triangular via hub",
        "steps": [
          {
            "swapType": 0,
            "router": "0x1b02da8cb0d097eb8d57a175b88c7d8b47997506",
            "path": [
              "0x3813e82e6f7098b9583FC0F33a962D02018B6803",
              "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
            ],
            "fee": 0,
            "poolId": "0x0000000000000000000000000000000000000000000000000000000000000000"
          },
          {
            "swapType": 0,
            "router": "0x1b02da8cb0d097eb8d57a175b88c7d8b47997506",
            "path": [
              "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
              "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619"
            ],
            "fee": 0,
            "poolId": "0x0000000000000000000000000000000000000000000000000000000000000000"
          }
        ],
        "preferredDex": "SushiSwap",
        "minLiquidityUSD": 3000,
        "maxSlippageBps": 75
      },
      {
        "description": "SushiSwap triangular via hub (reverse)",
        "steps": [
          {
            "swapType": 0,
            "router": "0x1b02da8cb0d097eb8d57a175b88c7d8b47997506",
            "path": [
              "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
              "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
            ],
            "fee": 0,
            "poolId": "0x0000000000000000000000000000000000000000000000000000000000000000"
          },
          {
            "swapType": 0,
            "router": "0x1b02da8cb0d097eb8d57a175b88c7d8b47997506",
            "path": [
              "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
              "0x3813e82e6f7098b9583FC0F33a962D02018B6803"
            ],
            "fee": 0,
            "poolId": "0x0000000000000000000000000000000000000000000000000000000000000000"
          }
        ],
        "preferredDex": "SushiSwap",
        "minLiquidityUSD": 3000,
        "maxSlippageBps": 75
      }
    ]
  },
  {
    "name": "DAI/USDC",
    "address": "0xF04AdBF75cDFc1F5C6bB6C4cD1f7cA2fA1cB8dC0",
    "tokens": [
      "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
      "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
    ],
    "paths": [
      [
        "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
        "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
      ],
      [
        "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
        "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
        "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
      ]
    ],
    "tradePaths": [
      {
        "description": "QuickSwap direct",
        "steps": [
          {
            "swapType": 0,
            "router": "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff",
            "path": [
              "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
              "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
            ],
            "fee": 0,
            "poolId": "0x0000000000000000000000000000000000000000000000000000000000000000"
          }
        ],
        "preferredDex": "QuickSwap",
        "minLiquidityUSD": 3000,
        "maxSlippageBps": 50
      },
      {
        "description": "QuickSwap reverse",
        "steps": [
          {
            "swapType": 0,
            "router": "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff",
            "path": [
              "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
              "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063"
            ],
            "fee": 0,
            "poolId": "0x0000000000000000000000000000000000000000000000000000000000000000"
          }
        ],
        "preferredDex": "QuickSwap",
        "minLiquidityUSD": 3000,
        "maxSlippageBps": 50
      },
      {
        "description": "SushiSwap direct",
        "steps": [
          {
            "swapType": 0,
            "router": "0x1b02da8cb0d097eb8d57a175b88c7d8b47997506",
            "path": [
              "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
              "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
            ],
            "fee": 0,
            "poolId": "0x0000000000000000000000000000000000000000000000000000000000000000"
          }
        ],
        "preferredDex": "SushiSwap",
        "minLiquidityUSD": 3000,
        "maxSlippageBps": 50
      },
      {
        "description": "SushiSwap reverse",
        "steps": [
          {
            "swapType": 0,
            "router": "0x1b02da8cb0d097eb8d57a175b88c7d8b47997506",
            "path": [
              "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
              "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063"
            ],
            "fee": 0,
            "poolId": "0x0000000000000000000000000000000000000000000000000000000000000000"
          }
        ],
        "preferredDex": "SushiSwap",
        "minLiquidityUSD": 3000,
        "maxSlippageBps": 50
      },
      {
        "description": "QuickSwap triangular via hub",
        "steps": [
          {
            "swapType": 0,
            "router": "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff",
            "path": [
              "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
              "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619"
            ],
            "fee": 0,
            "poolId": "0x0000000000000000000000000000000000000000000000000000000000000000"
          },
          {
            "swapType": 0,
            "router": "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff",
            "path": [
              "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
              "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
            ],
            "fee": 0,
            "poolId": "0x0000000000000000000000000000000000000000000000000000000000000000"
          }
        ],
        "preferredDex": "QuickSwap",
        "minLiquidityUSD": 3000,
        "maxSlippageBps": 75
      },
      {
        "description": "QuickSwap triangular via hub (reverse)",
        "steps": [
          {
            "swapType": 0,
            "router": "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff",
            "path": [
              "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
              "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619"
            ],
            "fee": 0,
            "poolId": "0x0000000000000000000000000000000000000000000000000000000000000000"
          },
          {
            "swapType": 0,
            "router": "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff",
            "path": [
              "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
              "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063"
            ],
            "fee": 0,
            "poolId": "0x0000000000000000000000000000000000000000000000000000000000000000"
          }
        ],
        "preferredDex": "QuickSwap",
        "minLiquidityUSD": 3000,
        "maxSlippageBps": 75
      },
      {
        "description": "SushiSwap triangular via hub",
        "steps": [
          {
            "swapType": 0,
            "router": "0x1b02da8cb0d097eb8d57a175b88c7d8b47997506",
            "path": [
              "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
              "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619"
            ],
            "fee": 0,
            "poolId": "0x0000000000000000000000000000000000000000000000000000000000000000"
          },
          {
            "swapType": 0,
            "router": "0x1b02da8cb0d097eb8d57a175b88c7d8b47997506",
            "path": [
              "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
              "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
            ],
            "fee": 0,
            "poolId": "0x0000000000000000000000000000000000000000000000000000000000000000"
          }
        ],
        "preferredDex": "SushiSwap",
        "minLiquidityUSD": 3000,
        "maxSlippageBps": 75
      },
      {
        "description": "SushiSwap triangular via hub (reverse)",
        "steps": [
          {
            "swapType": 0,
            "router": "0x1b02da8cb0d097eb8d57a175b88c7d8b47997506",
            "path": [
              "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
              "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619"
            ],
            "fee": 0,
            "poolId": "0x0000000000000000000000000000000000000000000000000000000000000000"
          },
          {
            "swapType": 0,
            "router": "0x1b02da8cb0d097eb8d57a175b88c7d8b47997506",
            "path": [
              "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
              "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063"
            ],
            "fee": 0,
            "poolId": "0x0000000000000000000000000000000000000000000000000000000000000000"
          }
        ],
        "preferredDex": "SushiSwap",
        "minLiquidityUSD": 3000,
        "maxSlippageBps": 75
      }
    ]
  },
  {
    "name": "WMATIC/WETH",
    "address": "0xA374094527e1673A86dE625aa59517c5de346d32",
    "tokens": [
      "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
      "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619"
    ],
    "paths": [
      [
        "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
        "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619"
      ],
      [
        "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
        "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
        "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619"
      ]
    ],
    "tradePaths": [
      {
        "description": "QuickSwap direct",
        "steps": [
          {
            "swapType": 0,
            "router": "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff",
            "path": [
              "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
              "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619"
            ],
            "fee": 0,
            "poolId": "0x0000000000000000000000000000000000000000000000000000000000000000"
          }
        ],
        "preferredDex": "QuickSwap",
        "minLiquidityUSD": 3000,
        "maxSlippageBps": 50
      },
      {
        "description": "QuickSwap reverse",
        "steps": [
          {
            "swapType": 0,
            "router": "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff",
            "path": [
              "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
              "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270"
            ],
            "fee": 0,
            "poolId": "0x0000000000000000000000000000000000000000000000000000000000000000"
          }
        ],
        "preferredDex": "QuickSwap",
        "minLiquidityUSD": 3000,
        "maxSlippageBps": 50
      },
      {
        "description": "SushiSwap direct",
        "steps": [
          {
            "swapType": 0,
            "router": "0x1b02da8cb0d097eb8d57a175b88c7d8b47997506",
            "path": [
              "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
              "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619"
            ],
            "fee": 0,
            "poolId": "0x0000000000000000000000000000000000000000000000000000000000000000"
          }
        ],
        "preferredDex": "SushiSwap",
        "minLiquidityUSD": 3000,
        "maxSlippageBps": 50
      },
      {
        "description": "SushiSwap reverse",
        "steps": [
          {
            "swapType": 0,
            "router": "0x1b02da8cb0d097eb8d57a175b88c7d8b47997506",
            "path": [
              "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
              "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270"
            ],
            "fee": 0,
            "poolId": "0x0000000000000000000000000000000000000000000000000000000000000000"
          }
        ],
        "preferredDex": "SushiSwap",
        "minLiquidityUSD": 3000,
        "maxSlippageBps": 50
      },
      {
        "description": "QuickSwap triangular via hub",
        "steps": [
          {
            "swapType": 0,
            "router": "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff",
            "path": [
              "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
              "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
            ],
            "fee": 0,
            "poolId": "0x0000000000000000000000000000000000000000000000000000000000000000"
          },
          {
            "swapType": 0,
            "router": "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff",
            "path": [
              "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
              "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619"
            ],
            "fee": 0,
            "poolId": "0x0000000000000000000000000000000000000000000000000000000000000000"
          }
        ],
        "preferredDex": "QuickSwap",
        "minLiquidityUSD": 3000,
        "maxSlippageBps": 75
      },
      {
        "description": "QuickSwap triangular via hub (reverse)",
        "steps": [
          {
            "swapType": 0,
            "router": "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff",
            "path": [
              "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
              "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
            ],
            "fee": 0,
            "poolId": "0x0000000000000000000000000000000000000000000000000000000000000000"
          },
          {
            "swapType": 0,
            "router": "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff",
            "path": [
              "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
              "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270"
            ],
            "fee": 0,
            "poolId": "0x0000000000000000000000000000000000000000000000000000000000000000"
          }
        ],
        "preferredDex": "QuickSwap",
        "minLiquidityUSD": 3000,
        "maxSlippageBps": 75
      },
      {
        "description": "SushiSwap triangular via hub",
        "steps": [
          {
            "swapType": 0,
            "router": "0x1b02da8cb0d097eb8d57a175b88c7d8b47997506",
            "path": [
              "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
              "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
            ],
            "fee": 0,
            "poolId": "0x0000000000000000000000000000000000000000000000000000000000000000"
          },
          {
            "swapType": 0,
            "router": "0x1b02da8cb0d097eb8d57a175b88c7d8b47997506",
            "path": [
              "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
              "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619"
            ],
            "fee": 0,
            "poolId": "0x0000000000000000000000000000000000000000000000000000000000000000"
          }
        ],
        "preferredDex": "SushiSwap",
        "minLiquidityUSD": 3000,
        "maxSlippageBps": 75
      },
      {
        "description": "SushiSwap triangular via hub (reverse)",
        "steps": [
          {
            "swapType": 0,
            "router": "0x1b02da8cb0d097eb8d57a175b88c7d8b47997506",
            "path": [
              "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
              "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
            ],
            "fee": 0,
            "poolId": "0x0000000000000000000000000000000000000000000000000000000000000000"
          },
          {
            "swapType": 0,
            "router": "0x1b02da8cb0d097eb8d57a175b88c7d8b47997506",
            "path": [
              "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
              "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270"
            ],
            "fee": 0,
            "poolId": "0x0000000000000000000000000000000000000000000000000000000000000000"
          }
        ],
        "preferredDex": "SushiSwap",
        "minLiquidityUSD": 3000,
        "maxSlippageBps": 75
      }
    ]
  },
  {
    "name": "WBTC/WETH",
    "address": "0x1Edb2D8F791D2a51D56979bf3A25673D6E783232",
    "tokens": [
      "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6",
      "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619"
    ],
    "paths": [
      [
        "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6",
        "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619"
      ],
      [
        "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6",
        "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
        "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619"
      ]
    ],
    "tradePaths": [
      {
        "description": "QuickSwap direct",
        "steps": [
          {
            "swapType": 0,
            "router": "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff",
            "path": [
              "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6",
              "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619"
            ],
            "fee": 0,
            "poolId": "0x0000000000000000000000000000000000000000000000000000000000000000"
          }
        ],
        "preferredDex": "QuickSwap",
        "minLiquidityUSD": 3000,
        "maxSlippageBps": 50
      },
      {
        "description": "QuickSwap reverse",
        "steps": [
          {
            "swapType": 0,
            "router": "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff",
            "path": [
              "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
              "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6"
            ],
            "fee": 0,
            "poolId": "0x0000000000000000000000000000000000000000000000000000000000000000"
          }
        ],
        "preferredDex": "QuickSwap",
        "minLiquidityUSD": 3000,
        "maxSlippageBps": 50
      },
      {
        "description": "SushiSwap direct",
        "steps": [
          {
            "swapType": 0,
            "router": "0x1b02da8cb0d097eb8d57a175b88c7d8b47997506",
            "path": [
              "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6",
              "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619"
            ],
            "fee": 0,
            "poolId": "0x0000000000000000000000000000000000000000000000000000000000000000"
          }
        ],
        "preferredDex": "SushiSwap",
        "minLiquidityUSD": 3000,
        "maxSlippageBps": 50
      },
      {
        "description": "SushiSwap reverse",
        "steps": [
          {
            "swapType": 0,
            "router": "0x1b02da8cb0d097eb8d57a175b88c7d8b47997506",
            "path": [
              "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
              "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6"
            ],
            "fee": 0,
            "poolId": "0x0000000000000000000000000000000000000000000000000000000000000000"
          }
        ],
        "preferredDex": "SushiSwap",
        "minLiquidityUSD": 3000,
        "maxSlippageBps": 50
      },
      {
        "description": "QuickSwap triangular via hub",
        "steps": [
          {
            "swapType": 0,
            "router": "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff",
            "path": [
              "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6",
              "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
            ],
            "fee": 0,
            "poolId": "0x0000000000000000000000000000000000000000000000000000000000000000"
          },
          {
            "swapType": 0,
            "router": "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff",
            "path": [
              "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
              "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619"
            ],
            "fee": 0,
            "poolId": "0x0000000000000000000000000000000000000000000000000000000000000000"
          }
        ],
        "preferredDex": "QuickSwap",
        "minLiquidityUSD": 3000,
        "maxSlippageBps": 75
      },
      {
        "description": "QuickSwap triangular via hub (reverse)",
        "steps": [
          {
            "swapType": 0,
            "router": "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff",
            "path": [
              "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
              "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
            ],
            "fee": 0,
            "poolId": "0x0000000000000000000000000000000000000000000000000000000000000000"
          },
          {
            "swapType": 0,
            "router": "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff",
            "path": [
              "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
              "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6"
            ],
            "fee": 0,
            "poolId": "0x0000000000000000000000000000000000000000000000000000000000000000"
          }
        ],
        "preferredDex": "QuickSwap",
        "minLiquidityUSD": 3000,
        "maxSlippageBps": 75
      },
      {
        "description": "SushiSwap triangular via hub",
        "steps": [
          {
            "swapType": 0,
            "router": "0x1b02da8cb0d097eb8d57a175b88c7d8b47997506",
            "path": [
              "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6",
              "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
            ],
            "fee": 0,
            "poolId": "0x0000000000000000000000000000000000000000000000000000000000000000"
          },
          {
            "swapType": 0,
            "router": "0x1b02da8cb0d097eb8d57a175b88c7d8b47997506",
            "path": [
              "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
              "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619"
            ],
            "fee": 0,
            "poolId": "0x0000000000000000000000000000000000000000000000000000000000000000"
          }
        ],
        "preferredDex": "SushiSwap",
        "minLiquidityUSD": 3000,
        "maxSlippageBps": 75
      },
      {
        "description": "SushiSwap triangular via hub (reverse)",
        "steps": [
          {
            "swapType": 0,
            "router": "0x1b02da8cb0d097eb8d57a175b88c7d8b47997506",
            "path": [
              "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
              "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
            ],
            "fee": 0,
            "poolId": "0x0000000000000000000000000000000000000000000000000000000000000000"
          },
          {
            "swapType": 0,
            "router": "0x1b02da8cb0d097eb8d57a175b88c7d8b47997506",
            "path": [
              "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
              "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6"
            ],
            "fee": 0,
            "poolId": "0x0000000000000000000000000000000000000000000000000000000000000000"
          }
        ],
        "preferredDex": "SushiSwap",
        "minLiquidityUSD": 3000,
        "maxSlippageBps": 75
      }
    ]
  },
  {
    "name": "CRV/USDC",
    "address": "0x0bC857F5F6c3f2f3C7fD4aFfFfFfFfFfFfFfFfFf",
    "tokens": [
      "0x172370d5Cd63279eFa6d502DAB29171933a610AF",
      "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
    ],
    "paths": [
      [
        "0x172370d5Cd63279eFa6d502DAB29171933a610AF",
        "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
      ],
      [
        "0x172370d5Cd63279eFa6d502DAB29171933a610AF",
        "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
        "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
      ]
    ],
    "tradePaths": [
      {
        "description": "QuickSwap direct",
        "steps": [
          {
            "swapType": 0,
            "router": "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff",
            "path": [
              "0x172370d5Cd63279eFa6d502DAB29171933a610AF",
              "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
            ],
            "fee": 0,
            "poolId": "0x0000000000000000000000000000000000000000000000000000000000000000"
          }
        ],
        "preferredDex": "QuickSwap",
        "minLiquidityUSD": 3000,
        "maxSlippageBps": 50
      },
      {
        "description": "QuickSwap reverse",
        "steps": [
          {
            "swapType": 0,
            "router": "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff",
            "path": [
              "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
              "0x172370d5Cd63279eFa6d502DAB29171933a610AF"
            ],
            "fee": 0,
            "poolId": "0x0000000000000000000000000000000000000000000000000000000000000000"
          }
        ],
        "preferredDex": "QuickSwap",
        "minLiquidityUSD": 3000,
        "maxSlippageBps": 50
      },
      {
        "description": "SushiSwap direct",
        "steps": [
          {
            "swapType": 0,
            "router": "0x1b02da8cb0d097eb8d57a175b88c7d8b47997506",
            "path": [
              "0x172370d5Cd63279eFa6d502DAB29171933a610AF",
              "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
            ],
            "fee": 0,
            "poolId": "0x0000000000000000000000000000000000000000000000000000000000000000"
          }
        ],
        "preferredDex": "SushiSwap",
        "minLiquidityUSD": 3000,
        "maxSlippageBps": 50
      },
      {
        "description": "SushiSwap reverse",
        "steps": [
          {
            "swapType": 0,
            "router": "0x1b02da8cb0d097eb8d57a175b88c7d8b47997506",
            "path": [
              "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
              "0x172370d5Cd63279eFa6d502DAB29171933a610AF"
            ],
            "fee": 0,
            "poolId": "0x0000000000000000000000000000000000000000000000000000000000000000"
          }
        ],
        "preferredDex": "SushiSwap",
        "minLiquidityUSD": 3000,
        "maxSlippageBps": 50
      },
      {
        "description": "QuickSwap triangular via hub",
        "steps": [
          {
            "swapType": 0,
            "router": "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff",
            "path": [
              "0x172370d5Cd63279eFa6d502DAB29171933a610AF",
              "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619"
            ],
            "fee": 0,
            "poolId": "0x0000000000000000000000000000000000000000000000000000000000000000"
          },
          {
            "swapType": 0,
            "router": "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff",
            "path": [
              "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
              "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
            ],
            "fee": 0,
            "poolId": "0x0000000000000000000000000000000000000000000000000000000000000000"
          }
        ],
        "preferredDex": "QuickSwap",
        "minLiquidityUSD": 3000,
        "maxSlippageBps": 75
      },
      {
        "description": "QuickSwap triangular via hub (reverse)",
        "steps": [
          {
            "swapType": 0,
            "router": "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff",
            "path": [
              "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
              "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619"
            ],
            "fee": 0,
            "poolId": "0x0000000000000000000000000000000000000000000000000000000000000000"
          },
          {
            "swapType": 0,
            "router": "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff",
            "path": [
              "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
              "0x172370d5Cd63279eFa6d502DAB29171933a610AF"
            ],
            "fee": 0,
            "poolId": "0x0000000000000000000000000000000000000000000000000000000000000000"
          }
        ],
        "preferredDex": "QuickSwap",
        "minLiquidityUSD": 3000,
        "maxSlippageBps": 75
      },
      {
        "description": "SushiSwap triangular via hub",
        "steps": [
          {
            "swapType": 0,
            "router": "0x1b02da8cb0d097eb8d57a175b88c7d8b47997506",
            "path": [
              "0x172370d5Cd63279eFa6d502DAB29171933a610AF",
              "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619"
            ],
            "fee": 0,
            "poolId": "0x0000000000000000000000000000000000000000000000000000000000000000"
          },
          {
            "swapType": 0,
            "router": "0x1b02da8cb0d097eb8d57a175b88c7d8b47997506",
            "path": [
              "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
              "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
            ],
            "fee": 0,
            "poolId": "0x0000000000000000000000000000000000000000000000000000000000000000"
          }
        ],
        "preferredDex": "SushiSwap",
        "minLiquidityUSD": 3000,
        "maxSlippageBps": 75
      },
      {
        "description": "SushiSwap triangular via hub (reverse)",
        "steps": [
          {
            "swapType": 0,
            "router": "0x1b02da8cb0d097eb8d57a175b88c7d8b47997506",
            "path": [
              "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
              "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619"
            ],
            "fee": 0,
            "poolId": "0x0000000000000000000000000000000000000000000000000000000000000000"
          },
          {
            "swapType": 0,
            "router": "0x1b02da8cb0d097eb8d57a175b88c7d8b47997506",
            "path": [
              "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
              "0x172370d5Cd63279eFa6d502DAB29171933a610AF"
            ],
            "fee": 0,
            "poolId": "0x0000000000000000000000000000000000000000000000000000000000000000"
          }
        ],
        "preferredDex": "SushiSwap",
        "minLiquidityUSD": 3000,
        "maxSlippageBps": 75
      }
    ]
  }
]
