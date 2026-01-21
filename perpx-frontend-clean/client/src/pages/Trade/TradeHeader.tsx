/**
 * ============================================================
 * TradeHeader
 * ============================================================
 *
 * Role:
 * - Global Header
 * - Perpetual / Spot mode switch
 *
 * Rule:
 * - JSX / className / order MUST match Trade1.tsx
 * - Design changes are NOT allowed here
 *
 * ============================================================
 */

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function TradeHeader() {
  const { t } = useLanguage();
  const [tradeMode, setTradeMode] = useState<"perpetual" | "spot">("perpetual");

  return (
    <>
    

      {/* Perpetual/Spot Tabs */}
      <div className="bg-card/50 border-b border-white/5">
        <div className="flex">
          <button
            onClick={() => setTradeMode("perpetual")}
            className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${
              tradeMode === "perpetual"
                ? "border-primary text-white"
                : "border-transparent text-white/60"
            }`}
          >
            {t("trade.perpetual")}
          </button>

          <button
            onClick={() => setTradeMode("spot")}
            className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${
              tradeMode === "spot"
                ? "border-primary text-white"
                : "border-transparent text-white/60"
            }`}
          >
            {t("trade.spot")}
          </button>
        </div>
      </div>
    </>
  );
}
