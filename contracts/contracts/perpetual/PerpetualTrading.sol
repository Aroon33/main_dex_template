// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../interfaces/IPerp.sol";
import "../interfaces/IOracle.sol";
import "../interfaces/ILiquidityPool.sol";
import "../interfaces/IFundingRate.sol";

contract PerpetualTrading is IPerp {
    struct Position {
        int256 size;
        uint256 entryPrice;
        uint256 margin;
    }

    mapping(address => mapping(bytes32 => Position)) public positions;

    IOracle public oracle;
    ILiquidityPool public liquidityPool;
    IFundingRate public fundingRate;

    constructor(
        address _oracle,
        address _liquidityPool,
        address _fundingRate
    ) {
        oracle = IOracle(_oracle);
        liquidityPool = ILiquidityPool(_liquidityPool);
        fundingRate = IFundingRate(_fundingRate);
    }

    // ------------------------------
    // Deposit / Withdraw
    // ------------------------------

    function deposit(bytes32 asset) external payable override {
        require(msg.value > 0, "No ETH sent");

        // LPに入金
        liquidityPool.deposit{value: msg.value}(msg.sender, asset);

        // ★ 証拠金として反映
        positions[msg.sender][asset].margin += msg.value;
    }

    function withdraw(bytes32 asset, uint256 amount) external override {
        Position storage pos = positions[msg.sender][asset];
        require(pos.margin >= amount, "Insufficient margin");

        pos.margin -= amount;
        liquidityPool.withdraw(msg.sender, asset, amount);
    }

    // ------------------------------
    // Positions
    // ------------------------------

    function openPosition(
        bytes32 asset,
        int256 size,
        uint256 price
    ) external override {
        require(size != 0, "Invalid size");

        Position storage pos = positions[msg.sender][asset];

        // ★ 証拠金チェック（最低限）
        require(pos.margin > 0, "No margin deposited");

        pos.size += size;
        pos.entryPrice = price;
    }

    function closePosition(bytes32 asset) external override {
        Position storage pos = positions[msg.sender][asset];
        require(pos.size != 0, "No position");

        uint256 price = oracle.getPrice(asset);
        int256 pnl = calculatePnL(asset, msg.sender, price);

        liquidityPool.settlePnL(msg.sender, pnl);

        delete positions[msg.sender][asset];
    }

    // ------------------------------
    // Read functions
    // ------------------------------

    function calculatePnL(
        bytes32 asset,
        address user,
        uint256 price
    ) public view override returns (int256) {
        Position memory pos = positions[user][asset];
        if (pos.size == 0) return 0;

        return (int256(price) - int256(pos.entryPrice)) * pos.size;
    }

    function getPosition(address user, bytes32 asset)
        external
        view
        override
        returns (int256 size, uint256 entryPrice)
    {
        Position memory pos = positions[user][asset];
        return (pos.size, pos.entryPrice);
    }

    function getMargin(address user, bytes32 asset)
        external
        view
        override
        returns (uint256)
    {
        return positions[user][asset].margin;
    }
}
