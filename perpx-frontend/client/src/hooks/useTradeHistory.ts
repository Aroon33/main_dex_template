// client/src/hooks/useTradeHistory.ts

import { useEffect, useState } from "react";
import { ethers } from "ethers";

// ===== ABI (TypeScript) =====
import { ROUTER_ABI } from "../lib/eth/abi/Router";
import { PERPETUAL_TRADING_ABI } from "../lib/eth/abi/PerpetualTrading";

// ===== Contract Addresses =====
import { CONTRACTS } from "../lib/eth/addresses";

const [positions, setPositions] = useState<any[]>([]);

const [trades, setTrades] = useState<any[]>([]);
const [orders, setOrders] = useState<any[]>([]);
const [transactions, setTransactions] = useState<any[]>([]);


// ===== Types =====
type Order = {
  id: string;
  symbol: string;
  side: "buy" | "sell";
  type: "market";
  size: number;
  price: number;
  status: "pending" | "filled";
  timestamp: number;
};

type Trade = {
  id: string;
  symbol: string;
  side: "buy" | "sell";
  size: number;
  price: number;
  pnl: number;
  timestamp: number;
};

// ===== Hook =====
export function useTradeHistory(account?: string) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);

  useEffect(() => {
    if (!account || !window.ethereum) return;

    const provider = new ethers.BrowserProvider(window.ethereum);

    const router = new ethers.Contract(
      CONTRACTS.ROUTER,
      ROUTER_ABI,
      provider
    );

    const perp = new ethers.Contract(
      CONTRACTS.PERPETUAL_TRADING,
      PERPETUAL_TRADING_ABI,
      provider
    );

    /* ===================================================== */
    /* ================= ORDER HISTORY ===================== */
    /* ===================================================== */

    // Position Opened
    const onPositionOpened = (
      user: string,
      positionId: bigint,
      pair: string,
      size: bigint,
      timestamp: bigint
    ) => {
      if (user.toLowerCase() !== account.toLowerCase()) return;

      setPositions(prev => [
  {
    id: positionId.toString(),
    symbol: ethers.decodeBytes32String(pair),
    side: size > 0n ? "buy" : "sell",
    size: Number(ethers.formatEther(size)),
    openedAt: Number(timestamp) * 1000,
  },
  ...prev,
]);

    };

    // Close Requested
    const onPositionCloseRequested = (
      user: string,
      positionId: bigint,
      timestamp: bigint
    ) => {
      if (user.toLowerCase() !== account.toLowerCase()) return;

      setOrders(prev =>
        prev.map(o =>
          o.id === positionId.toString()
            ? { ...o, status: "pending" }
            : o
        )
      );
    };

    router.on("PositionOpened", onPositionOpened);
    router.on("PositionCloseRequested", onPositionCloseRequested);

    /* ===================================================== */
    /* ================= TRADE HISTORY ===================== */
    /* ===================================================== */

    // Position Closed
    const onPositionClosed = (
      user: string,
      positionId: bigint,
      pair: string,
      size: bigint,
      entryPrice: bigint,
      exitPrice: bigint,
      realizedPnL: bigint,
      timestamp: bigint
    ) => {
      if (user.toLowerCase() !== account.toLowerCase()) return;

      setTrades(prev => [
        {
          id: `${positionId.toString()}-${timestamp.toString()}`,
          symbol: ethers.decodeBytes32String(pair),
          side: size > 0n ? "sell" : "buy",
          size: Number(ethers.formatEther(size)),
          price: Number(ethers.formatEther(exitPrice)),
          pnl: Number(ethers.formatEther(realizedPnL)),
          timestamp: Number(timestamp) * 1000,
        },
        ...prev,
      ]);
    };

    perp.on("PositionClosed", onPositionClosed);

    /* ===================================================== */
    /* ================= CLEAN UP ========================== */
    /* ===================================================== */

    return () => {
      router.off("PositionOpened", onPositionOpened);
      router.off("PositionCloseRequested", onPositionCloseRequested);
      perp.off("PositionClosed", onPositionClosed);
    };
  }, [account]);

  return {
  positions,
  orders,
  trades,
};


}
