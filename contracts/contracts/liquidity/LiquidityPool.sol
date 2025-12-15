// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../interfaces/ILiquidityPool.sol";

contract LiquidityPool is ILiquidityPool {
    // =========================
    // Asset Keys (統一)
    // =========================
    bytes32 public constant ASSET_ETH = keccak256("ETH");

    // user => asset => balance
    mapping(address => mapping(bytes32 => uint256)) public balances;

    // =========================
    // Deposit
    // =========================
    function deposit(address user, bytes32 asset)
        external
        payable
        override
    {
        require(asset == ASSET_ETH, "Unsupported asset");
        balances[user][asset] += msg.value;
    }

    // =========================
    // Withdraw
    // =========================
    function withdraw(address user, bytes32 asset, uint256 amount)
        external
        override
    {
        require(asset == ASSET_ETH, "Unsupported asset");
        require(balances[user][asset] >= amount, "Insufficient balance");

        balances[user][asset] -= amount;
        payable(user).transfer(amount);
    }

    // =========================
    // PnL Settlement
    // =========================
    function settlePnL(address user, int256 pnl)
        external
        override
    {
        if (pnl > 0) {
            balances[user][ASSET_ETH] += uint256(pnl);
        } else if (pnl < 0) {
            uint256 loss = uint256(-pnl);
            require(
                balances[user][ASSET_ETH] >= loss,
                "Not enough margin"
            );
            balances[user][ASSET_ETH] -= loss;
        }
    }

    // =========================
    // Pool Value
    // =========================
    function getPoolValue()
        external
        view
        override
        returns (uint256)
    {
        return address(this).balance;
    }
}
