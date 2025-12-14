"use client";

import { useTrade } from "@/src/hooks/useTrade";

export default function Trade() {
  const trade = useTrade("BTCUSDT");

  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Chart */}
      <div className="col-span-2 border border-gray-800 rounded-xl h-[600px]" />

      {/* Order Panel */}
      <div className="border border-gray-800 rounded-xl p-4 space-y-4">
        <h2 className="text-lg font-bold">Order</h2>

        <input
          type="number"
          placeholder="Price"
          value={trade.price}
          onChange={(e) => trade.setPrice(Number(e.target.value))}
          className="w-full p-2 bg-black border border-gray-700 rounded"
        />

        <input
          type="number"
          placeholder="Size"
          value={trade.size}
          onChange={(e) => trade.setSize(Number(e.target.value))}
          className="w-full p-2 bg-black border border-gray-700 rounded"
        />

        <div className="flex gap-2">
          <button
            onClick={() => {
              trade.setSide("long");
              trade.submitOrder();
            }}
            disabled={trade.loading}
            className="flex-1 bg-green-600 py-2 rounded"
          >
            Long
          </button>

          <button
            onClick={() => {
              trade.setSide("short");
              trade.submitOrder();
            }}
            disabled={trade.loading}
            className="flex-1 bg-red-600 py-2 rounded"
          >
            Short
          </button>
        </div>
      </div>
    </div>
  );
}
