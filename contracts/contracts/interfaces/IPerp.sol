// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IPerp {
    // ===== margin (Router only) =====
    function onTraderDeposit(address user, uint256 amount) external;
    function onTraderWithdraw(address user, uint256 amount) external;

    // ===== position =====
    function openPosition(address user, int256 size) external;
    function closePosition(address user) external;
    function liquidate(address user) external;

    // ===== view =====
    function getPosition(address user)
        external
        view
        returns (int256 size, uint256 entryPrice);

    function getMargin(address user)
        external
        view
        returns (uint256);
}
