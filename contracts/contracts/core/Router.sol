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

    /* ===== margin ===== */

    function deposit(uint256 amount) external {
        liquidityPool.deposit(msg.sender, amount);
        perp.onTraderDeposit(msg.sender, amount);
    }

    function withdraw(uint256 amount) external {
        perp.onTraderWithdraw(msg.sender, amount);
    }

    /* ===== position ===== */

    function openPosition(int256 size) external {
        perp.openPosition(msg.sender, size);
    }

    function closePosition() external {
        perp.closePosition(msg.sender);
    }

    function liquidate(address user) external {
        perp.liquidate(user);
    }

    /* ===== pnl ===== */

    function claimPnL() external {
        perp.claimPnL(msg.sender);
    }

    /* ===== views ===== */

    function getPosition(address user)
        external
        view
        returns (int256 size, uint256 entryPrice)
    {
        return perp.getPosition(user);
    }

    function getMargin(address user)
        external
        view
        returns (uint256)
    {
        return perp.getMargin(user);
    }

    function getClaimablePnL(address user)
        external
        view
        returns (int256)
    {
        return perp.getClaimablePnL(user);
    }
}
