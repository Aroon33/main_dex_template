"use client";

/**
 * ============================================================
 * TradeHistoryTab – Closed Trades + Claim to Margin
 * ============================================================
 */

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAccount } from "@/contexts/AccountContext";
import { useClaimPnLToMargin } from "@/hooks/trade/write/useClaimPnLToMargin";
import { BrowserProvider, Contract, ethers } from "ethers";
import { CONTRACTS } from "@/lib/eth/addresses";
import { ROUTER_ABI } from "@/lib/eth/abi/Router";

import { useLimitOrders } from "@/contexts/LimitOrderContext";


export default function TradeHistoryTab() {
  const { address, trades, isLoading, refreshAll } = useAccount();
  const { claimToMargin, isSubmitting } = useClaimPnLToMargin();

  const [claimable, setClaimable] = useState<number>(0);

  const { orders } = useLimitOrders();

const historyOrders = orders.filter(
  (o) => o.status !== "open"
);


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
              `Add ${claimable.toFixed(2)} USD to margin?`
            );
            if (!ok) return;

            try {
              const res = await claimToMargin();
              if (res?.success) {
                await refreshAll();
                setClaimable(0);
              }
            } catch {
              alert("Claim failed");
            }
          }}
        >
          {isSubmitting ? "Processing..." : "Add to Margin"}
        </Button>
      </div>

      {/* ===== Limit Order History ===== */}
{historyOrders.length > 0 && (
  <div className="space-y-3">
    <div className="text-xs text-white/50">
      Limit Order History
    </div>

    {historyOrders.map((o) => (
      <Card key={o.id} className="p-3 space-y-1">
        <div className="flex justify-between">
          <div className="font-medium">
            {o.symbol} / USD
          </div>
          <div className="text-xs text-white/50">
            LIMIT · {o.status.toUpperCase()}
          </div>
        </div>

        <div
          className={`text-sm ${
            o.side === "buy"
              ? "text-green-500"
              : "text-red-500"
          }`}
        >
          {o.side.toUpperCase()} &nbsp;
          {o.sizeUsd.toLocaleString()} USD
        </div>

        <div className="text-xs text-white/60">
          Price: {o.price}
        </div>

        <div className="text-xs text-white/50">
          {new Date(o.createdAt).toLocaleString()}
        </div>
      </Card>
    ))}
  </div>
)}


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
