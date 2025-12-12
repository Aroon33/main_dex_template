// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../interfaces/IPerp.sol";
import "../interfaces/IOracle.sol";
import "../interfaces/ILiquidityPool.sol";
import "../interfaces/ILiquidationEngine.sol";

contract Router {
    IPerp public perp;
    IOracle public oracle;
    ILiquidityPool public liquidityPool;
    ILiquidationEngine public liquidation;

    constructor(
        address _perp,
        address _oracle,
        address _liquidityPool,
        address _liquidation
    ) {
        perp = IPerp(_perp);
        oracle = IOracle(_oracle);
        liquidityPool = ILiquidityPool(_liquidityPool);
        liquidation = ILiquidationEngine(_liquidation);
    }

    function deposit(bytes32 asset) external payable {
        perp.deposit{value: msg.value}(asset);
    }

    function withdraw(bytes32 asset, uint256 amount) external {
        perp.withdraw(asset, amount);
    }

    function openPosition(bytes32 asset, int256 size, uint256 price) external {
        perp.openPosition(asset, size, price);
    }

    function closePosition(bytes32 asset) external {
        perp.closePosition(asset);
    }

    function liquidate(address user, bytes32 asset) external {
        liquidation.liquidate(user, asset);
    }

    function getPosition(address user, bytes32 asset)
        external
        view
        returns (int256 size, uint256 entryPrice)
    {
        return perp.getPosition(user, asset);
    }

    function getMargin(address user, bytes32 asset)
        external
        view
        returns (uint256)
    {
        return perp.getMargin(user, asset);
    }
}
