/**
 * ============================================================
 * TradeOrder
 * ============================================================
 *
 * Role:
 * - Order type
 * - Amount / price input
 * - BUY / SELL buttons
 *
 * ============================================================
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function TradeOrder() {
  const [orderType, setOrderType] = useState<"market" | "limit" | "stop">("market");
  const [amount, setAmount] = useState("");
  const [limitPrice, setLimitPrice] = useState("");
  const [stopPrice, setStopPrice] = useState("");

  const handleTrade = (side: "buy" | "sell") => {
    if (!amount || Number(amount) <= 0) {
      toast.error("Invalid amount");
      return;
    }
    toast.success(`${side.toUpperCase()} order submitted`);
  };

  return (
    <div className="p-4 space-y-4 flex-1 overflow-y-auto">
      <div className="flex gap-2 bg-card/30 rounded-lg p-1">
        {["market", "limit", "stop"].map((t) => (
          <button
            key={t}
            onClick={() => setOrderType(t as any)}
            className={`flex-1 py-2 rounded-md ${
              orderType === t ? "bg-primary text-white" : "text-white/60"
            }`}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {orderType !== "market" && (
        <Input
          value={limitPrice}
          onChange={(e) => setLimitPrice(e.target.value)}
          placeholder="Price"
        />
      )}

      {orderType === "stop" && (
        <Input
          value={stopPrice}
          onChange={(e) => setStopPrice(e.target.value)}
          placeholder="Stop Price"
        />
      )}

      <Input
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
      />

      <div className="grid grid-cols-2 gap-3 pt-2">
        <Button
          onClick={() => handleTrade("buy")}
          className="bg-green-500 hover:bg-green-600 text-white py-6 text-lg font-bold"
        >
          BUY
        </Button>
        <Button
          onClick={() => handleTrade("sell")}
          className="bg-red-500 hover:bg-red-600 text-white py-6 text-lg font-bold"
        >
          SELL
        </Button>
      </div>
    </div>
  );
}
