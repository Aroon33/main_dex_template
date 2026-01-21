"use client";

/**
 * ============================================================
 * Trade Page – AccountContext Only Version
 * ============================================================
 *
 * Rules:
 * - AccountContext を唯一のアカウントソースとして使用
 * - TradeReadContext / trade READ hooks は使用しない
 * - wallet 未接続でも UI は必ず描画
 * - UI 構造・デザインは変更しない
 *
 * 【重要】
 * - UI 用 symbol（BTCUSDT）と
 *   on-chain 用 pair（BTC）は必ず分離する
 *
 * ============================================================
 */

import { useState } from "react";
import { useAccount } from "@/contexts/AccountContext";

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
   * Balance (SSOT)
   * ========================= */
  const balance = account.collateralBalance;

  /* =========================
   * OrderBook (UI only)
   * ========================= */
  const { orderBookAsks, orderBookBids } =
    useOrderBook(selectedPair);

  /* ============================================================
   * Render
   * ============================================================
   */
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
          balance={balance}
          symbol={onchainPair}   // ★ 必ず on-chain pair を渡す
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
            balance={balance}
            symbol={onchainPair}   // ★ Mobile 側も必須
          />
          <TradeBottomTabs />
        </div>

      </div>

    </div>
  );
}
