"use client";

import { useRef, useCallback } from "react";
import { useLimitOrders } from "@/contexts/LimitOrderContext";
import { useMarkPrice } from "@/hooks/trade/read/useMarkPrice";
import { useOpenPosition } from "@/hooks/trade/write/useOpenPosition";

export function useLimitExecutor(symbol: string) {
  const { orders, markFilled } = useLimitOrders();
  const { price, loading } = useMarkPrice(symbol);
  const { openPosition } = useOpenPosition();

  // 🔒 実行ロック（超重要）
  const executingRef = useRef(false);

  const execute = useCallback(async () => {
    if (executingRef.current) return;
    if (loading || price == null) return;

    executingRef.current = true;

    try {
      const mark = Number(price);

      for (const o of orders) {
        if (o.status !== "open") continue;
        if (o.symbol !== symbol) continue;

        const shouldFill =
          o.side === "buy"
            ? mark <= o.price
            : mark >= o.price;

        if (!shouldFill) continue;

        const res = await openPosition({
          side: o.side,
          sizeUsd: o.sizeUsd,
          symbol,
        });

        if (res?.success) {
          markFilled(o.id);
        }
      }
    } finally {
      executingRef.current = false;
    }
  }, [orders, price, loading, symbol, openPosition, markFilled]);

  return { execute };
}
