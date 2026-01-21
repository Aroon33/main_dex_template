/**
 * ============================================================
 * useOpenPosition (WRITE) [USD NOTIONAL FINAL]
 * ============================================================
 */

import { useState } from "react";
import { Contract, encodeBytes32String, parseEther } from "ethers";
import { useAccount } from "@/contexts/AccountContext";
import { CONTRACTS } from "@/lib/eth/addresses";

type OpenPositionParams = {
  side: "buy" | "sell";
  sizeUsd: number;
  symbol: string; // ← 必須にする（default禁止）
};

export function useOpenPosition() {
  const { provider } = useAccount();
  const [loading, setLoading] = useState(false);

  const openPosition = async ({
    side,
    sizeUsd,
    symbol,
  }: OpenPositionParams) => {
    if (!provider) {
      throw new Error("Wallet not connected");
    }

    if (!symbol) {
      throw new Error("symbol is required");
    }

    if (sizeUsd <= 0) {
      throw new Error("sizeUsd must be > 0");
    }

    try {
      setLoading(true);

      const signer = await provider.getSigner();

      const router = new Contract(
        CONTRACTS.ROUTER,
        ["function openPosition(bytes32 pair, int256 size)"],
        signer
      );

      // ===== USD notional (18 decimals) =====
      const rawSize = parseEther(sizeUsd.toString());
      const signedSize =
        side === "buy" ? rawSize : -rawSize;

      const pair = encodeBytes32String(symbol);

      const tx = await router.openPosition(pair, signedSize);
      await tx.wait();

      return { success: true };
    } finally {
      setLoading(false);
    }
  };

  return {
    openPosition,
    loading,
  };
}
