/**
 * ============================================================
 * ChainlinkOracle ABI (bytes32 version)
 * ============================================================
 */

export const CHAINLINK_ORACLE_ABI = [
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "pair",
        type: "bytes32"
      },
      {
        internalType: "address",
        name: "feed",
        type: "address"
      }
    ],
    name: "setFeed",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "pair",
        type: "bytes32"
      }
    ],
    name: "feeds",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "pair",
        type: "bytes32"
      }
    ],
    name: "getPrice",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  }
] as const;
