/**
 * ============================================================
 * usePartialClose (WRITE)
 * ============================================================
 *
 * Role:
 * - Partially close an open position
 *
 * Rules:
 * - WRITE ONLY
 * - provider / signer は AccountContext から取得
 * - positionId は number に統一
 * - closeSizeUsd は正の数
 *
 * ============================================================
 */

import { useState } from "react";
import { Contract } from "ethers";
import { useAccount } from "@/contexts/AccountContext";
import { CONTRACTS } from "@/lib/eth/addresses";

type PartialCloseParams = {
  positionId: number;
  closeSizeUsd: number;
};

export function usePartialClose() {
  const { provider } = useAccount();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const partialClose = async ({
    positionId,
    closeSizeUsd,
  }: PartialCloseParams) => {
    if (!provider) {
      throw new Error("Wallet not connected");
    }

    if (closeSizeUsd <= 0) {
      throw new Error("closeSizeUsd must be positive");
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const signer = await provider.getSigner();

      const router = new Contract(
        CONTRACTS.ROUTER,
        [
          "function closePositionPartial(uint256 positionId, int256 closeSize)",
        ],
        signer
      );

      const tx = await router.closePositionPartial(
        BigInt(positionId),
        BigInt(Math.trunc(closeSizeUsd))
      );

      await tx.wait();

      return { success: true };
    } catch (e: any) {
      console.error("[usePartialClose]", e);
      setError(e?.message ?? "Partial close failed");
      throw e;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    partialClose,
    isSubmitting,
    error,
  };
}
