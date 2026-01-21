/**
 * ============================================================
 * useOpenPosition (WRITE) [FINAL]
 * ============================================================
 *
 * Role:
 * - Open new position (market)
 *
 * Rule:
 * - WRITE ONLY (on-chain state change)
 * - Do NOT accept account as argument
 * - Signer resolved internally
 * - READ will update via events
 *
 * ============================================================
 */

import { useState } from "react";
import { BrowserProvider, Contract, encodeBytes32String } from "ethers";

import { CONTRACTS } from "@/lib/eth/addresses";

type OpenPositionParams = {
  symbol: string;      // e.g. "tUSD"
  sizeUsd: number;    // positive = long, negative = short
};

export function useOpenPosition() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openPosition = async ({
    symbol,
    sizeUsd,
  }: OpenPositionParams) => {
    try {
      setLoading(true);
      setError(null);

      if (typeof window === "undefined") {
        throw new Error("No window environment");
      }

      const provider = new BrowserProvider(
        (window as any).ethereum
      );

      const signer = await provider.getSigner();

      const router = new Contract(
        CONTRACTS.ROUTER,
        [
          "function openPosition(bytes32 pair, int256 size)",
        ],
        signer
      );

      const pair = encodeBytes32String(symbol);

      // NOTE:
      // sizeUsd is passed as int256
      // decimals / leverage logic is handled on-chain
      const tx = await router.openPosition(
        pair,
        BigInt(Math.trunc(sizeUsd))
      );

      await tx.wait();

      // success: READ will update via events
      return { success: true };
    } catch (e: any) {
      console.error("[useOpenPosition] failed:", e);
      setError(e?.message ?? "Open position failed");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return {
    openPosition,
    loading,
    error,
  };
}
