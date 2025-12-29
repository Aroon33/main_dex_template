/**
 * ============================================================
 * useOrderBook (WebSocket)
 * ============================================================
 *
 * Role:
 * - Fetch order book (asks / bids) via WebSocket
 *
 * Rule:
 * - UI must not touch WebSocket directly
 * - Hook returns formatted data only
 *
 * ============================================================
 */

import { useEffect, useState } from "react";

export type OrderBookRow = {
  price: string;
  size: string;
  sum: string;
};

type OrderBookData = {
  bids: OrderBookRow[];
  asks: OrderBookRow[];
};

export function useOrderBook(symbol: string) {
  const [bids, setBids] = useState<OrderBookRow[]>([]);
  const [asks, setAsks] = useState<OrderBookRow[]>([]);

  useEffect(() => {
    if (!symbol) return;

    const wsSymbol = symbol.toLowerCase();
    const ws = new WebSocket(
      `wss://stream.binance.com:9443/ws/${wsSymbol}@depth20@100ms`
    );

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        let sumBid = 0;
        let sumAsk = 0;

        const nextBids: OrderBookRow[] = data.bids.map(
          ([price, size]: [string, string]) => {
            sumBid += parseFloat(size);
            return {
              price,
              size,
              sum: sumBid.toFixed(4),
            };
          }
        );

        const nextAsks: OrderBookRow[] = data.asks.map(
          ([price, size]: [string, string]) => {
            sumAsk += parseFloat(size);
            return {
              price,
              size,
              sum: sumAsk.toFixed(4),
            };
          }
        );

        setBids(nextBids);
        setAsks(nextAsks);
      } catch (e) {
        console.error("[useOrderBook] parse failed", e);
      }
    };

    ws.onerror = (e) => {
      console.error("[useOrderBook] ws error", e);
    };

    return () => {
      ws.close();
    };
  }, [symbol]);

  return {
    orderBookBids: bids,
    orderBookAsks: asks,
  };
}
