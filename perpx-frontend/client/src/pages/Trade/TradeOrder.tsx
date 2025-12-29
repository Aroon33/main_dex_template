/**
 * ============================================================
 * TradeOrder
 * ============================================================
 *
 * Role:
 * - Order type selection (Market / Limit / Stop)
 * - Price / Stop / Size inputs
 * - Buy / Sell actions
 *
 * Rule:
 * - JSX / className / order MUST match Trade1.tsx
 * - Design changes are NOT allowed here
 *
 * ============================================================
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

type Props = {
  tradeMode: "perpetual" | "spot";
  balance: number;
};

export default function TradeOrder({ tradeMode, balance }: Props) {
  const [orderType, setOrderType] = useState<"market" | "limit" | "stop">("market");
  const [marginMode, setMarginMode] = useState<"cross" | "isolated">("cross");
  const [leverage, setLeverage] = useState(25);

  const [amount, setAmount] = useState("");
  const [limitPrice, setLimitPrice] = useState("");
  const [stopPrice, setStopPrice] = useState("");

  const handlePercentageClick = (percent: number) => {
    const calculatedAmount = (balance * percent) / 100;
    setAmount(calculatedAmount.toFixed(2));
  };

  const handleTrade = (side: "buy" | "sell") => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    toast.success(`${side.toUpperCase()} order submitted`);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-background p-4 space-y-4">
      {/* Margin Mode and Leverage - Only for Perpetual */}
      {tradeMode === "perpetual" && (
        <div className="flex gap-2">
          <Button
            variant={marginMode === "cross" ? "default" : "outline"}
            onClick={() => setMarginMode("cross")}
            className="flex-1"
          >
            Cross
          </Button>
          <Button
            variant={marginMode === "isolated" ? "default" : "outline"}
            onClick={() => setMarginMode("isolated")}
            className="flex-1"
          >
            Isolated
          </Button>
          <Button variant="outline" className="px-4">
            {leverage}x
          </Button>
        </div>
      )}

      {/* Order Type Tabs */}
      <div className="flex gap-2 bg-card/30 rounded-lg p-1">
        <button
          onClick={() => setOrderType("market")}
          className={`flex-1 py-2 rounded-md transition-colors ${
            orderType === "market" ? "bg-primary text-white" : "text-white/60"
          }`}
        >
          Market
        </button>
        <button
          onClick={() => setOrderType("limit")}
          className={`flex-1 py-2 rounded-md transition-colors ${
            orderType === "limit" ? "bg-primary text-white" : "text-white/60"
          }`}
        >
          Limit
        </button>
        <button
          onClick={() => setOrderType("stop")}
          className={`flex-1 py-2 rounded-md transition-colors ${
            orderType === "stop" ? "bg-primary text-white" : "text-white/60"
          }`}
        >
          Stop
        </button>
      </div>

      {/* Price Input - Only for Limit and Stop */}
      {orderType !== "market" && (
        <div>
          <label className="text-sm text-white/60 mb-2 block">Price</label>
          <div className="relative">
            <Input
              type="number"
              value={limitPrice}
              onChange={(e) => setLimitPrice(e.target.value)}
              placeholder="0.00"
              className="bg-card/50 border-white/10 text-white pr-16"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-white/60">
              USDT
            </span>
          </div>
        </div>
      )}

      {/* Stop Price Input */}
      {orderType === "stop" && (
        <div>
          <label className="text-sm text-white/60 mb-2 block">Stop Price</label>
          <div className="relative">
            <Input
              type="number"
              value={stopPrice}
              onChange={(e) => setStopPrice(e.target.value)}
              placeholder="0.00"
              className="bg-card/50 border-white/10 text-white pr-16"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-white/60">
              USDT
            </span>
          </div>
        </div>
      )}

      {/* Size Input */}
      <div>
        <label className="text-sm text-white/60 mb-2 block">Size</label>
        <div className="relative">
          <Input
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-card/50 border-white/10 text-white pr-16"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-white/60">
            USDT
          </span>
        </div>
      </div>

      {/* Percentage Buttons */}
      <div className="flex gap-2">
        {[25, 50, 75, 100].map((percent) => (
          <Button
            key={percent}
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => handlePercentageClick(percent)}
          >
            {percent}%
          </Button>
        ))}
      </div>

      {/* Buy / Sell Buttons */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <Button
          onClick={() => handleTrade("buy")}
          className="bg-green-500 hover:bg-green-600 text-white py-6 text-lg font-bold"
        >
          {tradeMode === "perpetual" ? "Buy Long" : "Buy"}
        </Button>
        <Button
          onClick={() => handleTrade("sell")}
          className="bg-red-500 hover:bg-red-600 text-white py-6 text-lg font-bold"
        >
          {tradeMode === "perpetual" ? "Sell Short" : "Sell"}
        </Button>
      </div>
    </div>
  );
}
