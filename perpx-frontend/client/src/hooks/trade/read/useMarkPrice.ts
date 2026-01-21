/**
 * ============================================================
 * useMarkPrice (READ)
 * ============================================================
 *
 * - Oracle（on-chain）から Mark Price を取得
 * - Trade / PnL / 清算で使われる「真実の価格」
 * - DB 不要
 *
 * ============================================================
 */

import { useEffect, useState } from "react";
import {
  BrowserProvider,
  Contract,
  formatUnits,
  encodeBytes32String,
} from "ethers";

import { CONTRACTS } from "@/lib/eth/addresses";
import { ORACLE_ABI } from "@/lib/eth/abi/Oracle";

export function useMarkPrice(pair: string | null) {
  const [price, setPrice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!pair) {
      setPrice(null);
      return;
    }

    let timer: NodeJS.Timeout | null = null;
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);

        const provider = new BrowserProvider(window.ethereum);
        const oracle = new Contract(
          CONTRACTS.PRICE_ORACLE,
          ORACLE_ABI,
          provider
        );

        const raw = await oracle.getPrice(
          encodeBytes32String(pair)
        );

        if (!cancelled) {
          setPrice(formatUnits(raw, 18));
        }
      } catch (e) {
        console.error("Mark price read failed:", e);
        if (!cancelled) {
          setPrice(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    // 初回ロード
    load();

    // 5秒ごとに更新
    timer = setInterval(load, 5000);

    return () => {
      cancelled = true;
      if (timer) clearInterval(timer);
    };
  }, [pair]);

  return {
    price,
    loading,
  };
}
