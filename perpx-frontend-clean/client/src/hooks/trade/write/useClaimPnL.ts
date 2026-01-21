import { useState } from "react";
import { Contract } from "ethers";
import { useAccount } from "@/contexts/AccountContext";
import { CONTRACTS } from "@/lib/eth/addresses";
import { ROUTER_ABI } from "@/lib/eth/abi/Router";

export function useClaimPnL() {
  const { provider } = useAccount();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const claimPnL = async () => {
    if (!provider) {
      throw new Error("Wallet not connected");
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const signer = await provider.getSigner();

      // ✅ Router を使う
      const router = new Contract(
        CONTRACTS.ROUTER,
        ROUTER_ABI,
        signer
      );

      const tx = await router.claimPnL();
      await tx.wait();

      return { success: true };
    } catch (e: any) {
      console.error("[useClaimPnL]", e);
      setError(e?.message ?? "Claim PnL failed");
      throw e;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    claimPnL,
    isSubmitting,
    error,
  };
}
