// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IPerp {
    function deposit(bytes32 asset) external payable;

    function withdraw(bytes32 asset, uint256 amount) external;

    function openPosition(bytes32 asset, int256 size, uint256 price) external;

    function closePosition(bytes32 asset) external;

    function calculatePnL(bytes32 asset, address user, uint256 price)
        external
        view
        returns (int256);

    function getPosition(address user, bytes32 asset)
        external
        view
        returns (int256 size, uint256 entryPrice);

    function getMargin(address user, bytes32 asset)
        external
        view
        returns (uint256);
}
