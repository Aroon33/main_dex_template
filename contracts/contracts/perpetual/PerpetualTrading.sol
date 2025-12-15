// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../interfaces/IPerp.sol";
import "../interfaces/IOracle.sol";

/**
 * @title PerpetualTrading
 * @notice ERC20担保版 Perp（PoC）
 * @dev Pool操作は行わず、Router経由で資金移動する
 */
contract PerpetualTrading is IPerp {
    struct Position {
        int256 size;          // +long / -short
        uint256 entryPrice;   // USD価格（18dec）
        uint256 margin;       // tUSD
        bool isOpen;
    }

    mapping(address => Position) public positions;

    address public owner;
    address public router;
    address public liquidationEngine;

    IOracle public oracle;

    modifier onlyOwner() {
        require(msg.sender == owner, "NOT_OWNER");
        _;
    }

    modifier onlyRouter() {
        require(msg.sender == router, "NOT_ROUTER");
        _;
    }

    modifier onlyLiquidation() {
        require(msg.sender == liquidationEngine, "NOT_LIQUIDATION");
        _;
    }

    constructor(address _oracle) {
        owner = msg.sender;
        oracle = IOracle(_oracle);
    }

    // ===== admin =====

    function setRouter(address _router) external onlyOwner {
        router = _router;
    }

    function setLiquidationEngine(address _liq) external onlyOwner {
        liquidationEngine = _liq;
    }

    // ===== margin (Router only) =====

    function onTraderDeposit(address user, uint256 amount)
        external
        onlyRouter
    {
        positions[user].margin += amount;
    }

    function onTraderWithdraw(address user, uint256 amount)
        external
        onlyRouter
    {
        require(positions[user].margin >= amount, "INSUFFICIENT_MARGIN");
        positions[user].margin -= amount;
    }

    // ===== position =====

    function openPosition(address user, int256 size)
        external
        onlyRouter
    {
        Position storage pos = positions[user];
        require(!pos.isOpen, "POSITION_EXISTS");
        require(pos.margin > 0, "NO_MARGIN");
        require(size != 0, "INVALID_SIZE");

        uint256 price = oracle.getPrice(bytes32("tUSD"));

        pos.size = size;
        pos.entryPrice = price;
        pos.isOpen = true;
    }

    function closePosition(address user)
        external
        onlyRouter
    {
        _closePosition(user);
    }

    function liquidate(address user)
        external
        onlyLiquidation
    {
        _closePosition(user);
    }

    function _closePosition(address user) internal {
        Position storage pos = positions[user];
        require(pos.isOpen, "NO_POSITION");

        delete positions[user];
    }

    // ===== view =====

    function calculatePnL(address user, uint256 price)
        public
        view
        returns (int256)
    {
        Position memory pos = positions[user];
        if (!pos.isOpen) return 0;

        return (int256(price) - int256(pos.entryPrice)) * pos.size;
    }

    function getPosition(address user)
        external
        view
        returns (int256 size, uint256 entryPrice)
    {
        Position memory pos = positions[user];
        return (pos.size, pos.entryPrice);
    }

    function getMargin(address user)
        external
        view
        returns (uint256)
    {
        return positions[user].margin;
    }
}
