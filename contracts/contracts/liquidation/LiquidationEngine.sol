// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../interfaces/IPerp.sol";
import "../interfaces/ILiquidationEngine.sol";
import "../interfaces/IOracle.sol";

contract LiquidationEngine is ILiquidationEngine {
    IPerp public perp;
    IOracle public oracle;

    constructor(address _perp, address _oracle) {
        perp = IPerp(_perp);
        oracle = IOracle(_oracle);
    }

    function liquidate(address user, bytes32 asset) external override {
        // 取得
        (int256 size, uint256 entryPrice) = perp.getPosition(user, asset);

        require(size != 0, "No position");

        uint256 price = oracle.getPrice(asset);

        int256 pnl = perp.calculatePnL(asset, user, price);

        // 強制決済
        perp.closePosition(asset);
    }
}
