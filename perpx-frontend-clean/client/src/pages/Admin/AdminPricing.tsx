/**
 * ============================================================
 * AdminPricing – Manual Pricing UX Improved
 * ============================================================
 *
 * - 現在の manual price を常時表示
 * - input は編集専用
 * - ペア切替・更新でも表示は消えない
 *
 * ============================================================
 */

import { useEffect, useState } from "react";
import {
  BrowserProvider,
  Contract,
  formatUnits,
  parseUnits,
  encodeBytes32String,
} from "ethers";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { loadPairs } from "@/lib/pairsStore";
import { CONTRACTS } from "@/lib/eth/addresses";
import { ORACLE_ABI } from "@/lib/eth/abi/Oracle";

type PriceMap = Record<string, string>;
type TxStateMap = Record<string, boolean>;

export default function AdminPricing() {
  const [pairs, setPairs] = useState(loadPairs());

  /** 現在の on-chain manual price（表示用・消えない） */
  const [currentPrice, setCurrentPrice] = useState<PriceMap>({});

  /** input 編集用 */
  const [priceInput, setPriceInput] = useState<PriceMap>({});

  const [txLoading, setTxLoading] = useState<TxStateMap>({});

  useEffect(() => {
    setPairs(loadPairs());
  }, []);

  /** 初回 & reload 時に現在価格を読む */
  useEffect(() => {
    const loadCurrentPrices = async () => {
      const provider = new BrowserProvider(window.ethereum);
      const oracle = new Contract(
        CONTRACTS.PRICE_ORACLE,
        ORACLE_ABI,
        provider
      );

      const nextCurrent: PriceMap = {};
      const nextInput: PriceMap = {};

      for (const p of pairs) {
        if (p.priceSource !== "manual") continue;

        try {
          const raw = await oracle.getPrice(
            encodeBytes32String(p.symbol)
          );
          const v = formatUnits(raw, 18);

          nextCurrent[p.symbol] = v;

          // input 初期値は current をコピー
          nextInput[p.symbol] =
            priceInput[p.symbol] ?? v;
        } catch {
          nextCurrent[p.symbol] = "—";
          nextInput[p.symbol] =
            priceInput[p.symbol] ?? "";
        }
      }

      setCurrentPrice(nextCurrent);
      setPriceInput(nextInput);
    };

    if (pairs.length > 0) {
      loadCurrentPrices();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pairs]);

  const updatePrice = async (symbol: string) => {
    const value = priceInput[symbol];
    if (!value || Number(value) <= 0) {
      alert("Invalid price");
      return;
    }

    try {
      setTxLoading((s) => ({ ...s, [symbol]: true }));

      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const oracle = new Contract(
        CONTRACTS.PRICE_ORACLE,
        ORACLE_ABI,
        signer
      );

      const tx = await oracle.setPrice(
        encodeBytes32String(symbol),
        parseUnits(value, 18)
      );
      await tx.wait();

      // ★ 成功後は currentPrice を更新
      setCurrentPrice((p) => ({
        ...p,
        [symbol]: value,
      }));

      alert(`${symbol} price updated`);
    } catch (e) {
      console.error(e);
      alert("Price update failed");
    } finally {
      setTxLoading((s) => ({ ...s, [symbol]: false }));
    }
  };

  return (
    <>
      <h1 className="text-xl font-bold">
        Admin – Manual Pricing
      </h1>

      <div className="border border-white/10 rounded-lg p-4 space-y-4 text-xs">
        {pairs
          .filter((p) => p.priceSource === "manual")
          .map((p) => (
            <div
              key={p.symbol}
              className="grid grid-cols-8 gap-2 items-center"
            >
              <div className="font-medium">
                {p.symbol}
              </div>

              {/* 現在価格（常時表示） */}
              <div className="col-span-2 text-white/60">
                Current:{" "}
                {currentPrice[p.symbol] ?? "—"} USD
              </div>

              {/* 編集用 input */}
              <Input
                value={priceInput[p.symbol] ?? ""}
                onChange={(e) =>
                  setPriceInput({
                    ...priceInput,
                    [p.symbol]: e.target.value,
                  })
                }
                className="text-xs"
              />

              <Button
                size="sm"
                disabled={txLoading[p.symbol]}
                onClick={() => updatePrice(p.symbol)}
              >
                Update
              </Button>
            </div>
          ))}
      </div>
    </>
  );
}
