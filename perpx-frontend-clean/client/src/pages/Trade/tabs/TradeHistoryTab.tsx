"use client";

/**
 * ============================================================
 * TradeHistoryTab – Closed Trades + Claim (FINAL)
 * ============================================================
 */

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAccount } from "@/contexts/AccountContext";
import { useClaimPnL } from "@/hooks/trade/write/useClaimPnL";
import { BrowserProvider, Contract, ethers } from "ethers";
import { CONTRACTS } from "@/lib/eth/addresses";
import { ROUTER_ABI } from "@/lib/eth/abi/Router";

export default function TradeHistoryTab() {
  const { address, trades, isLoading, refreshAll } = useAccount();
  const { claimPnL, isSubmitting } = useClaimPnL();

  const [claimable, setClaimable] = useState<number>(0);

  /* ======================
     Load claimable PnL
  ====================== */
  useEffect(() => {
    if (!address || !window.ethereum) {
      setClaimable(0);
      return;
    }

    (async () => {
      try {
        const provider = new BrowserProvider(window.ethereum);
        const router = new Contract(
          CONTRACTS.ROUTER,
          ROUTER_ABI,
          provider
        );

        const raw = await router.getClaimablePnL(address);
        setClaimable(Number(raw) / 1e18);
      } catch (e) {
        console.error("[TradeHistoryTab] load claimablePnL failed:", e);
      }
    })();
  }, [address, trades]);

  if (!address) {
    return <div className="text-sm text-white/60">Wallet not connected</div>;
  }

  if (isLoading) {
    return (
      <div className="text-sm text-white/60">
        Loading trade history...
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* ===== Claim PnL ===== */}
      <div className="p-3 border border-white/10 rounded-lg flex justify-between items-center">
        <div className="text-sm">
          Claimable PnL:
          <span className="ml-2 font-semibold text-green-500">
            +{claimable.toFixed(2)} USD
          </span>
        </div>

        <Button
          size="sm"
          disabled={claimable <= 0 || isSubmitting}
          onClick={async () => {
            const ok = confirm(
              `Claim ${claimable.toFixed(2)} USD ?`
            );
            if (!ok) return;

            try {
              const res = await claimPnL();
              if (res?.success) {
                await refreshAll();
                setClaimable(0);
              }
            } catch {
              alert("Claim failed");
            }
          }}
        >
          {isSubmitting ? "Claiming..." : "Claim"}
        </Button>
      </div>

      {/* ===== Trade History ===== */}
      {(!trades || trades.length === 0) && (
        <div className="text-sm text-white/60">
          No trade history
        </div>
      )}

      {trades.map((t) => {
        const pnlColor =
          t.pnl > 0
            ? "text-green-500"
            : t.pnl < 0
            ? "text-red-500"
            : "text-white/50";

        return (
          <Card key={t.id} className="p-3 space-y-1">
            <div className="font-medium">
              {t.symbol} / USD
            </div>

            <div className="text-sm text-white/70">
              Close {t.side.toUpperCase()} &nbsp;
              {t.sizeUsd.toLocaleString()} USD
            </div>

            <div className="text-xs text-white/60">
              Entry: {t.entryPrice} → Exit: {t.exitPrice}
            </div>

            <div className={`text-sm font-semibold ${pnlColor}`}>
              PnL: {t.pnl >= 0 ? "+" : ""}
              {t.pnl.toFixed(2)} USD
            </div>

            <div className="text-xs text-white/50">
              {new Date(t.timestamp).toLocaleString()}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
