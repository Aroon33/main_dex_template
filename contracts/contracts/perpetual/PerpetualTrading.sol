// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../interfaces/IPerp.sol";
import "../interfaces/ILiquidityPool.sol";
import "../interfaces/IOracle.sol";

contract PerpetualTrading is IPerp {
    struct Position {
        int256 size;
        uint256 entryPrice;
        uint256 margin;
        bool isOpen;
    }

    mapping(address => Position) public positions;
    mapping(address => int256) public claimablePnL;

    address public owner;
    address public router;
    address public liquidationEngine;

    ILiquidityPool public liquidityPool;
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

    constructor(address _oracle, address _liquidityPool) {
        owner = msg.sender;
        oracle = IOracle(_oracle);
        liquidityPool = ILiquidityPool(_liquidityPool);
    }

    /* ========== admin ========== */

    function setRouter(address _router) external onlyOwner {
        router = _router;
    }

    function setLiquidationEngine(address _liq) external onlyOwner {
        liquidationEngine = _liq;
    }

    /* ========== interface hooks (IMPORTANT) ========== */

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

    /* ========== position ========== */

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

        uint256 exitPrice = oracle.getPrice(bytes32("tUSD"));
        int256 pnl = calculatePnL(user, exitPrice);

        liquidityPool.settlePnL(user, pnl);
        claimablePnL[user] += pnl;

        pos.isOpen = false;
        pos.size = 0;
        pos.entryPrice = 0;
    }

    /* ========== PnL claim ========== */

    function claimPnL(address user)
        external
        onlyRouter
    {
        int256 pnl = claimablePnL[user];
        require(pnl != 0, "NO_PNL");

        claimablePnL[user] = 0;

        if (pnl > 0) {
            liquidityPool.withdraw(user, uint256(pnl));
        }
    }

    /* ========== views ========== */

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

    function getClaimablePnL(address user)
        external
        view
        returns (int256)
    {
        return claimablePnL[user];
    }
}
