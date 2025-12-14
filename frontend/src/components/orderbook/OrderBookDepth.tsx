"use client";

import { asks, bids } from "./mock";

export default function OrderBookDepth() {
  const max = Math.max(
    ...asks.map(a => a.size),
    ...bids.map(b => b.size)
  );

  return (
    <div className="space-y-1">
      {asks.map((a, i) => (
        <div key={i} className="relative h-6">
          <div
            className="absolute right-0 top-0 h-full bg-red-500/20"
            style={{ width: `${(a.size / max) * 100}%` }}
          />
          <div className="relative z-10 flex justify-between px-2 text-red-400">
            <span>{a.price}</span>
            <span>{a.size}</span>
          </div>
        </div>
      ))}

      {bids.map((b, i) => (
        <div key={i} className="relative h-6">
          <div
            className="absolute left-0 top-0 h-full bg-green-500/20"
            style={{ width: `${(b.size / max) * 100}%` }}
          />
          <div className="relative z-10 flex justify-between px-2 text-green-400">
            <span>{b.price}</span>
            <span>{b.size}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
