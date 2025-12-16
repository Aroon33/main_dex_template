// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../interfaces/IPerp.sol";
import "../interfaces/ILiquidityPool.sol";
import "../interfaces/IOracle.sol";

contract PerpetualTrading is IPerp {

    struct Position {
        bytes32 pair;
        int256 size;
        uint256 entryPrice;
        uint256 margin;
        bool isOpen;
    }

    address public owner;
    address public router;
    address public liquidationEngine;

    IOracle public oracle;
    ILiquidityPool public liquidityPool;

    uint256 public nextPositionId;

    mapping(address => uint256[]) private userPositionIds;
    mapping(address => mapping(uint256 => Position)) public positions;
    mapping(address => uint256) public traderMargin;

    // Trader realized profit (claimable)
mapping(address => int256) public claimablePnL;



    /* ===================================================== */
    /* ====================== MODIFIERS ==================== */
    /* ===================================================== */

    modifier onlyOwner() {
        require(msg.sender == owner, "NOT_OWNER");
        _;
    }

    modifier onlyRouter() {
        require(msg.sender == router, "NOT_ROUTER");
        _;
    }

    modifier onlyLiquidation() {
        require(msg.sender == liquidationEngine, "NOT_LIQUIDATION");
        _;
    }

    constructor(address _oracle, address _liquidityPool) {
        owner = msg.sender;
        oracle = IOracle(_oracle);
        liquidityPool = ILiquidityPool(_liquidityPool);
    }

    /* ===================================================== */
    /* ====================== ADMIN ======================== */
    /* ===================================================== */

    function setRouter(address _router) external onlyOwner {
        router = _router;
    }

    function setLiquidationEngine(address _engine) external onlyOwner {
        liquidationEngine = _engine;
    }

    /* ===================================================== */
    /* ====================== MARGIN ======================= */
    /* ===================================================== */

    /// @notice Increase trader margin
    function onTraderDeposit(address user, uint256 amount)
        external
        onlyRouter
    {
        traderMargin[user] += amount;
    }

    /// @notice Decrease trader margin
    function onTraderWithdraw(address user, uint256 amount)
        external
        onlyRouter
    {
        require(traderMargin[user] >= amount, "INSUFFICIENT_MARGIN");
        traderMargin[user] -= amount;
    }

    /* ===================================================== */
    /* ===================== POSITION ====================== */
    /* ===================================================== */

    /// @notice Open new position
    function openPosition(
        address user,
        bytes32 pair,
        int256 size
    )
        external
        onlyRouter
        returns (uint256 positionId)
    {
        require(size != 0, "INVALID_SIZE");
        require(traderMargin[user] > 0, "NO_MARGIN");

        uint256 price = oracle.getPrice(pair);

        positionId = nextPositionId++;
        userPositionIds[user].push(positionId);

        positions[user][positionId] = Position({
            pair: pair,
            size: size,
            entryPrice: price,
            margin: traderMargin[user],
            isOpen: true
        });
    }

    /// @notice Fully close position (state only, no PnL yet)
    function closePosition(address user, uint256 positionId)
        external
        onlyRouter
    {
        positions[user][positionId].isOpen = false;
    }

    /// @notice Liquidate position (forced close)
    function liquidate(address user, uint256 positionId)
        external
        onlyLiquidation
    {
        positions[user][positionId].isOpen = false;
    }

/* ===================================================== */
/* ====================== PNL ========================== */
/* ===================================================== */

/// @notice Claim realized PnL
function claimPnL(address user)
    external
    onlyRouter
{
    int256 pnl = claimablePnL[user];
    require(pnl > 0, "NO_PROFIT");

    claimablePnL[user] = 0;

    liquidityPool.payProfit(user, uint256(pnl));
}


    /* ===================================================== */
    /* ======================= VIEWS ======================= */
    /* ===================================================== */

    /// @notice Get realized (claimable) PnL
function getClaimablePnL(address user)
    external
    view
    returns (int256)
{
    return claimablePnL[user];
}


    function getPosition(address user, uint256 positionId)
        external
        view
        returns (
            bytes32 pair,
            int256 size,
            uint256 entryPrice,
            uint256 margin,
            bool isOpen
        )
    {
        Position memory p = positions[user][positionId];
        return (p.pair, p.size, p.entryPrice, p.margin, p.isOpen);
    }

    function getMargin(address user)
        external
        view
        returns (uint256)
    {
        return traderMargin[user];
    }

    function getUserPositionIds(address user)
        external
        view
        returns (uint256[] memory)
    {
        return userPositionIds[user];
    }


    function closePositionPartial(
    address user,
    uint256 positionId,
    int256 closeSize
)
    external
    onlyRouter
{
    Position storage pos = positions[user][positionId];

    /* ===================================================== */
    /* ====================== CHECKS ======================= */
    /* ===================================================== */

    require(pos.isOpen, "NO_POSITION");
    require(closeSize != 0, "INVALID_CLOSE_SIZE");

    // 方向一致チェック（ロングは +、ショートは -）
    require(
        (pos.size > 0 && closeSize > 0) ||
        (pos.size < 0 && closeSize < 0),
        "WRONG_DIRECTION"
    );

    int256 absTotalSize = _abs(pos.size);
    int256 absCloseSize = _abs(closeSize);

    require(absCloseSize <= absTotalSize, "CLOSE_TOO_LARGE");

    /* ===================================================== */
    /* ====================== PRICING ====================== */
    /* ===================================================== */

    uint256 exitPrice = oracle.getPrice(pos.pair);

    /*
        totalPnL (USD notional based)

        long  : size * (exit - entry) / entry
        short : size * (entry - exit) / entry
        ※ size は signed なので同一式でOK
    */
    int256 totalPnL = (pos.size * int256(exitPrice - pos.entryPrice))
        / int256(pos.entryPrice);

    /*
        部分クローズ分の PnL
        ratio = closeSize / totalSize
    */
    int256 partialPnL = (totalPnL * closeSize) / pos.size;

    /* ===================================================== */
    /* ====================== SETTLEMENT =================== */
    /* ===================================================== */

    if (partialPnL < 0) {
        // 損失は即 Pool へ
        liquidityPool.settlePnL(user, partialPnL);
    } else if (partialPnL > 0) {
        // 利益は claimablePnL に積む
        claimablePnL[user] += partialPnL;
    }

    /* ===================================================== */
    /* ====================== MARGIN ======================= */
    /* ===================================================== */

    uint256 marginReduction =
        (pos.margin * uint256(absCloseSize)) / uint256(absTotalSize);

    pos.margin -= marginReduction;

    /* ===================================================== */
    /* ====================== POSITION ===================== */
    /* ===================================================== */

    pos.size -= closeSize;

    // 完全クローズ
    if (pos.size == 0) {
        pos.isOpen = false;
    }
}
/* ===================================================== */
/* ====================== INTERNAL ===================== */
/* ===================================================== */

function _abs(int256 x) internal pure returns (int256) {
    return x >= 0 ? x : -x;
}

}
