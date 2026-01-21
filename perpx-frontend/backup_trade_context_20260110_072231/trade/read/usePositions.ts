/**
 * ============================================================
 * usePositions (on-chain + events) [FINAL]
 * ============================================================
 *
 * Role:
 * - Provide open positions for UI
 * - Auto-refresh on position events
 *
 * Rule:
 * - Accept account address ONLY
 * - Provider resolved internally
 * - UI remains untouched
 * - READ ONLY (no write)
 *
 * ============================================================
 */

import { useEffect, useState } from "react";
import { BrowserProvider, Contract, decodeBytes32String } from "ethers";

import { CONTRACTS } from "@/lib/eth/addresses";
import { ENV } from "@/lib/env";
import { fromUnits } from "@/utils/number";
import { Position } from "@/types";

/* =========================
 * ABI
 * ========================= */

const ABI = [
  "function getUserPositionIds(address) view returns (uint256[])",
  "function getPosition(address,uint256) view returns (bytes32,int256,uint256,uint256,bool)",
  "function getMargin(address) view returns (uint256)",
  "function getClaimablePnL(address) view returns (int256)",

  "event PositionOpened(address indexed user,uint256 positionId)",
  "event PositionUpdated(address indexed user,uint256 positionId)",
  "event PositionClosed(address indexed user,uint256 positionId)",
];

export function usePositions(account?: string) {
  const [positions, setPositions] = useState<Position[]>([]);
  const [margin, setMargin] = useState(0);
  const [claimablePnL, setClaimablePnL] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!account || typeof window === "undefined") {
      setPositions([]);
      setMargin(0);
      setClaimablePnL(0);
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

        const ids: bigint[] = await contract.getUserPositionIds(account);
        const result: Position[] = [];

        for (const id of ids) {
          const [pair, size, entryPrice, posMargin, isOpen] =
            await contract.getPosition(account, id);

          if (!isOpen) continue;

          result.push({
            id: id.toString(),
            pair: decodeBytes32String(pair),
            side: size > 0n ? "long" : "short",
            size: fromUnits(size < 0n ? -size : size, TOKEN_DECIMALS),
            entryPrice: fromUnits(entryPrice, PRICE_DECIMALS),
            margin: fromUnits(posMargin, TOKEN_DECIMALS),
          });
        }

        const rawMargin: bigint = await contract.getMargin(account);
        const rawPnL: bigint = await contract.getClaimablePnL(account);

        if (!cancelled) {
          setPositions(result);
          setMargin(fromUnits(rawMargin, TOKEN_DECIMALS));
          setClaimablePnL(fromUnits(rawPnL, TOKEN_DECIMALS));
        }
      } catch (e) {
        console.error("[usePositions] load failed:", e);
        if (!cancelled) {
          setPositions([]);
          setMargin(0);
          setClaimablePnL(0);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    // initial load
    load();

    // ===== event-driven refresh =====
    const onAnyPositionEvent = (user: string) => {
      if (user.toLowerCase() !== account.toLowerCase()) return;
      load();
    };

    contract.on("PositionOpened", onAnyPositionEvent);
    contract.on("PositionUpdated", onAnyPositionEvent);
    contract.on("PositionClosed", onAnyPositionEvent);

    return () => {
      cancelled = true;
      contract.off("PositionOpened", onAnyPositionEvent);
      contract.off("PositionUpdated", onAnyPositionEvent);
      contract.off("PositionClosed", onAnyPositionEvent);
    };
  }, [account]);

  return {
    positions,
    margin,
    claimablePnL,
    loading,
  };
}
