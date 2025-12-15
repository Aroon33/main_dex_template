// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title PLP
 * @notice Pool Liquidity Provider Token
 */
contract PLP is ERC20 {
    address public pool;
    address public owner;

    modifier onlyPool() {
        require(msg.sender == pool, "ONLY_POOL");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "NOT_OWNER");
        _;
    }

    constructor(
        string memory name_,
        string memory symbol_
    ) ERC20(name_, symbol_) {
        owner = msg.sender;
    }

    /**
     * @notice Pool アドレスを設定（1回だけ想定）
     */
    function setPool(address _pool) external onlyOwner {
        require(pool == address(0), "POOL_ALREADY_SET");
        pool = _pool;
    }

    function mint(address to, uint256 amount)
        external
        onlyPool
    {
        _mint(to, amount);
    }

    function burn(address from, uint256 amount)
        external
        onlyPool
    {
        _burn(from, amount);
    }
}
