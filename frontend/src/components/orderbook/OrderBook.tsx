"use client";

import OrderBookTable from "./OrderBookTable";
import OrderBookDepth from "./OrderBookDepth";
import { asks, bids } from "./mock";
import { useState } from "react";

type Props = {
  symbol?: string; // ← 将来API用、今は未使用でOK
};

export default function OrderBook({ symbol }: Props) {
  const [view, setView] = useState<"table" | "depth">("table");

  return (
    <div className="h-full flex flex-col bg-[#0B0E11] text-white">

      {/* Tabs */}
      <div className="flex border-b border-white/10 text-sm">
        <button
          onClick={() => setView("table")}
          className={`flex-1 py-2 ${
            view === "table"
              ? "text-white border-b-2 border-purple-500"
              : "text-gray-500"
          }`}
        >
          Book
        </button>
        <button
          onClick={() => setView("depth")}
          className={`flex-1 py-2 ${
            view === "depth"
              ? "text-white border-b-2 border-purple-500"
              : "text-gray-500"
          }`}
        >
          Depth
        </button>
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
