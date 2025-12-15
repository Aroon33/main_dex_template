// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface ILiquidityPool {
    function deposit(address user, uint256 amount) external;
    function withdraw(address user, uint256 amount) external;
    function settlePnL(address user, int256 pnl) external;
    function getPoolValue() external view returns (uint256);
}