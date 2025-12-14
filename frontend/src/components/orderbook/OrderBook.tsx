"use client";

import { useState } from "react";
import { asks, bids } from "./mock";
import OrderBookTable from "./OrderBookTable";
import OrderBookDepth from "./OrderBookDepth";

export default function OrderBook() {
  const [view, setView] = useState<"table" | "depth">("table");

  return (
    <div className="h-full flex flex-col bg-black text-white">
      {/* Header */}
      <div className="px-4 py-2 border-b border-white/10">
        <div className="text-sm font-semibold mb-2">BTCUSDT</div>

        <div className="flex gap-2">
          <button
            onClick={() => setView("table")}
            className={`px-3 py-1 rounded text-xs ${
              view === "table"
                ? "bg-purple-600 text-white"
                : "bg-white/10 text-gray-400"
            }`}
          >
            数字
          </button>
          <button
            onClick={() => setView("depth")}
            className={`px-3 py-1 rounded text-xs ${
              view === "depth"
                ? "bg-purple-600 text-white"
                : "bg-white/10 text-gray-400"
            }`}
          >
            チャート
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {view === "table" && (
          <OrderBookTable asks={asks} bids={bids} />
        )}
        {view === "depth" && (
          <OrderBookDepth asks={asks} bids={bids} />
        )}
      </div>
    </div>
  );
}
