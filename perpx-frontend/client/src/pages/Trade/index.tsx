"use client";

/**
 * ============================================================
 * Trade Page – AccountContext Only Version
 * ============================================================
 */

import { useState, useEffect } from "react";
import { useAccount } from "@/contexts/AccountContext";
import { useLimitExecutor } from "@/hooks/limit/useLimitExecutor";

// Trade components
import TradeHeader from "./TradeHeader";
import TradePair from "./TradePair";
import TradeChart from "./TradeChart";
import TradeOrder from "./TradeOrder";
import TradeBottomTabs from "./TradeBottomTabs";

// OrderBook（UI 用・読み取り専用）
import { useOrderBook } from "@/hooks/trade/useOrderBook";

export default function Trade() {
  /* =========================
   * Account Context
   * ========================= */
  const account = useAccount();

  /* =========================
   * Local UI State
   * ========================= */
  const [tradeMode] =
    useState<"perpetual" | "spot">("perpetual");

  // UI / Binance / Chart 用（例: BTCUSDT）
  const [selectedPair, setSelectedPair] =
    useState("BTCUSDT");

  // on-chain / Oracle / Router 用（例: BTC）
  const onchainPair = selectedPair.replace("USDT", "");

  /* =========================
   * Limit Executor（裏方・常駐）
   * ========================= */
  const { execute } = useLimitExecutor(onchainPair);

  useEffect(() => {
    execute();
  }, [execute]);

  /* =========================
   * Balance (SSOT)
   * ========================= */
  const { marginBalance, availableBalance } = useAccount();

  /* =========================
   * OrderBook (UI only)
   * ========================= */
  const { orderBookAsks, orderBookBids } =
    useOrderBook(selectedPair);

  /* ============================================================
   * Render
   * ============================================================ */
  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* ================= PC Layout ================= */}
      <div className="hidden md:flex flex-col flex-1 min-h-0">
        <TradeHeader />

        <TradePair
          symbol={selectedPair}
          onChange={setSelectedPair}
        />

        <TradeChart
          symbol={selectedPair}
          mode={tradeMode}
        />

        <TradeOrder
          tradeMode={tradeMode}
          marginBalance={marginBalance}
          availableBalance={availableBalance}
          symbol={onchainPair}
        />

        <TradeBottomTabs />
      </div>

      {/* ================= Mobile Layout ================= */}
      <div className="md:hidden h-[100dvh] flex flex-col">

        <div className="shrink-0">
          <TradeHeader />
          <TradePair
            symbol={selectedPair}
            onChange={setSelectedPair}
          />
        </div>

        {/* 👇 Chart だけ scroll */}
        <div className="flex-1 overflow-y-auto">
          <TradeChart
            symbol={selectedPair}
            mode={tradeMode}
          />
        </div>

        {/* 👇 Order + Tabs は固定 */}
        <div className="shrink-0">
          <TradeOrder
            tradeMode={tradeMode}
            marginBalance={marginBalance}
            availableBalance={availableBalance}
            symbol={onchainPair}
          />

          <TradeBottomTabs />
        </div>

      </div>

    </div>
  );
}
