/**
 * ============================================================
 * TradeOrder
 * ============================================================
 *
 * 【役割】
 * - UI のみ担当
 * - BUY / SELL の選択のみを責務とする
 * - size は常に「正の USD」
 * - on-chain 処理は useOpenPosition に完全委譲
 *
 * 【重要】
 * - OrderType / price / stop / leverage は UI 表示用のみ
 * - 現在 on-chain で有効なのは Market のみ
 *
 * ============================================================
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import { useOpenPosition } from "@/hooks/trade/write/useOpenPosition";

type Props = {
  tradeMode: "perpetual" | "spot";
  balance: number;
};

export default function TradeOrder({ tradeMode, balance }: Props) {
  const { openPosition, loading } = useOpenPosition();

  const [amount, setAmount] = useState("");

  const handlePercentageClick = (percent: number) => {
    if (tradeMode !== "perpetual") return;

    const calculated = (balance * percent) / 100;
    setAmount(calculated.toFixed(2));
  };

  const handleTrade = async (side: "buy" | "sell") => {
    const sizeUsd = Number(amount);

    if (!sizeUsd || sizeUsd <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      const res = await openPosition({
        side,
        sizeUsd,
        symbol: "tUSD",
      });

      if (!res?.success) {
        toast.error("Transaction failed");
        return;
      }

      toast.success("Position opened");
      setAmount("");
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message ?? "Trade failed");
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-background p-4 space-y-4">
      {/* ===== Size ===== */}
      <div>
        <label className="text-sm text-white/60 block mb-1">
          Size
          {tradeMode === "perpetual" && (
            <span className="float-right text-xs text-white/40">
              Available: {balance.toFixed(2)} USDT
            </span>
          )}
        </label>

        <Input
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      {/* ===== Percent Buttons ===== */}
      {tradeMode === "perpetual" && (
        <div className="flex gap-2">
          {[25, 50, 75, 100].map((p) => (
            <Button
              key={p}
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => handlePercentageClick(p)}
            >
              {p}%
            </Button>
          ))}
        </div>
      )}

      {/* ===== Actions ===== */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <Button
          disabled={loading}
          onClick={() => handleTrade("buy")}
          className="bg-green-500 hover:bg-green-600 text-white py-6 text-lg font-bold"
        >
          Buy Long
        </Button>

        <Button
          disabled={loading}
          onClick={() => handleTrade("sell")}
          className="bg-red-500 hover:bg-red-600 text-white py-6 text-lg font-bold"
        >
          Sell Short
        </Button>
      </div>
    </div>
  );
}
