/**
 * ============================================================
 * TradeHeader
 * ============================================================
 *
 * Role:
 * - Global Header
 * - Perpetual / Spot mode switch
 *
 * ============================================================
 */

import Header from "@/components/Header";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function TradeHeader() {
  const { t } = useLanguage();
  const [tradeMode, setTradeMode] = useState<"perpetual" | "spot">("perpetual");

  return (
    <>
      <Header />

      <div className="bg-card/50 border-b border-white/5">
        <div className="flex">
          {["perpetual", "spot"].map((mode) => (
            <button
              key={mode}
              onClick={() => setTradeMode(mode as any)}
              className={`flex-1 py-3 text-sm font-medium border-b-2 ${
                tradeMode === mode
                  ? "border-primary text-white"
                  : "border-transparent text-white/60"
              }`}
            >
              {t(`trade.${mode}`)}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
