/**
 * ============================================================
 * Trade Page – Final Entry (Single Source of Truth)
 * ============================================================
 *
 * ■ 接続ルール（最重要）
 * ------------------------------------------------------------
 * - provider / account は必ず AccountContext から取得
 * - BrowserProvider を新規生成しない
 * - window.ethereum を直接参照しない
 *
 * ■ このファイルの役割
 * ------------------------------------------------------------
 * - Tradeページ全体の組み立てのみを担当
 * - state / handler は子コンポーネントへ委譲
 * - デザインは Trade1.tsx と完全一致
 *
 * ============================================================
 */

import { useAccount } from "@/contexts/AccountContext";

// Trade components
import TradeHeader from "./TradeHeader";
import TradePair from "./TradePair";
import TradeChart from "./TradeChart";
import TradeOrder from "./TradeOrder";
import TradeBottomTabs from "./TradeBottomTabs";

import { useOrderBook } from "@/hooks/trade/useOrderBook";


// React
import { useState } from "react";

export default function Trade() {
  /* =========================
   * Account Context (唯一)
   * ========================= */
  const accountCtx = useAccount();

// 必要なら「接続済みかどうか」だけ見る
if (!accountCtx) {
  return null;
}


  /* =========================
   * Shared State (Trade1 同等)
   * ========================= */
  const [tradeMode, setTradeMode] = useState<"perpetual" | "spot">("perpetual");

  // Mock / placeholder data (Trade1 と同じ扱い)
  const balance = 10000;
  const positions: any[] = [];
  const orders: any[] = [];
  const trades: any[] = [];

  const { orderBookAsks, orderBookBids } = useOrderBook("BTCUSDT");

  const [selectedPair, setSelectedPair] = useState("BTCUSDT");




  /* =========================
   * Render
   * ========================= */
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header + Perpetual/Spot */}
      <TradeHeader />

      {/* Pair selector + price */}
      <TradePair
  symbol={selectedPair}
  onChange={setSelectedPair}
/>


      {/* Chart */}
      <TradeChart symbol="BTCUSDT" mode={tradeMode} />

      {/* Order panel */}
      <TradeOrder tradeMode={tradeMode} balance={balance} />

      {/* Bottom tabs */}
      <TradeBottomTabs
  positions={positions}
  tradeHistory={trades}
  orders={orders}
  orderBookAsks={orderBookAsks}
  orderBookBids={orderBookBids}
/>

    </div>
  );
}
