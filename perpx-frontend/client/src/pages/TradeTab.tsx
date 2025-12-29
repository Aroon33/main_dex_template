/**
 * ============================================================
 * TRADE MODULE RULES (DO NOT REMOVE)
 * ============================================================
 *
 * ■ Purpose
 * ------------------------------------------------------------
 * This file is part of the Trade module.
 * The rules below are a CONTRACT to prevent architectural
 * regressions and build-time errors.
 *
 * ■ Data / Dependency Rules
 * ------------------------------------------------------------
 * 1. AccountContext is INTERNAL ONLY.
 *    - TradeTab MUST NOT access AccountContext directly.
 *    - Wallet address is provided via WalletContext only.
 *
 * 2. Hooks under src/hooks/trade MUST be PURE.
 *    - NO direct access to AccountContext or WalletContext.
 *    - All external data must be passed via function arguments.
 *
 * 3. UI Components MUST consume hook results only.
 *    - UI never talks to blockchain directly.
 *    - UI never creates providers or side-effects for data fetching.
 *
 * ■ Naming / Export Rules
 * ------------------------------------------------------------
 * - 1 file = 1 component = 1 default export.
 * - Import names MUST match export names exactly.
 *
 * ■ Modification Policy
 * ------------------------------------------------------------
 * - This header MUST stay at the top of the file.
 * - Always replace the whole file when refactoring.
 *
 * ============================================================
 */

"use client";

import { useState } from "react";
import { useWallet } from "@/contexts/WalletContext";

// Components
import HeaderHistory from "@/components/HeaderHistory";

// Hooks (PURE hooks)
import { usePositions, Position } from "@/hooks/trade/usePositions";
import {
  useTradeHistorySimple,
  Trade,
} from "@/hooks/trade/useTradeHistorySimple";
import { useOrderHistory, Order } from "@/hooks/trade/useOrderHistory";

// UI
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/* =========================
 * Types
 * ========================= */

type TabKey = "positions" | "trades" | "orders";

/* =========================
 * Component
 * ========================= */

export default function TradeTab() {
  const { address, isConnected, connect } = useWallet();
  const [activeTab, setActiveTab] = useState<TabKey>("positions");

  /* =========================
   * Hooks
   * ========================= */

  const { positions } = usePositions(address ?? undefined);
  const { trades } = useTradeHistorySimple(  );
  const { orders } = useOrderHistory(address ?? undefined);

  /* =========================
   * Guard
   * ========================= */

  if (!isConnected) {
    return (
      <div className="p-6">
        <Button onClick={connect}>Connect Wallet</Button>
      </div>
    );
  }

  /* =========================
   * Render
   * ========================= */

  return (
    <div className="p-4 space-y-4">
      {/* ===== Header Summary ===== */}
      <HeaderHistory trades={trades} />

      {/* ===== Tabs ===== */}
      <div className="flex gap-2">
        <Button
          variant={activeTab === "positions" ? "default" : "outline"}
          onClick={() => setActiveTab("positions")}
        >
          Positions
        </Button>

        <Button
          variant={activeTab === "trades" ? "default" : "outline"}
          onClick={() => setActiveTab("trades")}
        >
          Trades
        </Button>

        <Button
          variant={activeTab === "orders" ? "default" : "outline"}
          onClick={() => setActiveTab("orders")}
        >
          Orders
        </Button>
      </div>

      {/* ===== Positions ===== */}
      {activeTab === "positions" && (
        <Card className="p-4 space-y-2">
          {positions.length === 0 ? (
            <div className="text-muted-foreground">
              No open positions
            </div>
          ) : (
            positions.map((p: Position) => (
              <div key={p.id} className="flex justify-between text-sm">
                <div>
                  <div className="font-medium">{p.pair}</div>
                  <div className="text-xs text-muted-foreground">
                    {p.side.toUpperCase()}
                  </div>
                </div>
                <div className="text-right">
                  <div>Size: {p.size}</div>
                  <div>Entry: {p.entryPrice}</div>
                </div>
              </div>
            ))
          )}
        </Card>
      )}

      {/* ===== Trades ===== */}
      {activeTab === "trades" && (
        <Card className="p-4 space-y-2">
          {trades.length === 0 ? (
            <div className="text-muted-foreground">
              No trade history
            </div>
          ) : (
            trades.map((t: Trade) => (
              <div key={t.id} className="flex justify-between text-sm">
                <div>
                  <div className="font-medium">{t.symbol}</div>
                  <div className="text-xs text-muted-foreground">
                    CLOSE
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
            ))
          )}
        </Card>
      )}

      {/* ===== Orders ===== */}
      {activeTab === "orders" && (
        <Card className="p-4 space-y-2">
          {orders.length === 0 ? (
            <div className="text-muted-foreground">
              No orders
            </div>
          ) : (
            orders.map((o: Order) => (
              <div key={o.id} className="flex justify-between text-sm">
                <div>
                  <div className="font-medium">{o.symbol}</div>
                  <div className="text-xs text-muted-foreground">
                    {o.side.toUpperCase()} {o.type.toUpperCase()}
                  </div>
                </div>
                <div className="text-right">
                  <div>Size: {o.size}</div>
                  <div>Status: {o.status}</div>
                </div>
              </div>
            ))
          )}
        </Card>
      )}
    </div>
  );
}
