/**
 * ===============================
 * Trade Module Rule (IMPORTANT)
 * ===============================
 *
 * - provider / address は必ず AccountContext から取得する
 * - BrowserProvider を新規生成しない
 * - window.ethereum を直接参照しない
 * - このファイルは UI / Logic のみを担当する
 *
 * Data Flow:
 * Wallet -> AccountContext -> Trade Page / Hooks
 *
 * ===============================
 */

import { useEffect, useState } from "react";
import { Contract, ethers } from "ethers";
import { useAccount } from "@/contexts/AccountContext";
import { CONTRACTS } from "@/lib/eth/addresses";

export type TradePriceResult = {
  price: number | null;
  loading: boolean;
};

const ABI = [
  "function getMarkPrice(bytes32 pair) view returns (uint256)",
];

export function useTradePrice(
  symbol: string = "tUSD"
): TradePriceResult {
  const { provider, address } = useAccount();

  const [price, setPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!provider || !address) {
      setPrice(null);
      return;
    }

    const load = async () => {
      setLoading(true);

      try {
        const perp = new Contract(
          CONTRACTS.PERPETUAL_TRADING,
          ABI,
          provider
        );

        const raw = await perp.getMarkPrice(
          ethers.encodeBytes32String(symbol)
        );

        setPrice(Number(ethers.formatEther(raw)));
      } catch (e) {
        console.error("Failed to load price", e);
        setPrice(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [provider, address, symbol]);

  return { price, loading };
}
