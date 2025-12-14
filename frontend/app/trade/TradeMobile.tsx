"use client";

import { useState } from "react";

import TradeHeader from "@/src/components/trade/TradeHeader";
import TradeChart from "@/src/components/trade/TradeChart";
import TradeOrderPanel from "@/src/components/trade/TradeOrderPanel";
import OrderBook from "@/src/components/orderbook/OrderBook";

type Tab = "chart" | "orders" | "trades" | "book";

export default function TradeMobile() {
  const [tab, setTab] = useState<Tab>("chart");

  return (
    <div className="h-[100dvh] flex flex-col bg-bg-base text-text-main">

      {/* ===== Header (高さ固定) ===== */}
      <div className="shrink-0">
        <TradeHeader />
      </div>

      {/* ===== Main Content ===== */}
      <div className="flex-1 overflow-hidden bg-bg-panel">
        {tab === "chart" && (
          <div className="h-full">
            <TradeChart />
          </div>
        )}

        {tab === "orders" && (
          <div className="h-full overflow-auto p-2">
            <TradeOrderPanel />
          </div>
        )}

        {tab === "trades" && (
          <div className="h-full flex items-center justify-center text-text-mute">
            Trades (coming soon)
          </div>
        )}

        {tab === "book" && (
          <div className="h-full overflow-hidden">
            <OrderBook />
          </div>
        )}
      </div>

      {/* ===== Bottom Tabs (固定) ===== */}
      <div className="shrink-0 border-t border-white/10 bg-bg-panel grid grid-cols-4 text-sm">
        <TabButton label="Chart" active={tab === "chart"} onClick={() => setTab("chart")} />
        <TabButton label="Orders" active={tab === "orders"} onClick={() => setTab("orders")} />
        <TabButton label="Trades" active={tab === "trades"} onClick={() => setTab("trades")} />
        <TabButton label="Book" active={tab === "book"} onClick={() => setTab("book")} />
      </div>
    </div>
  );
}

function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`py-3 transition-colors ${
        active
          ? "text-text-main border-t-2 border-ui-active bg-bg-box"
          : "text-text-mute"
      }`}
    >
      {label}
    </button>
  );
}
