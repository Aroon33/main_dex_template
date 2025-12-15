"use client";

import { useState } from "react";
import { useTrade } from "@/src/hooks/useTrade";

type Props = {
  symbol: string;
};

export default function TradeOrderPanel({ symbol }: Props) {
  const { submitOrder, loading } = useTrade(symbol);

  const [price, setPrice] = useState("");
  const [size, setSize] = useState("");

  return (
    <div className="card p-4 space-y-4">
      <h2 className="text-lg font-semibold">Order</h2>

      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="w-full p-2 bg-black border border-gray-700 rounded"
      />

      <input
        type="number"
        placeholder="Size"
        value={size}
        onChange={(e) => setSize(e.target.value)}
        className="w-full p-2 bg-black border border-gray-700 rounded"
      />

      <button
        disabled={loading}
        onClick={() => submitOrder("buy", Number(price), Number(size))}
        className="w-full py-2 bg-green-600 rounded text-white disabled:opacity-50"
      >
        Buy
      </button>

      <button
        disabled={loading}
        onClick={() => submitOrder("sell", Number(price), Number(size))}
        className="w-full py-2 bg-red-600 rounded text-white disabled:opacity-50"
      >
        Sell
      </button>
    </div>
  );
}
