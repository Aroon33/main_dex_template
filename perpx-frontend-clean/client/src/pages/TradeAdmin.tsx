"use client";

/**
 * ============================================================
 * TradeAdmin – Pair Management (B-3 FINAL)
 * ============================================================
 *
 * - SSOT: localStorage (pairsStore)
 * - Show pairs
 * - Update Oracle price
 * - ON / OFF / Display edit
 * - Persist on reload
 *
 * ============================================================
 */

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BrowserProvider, Contract, ethers } from "ethers";

import { useWallet } from "@/contexts/WalletContext";
import { useRuntimeConfig } from "@/hooks/useRuntimeConfig";
import { useClaimPnL } from "@/hooks/trade/write/useClaimPnL";

import { CONTRACTS } from "@/lib/eth/addresses";
import { ORACLE_ABI } from "@/lib/eth/abi/Oracle";

import { loadPairs, savePairs, PairItem } from "@/lib/pairsStore";

export default function TradeAdmin() {
  const { address, isConnected, connect } = useWallet();
  const { config, loading, error } = useRuntimeConfig();
  const { claimPnL, isSubmitting } = useClaimPnL();

  const [pairs, setPairs] = useState<PairItem[]>([]);
  const [priceInput, setPriceInput] = useState<Record<string, string>>({});
  const [txLoading, setTxLoading] = useState(false);

  useEffect(() => {
    setPairs(loadPairs());
  }, []);

  /* =========================
   * Guards
   * ========================= */
  if (loading) return <div className="p-6">Loading config…</div>;
  if (error || !config)
    return <div className="p-6 text-red-500">Config error</div>;

  if (!isConnected) {
    return (
      <div className="p-6">
        <Button onClick={connect}>Connect Wallet</Button>
      </div>
    );
  }

  const isAdmin =
    address?.toLowerCase() ===
    config.dev.userAddress.toLowerCase();

  if (!isAdmin) {
    return <div className="p-6 text-red-500">Not authorized</div>;
  }

  /* =========================
   * Helpers
   * ========================= */
  const getOracle = async () => {
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new Contract(CONTRACTS.PRICE_ORACLE, ORACLE_ABI, signer);
  };

  const updatePrice = async (symbol: string) => {
    const price = priceInput[symbol];
    if (!price || Number(price) <= 0) return alert("Invalid price");

    try {
      setTxLoading(true);
      const oracle = await getOracle();
      await oracle.setPrice(
        ethers.encodeBytes32String(symbol),
        ethers.parseUnits(price, 18)
      );
      alert(`${symbol} price updated`);
    } catch (e) {
      console.error(e);
      alert("Oracle tx failed");
    } finally {
      setTxLoading(false);
    }
  };

  const toggleEnabled = (symbol: string) => {
    const next = pairs.map(p =>
      p.symbol === symbol ? { ...p, enabled: !p.enabled } : p
    );
    setPairs(next);
    savePairs(next);
  };

  const updateDisplay = (symbol: string, display: string) => {
    const next = pairs.map(p =>
      p.symbol === symbol ? { ...p, display } : p
    );
    setPairs(next);
    savePairs(next);
  };

  /* =========================
   * Render
   * ========================= */
  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <h1 className="text-xl font-bold">
        Trade Admin – Pair Management
      </h1>

      <div className="border border-white/10 rounded-lg p-4 space-y-3">
        <h2 className="font-semibold text-sm">Registered Pairs</h2>

        {pairs.map((p) => (
          <div key={p.symbol} className="grid grid-cols-7 gap-2 items-center">
            <div className="text-sm font-medium">{p.symbol}</div>

            <Input
              value={p.display}
              onChange={(e) => updateDisplay(p.symbol, e.target.value)}
              className="col-span-2 text-xs"
            />

            <Input
              placeholder="Price"
              value={priceInput[p.symbol] ?? ""}
              onChange={(e) =>
                setPriceInput({ ...priceInput, [p.symbol]: e.target.value })
              }
              className="text-xs"
            />

            <Button
              size="sm"
              onClick={() => updatePrice(p.symbol)}
              disabled={txLoading}
            >
              Update
            </Button>

            <Button
              size="sm"
              variant={p.enabled ? "default" : "outline"}
              onClick={() => toggleEnabled(p.symbol)}
            >
              {p.enabled ? "ON" : "OFF"}
            </Button>
          </div>
        ))}
      </div>

      <Button
        className="w-full bg-emerald-600 hover:bg-emerald-700"
        disabled={isSubmitting}
        onClick={async () => {
          try {
            await claimPnL();
            alert("Claim tx sent");
          } catch {
            alert("Claim failed");
          }
        }}
      >
        {isSubmitting ? "Claiming…" : "Claim PnL"}
      </Button>
    </div>
  );
}
