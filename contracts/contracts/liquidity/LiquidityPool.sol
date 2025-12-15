// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../interfaces/ILiquidityPool.sol";
import "../tokens/PLP.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title LiquidityPool
 * @notice ERC20担保 + PLP対応 Liquidity Pool（PoC）
 */
contract LiquidityPool is ILiquidityPool {
    IERC20 public collateralToken;
    PLP public plp;

    address public owner;
    address public perp;
    address public router;

    // Trader margin
    mapping(address => uint256) public traderBalances;

    modifier onlyOwner() {
        require(msg.sender == owner, "NOT_OWNER");
        _;
    }

    modifier onlyPerp() {
        require(msg.sender == perp, "NOT_PERP");
        _;
    }

    modifier onlyRouter() {
        require(msg.sender == router, "NOT_ROUTER");
        _;
    }

    constructor(address _collateralToken, address _plp) {
        owner = msg.sender;
        collateralToken = IERC20(_collateralToken);
        plp = PLP(_plp);
    }

    // ===== admin =====

    function setPerp(address _perp) external onlyOwner {
        perp = _perp;
    }

    function setRouter(address _router) external onlyOwner {
        router = _router;
    }

    // ===== LP functions =====

    /**
     * @notice LP が流動性を供給 → PLP mint
     * @dev PoC: 1 tUSD = 1 PLP
     */
    function lpDeposit(uint256 amount) external {
        require(amount > 0, "ZERO_AMOUNT");

        collateralToken.transferFrom(
            msg.sender,
            address(this),
            amount
        );

        plp.mint(msg.sender, amount);
    }

    /**
     * @notice LP が流動性を引き出す → PLP burn
     * @dev PoC: NAV を考慮して引き出し
     */
    function lpWithdraw(uint256 plpAmount) external {
        require(plpAmount > 0, "ZERO_AMOUNT");

        uint256 nav = getPLPNAV();
        uint256 withdrawAmount = (plpAmount * nav) / 1e18;

        plp.burn(msg.sender, plpAmount);
        collateralToken.transfer(msg.sender, withdrawAmount);
    }

    // ===== Trader functions =====

    function deposit(address user, uint256 amount)
        external
        override
        onlyRouter
    {
        require(amount > 0, "ZERO_AMOUNT");

        collateralToken.transferFrom(
            user,
            address(this),
            amount
        );

        traderBalances[user] += amount;
    }

    function withdraw(address user, uint256 amount)
        external
        override
        onlyPerp
    {
        require(traderBalances[user] >= amount, "INSUFFICIENT_BALANCE");

        traderBalances[user] -= amount;
        collateralToken.transfer(user, amount);
    }

    function settlePnL(address user, int256 pnl)
        external
        override
        onlyPerp
    {
        if (pnl < 0) {
            uint256 loss = uint256(-pnl);
            require(traderBalances[user] >= loss, "INSUFFICIENT_MARGIN");
            traderBalances[user] -= loss;
        }
    }

    // ===== NAV / views =====

    /**
     * @notice Pool の総資産（tUSD）
     */
    function getPoolValue()
        external
        view
        override
        returns (uint256)
    {
        return collateralToken.balanceOf(address(this));
    }

    /**
     * @notice 1 PLP あたりの価値（NAV）
     * @dev 18 decimals
     */
    function getPLPNAV() public view returns (uint256) {
        uint256 supply = plp.totalSupply();
        if (supply == 0) return 1e18;

        uint256 poolValue = collateralToken.balanceOf(address(this));
        return (poolValue * 1e18) / supply;
    }
}
