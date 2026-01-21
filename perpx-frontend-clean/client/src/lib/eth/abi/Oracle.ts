// client/src/lib/eth/abi/Oracle.ts

export const ORACLE_ABI = [
  // ===== views =====
  "function getPrice(bytes32 pair) external view returns (uint256)",

  // ===== admin / updater =====
  "function setPrice(bytes32 pair, uint256 price) external",
  "function increasePrice(bytes32 pair, uint256 delta) external",
  "function decreasePrice(bytes32 pair, uint256 delta) external",
];
