"use client";

/**
 * ============================================================
 * PositionsTab – Open Positions (FINAL)
 * ============================================================
 *
 * - Show OPEN positions only
 * - Display Unrealized PnL (USD + %)
 * - Entry / Mark price
 * - Close action
 *
 * ============================================================
 */

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAccount } from "@/contexts/AccountContext";
import { useClosePosition } from "@/hooks/trade/write/useClosePosition";
import { BrowserProvider, Contract, ethers } from "ethers";
import { CONTRACTS } from "@/lib/eth/addresses";
import { ORACLE_ABI } from "@/lib/eth/abi/Oracle";

type MarkPriceMap = Record<number, number>;

export default function PositionsTab() {
  const { address, positions, isLoading, refreshAll } = useAccount();
  const { closePosition, isSubmitting } = useClosePosition();

  const [markPrices, setMarkPrices] = useState<MarkPriceMap>({});

  /* ======================
     Load mark prices
  ====================== */
  useEffect(() => {
    if (!address || positions.length === 0) return;

    let cancelled = false;

    (async () => {
      try {
        const provider = new BrowserProvider(window.ethereum);
        const oracle = new Contract(
          CONTRACTS.PRICE_ORACLE,
          ORACLE_ABI,
          provider
        );

        const prices: MarkPriceMap = {};

        for (const p of positions) {
          const price = await oracle.getPrice(
            ethers.encodeBytes32String(p.pair)
          );
          prices[p.id] = Number(price) / 1e18;
        }

        if (!cancelled) setMarkPrices(prices);
      } catch (e) {
        console.error("[PositionsTab] load mark price failed:", e);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [address, positions]);

  if (!address) {
    return <div className="text-sm text-white/60">Wallet not connected</div>;
  }

  if (isLoading) {
    return <div className="text-sm text-white/60">Loading positions...</div>;
  }

  if (!positions || positions.length === 0) {
    return <div className="text-sm text-white/60">No open positions</div>;
  }

  return (
    <div className="space-y-3">
      {positions.map((p) => {
        const side = p.size > 0 ? "LONG" : "SHORT";
        const sizeUsd = Math.abs(p.size) / 1e18;

        const entry = p.entryPrice;
        const mark = markPrices[p.id] ?? entry;

        // Unrealized PnL
        const pnlUsd =
          (p.size * (mark - entry)) / entry / 1e18;

        const pnlPct = ((mark - entry) / entry) * 100;

        const pnlColor =
          pnlUsd >= 0 ? "text-green-500" : "text-red-500";

        const sideColor =
          side === "LONG" ? "text-green-500" : "text-red-500";

        return (
          <Card key={p.id} className="p-3 space-y-1">
            <div className="flex justify-between">
              <div className="font-medium">
                {p.pair} / USD
              </div>
              <div className={`font-bold ${sideColor}`}>
                {side}
              </div>
            </div>

            <div className="text-sm text-white/70">
              {side} &nbsp; {sizeUsd.toLocaleString()} USD
            </div>

            <div className="text-xs text-white/60">
              Entry: {entry} | Mark: {mark}
            </div>

            <div className={`text-sm font-semibold ${pnlColor}`}>
              PnL: {pnlUsd >= 0 ? "+" : ""}
              {pnlUsd.toFixed(2)} USD (
              {pnlPct >= 0 ? "+" : ""}
              {pnlPct.toFixed(1)}%)
            </div>

            <div className="pt-2">
              <Button
                size="sm"
                variant="outline"
                disabled={isSubmitting}
                onClick={async () => {
                  const ok = confirm(
                    "Are you sure you want to close this position?"
                  );
                  if (!ok) return;

                  const res = await closePosition({
                    positionId: p.id,
                  });

                  if (res?.success) {
                    await refreshAll();
                  }
                }}
              >
                {isSubmitting ? "Closing..." : "Close"}
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
