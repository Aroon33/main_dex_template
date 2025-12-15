// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../interfaces/IPerp.sol";
import "../interfaces/ILiquidityPool.sol";

/**
 * @title Router
 * @notice Central entry point for traders
 */
contract Router {
    IPerp public perp;
    ILiquidityPool public liquidityPool;

    constructor(address _perp, address _liquidityPool) {
        perp = IPerp(_perp);
        liquidityPool = ILiquidityPool(_liquidityPool);
    }

    // ===== margin =====

    function deposit(address user, uint256 amount) external {
        liquidityPool.deposit(user, amount);
        perp.onTraderDeposit(user, amount);
    }

    function withdraw(address user, uint256 amount) external {
        perp.onTraderWithdraw(user, amount);
        liquidityPool.withdraw(user, amount);
    }

    // ===== position =====

    function openPosition(address user, int256 size) external {
        perp.openPosition(user, size);
    }

    function closePosition(address user) external {
        perp.closePosition(user);
    }

    function liquidate(address user) external {
        perp.liquidate(user);
    }

    // ===== views =====

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
}
