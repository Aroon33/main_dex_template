// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../interfaces/ILiquidityPool.sol";

contract LiquidityPool is ILiquidityPool {
    mapping(address => mapping(bytes32 => uint256)) public balances;

    function deposit(address user, bytes32 asset) external payable override {
        balances[user][asset] += msg.value;
    }

    function withdraw(address user, bytes32 asset, uint256 amount) external override {
        require(balances[user][asset] >= amount, "Insufficient balance");
        balances[user][asset] -= amount;
        payable(user).transfer(amount);
    }

    function settlePnL(address user, int256 pnl) external override {
        if (pnl > 0) {
            balances[user]["PNL"] += uint256(pnl);
        } else if (pnl < 0) {
            uint256 loss = uint256(-pnl);
            require(balances[user]["PNL"] >= loss, "Not enough margin");
            balances[user]["PNL"] -= loss;
        }
    }

    function getPoolValue() external view override returns (uint256) {
        return address(this).balance;
    }
}
