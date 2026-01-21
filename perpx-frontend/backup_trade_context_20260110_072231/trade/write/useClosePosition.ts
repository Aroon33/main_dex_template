/**
 * ============================================================
 * useClosePosition (WRITE) [FINAL]
 * ============================================================
 *
 * Role:
 * - Close an open position (full close)
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
import { BrowserProvider, Contract } from "ethers";

import { CONTRACTS } from "@/lib/eth/addresses";

type ClosePositionParams = {
  positionId: number | string;
};

export function useClosePosition() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const closePosition = async ({
    positionId,
  }: ClosePositionParams) => {
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
          "function closePosition(uint256 positionId)",
        ],
        signer
      );

      const tx = await router.closePosition(
        BigInt(positionId)
      );

      await tx.wait();

      // success: READ updates via events
      return { success: true };
    } catch (e: any) {
      console.error("[useClosePosition] failed:", e);
      setError(e?.message ?? "Close position failed");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return {
    closePosition,
    loading,
    error,
  };
}
