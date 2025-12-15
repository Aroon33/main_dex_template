"use client";

import { useTrade } from "@/src/hooks/useTrade";

export default function Trade() {
  const trade = useTrade();

  return (
    <div className="space-y-4">

      {/* Price */}
      <input
        type="number"
        placeholder="Price"
        value={trade.price}
        onChange={(e) => trade.setPrice(Number(e.target.value))}
        className="w-full p-2 bg-black border border-gray-700 rounded"
      />

      {/* Size */}
      <input
        type="number"
        placeholder="Size"
        value={trade.size}
        onChange={(e) => trade.setSize(Number(e.target.value))}
        className="w-full p-2 bg-black border border-gray-700 rounded"
      />

      {/* BUY */}
      <button
        onClick={() => {
          trade.setSide("buy");
          trade.submitOrder();
        }}
        disabled={trade.loading}
        className="w-full py-2 bg-green-600 rounded text-white disabled:opacity-50"
      >
        Buy
      </button>

      {/* SELL */}
      <button
        onClick={() => {
          trade.setSide("sell");
          trade.submitOrder();
        }}
        disabled={trade.loading}
        className="w-full py-2 bg-red-600 rounded text-white disabled:opacity-50"
      >
        Sell
      </button>

    </div>
  );
}
