"use client";

import { useState } from "react";

export default function OrderPanel() {
  const [side, setSide] = useState<"long" | "short">("long");
  const [orderType, setOrderType] = useState("limit");
  const [leverage, setLeverage] = useState(20);

  return (
    <div className="bg-[#0b0b0b] border border-white/10 rounded-xl p-4 space-y-4">

      {/* Margin / Leverage */}
      <div className="flex gap-2">
        <button className="flex-1 py-2 rounded bg-[#1a1a1a] text-sm">
          Cross
        </button>
        <button className="flex-1 py-2 rounded bg-[#1a1a1a] text-sm">
          {leverage}x
        </button>
      </div>

      {/* Order Type */}
      <div className="flex gap-2">
        {["limit", "market"].map((t) => (
          <button
            key={t}
            onClick={() => setOrderType(t)}
            className={`flex-1 py-2 rounded text-sm ${
              orderType === t
                ? "bg-[#2a2a2a] text-white"
                : "bg-[#141414] text-gray-400"
            }`}
          >
            {t === "limit" ? "指値" : "成行"}
          </button>
        ))}
      </div>

      {/* Price */}
      <div>
        <label className="text-xs text-gray-400">価格 (USDT)</label>
        <input
          className="w-full mt-1 p-2 bg-black border border-gray-700 rounded"
          placeholder="90372.0"
        />
      </div>

      {/* Size */}
      <div>
        <label className="text-xs text-gray-400">数量 (USDT)</label>
        <input
          className="w-full mt-1 p-2 bg-black border border-gray-700 rounded"
          placeholder="0.00"
        />
      </div>

      {/* Slider (Dummy) */}
      <div className="flex gap-2">
        {[0, 25, 50, 75, 100].map((v) => (
          <div key={v} className="flex-1 h-1 bg-gray-700 rounded" />
        ))}
      </div>

      {/* Options */}
      <div className="space-y-2 text-sm text-gray-400">
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
      <div className="text-xs text-gray-500 space-y-1">
        <div className="flex justify-between">
          <span>必要証拠金</span>
          <span>0.00 USDT</span>
        </div>
        <div className="flex justify-between">
          <span>最大オープン</span>
          <span>0.00 USDT</span>
        </div>
      </div>

      {/* Action */}
      <button
        onClick={() => alert("Connect Wallet")}
        className={`w-full py-3 rounded font-bold ${
          side === "long"
            ? "bg-green-600"
            : "bg-red-600"
        }`}
      >
        Connect
      </button>

      {/* Side Switch */}
      <div className="flex gap-2">
        <button
          onClick={() => setSide("long")}
          className="flex-1 py-2 bg-green-600 rounded"
        >
          Long
        </button>
        <button
          onClick={() => setSide("short")}
          className="flex-1 py-2 bg-red-600 rounded"
        >
          Short
        </button>
      </div>
    </div>
  );
}
