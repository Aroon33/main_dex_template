/**
 * ============================================================
 * useOrderBook (WebSocket) [FINAL]
 * ============================================================
 *
 * Role:
 * - Provide real-time order book (asks / bids)
 * - Source: Binance WebSocket
 *
 * Rule:
 * - UI must NOT touch WebSocket directly
 * - READ ONLY (no write)
 * - Return formatted data only
 * - Safe for re-mount / StrictMode
 *
 * ============================================================
 */

import { useEffect, useState } from "react";
import { OrderBookRow } from "@/types";

/* =========================
 * Hook
 * ========================= */

export function useOrderBook(symbol: string) {
  const [bids, setBids] = useState<OrderBookRow[]>([]);
  const [asks, setAsks] = useState<OrderBookRow[]>([]);

  useEffect(() => {
    if (!symbol) {
      setBids([]);
      setAsks([]);
      return;
    }

    let cancelled = false;

    const ws = new WebSocket(
      `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@depth20@100ms`
    );

    ws.onmessage = (event) => {
      if (cancelled) return;

      try {
        const data = JSON.parse(event.data);

        let bidSum = 0;
        let askSum = 0;

        const nextBids: OrderBookRow[] = data.bids.map(
          ([price, size]: [string, string]) => {
            bidSum += Number(size);
            return {
              price,
              size,
              sum: bidSum.toFixed(4),
            };
          }
        );

        const nextAsks: OrderBookRow[] = data.asks.map(
          ([price, size]: [string, string]) => {
            askSum += Number(size);
            return {
              price,
              size,
              sum: askSum.toFixed(4),
            };
          }
        );

        setBids(nextBids);
        setAsks(nextAsks);
      } catch (e) {
        console.error("[useOrderBook] parse failed:", e);
      }
    };

    ws.onerror = (e) => {
      console.error("[useOrderBook] websocket error:", e);
    };

    return () => {
      cancelled = true;
      ws.close();
    };
  }, [symbol]);

  return {
    orderBookBids: bids,
    orderBookAsks: asks,
  };
}
