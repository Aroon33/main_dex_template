// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../interfaces/IPerp.sol";

/**
 * @title LiquidationEngine
 * @notice ERC20担保版 LiquidationEngine（PoC）
 */
contract LiquidationEngine {
    IPerp public perp;

    constructor(address _perp) {
        perp = IPerp(_perp);
    }

    function liquidate(address user) external {
        perp.liquidate(user);
    }
}
