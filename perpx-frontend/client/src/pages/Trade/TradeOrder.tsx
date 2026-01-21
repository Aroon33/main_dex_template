"use client";

/**
 * ============================================================
 * TradeOrder
 * ============================================================
 *
 * Role:
 * - UI のみ担当
 * - Market / Limit の注文 intent を作る
 * - Market → on-chain 即時
 * - Limit  → off-chain（LimitOrderContext）
 *
 * ============================================================
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import { useOpenPosition } from "@/hooks/trade/write/useOpenPosition";
import { useLimitOrders } from "@/contexts/LimitOrderContext";

type Props = {
  tradeMode: "perpetual" | "spot";
  marginBalance: number;
  availableBalance: number;
  symbol: string; // on-chain pair (ex: BTC)
};

export default function TradeOrder({
  tradeMode,
  marginBalance,
  availableBalance,
  symbol,
}: Props) {
  const { openPosition, loading } = useOpenPosition();
  const { addOrder } = useLimitOrders();

  /* =========================
     Local UI State
  ========================= */
  const [orderType, setOrderType] =
    useState<"market" | "limit">("market");

  const [price, setPrice] = useState("");
  const [amount, setAmount] = useState("");
  const [leverage, setLeverage] = useState(5);

  /* =========================
     Helpers
  ========================= */
  const handlePercentageClick = (percent: number) => {
    if (tradeMode !== "perpetual") return;
    const calculated = (marginBalance * percent) / 100;
    setAmount(calculated.toFixed(2));
  };

  const changeLeverage = (delta: number) => {
    setLeverage((v) => Math.min(20, Math.max(1, v + delta)));
  };

  const handleSubmit = async (side: "buy" | "sell") => {
    const sizeUsd = Number(amount);

    if (!sizeUsd || sizeUsd <= 0) {
      toast.error("Please enter a valid size");
      return;
    }

    /* ===== LIMIT (off-chain) ===== */
    if (orderType === "limit") {
      if (!price || Number(price) <= 0) {
        toast.error("Please enter limit price");
        return;
      }

      addOrder({
        id: crypto.randomUUID(),
        symbol,
        side,
        price: Number(price),
        sizeUsd,
        leverage,
        status: "open",
        createdAt: Date.now(),
      });

      toast.success("Limit order placed");
      setAmount("");
      setPrice("");
      return;
    }

    /* ===== MARKET (on-chain) ===== */
    try {
      const res = await openPosition({
        side,
        sizeUsd,
        symbol,
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

  /* =========================
     Derived (UI only)
  ========================= */
  const marginUsed =
    amount && leverage ? Number(amount) / leverage : 0;

  /* =========================
     Render
  ========================= */
  return (
    <div className="flex-1 overflow-y-auto bg-background p-4 space-y-4">

      {/* ===== Order Type ===== */}
      <div className="flex rounded-lg bg-card p-1">
        {["market", "limit"].map((t) => (
          <button
            key={t}
            onClick={() => setOrderType(t as any)}
            className={`flex-1 py-2 text-sm rounded-md ${
              orderType === t
                ? "bg-primary text-white"
                : "text-white/60"
            }`}
          >
            {t === "market" ? "Market" : "Limit"}
          </button>
        ))}
      </div>

      {/* ===== Limit Price ===== */}
      {orderType === "limit" && (
        <div>
          <label className="text-sm text-white/60 block mb-1">
            Limit Price
          </label>
          <Input
            type="number"
            placeholder="0.00"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
      )}

      {/* ===== Size ===== */}
      <div>
        <label className="text-sm text-white/60 block mb-1">
          Size (USD)
          {tradeMode === "perpetual" && (
            <span className="float-right text-xs text-white/40">
              Available: {availableBalance.toFixed(2)} USDT
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

      {/* ===== Leverage ===== */}
      {tradeMode === "perpetual" && (
        <div>
          <label className="text-sm text-white/60 block mb-1">
            Leverage
          </label>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => changeLeverage(-1)}
            >
              −
            </Button>
            <div className="text-lg font-bold w-12 text-center">
              {leverage}x
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => changeLeverage(1)}
            >
              ＋
            </Button>
          </div>
        </div>
      )}

      {/* ===== Summary ===== */}
      {tradeMode === "perpetual" && amount && (
        <div className="text-sm text-white/60 space-y-1">
          <div>Margin Used: {marginUsed.toFixed(2)} USD</div>
          <div>Position Size: {amount} USD</div>
          <div>Leverage: {leverage}x</div>
        </div>
      )}

      {/* ===== Actions ===== */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <Button
          disabled={loading}
          onClick={() => handleSubmit("buy")}
          className="bg-green-500 hover:bg-green-600 text-white py-6 text-lg font-bold"
        >
          Buy Long ({leverage}x)
        </Button>

        <Button
          disabled={loading}
          onClick={() => handleSubmit("sell")}
          className="bg-red-500 hover:bg-red-600 text-white py-6 text-lg font-bold"
        >
          Sell Short ({leverage}x)
        </Button>
      </div>
    </div>
  );
}
