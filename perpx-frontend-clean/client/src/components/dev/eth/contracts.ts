/**
 * ============================================================
 * Dev Contracts
 * ============================================================
 *
 * Role:
 * - Contract instantiation for dev
 *
 * ============================================================
 */

import { BrowserProvider, Contract, ethers } from "ethers";
import { CONTRACTS } from "@/lib/eth/addresses";

export const PAIR = ethers.encodeBytes32String("tUSD");

export function getDevContracts(provider: BrowserProvider) {
  return {
    oracle: new Contract(
      CONTRACTS.PRICE_ORACLE,
      ["function getPrice(bytes32) view returns (uint256)"],
      provider
    ),

    token: new Contract(
      CONTRACTS.COLLATERAL_TOKEN,
      [
        "function balanceOf(address) view returns (uint256)",
        "function allowance(address,address) view returns (uint256)",
      ],
      provider
    ),

    perp: new Contract(
      CONTRACTS.PERPETUAL_TRADING,
      [
        "function getMargin(address) view returns (uint256)",
        "function getClaimablePnL(address) view returns (int256)",
        "function getUserPositionIds(address) view returns (uint256[])",
        "function getPosition(address,uint256) view returns (bytes32,int256,uint256,uint256,bool)",
      ],
      provider
    ),
  };
}
