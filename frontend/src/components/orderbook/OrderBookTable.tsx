"use client";

import { Order } from "./mock";

type Props = {
  asks: Order[];
  bids: Order[];
};

export default function OrderBookTable({ asks, bids }: Props) {
  return (
    <div className="flex flex-col text-sm">
      {/* ASKS */}
      <div>
        {asks.map((a, i) => (
          <div key={i} className="flex justify-between text-ask">
            <span>{a.price}</span>
            <span>{a.size}</span>
          </div>
        ))}
      </div>

      {/* MID PRICE */}
      <div className="text-center text-mid my-2">
        {asks[0]?.price}
      </div>

      {/* BIDS */}
      <div>
        {bids.map((b, i) => (
          <div key={i} className="flex justify-between text-bid">
            <span>{b.price}</span>
            <span>{b.size}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
