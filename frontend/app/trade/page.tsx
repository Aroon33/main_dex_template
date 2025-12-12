"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const TVChart = dynamic(() => import("@/src/components/TradingViewChart"), {
  ssr: false,
});

const ASSETS = [
  { symbol: "ETHUSD", name: "ETH" },
  { symbol: "BTCUSD", name: "BTC" },
  { symbol: "SOLUSD", name: "SOL" },
  { symbol: "BNBUSD", name: "BNB" },
  { symbol: "XRPUSD", name: "XRP" },
  { symbol: "DOGEUSD", name: "DOGE" },
  { symbol: "AVAXUSD", name: "AVAX" },
  { symbol: "MATICUSD", name: "MATIC" },
  { symbol: "ADAUSD", name: "ADA" },
  { symbol: "DOTUSD", name: "DOT" },
];

export default function TradePage() {
  const [selectedAsset, setSelectedAsset] = useState(ASSETS[0]);

  return (
    <div className="space-y-6">

      {/* Asset Selector */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {ASSETS.map((a) => (
          <button
            key={a.name}
            onClick={() => setSelectedAsset(a)}
            className={`px-4 py-2 rounded-lg border ${
              selectedAsset.name === a.name
                ? "border-purple-500 bg-purple-600/20 text-white"
                : "border-gray-700 text-gray-400 hover:bg-gray-700/30"
            } transition`}
          >
            {a.name}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="border border-gray-800 rounded-xl p-2 h-[600px]">
        <TVChart symbol={selectedAsset.symbol} />
      </div>

      {/* Trade Panel */}
      <div className="border border-gray-800 rounded-xl p-4 space-y-4">
        <h2 className="text-xl font-bold">{selectedAsset.name} Trade</h2>

        <input
          type="number"
          placeholder="Order Size"
          className="w-full p-2 bg-black border border-gray-700 rounded"
        />

        <input
          type="number"
          placeholder="Price"
          className="w-full p-2 bg-black border border-gray-700 rounded"
        />

        <button className="w-full p-3 bg-green-600 rounded hover:bg-green-700">
          Long
        </button>

        <button className="w-full p-3 bg-red-600 rounded hover:bg-red-700">
          Short
        </button>
      </div>

    </div>
  );
}
