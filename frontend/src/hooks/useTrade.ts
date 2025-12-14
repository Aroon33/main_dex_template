"use client";

import { useState } from "react";
import { TradeSide } from "@/src/types/trade";

export function useTrade(symbol: string) {
  const [price, setPrice] = useState<number | "">("");
  const [size, setSize] = useState<number | "">("");
  const [leverage, setLeverage] = useState(20);
  const [side, setSide] = useState<TradeSide | null>(null);
  const [loading, setLoading] = useState(false);

  const submitOrder = async () => {
    if (!side || !price || !size) {
      alert("Order parameters missing");
      return;
    }

    setLoading(true);

    try {
      // 将来：API / Contract 接続
      console.log("PLACE ORDER", {
        symbol,
        side,
        price,
        size,
        leverage,
      });

      await new Promise((r) => setTimeout(r, 800));

      alert(side.toUpperCase() + " order submitted");
    } catch (e) {
      console.error(e);
      alert("Order failed");
    } finally {
      setLoading(false);
    }
  };

  return {
    price,
    size,
    leverage,
    side,
    loading,
    setPrice,
    setSize,
    setLeverage,
    setSide,
    submitOrder,
  };
}
