// client/src/lib/eth/abi/PerpetualTrading.ts

export const PERPETUAL_TRADING_ABI = [
  // ===== events =====
  "event PositionClosed(address indexed user,uint256 indexed positionId,bytes32 pair,int256 size,uint256 entryPrice,uint256 exitPrice,int256 realizedPnL,uint256 timestamp)",

  // ===== views (History 取得時に使う可能性あり) =====
  "function getPosition(address user,uint256 positionId) view returns (bytes32,int256,uint256,uint256,bool)",
  "function getUserPositionIds(address user) view returns (uint256[])",
  "function getMargin(address user) view returns (uint256)",

  // ===== actions (参照用・将来用) =====
  "function closePosition(address user,uint256 positionId)",
  "function closePositionPartial(address user,uint256 positionId,int256 closeSize)",
];
