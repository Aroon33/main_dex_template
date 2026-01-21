/**
 * ============================================================
 * useClosePosition (WRITE)
 * ============================================================
 *
 * Role:
 * - Close an open position (full close)
 *
 * Rules:
 * - WRITE ONLY
 * - provider / signer は AccountContext から取得
 * - positionId は number で統一
 *
 * ============================================================
 */

import { useState } from "react";
import { Contract } from "ethers";
import { useAccount } from "@/contexts/AccountContext";
import { CONTRACTS } from "@/lib/eth/addresses";

type ClosePositionParams = {
  positionId: number;
};

export function useClosePosition() {
  const { provider } = useAccount();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const closePosition = async ({
    positionId,
  }: ClosePositionParams) => {
    if (!provider) {
      throw new Error("Wallet not connected");
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const signer = await provider.getSigner();

      const router = new Contract(
        CONTRACTS.ROUTER,
        ["function closePosition(uint256 positionId)"],
        signer
      );

      const tx = await router.closePosition(
        BigInt(positionId)
      );

      await tx.wait();

      return { success: true };
    } catch (e: any) {
      console.error("[useClosePosition]", e);
      setError(e?.message ?? "Close position failed");
      throw e;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    closePosition,
    isSubmitting,
    error,
  };
}
