/**
 * ============================================================
 * TradeHistoryList
 * ============================================================
 *
 * Role:
 * - Display executed trade history
 *
 * ============================================================
 */

import { Trade } from "@/types";

type Props = {
  trades: Trade[];
  loading?: boolean;
};

export default function TradeHistoryList({
  trades,
  loading,
}: Props) {
  if (loading) {
    return <div className="text-muted-foreground">Loading…</div>;
  }

  if (trades.length === 0) {
    return (
      <div className="text-muted-foreground">
        No trade history
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {trades.map((t) => (
        <div
          key={t.id}
          className="flex justify-between text-sm border-b pb-1"
        >
          <div>
            <div className="font-medium">{t.symbol}</div>
            <div className="text-xs text-muted-foreground">
              {new Date(t.timestamp).toLocaleString()}
            </div>
          </div>

          <div className="text-right">
            <div>Price: {t.price}</div>
            <div
              className={
                t.pnl >= 0
                  ? "text-green-500"
                  : "text-red-500"
              }
            >
              {t.pnl >= 0 ? "+" : ""}
              {t.pnl}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
