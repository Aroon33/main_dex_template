// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../interfaces/IPerp.sol";
import "../interfaces/ILiquidityPool.sol";

contract Router {

    IPerp public perp;
    ILiquidityPool public liquidityPool;

    constructor(address _perp, address _liquidityPool) {
        perp = IPerp(_perp);
        liquidityPool = ILiquidityPool(_liquidityPool);
    }

    /* ===================================================== */
    /* ====================== MARGIN ======================= */
    /* ===================================================== */

    /// @notice Deposit collateral and increase margin
    function deposit(uint256 amount) external {
        liquidityPool.deposit(msg.sender, amount);
        perp.onTraderDeposit(msg.sender, amount);
    }

    /// @notice Withdraw collateral and decrease margin
    function withdraw(uint256 amount) external {
        perp.onTraderWithdraw(msg.sender, amount);
        liquidityPool.withdraw(msg.sender, amount);
    }

    /* ===================================================== */
    /* ===================== POSITION ====================== */
    /* ===================================================== */

    /// @notice Open new position
    function openPosition(bytes32 pair, int256 size)
        external
        returns (uint256)
    {
        return perp.openPosition(msg.sender, pair, size);
    }

    /// @notice Fully close position
    function closePosition(uint256 positionId) external {
        perp.closePosition(msg.sender, positionId);
    }

/* ===================================================== */
/* ====================== PNL ========================== */
/* ===================================================== */

/// @notice Claim realized PnL
function claimPnL() external {
    perp.claimPnL(msg.sender);
}

/// @notice Get realized (claimable) PnL
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

    function closePositionPartial(
    uint256 positionId,
    int256 closeSize
) external {
    perp.closePositionPartial(msg.sender, positionId, closeSize);
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
