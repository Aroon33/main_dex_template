// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../interfaces/IPerp.sol";

contract LiquidationEngine {
    IPerp public perp;

    constructor(address _perp) {
        perp = IPerp(_perp);
    }

    function liquidate(address user, uint256 positionId) external {
        perp.liquidate(user, positionId);
    }
}
