import { Contract, BrowserProvider } from "ethers";
import { CONTRACTS } from "@/lib/eth/addresses";
import { ROUTER_ABI } from "@/lib/eth/abi/Router";

/**
 * Router PositionClosed event (SSOT)
 */
export type PositionCloseEvent = {
  user: string;
  positionId: bigint;

  pair: string;          // bytes32
  size: bigint;          // int256
  entryPrice: bigint;    // uint256
  exitPrice: bigint;     // uint256
  pnl: bigint;           // int256

  timestamp: bigint;
};

export async function getPositionCloseEvents(
  user: string
): Promise<PositionCloseEvent[]> {
  if (!window.ethereum) {
    throw new Error("Wallet not found");
  }

  const provider = new BrowserProvider(window.ethereum);
  const router = new Contract(
    CONTRACTS.ROUTER,
    ROUTER_ABI,
    provider
  );

  const filter = router.filters.PositionClosed(user, null);
  const logs = await router.queryFilter(filter);

  const events: PositionCloseEvent[] = [];

  for (const log of logs) {
    if (!("args" in log)) continue;
    const a = log.args;

    events.push({
      user: a.user,
      positionId: a.positionId,

      pair: a.pair,
      size: a.size,
      entryPrice: a.entryPrice,
      exitPrice: a.exitPrice,
      pnl: a.pnl,

      timestamp: a.timestamp,
    });
  }

  // 新しい順
  events.sort(
    (a, b) => Number(b.timestamp - a.timestamp)
  );

  return events;
}
