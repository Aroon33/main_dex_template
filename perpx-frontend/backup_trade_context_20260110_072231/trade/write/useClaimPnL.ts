/**
 * ============================================================
 * useClaimPnL (WRITE) [FINAL]
 * ============================================================
 *
 * Role:
 * - Claim realized PnL
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

export function useClaimPnL() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const claimPnL = async () => {
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

      const perp = new Contract(
        CONTRACTS.PERPETUAL_TRADING,
        [
          "function claimPnL(address user)",
        ],
        signer
      );

      // NOTE:
      // user address is resolved on-chain via msg.sender or explicit param
      const tx = await perp.claimPnL(
        await signer.getAddress()
      );

      await tx.wait();

      // success: READ updates via events
      return { success: true };
    } catch (e: any) {
      console.error("[useClaimPnL] failed:", e);
      setError(e?.message ?? "Claim PnL failed");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return {
    claimPnL,
    loading,
    error,
  };
}
