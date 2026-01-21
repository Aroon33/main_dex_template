import { Contract, BrowserProvider } from "ethers";
import { CONTRACTS } from "@/lib/eth/addresses";
import { ROUTER_ABI } from "@/lib/eth/abi/Router";

export type PositionCloseEvent = {
  user: string;
  positionId: bigint;

  pair: string;
  size: bigint;
  entryPrice: bigint;
  exitPrice: bigint;
  pnl: bigint;

  timestamp: bigint;
};

/**
 * Solidity と完全一致の PnL 計算
 *
 * pnl = size * (exitPrice - entryPrice) / entryPrice
 *
 * - size: signed (long + / short -)
 * - entryPrice / exitPrice: uint256 (18dec)
 */
function calcPnl(
  size: bigint,
  entryPrice: bigint,
  exitPrice: bigint
): bigint {
  if (entryPrice === 0n) return 0n;
  return (size * (exitPrice - entryPrice)) / entryPrice;
}

export async function getPositionCloseEvents(
  user: string,
  provider: BrowserProvider
): Promise<PositionCloseEvent[]> {
  const router = new Contract(
    CONTRACTS.ROUTER,
    ROUTER_ABI,
    provider
  );

  const filter = router.filters.PositionClosed(user, null);
  const logs = await router.queryFilter(filter);

  const events: PositionCloseEvent[] = [];

  for (const log of logs) {
    if (!("args" in log) || !log.args) continue;
    const a = log.args as any;

    const pnl = calcPnl(
      a.size,
      a.entryPrice,
      a.exitPrice
    );

    events.push({
      user: a.user,
      positionId: a.positionId,
      pair: a.pair,
      size: a.size,
      entryPrice: a.entryPrice,
      exitPrice: a.exitPrice,
      pnl, // ← フロント計算結果
      timestamp: a.timestamp,
    });
  }

  // newest first
  events.sort(
    (a, b) => Number(b.timestamp - a.timestamp)
  );

  return events;
}
