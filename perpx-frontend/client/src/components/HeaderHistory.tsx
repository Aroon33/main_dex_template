import React from "react";


import { Trade } from "@/types"; 

type Props = {
  trades: Trade[];
  limit?: number;
};

export default function HeaderHistory({ trades, limit = 3 }: Props) {
  const recent = trades.slice(0, limit);

  if (recent.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        No recent trades
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {recent.map((t) => (
        <div
          key={t.id}
          className="flex justify-between text-sm"
        >
          <div>
            <span className="font-medium">{t.symbol}</span>{" "}
            <span className="text-muted-foreground">
              CLOSE
            </span>
          </div>

          <div
            className={
              t.pnl >= 0 ? "text-green-500" : "text-red-500"
            }
          >
            {t.pnl >= 0 ? "+" : ""}
            {t.pnl.toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  );
}
