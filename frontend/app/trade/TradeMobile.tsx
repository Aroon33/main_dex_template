"use client";

import { useState } from "react";

import TradeHeader from "@/src/components/trade/TradeHeader";
import TradeChart from "@/src/components/trade/TradeChart";
import TradeOrderPanel from "@/src/components/trade/TradeOrderPanel";
import TradeBook from "@/src/components/trade/TradeBook";

type Tab = "chart" | "orders" | "trades" | "book";

const DEFAULT_SYMBOL = "BTCUSD";

export default function TradeMobile() {
  const [tab, setTab] = useState<Tab>("chart");
  const [symbol] = useState(DEFAULT_SYMBOL);

  return (
    <div className="h-[100dvh] flex flex-col bg-black text-white">

      {/* Header */}
      <TradeHeader symbol={symbol} />

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {tab === "chart" && (
          <TradeChart symbol={symbol} />
        )}

        {tab === "orders" && (
          <div className="h-full overflow-auto p-2">
            <TradeOrderPanel symbol={symbol} />
          </div>
        )}

        {tab === "trades" && (
          <div className="h-full flex items-center justify-center text-gray-500">
            Trades (coming soon)
          </div>
        )}

        {tab === "book" && (
          <TradeBook symbol={symbol} />
        )}
      </div>

      {/* Bottom Tabs */}
      <div className="border-t border-white/10 grid grid-cols-4 text-sm">
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
      className={`py-3 ${
        active
          ? "text-white border-t-2 border-purple-500"
          : "text-gray-500"
      }`}
    >
      {label}
    </button>
  );
}
