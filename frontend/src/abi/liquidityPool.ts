export const LiquidityPoolABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "user", "type": "address" },
      { "internalType": "bytes32", "name": "asset", "type": "bytes32" }
    ],
    "name": "deposit",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "user", "type": "address" },
      { "internalType": "bytes32", "name": "asset", "type": "bytes32" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
];
