/**
 * ============================================================
 * useOrderHistory (events)
 * ============================================================
 *
 * Role:
 * - Provide open / historical orders for UI
 *
 * Rule:
 * - Event-driven only
 * - Accept account address ONLY
 *
 * ============================================================
 */

import { useEffect, useState } from "react";
import { BrowserProvider, Contract } from "ethers";
import { CONTRACTS } from "@/lib/eth/addresses";

/* =========================
 * Types
 * ========================= */

export type Order = {
  id: string;
  symbol: string;
  side: "buy" | "sell";
  type: string;
  size: number;
  status: "open" | "filled" | "cancelled";
};

const ABI = [
  "event OrderPlaced(address indexed user, bytes32 pair, int256 size)",
  "event OrderCancelled(address indexed user, uint256 orderId)",
  "event OrderFilled(address indexed user, uint256 orderId)",
];

export function useOrderHistory(account?: string) {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!account || typeof window === "undefined") {
      setOrders([]);
      return;
    }

    const provider = new BrowserProvider(
      (window as any).ethereum
    );

    const contract = new Contract(
      CONTRACTS.ROUTER,
      ABI,
      provider
    );

    const addOrder = (o: Order) =>
      setOrders((prev) => [o, ...prev]);

    const onPlaced = (
      user: string,
      pair: string,
      size: bigint
    ) => {
      if (user.toLowerCase() !== account.toLowerCase()) return;

      addOrder({
        id: `${Date.now()}`,
        symbol: pair.toString(),
        side: size > 0n ? "buy" : "sell",
        type: "market",
        size: Math.abs(Number(size)) / 1e18,
        status: "open",
      });
    };

    const onFilled = (user: string, orderId: bigint) => {
      if (user.toLowerCase() !== account.toLowerCase()) return;
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId.toString()
            ? { ...o, status: "filled" }
            : o
        )
      );
    };

    const onCancelled = (user: string, orderId: bigint) => {
      if (user.toLowerCase() !== account.toLowerCase()) return;
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId.toString()
            ? { ...o, status: "cancelled" }
            : o
        )
      );
    };

    contract.on("OrderPlaced", onPlaced);
    contract.on("OrderFilled", onFilled);
    contract.on("OrderCancelled", onCancelled);

    return () => {
      contract.off("OrderPlaced", onPlaced);
      contract.off("OrderFilled", onFilled);
      contract.off("OrderCancelled", onCancelled);
    };
  }, [account]);

  return { orders };
}
