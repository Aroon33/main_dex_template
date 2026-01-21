import { useState } from "react";
import { Contract } from "ethers";
import { useAccount } from "@/contexts/AccountContext";
import { CONTRACTS } from "@/lib/eth/addresses";
import { ROUTER_ABI } from "@/lib/eth/abi/Router";

export function useClaimPnLToMargin() {
  const { provider, refreshAll } = useAccount();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const claimToMargin = async () => {
    if (!provider) {
      throw new Error("Wallet not connected");
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const signer = await provider.getSigner();
      const router = new Contract(
        CONTRACTS.ROUTER,
        ROUTER_ABI,
        signer
      );

      // ★ ここが差分
      const tx = await router.claimPnLToMargin();
      await tx.wait();

      await refreshAll();
      return { success: true };
    } catch (e: any) {
      console.error("[useClaimPnLToMargin]", e);
      setError(e?.message ?? "Claim to margin failed");
      throw e;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    claimToMargin,
    isSubmitting,
    error,
  };
}
