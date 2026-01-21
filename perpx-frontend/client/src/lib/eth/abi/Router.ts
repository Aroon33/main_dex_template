export const ROUTER_ABI = [
  // ===== EVENTS =====
  

  "event PositionClosed(address indexed user,uint256 indexed positionId,bytes32 pair,int256 size,uint256 entryPrice,uint256 exitPrice,int256 pnl,uint256 timestamp)",

  // 既存のイベント（残す）
  "event PositionOpened(address indexed user,uint256 indexed positionId,bytes32 pair,int256 size,uint256 timestamp)",
  "event PositionCloseRequested(address indexed user,uint256 indexed positionId,uint256 timestamp)",
  "event PositionPartialCloseRequested(address indexed user,uint256 indexed positionId,int256 closeSize,uint256 timestamp)",
  "event PnLClaimed(address indexed user,int256 amount,uint256 timestamp)",

  // ===== FUNCTIONS =====
  "function deposit(uint256 amount)",
  "function withdraw(uint256 amount)",
  "function openPosition(bytes32 pair,int256 size)",
  "function closePosition(uint256 positionId)",
  "function closePositionPartial(uint256 positionId,int256 closeSize)",
  "function claimPnL()",

  "function claimPnLToMargin()",

  // ===== VIEWS =====
  "function getMargin(address user) view returns(uint256)",
  "function getClaimablePnL(address user) view returns(int256)",
  "function getUserPositionIds(address user) view returns(uint256[])",
  "function getPosition(address user,uint256 positionId) view returns (bytes32,int256,uint256,uint256,bool)",
] as const;
