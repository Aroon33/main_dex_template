// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../interfaces/IOracle.sol";

contract PriceOracle is IOracle {
    mapping(bytes32 => uint256) public prices;

    function setPrice(bytes32 asset, uint256 price) external override {
        prices[asset] = price;
    }

    function getPrice(bytes32 asset) external view override returns (uint256) {
        uint256 p = prices[asset];
        require(p > 0, "Oracle: price not set");
        return p;
    }
}
