/**
 * ============================================================
 * useOrderHistory (events only) [FINAL]
 * ============================================================
 *
 * Role:
 * - Provide order timeline for UI (event-driven)
 *
 * Rule:
 * - Accept account address ONLY
 * - Provider resolved internally
 * - READ ONLY (no write)
 * - Event-only (no view functions)
 *
 * ============================================================
 */

import { useEffect, useState } from "react";
import { BrowserProvider, Contract, decodeBytes32String } from "ethers";

import { CONTRACTS } from "@/lib/eth/addresses";
import { ENV } from "@/lib/env";
import { fromUnits } from "@/utils/number";
import { Order } from "@/types";

/* =========================
 * ABI (event only)
 * ========================= */

const ABI = [
  "event OrderPlaced(address indexed user, bytes32 pair, int256 size)",
  "event OrderFilled(address indexed user)",
  "event OrderCancelled(address indexed user)",
];

export function useOrderHistory(account?: string) {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!account || typeof window === "undefined") {
      setOrders([]);
      return;
    }

    const provider = new BrowserProvider((window as any).ethereum);
    const contract = new Contract(CONTRACTS.ROUTER, ABI, provider);

    const TOKEN_DECIMALS = ENV.DECIMALS.TOKEN;

    // ===== handlers =====

    const onPlaced = (
      user: string,
      pair: string,
      size: bigint
    ) => {
      if (user.toLowerCase() !== account.toLowerCase()) return;

      setOrders((prev) => [
        {
          // NOTE:
          // orderId is not available in current ABI
          // this is a timeline identifier, not on-chain ID
          id: crypto.randomUUID(),
          symbol: decodeBytes32String(pair),
          side: size > 0n ? "buy" : "sell",
          type: "market",
          size: fromUnits(size < 0n ? -size : size, TOKEN_DECIMALS),
          status: "open",
        },
        ...prev,
      ]);
    };

    const onFilled = (user: string) => {
      if (user.toLowerCase() !== account.toLowerCase()) return;

      setOrders((prev) =>
        prev.length > 0
          ? [{ ...prev[0], status: "filled" }, ...prev.slice(1)]
          : prev
      );
    };

    const onCancelled = (user: string) => {
      if (user.toLowerCase() !== account.toLowerCase()) return;

      setOrders((prev) =>
        prev.length > 0
          ? [{ ...prev[0], status: "cancelled" }, ...prev.slice(1)]
          : prev
      );
    };

    // ===== subscribe =====
    contract.on("OrderPlaced", onPlaced);
    contract.on("OrderFilled", onFilled);
    contract.on("OrderCancelled", onCancelled);

    return () => {
      contract.off("OrderPlaced", onPlaced);
      contract.off("OrderFilled", onFilled);
      contract.off("OrderCancelled", onCancelled);
    };
  }, [account]);

  return {
    orders,
  };
}
