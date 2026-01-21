"use client";

/**
 * ============================================================
 * OrderBookTab
 * ============================================================
 */

import { useOrderBook } from "@/hooks/trade/read/useOrderBook";

export default function OrderBookTab() {
  const { orderBookAsks: asks, orderBookBids: bids } =
    useOrderBook("BTCUSDT");

  return (
    <div className="space-y-1 text-xs">
      {asks.map((a, i) => (
        <div key={`ask-${i}`} className="text-red-500">
          {a.price} / {a.size}
        </div>
      ))}
      {bids.map((b, i) => (
        <div key={`bid-${i}`} className="text-green-500">
          {b.price} / {b.size}
        </div>
      ))}
    </div>
  );
}
