"use client";

import { useState } from "react";

type Side = "buy" | "sell";

export function useTrade(symbol?: string) {
  const [side, setSide] = useState<Side>("buy");
  const [price, setPrice] = useState<number>(0);
  const [size, setSize] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const submitOrder = async (
    sideArg?: Side,
    priceArg?: number,
    sizeArg?: number
  ) => {
    const s = sideArg ?? side;
    const p = priceArg ?? price;
    const sz = sizeArg ?? size;

    try {
      setLoading(true);

      console.log("Submitting order", {
        symbol,
        side: s,
        price: p,
        size: sz,
      });

      // mock delay（後でコントラクト接続に差し替え）
      await new Promise((r) => setTimeout(r, 800));

      alert(`${s.toUpperCase()} order submitted`);
    } catch (e) {
      console.error(e);
      alert("Order failed");
    } finally {
      setLoading(false);
    }
  };

  return {
    side,
    setSide,
    price,
    setPrice,
    size,
    setSize,
    submitOrder,
    loading,
  };
}
