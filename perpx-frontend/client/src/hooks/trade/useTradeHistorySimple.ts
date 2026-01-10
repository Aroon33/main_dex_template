/**
 * ============================================================
 * useTradeHistorySimple (on-chain + events)
 * ============================================================
 *
 * Role:
 * - Provide trade history for UI
 * - Auto-refresh on TradeExecuted event
 *
 * Rule:
 * - Accept account address ONLY
 * - Provider resolved internally
 * - Event subscription handled safely
 *
 * ============================================================
 */

import { useEffect, useState } from "react";
import { BrowserProvider, Contract, decodeBytes32String } from "ethers";
import { CONTRACTS } from "@/lib/eth/addresses";

/* =========================
 * Types
 * ========================= */

export type Trade = {
  id: string;
  symbol: string;
  price: number;
  pnl: number;
  timestamp: number;
};

/* =========================
 * ABI
 * ========================= */

const ABI = [
  "function getTradeCount(address) view returns (uint256)",
  "function getTrade(address,uint256) view returns (bytes32,int256,uint256,int256,uint256)",
  "event TradeExecuted(address indexed user, bytes32 pair, int256 size, uint256 price, int256 pnl, uint256 timestamp)",
];

/* =========================
 * Hook
 * ========================= */

export function useTradeHistorySimple(account?: string) {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!account || typeof window === "undefined") {
      setTrades([]);
      return;
    }

    let cancelled = false;

    // provider / contract は effect 内で完結させる
    const provider = new BrowserProvider(
      (window as any).ethereum
    );

    const contract = new Contract(
      CONTRACTS.PERPETUAL_TRADING,
      ABI,
      provider
    );

    const load = async () => {
      try {
        setLoading(true);

        const count: bigint = await contract.getTradeCount(account);
        const result: Trade[] = [];

        for (let i = 0; i < Number(count); i++) {
          const [pair, , price, pnl, ts] =
            await contract.getTrade(account, i);

          result.push({
            id: `${i}`,
            symbol: decodeBytes32String(pair),
            price: Number(price) / 1e8,
            pnl: Number(pnl) / 1e18,
            timestamp: Number(ts) * 1000,
          });
        }

        if (!cancelled) {
          setTrades(result.reverse());
        }
      } catch (e) {
        console.error("[useTradeHistorySimple] load failed:", e);
        if (!cancelled) setTrades([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    // 初回ロード
    load();

    // ===== Event subscribe =====
    const onTradeExecuted = (user: string) => {
      if (user.toLowerCase() !== account.toLowerCase()) return;
      load(); // 安全に再取得
    };

    contract.on("TradeExecuted", onTradeExecuted);

    return () => {
      cancelled = true;
      contract.off("TradeExecuted", onTradeExecuted);
    };
  }, [account]);

  return { trades, loading };
}
