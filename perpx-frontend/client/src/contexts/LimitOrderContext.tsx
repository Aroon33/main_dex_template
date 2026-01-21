"use client";

/**
 * ============================================================
 * LimitOrderContext (Expanded PoC – OFF-CHAIN SSOT)
 * ============================================================
 *
 * Role:
 * - Limit（指値）注文の off-chain 状態管理
 * - UI / Executor / Keeper のための単一SSOT
 *
 * IMPORTANT:
 * - on-chain 処理は一切行わない
 * - openPosition は呼ばない
 * - AccountContext を参照しない
 *
 * ============================================================
 */

import { createContext, useContext, useState } from "react";

/* ======================
   Types
====================== */

export type LimitOrder = {
  id: string;
  symbol: string; // on-chain pair (ex: BTC)
  side: "buy" | "sell";
  price: number;
  sizeUsd: number;
  leverage: number;
  status: "open" | "filled" | "cancelled";
  createdAt: number;
};

type LimitOrderContextType = {
  orders: LimitOrder[];

  /** create new limit order */
  addOrder: (order: LimitOrder) => void;

  /** cancel by id (soft cancel) */
  cancelOrder: (id: string) => void;

  /** mark as filled (executor only) */
  markFilled: (id: string) => void;

  /** clear all (dev / debug only) */
  clearAll: () => void;
};

/* ======================
   Context
====================== */

const LimitOrderContext =
  createContext<LimitOrderContextType | null>(null);

/* ======================
   Provider
====================== */

export function LimitOrderProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [orders, setOrders] = useState<LimitOrder[]>([]);

  /* ===== add ===== */
  const addOrder = (order: LimitOrder) => {
    setOrders((prev) => [...prev, order]);
  };

  /* ===== cancel ===== */
  const cancelOrder = (id: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id ? { ...o, status: "cancelled" } : o
      )
    );
  };

  /* ===== filled ===== */
  const markFilled = (id: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id ? { ...o, status: "filled" } : o
      )
    );
  };

  /* ===== clear (PoC / dev only) ===== */
  const clearAll = () => {
    setOrders([]);
  };

  return (
    <LimitOrderContext.Provider
      value={{
        orders,
        addOrder,
        cancelOrder,
        markFilled,
        clearAll,
      }}
    >
      {children}
    </LimitOrderContext.Provider>
  );
}

/* ======================
   Hook
====================== */

export function useLimitOrders() {
  const ctx = useContext(LimitOrderContext);
  if (!ctx) {
    throw new Error(
      "useLimitOrders must be used within LimitOrderProvider"
    );
  }
  return ctx;
}
