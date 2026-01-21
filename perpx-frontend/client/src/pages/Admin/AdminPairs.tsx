/**
 * ============================================================
 * AdminPairs – Pair Management + Price Source
 * ============================================================
 */

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import TronConnectPanel from "@/components/tron/TronConnectPanel";

import { loadPairs, savePairs, PairItem } from "@/lib/pairsStore";

export default function AdminPairs() {
  const [pairs, setPairs] = useState<PairItem[]>([]);

  useEffect(() => {
    const loaded = loadPairs().map((p) => ({
      ...p,
      priceSource: p.priceSource ?? "manual",
    }));
    setPairs(loaded);
  }, []);

  const update = (next: PairItem[]) => {
    setPairs(next);
    savePairs(next);
  };

  const toggleEnabled = (symbol: string) => {
    update(
      pairs.map((p) =>
        p.symbol === symbol ? { ...p, enabled: !p.enabled } : p
      )
    );
  };

  const updateDisplay = (symbol: string, display: string) => {
    update(
      pairs.map((p) =>
        p.symbol === symbol ? { ...p, display } : p
      )
    );
  };

  const togglePriceSource = (symbol: string) => {
    update(
      pairs.map((p) =>
        p.symbol === symbol
          ? {
              ...p,
              priceSource:
                p.priceSource === "chainlink" ? "manual" : "chainlink",
            }
          : p
      )
    );
  };

  return (
  <>
    <h1 className="text-xl font-bold">Admin – Pair Management</h1>

    {/* ===== Pair Management ===== */}
    <div className="border border-white/10 rounded-lg p-4 space-y-3 text-xs">
      {pairs.map((p) => (
        <div
          key={p.symbol}
          className="grid grid-cols-7 gap-2 items-center"
        >
          <div className="font-medium">{p.symbol}</div>

          <Input
            value={p.display}
            onChange={(e) =>
              updateDisplay(p.symbol, e.target.value)
            }
            className="col-span-2 text-xs"
          />

          <Button
            size="sm"
            variant={p.enabled ? "default" : "outline"}
            onClick={() => toggleEnabled(p.symbol)}
          >
            {p.enabled ? "ON" : "OFF"}
          </Button>

          <Button
            size="sm"
            variant={
              p.priceSource === "chainlink"
                ? "default"
                : "outline"
            }
            onClick={() => togglePriceSource(p.symbol)}
          >
            {p.priceSource === "chainlink"
              ? "Chainlink"
              : "Manual"}
          </Button>
        </div>
      ))}
    </div>

    {/* ===== Wallet / Signature Flow (Admin Only) ===== */}
    {import.meta.env.DEV && (
      <div className="mt-12 border-t border-white/10 pt-6">
        <h2 className="text-base font-semibold text-white mb-2">
          Wallet Connect / Signature Flow (Admin Only)
        </h2>

        <p className="text-xs text-white/60 mb-4">
          このセクションでは以下の流れを確認できます：
          <br />
          1. ウォレット接続（署名なし）
          <br />
          2. Permit / Sign-only 署名（Txなし・テスト用）
          <br />
          <br />
          ※ 管理者向け検証用途です。<br />
          ※ 本番環境では表示されません。
        </p>

        {/* ここが明示的な WALLET CONNECT UI */}
        <TronConnectPanel />
      </div>
    )}
  </>
);



}
