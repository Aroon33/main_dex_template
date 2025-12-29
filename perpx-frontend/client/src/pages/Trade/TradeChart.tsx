/**
 * ============================================================
 * TradeChart
 * ============================================================
 *
 * Role:
 * - TradingView chart wrapper
 *
 * ============================================================
 */

import TradingViewChart from "@/components/TradingViewChart";

export default function TradeChart() {
  return (
    <div
      className="flex-shrink-0 bg-card/30 border-b border-white/5"
      style={{ height: "300px" }}
    >
      <TradingViewChart symbol="BTCUSDT" mode="perpetual" />
    </div>
  );
}
