import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CONTRACTS } from "../lib/eth/addresses";
import { PERPETUAL_TRADING_ABI } from "../lib/eth/abi/PerpetualTrading";

/* ======================
   Trade type (MINIMAL)
====================== */
export type Trade = {
  id: string;
  symbol: string;
  side: "CLOSE";
  size: number;
  entryPrice: number;
  price: number;
  pnl: number;
  timestamp: number;
};

/* ======================
   Hook
====================== */
export function useTradeHistory(account?: string) {
  const [trades, setTrades] = useState<Trade[]>([]);

  useEffect(() => {
    if (!account || !window.ethereum) return;

    const provider = new ethers.BrowserProvider(window.ethereum);

    // 🔑 PositionClosed は Router から emit される
    const router = new ethers.Contract(
      CONTRACTS.ROUTER,
      PERPETUAL_TRADING_ABI,
      provider
    );

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

      const trade: Trade = {
        id: positionId.toString(),
        symbol: ethers.decodeBytes32String(pair),
        side: "CLOSE",
        size: Math.abs(Number(size)),
        entryPrice: Number(entryPrice) / 1e8,
        price: Number(exitPrice) / 1e8,
        pnl: Number(realizedPnL) / 1e18,
        timestamp: Number(timestamp) * 1000,
      };

      setTrades((prev) => [trade, ...prev]);
    };

    router.on("PositionClosed", onPositionClosed);

    return () => {
      router.off("PositionClosed", onPositionClosed);
    };
  }, [account]);

  return { trades };
}
