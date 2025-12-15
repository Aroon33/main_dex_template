"use client";

import { Order } from "./mock";

type Props = {
  asks: Order[];
  bids: Order[];
};

export default function OrderBookDepth({ asks, bids }: Props) {
  const maxSize = Math.max(
    ...asks.map(a => a.size),
    ...bids.map(b => b.size)
  );

  return (
    <div className="flex flex-col text-sm space-y-1">
      {asks.map((a, i) => (
        <div key={i} className="relative text-ask">
          <div
            className="absolute inset-y-0 right-0 bg-ask"
            style={{ width: `${(a.size / maxSize) * 100}%` }}
          />
          <div className="relative flex justify-between px-1">
            <span>{a.price}</span>
            <span>{a.size}</span>
          </div>
        </div>
      ))}

      <div className="text-center text-mid my-2">
        {asks[0]?.price}
      </div>

      {bids.map((b, i) => (
        <div key={i} className="relative text-bid">
          <div
            className="absolute inset-y-0 left-0 bg-bid"
            style={{ width: `${(b.size / maxSize) * 100}%` }}
          />
          <div className="relative flex justify-between px-1">
            <span>{b.price}</span>
            <span>{b.size}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
