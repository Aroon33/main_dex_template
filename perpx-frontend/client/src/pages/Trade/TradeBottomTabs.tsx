/**
 * ============================================================
 * TradeBottomTabs
 * ============================================================
 *
 * Role:
 * - Positions / Orders / History / Trades
 *
 * ============================================================
 */

import { useState } from "react";
import { Card } from "@/components/ui/card";

export default function TradeBottomTabs() {
  const [activeTab, setActiveTab] = useState<
    "positions" | "orders" | "history" | "trades"
  >("positions");

  return (
    <div className="bg-card/50 border-t border-white/5">
      <div className="flex">
        {[
          { key: "positions", label: "Positions" },
          { key: "orders", label: "Orders" },
          { key: "history", label: "History" },
          { key: "trades", label: "Trades" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex-1 py-3 text-sm border-b-2 ${
              activeTab === tab.key
                ? "border-primary text-white"
                : "border-transparent text-white/60"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-4 min-h-[200px] max-h-[300px] overflow-y-auto">
        <Card className="p-3 bg-card/50 border-white/10">
          {activeTab.toUpperCase()} CONTENT
        </Card>
      </div>
    </div>
  );
}
