// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../interfaces/IOracle.sol";

contract PriceOracle is IOracle {
    address public owner;
    mapping(address => bool) public updaters;

    mapping(bytes32 => uint256) public prices;

    modifier onlyOwner() {
        require(msg.sender == owner, "NOT_OWNER");
        _;
    }

    modifier onlyUpdater() {
        require(updaters[msg.sender], "NOT_UPDATER");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // =========================
    // Admin
    // =========================
    function addUpdater(address updater) external onlyOwner {
        updaters[updater] = true;
    }

    function removeUpdater(address updater) external onlyOwner {
        updaters[updater] = false;
    }

    // =========================
    // Price feed
    // =========================
    function setPrice(bytes32 asset, uint256 price)
        external
        override
        onlyUpdater
    {
        require(price > 0, "INVALID_PRICE");
        prices[asset] = price;
    }

    function getPrice(bytes32 asset)
        external
        view
        override
        returns (uint256)
    {
        uint256 p = prices[asset];
        require(p > 0, "PRICE_NOT_SET");
        return p;
    }
}
