/**
 * ============================================================
 * useTradeHistorySimple (on-chain + events) [FINAL]
 * ============================================================
 *
 * Role:
 * - Provide executed trade history for UI
 * - Auto-refresh on TradeExecuted event
 *
 * Rule:
 * - Accept account address ONLY
 * - Provider resolved internally
 * - READ ONLY (no write)
 * - Safe for re-mount / StrictMode
 *
 * ============================================================
 */

import { useEffect, useState } from "react";
import { BrowserProvider, Contract, decodeBytes32String } from "ethers";

import { CONTRACTS } from "@/lib/eth/addresses";
import { ENV } from "@/lib/env";
import { fromUnits } from "@/utils/number";
import { Trade } from "@/types";

/* =========================
 * ABI
 * ========================= */

const ABI = [
  "function getTradeCount(address) view returns (uint256)",
  "function getTrade(address,uint256) view returns (bytes32,int256,uint256,int256,uint256)",
  "event TradeExecuted(address indexed user)",
];

export function useTradeHistorySimple(account?: string) {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!account || typeof window === "undefined") {
      setTrades([]);
      return;
    }

    let cancelled = false;

    const provider = new BrowserProvider((window as any).ethereum);
    const contract = new Contract(
      CONTRACTS.PERPETUAL_TRADING,
      ABI,
      provider
    );

    const PRICE_DECIMALS = ENV.DECIMALS.PRICE;
    const TOKEN_DECIMALS = ENV.DECIMALS.TOKEN;

    const load = async () => {
      try {
        setLoading(true);

        const count = Number(
          await contract.getTradeCount(account)
        );

        const result: Trade[] = [];

        for (let i = 0; i < count; i++) {
          const trade = await contract.getTrade(account, i);

          result.push({
            id: i.toString(),
            symbol: decodeBytes32String(trade[0]),
            price: fromUnits(trade[2], PRICE_DECIMALS),
            pnl: fromUnits(trade[3], TOKEN_DECIMALS),
            timestamp: Number(trade[4]) * 1000,
          });
        }

        if (!cancelled) {
          // 最新を上に
          setTrades(result.reverse());
        }
      } catch (e) {
        console.error("[useTradeHistorySimple] load failed:", e);
        if (!cancelled) setTrades([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    // initial load
    load();

    // ===== event-driven refresh =====
    const onTradeExecuted = (user: string) => {
      if (user.toLowerCase() !== account.toLowerCase()) return;
      load();
    };

    contract.on("TradeExecuted", onTradeExecuted);

    return () => {
      cancelled = true;
      contract.off("TradeExecuted", onTradeExecuted);
    };
  }, [account]);

  return {
    trades,
    loading,
  };
}
