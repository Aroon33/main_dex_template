/**
 * ============================================================
 * OrderBookPanel
 * ============================================================
 *
 * Role:
 * - Display order book (asks / bids)
 *
 * ============================================================
 */

import { OrderBookRow } from "@/types";

type Props = {
  bids: OrderBookRow[];
  asks: OrderBookRow[];
};

export default function OrderBookPanel({ bids, asks }: Props) {
  if (bids.length === 0 && asks.length === 0) {
    return (
      <div className="text-muted-foreground">
        No order book data
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 text-sm">
      {/* ===== Asks ===== */}
      <div>
        <div className="font-medium mb-2 text-red-500">
          Asks
        </div>
        {asks.map((a, i) => (
          <div
            key={`ask-${i}`}
            className="flex justify-between"
          >
            <span>{a.price}</span>
            <span>{a.size}</span>
            <span className="text-muted-foreground">
              {a.sum}
            </span>
          </div>
        ))}
      </div>

      {/* ===== Bids ===== */}
      <div>
        <div className="font-medium mb-2 text-green-500">
          Bids
        </div>
        {bids.map((b, i) => (
          <div
            key={`bid-${i}`}
            className="flex justify-between"
          >
            <span>{b.price}</span>
            <span>{b.size}</span>
            <span className="text-muted-foreground">
              {b.sum}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
