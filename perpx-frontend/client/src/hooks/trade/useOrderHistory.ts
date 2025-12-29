// client/src/hooks/useOrderHistory.ts

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CONTRACTS } from "../../lib/eth/addresses";
import { ROUTER_ABI } from "../../lib/eth/abi/Router";

export type Order = {
  id: string;
  symbol: string;
  side: "buy" | "sell" | "close";
  type: "market";
  size: number;
  status: "pending" | "filled";
  timestamp: number;
};

export function useOrderHistory(account?: string) {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!account || !window.ethereum) return;

    const provider = new ethers.BrowserProvider(window.ethereum);

    // 🔑 Router が注文系 event を emit
    const router = new ethers.Contract(
      CONTRACTS.ROUTER,
      ROUTER_ABI,
      provider
    );

    /* ===============================
       Position Opened (Filled)
    =============================== */
    const onPositionOpened = (
      user: string,
      positionId: bigint,
      pair: string,
      size: bigint,
      timestamp: bigint
    ) => {
      if (user.toLowerCase() !== account.toLowerCase()) return;

      const order: Order = {
        id: positionId.toString(),
        symbol: ethers.decodeBytes32String(pair),
        side: size > 0n ? "buy" : "sell",
        type: "market",
        size: Math.abs(Number(size)),
        status: "filled",
        timestamp: Number(timestamp) * 1000,
      };

      setOrders((prev) => [order, ...prev]);
    };

    /* ===============================
       Close Requested (Pending)
    =============================== */
    const onPositionCloseRequested = (
      user: string,
      positionId: bigint,
      timestamp: bigint
    ) => {
      if (user.toLowerCase() !== account.toLowerCase()) return;

      setOrders((prev) => [
        {
          id: positionId.toString(),
          symbol: "-",
          side: "close",
          type: "market",
          size: 0,
          status: "pending",
          timestamp: Number(timestamp) * 1000,
        },
        ...prev,
      ]);
    };

    /* ===============================
       Close Completed (Remove Pending)
    =============================== */
    const onPositionClosed = (
      user: string,
      positionId: bigint
    ) => {
      if (user.toLowerCase() !== account.toLowerCase()) return;

      // pending close を消す（好みで残してもOK）
      setOrders((prev) =>
        prev.filter(
          (o) =>
            !(
              o.id === positionId.toString() &&
              o.side === "close" &&
              o.status === "pending"
            )
        )
      );
    };

    // ===== Register Events =====
    router.on("PositionOpened", onPositionOpened);
    router.on("PositionCloseRequested", onPositionCloseRequested);
    router.on("PositionClosed", onPositionClosed);

    // ===== Cleanup =====
    return () => {
      router.off("PositionOpened", onPositionOpened);
      router.off("PositionCloseRequested", onPositionCloseRequested);
      router.off("PositionClosed", onPositionClosed);
    };
  }, [account]);

  return { orders };
}
