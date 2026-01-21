"use client";

/**
 * ============================================================
 * usePositions (READ)
 * ============================================================
 *
 * - open positions を取得
 * - entryPrice / size から PnL を算出
 *
 * ============================================================
 */

import { useEffect, useState } from "react";
import { BrowserProvider, Contract, decodeBytes32String, ethers } from "ethers";
import { CONTRACTS } from "@/lib/eth/addresses";
import { useTradePrice } from "@/hooks/trade/useTradePrice";

export type PositionView = {
  id: number;
  pair: string;
  side: "long" | "short";
  size: number;
  entryPrice: number;
  pnl: number;
};

const ABI = [
  "function getUserPositionIds(address) view returns (uint256[])",
  "function getPosition(address,uint256) view returns (bytes32,int256,uint256,uint256,bool)",
];

export function usePositions(address?: string) {
  const [positions, setPositions] = useState<PositionView[]>([]);
  const [loading, setLoading] = useState(false);

  const { price } = useTradePrice(); // 現在価格

  useEffect(() => {
    if (!address || !price || typeof window === "undefined") {
      setPositions([]);
      return;
    }

    const provider = new BrowserProvider(window.ethereum);
    const perp = new Contract(CONTRACTS.PERPETUAL_TRADING, ABI, provider);

    const load = async () => {
      setLoading(true);

      const ids: bigint[] = await perp.getUserPositionIds(address);
      const list: PositionView[] = [];

      for (const id of ids) {
        const [pair, sizeRaw, entryRaw, , isOpen] =
          await perp.getPosition(address, id);

        if (!isOpen) continue;

        const size = Number(ethers.formatEther(sizeRaw));
        const entryPrice = Number(ethers.formatEther(entryRaw));

        const pnl =
          size > 0
            ? size * (price - entryPrice) / entryPrice
            : Math.abs(size) * (entryPrice - price) / entryPrice;

        list.push({
          id: Number(id),
          pair: decodeBytes32String(pair),
          side: size > 0 ? "long" : "short",
          size: Math.abs(size),
          entryPrice,
          pnl,
        });
      }

      setPositions(list);
      setLoading(false);
    };

    load();
  }, [address, price]);

  return { positions, loading };
}
