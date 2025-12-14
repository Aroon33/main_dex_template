"use client";

import OrderBookTable from "@/src/components/orderbook/OrderBookTable";
import OrderBookDepth from "@/src/components/orderbook/OrderBookDepth";

export default function TradeBook() {
  return (
    <div className="h-full w-full flex flex-col md:flex-row gap-2">
      {/* Order Book Table */}
      <div className="flex-1 overflow-hidden rounded-xl border border-gray-800">
        <OrderBookTable />
      </div>

      {/* Depth Chart */}
      <div className="flex-1 rounded-xl border border-gray-800 bg-black">
        <OrderBookDepth />
      </div>
    </div>
  );
}
