"use client";

import { useState } from "react";
import { useTrade } from "@/src/hooks/useTrade";

export default function TradeOrderPanel() {
  const { submitOrder } = useTrade();

  const [price, setPrice] = useState("");
  const [size, setSize] = useState("");

  return (
    <div className="p-4 space-y-4">

      {/* Mode */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-white/5 rounded-lg py-2 text-center">Cross</div>
        <div className="bg-white/5 rounded-lg py-2 text-center">20x</div>
      </div>

      {/* Order Type */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-white/10 rounded-lg py-2 text-center">指値</div>
        <div className="bg-white/5 rounded-lg py-2 text-center text-gray-400">
          成行
        </div>
      </div>

      {/* Price */}
      <div>
        <label className="text-sm text-gray-400">価格 (USDT)</label>
        <input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="90372.0"
          className="w-full mt-1 p-2 bg-black border border-gray-700 rounded"
        />
      </div>

      {/* Size */}
      <div>
        <label className="text-sm text-gray-400">数量 (USDT)</label>
        <input
          value={size}
          onChange={(e) => setSize(e.target.value)}
          placeholder="0.00"
          className="w-full mt-1 p-2 bg-black border border-gray-700 rounded"
        />
        <div className="mt-2 h-1 bg-gray-700 rounded" />
      </div>

      {/* Options */}
      <div className="space-y-2 text-sm text-gray-300">
        <label className="flex items-center gap-2">
          <input type="checkbox" /> 利確 / 損切
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" /> 隠れた注文
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" /> Reduce only
        </label>
      </div>

      {/* Info */}
      <div className="text-sm text-gray-400 space-y-1">
        <div className="flex justify-between">
          <span>必要証拠金</span>
          <span>0.00 USDT</span>
        </div>
        <div className="flex justify-between">
          <span>最大オープン</span>
          <span>0.00 USDT</span>
        </div>
      </div>

      {/* Actions */}
      <button className="w-full py-3 bg-yellow-500 text-black rounded font-semibold">
        Connect
      </button>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => submitOrder("long", price, size)}
          className="py-3 bg-green-600 rounded font-semibold"
        >
          Long
        </button>
        <button
          onClick={() => submitOrder("short", price, size)}
          className="py-3 bg-red-600 rounded font-semibold"
        >
          Short
        </button>
      </div>

    </div>
  );
}
