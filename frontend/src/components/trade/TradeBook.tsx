"use client";

import OrderBook from "@/src/components/orderbook/OrderBook";

type Props = {
  symbol: string;
};

export default function TradeBook({ symbol }: Props) {
  return (
    <div className="h-full p-2">
      <OrderBook symbol={symbol} />
    </div>
  );
}
