/**
 * ============================================================
 * usePartialClose (WRITE) [FINAL]
 * ============================================================
 *
 * Role:
 * - Partially close an open position
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

type PartialCloseParams = {
  positionId: number | string;
  closeSizeUsd: number; // positive value (USD size to close)
};

export function usePartialClose() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const partialClose = async ({
    positionId,
    closeSizeUsd,
  }: PartialCloseParams) => {
    try {
      setLoading(true);
      setError(null);

      if (typeof window === "undefined") {
        throw new Error("No window environment");
      }

      if (closeSizeUsd <= 0) {
        throw new Error("closeSizeUsd must be positive");
      }

      const provider = new BrowserProvider(
        (window as any).ethereum
      );

      const signer = await provider.getSigner();

      const router = new Contract(
        CONTRACTS.ROUTER,
        [
          "function closePositionPartial(uint256 positionId, int256 closeSize)",
        ],
        signer
      );

      // NOTE:
      // closeSize is passed as int256
      // sign is determined by on-chain logic
      const tx = await router.closePositionPartial(
        BigInt(positionId),
        BigInt(Math.trunc(closeSizeUsd))
      );

      await tx.wait();

      // success: READ updates via events
      return { success: true };
    } catch (e: any) {
      console.error("[usePartialClose] failed:", e);
      setError(e?.message ?? "Partial close failed");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return {
    partialClose,
    loading,
    error,
  };
}
