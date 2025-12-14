"use client";

import { asks, bids } from "./mock";

export default function OrderBookTable() {
  const maxAskSize = Math.max(...asks.map(a => a.size));
  const maxBidSize = Math.max(...bids.map(b => b.size));
  const midPrice =
    bids.length > 0 && asks.length > 0
      ? Math.round((bids[0].price + asks[0].price) / 2)
      : 0;

  return (
    <div className="w-full h-full text-sm font-mono">

      {/* ===== Asks ===== */}
      <div>
        {asks.slice().reverse().map((ask, i) => {
          const width = (ask.size / maxAskSize) * 100;
          return (
            <div
              key={`ask-${i}`}
              className="relative flex items-center justify-between px-3 py-[2px]"
            >
              <div
                className="absolute inset-y-0 right-0 bg-red-500/25"
                style={{ width: `${width}%` }}
              />
              <span className="z-10 text-red-400">
                {ask.price}
              </span>
              <span className="z-10 text-red-300">
                {ask.size}
              </span>
            </div>
          );
        })}
      </div>

      {/* ===== Mid Price ===== */}
      <div className="py-2 text-center text-cyan-400 font-semibold border-y border-white/10">
        {midPrice}
      </div>

      {/* ===== Bids ===== */}
      <div>
        {bids.map((bid, i) => {
          const width = (bid.size / maxBidSize) * 100;
          return (
            <div
              key={`bid-${i}`}
              className="relative flex items-center justify-between px-3 py-[2px]"
            >
              <div
                className="absolute inset-y-0 left-0 bg-green-500/25"
                style={{ width: `${width}%` }}
              />
              <span className="z-10 text-green-400">
                {bid.price}
              </span>
              <span className="z-10 text-green-300">
                {bid.size}
              </span>
            </div>
          );
        })}
      </div>

    </div>
  );
}
