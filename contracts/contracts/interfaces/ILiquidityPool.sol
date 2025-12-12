// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface ILiquidityPool {
    function deposit(address user, bytes32 asset) external payable;

    function withdraw(address user, bytes32 asset, uint256 amount) external;

    function settlePnL(address user, int256 pnl) external;

    function getPoolValue() external view returns (uint256);
}
