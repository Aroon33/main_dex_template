/**
 * ============================================================
 * Dev Reader
 * ============================================================
 *
 * Role:
 * - Read on-chain state for dev
 *
 * ============================================================
 */

import { BrowserProvider } from "ethers";
import { getDevContracts, PAIR } from "./contracts";
import { DevState } from "../types/dev";

/* =========================
 * Reader
 * ========================= */

export async function readDevState(
  provider: BrowserProvider,
  account: string
): Promise<DevState> {
  const { oracle, token, perp } =
    getDevContracts(provider);

  const oraclePrice =
    Number(await oracle.getPrice(PAIR)) / 1e8;

  const balance =
    Number(await token.balanceOf(account)) / 1e18;

  const allowance =
    Number(
      await token.allowance(
        account,
        perp.target
      )
    ) / 1e18;

  const margin =
    Number(await perp.getMargin(account)) / 1e18;

  const claimablePnL =
    Number(await perp.getClaimablePnL(account)) / 1e18;

  const ids = await perp.getUserPositionIds(account);

  let sizeUsd = 0;
  let entryPrice: number | null = null;
  let unrealizedPnL = 0;

  if (ids.length > 0) {
    const pos = await perp.getPosition(
      account,
      ids[0]
    );

    sizeUsd = Number(pos[1]);
    entryPrice = Number(pos[2]) / 1e8;

    unrealizedPnL =
      entryPrice > 0
        ? (sizeUsd *
            (oraclePrice - entryPrice)) /
          entryPrice
        : 0;
  }

  return {
    oraclePrice,
    balance,
    allowance,
    margin,
    claimablePnL,
    position: {
      sizeUsd,
      entryPrice,
      unrealizedPnL,
    },
  };
}
