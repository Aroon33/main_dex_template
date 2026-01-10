// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../interfaces/IPerp.sol";
import "../interfaces/ILiquidityPool.sol";
import "../interfaces/IOracle.sol";

contract Router {

    IPerp public perp;
    ILiquidityPool public liquidityPool;
    IOracle public oracle;

    /* ===================================================== */
    /* ====================== EVENTS ======================= */
    /* ===================================================== */

    event PositionClosed(
        address indexed user,
        uint256 indexed positionId,
        bytes32 pair,
        int256 size,
        uint256 entryPrice,
        uint256 exitPrice,
        int256 pnl,
        uint256 timestamp
    );

    constructor(
        address _perp,
        address _liquidityPool,
        address _oracle
    ) {
        perp = IPerp(_perp);
        liquidityPool = ILiquidityPool(_liquidityPool);
        oracle = IOracle(_oracle);
    }

    /* ===================================================== */
    /* ====================== MARGIN ======================= */
    /* ===================================================== */

    function deposit(uint256 amount) external {
        liquidityPool.deposit(msg.sender, amount);
        perp.onTraderDeposit(msg.sender, amount);
    }

    function withdraw(uint256 amount) external {
        perp.onTraderWithdraw(msg.sender, amount);
        liquidityPool.withdraw(msg.sender, amount);
    }

    /* ===================================================== */
    /* ===================== POSITION ====================== */
    /* ===================================================== */

    function openPosition(bytes32 pair, int256 size)
        external
        returns (uint256)
    {
        return perp.openPosition(msg.sender, pair, size);
    }

    /// @notice Fully close position and emit realized PnL
    function closePosition(uint256 positionId) external {
    // ===== 1. read position BEFORE close =====
    (
        bytes32 pair,
        int256 size,
        uint256 entryPrice,
        ,
        bool isOpen
    ) = perp.getPosition(msg.sender, positionId);

    require(isOpen, "POSITION_NOT_OPEN");

    // ===== 2. get exit price =====
    uint256 exitPrice = oracle.getPrice(pair);

    // ===== 3. calculate PnL (USD notional) =====
    int256 pnl =
        (size * int256(exitPrice - entryPrice))
        / int256(entryPrice);

    // ===== 4. on-chain settlement =====
    if (pnl < 0) {
    // loss → pool (ABS value)
    liquidityPool.settlePnL(
    msg.sender,
    pnl
);


} else if (pnl > 0) {
    // profit → claimable
    perp.addClaimablePnL(msg.sender, pnl);
}


    // ===== 5. close position =====
    perp.closePosition(msg.sender, positionId);

    // ===== 6. emit event (history SSOT) =====
    emit PositionClosed(
        msg.sender,
        positionId,
        pair,
        size,
        entryPrice,
        exitPrice,
        pnl,
        block.timestamp
    );
}


    function closePositionPartial(
        uint256 positionId,
        int256 closeSize
    ) external {
        // NOTE:
        // 部分クローズの PnL event は次ステップで対応
        perp.closePositionPartial(msg.sender, positionId, closeSize);
    }

    /* ===================================================== */
    /* ====================== PNL ========================== */
    /* ===================================================== */

    function claimPnL() external {
        perp.claimPnL(msg.sender);
    }

    function getClaimablePnL(address user)
        external
        view
        returns (int256)
    {
        return perp.getClaimablePnL(user);
    }

    /* ===================================================== */
    /* ======================= VIEWS ======================= */
    /* ===================================================== */

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
        return perp.getPosition(user, positionId);
    }

    function getMargin(address user)
        external
        view
        returns (uint256)
    {
        return perp.getMargin(user);
    }

    function getUserPositionIds(address user)
        external
        view
        returns (uint256[] memory)
    {
        return perp.getUserPositionIds(user);
    }
}
