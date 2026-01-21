/**
 * ============================================================
 * TradeChart
 * ============================================================
 *
 * Role:
 * - TradingView chart section
 *
 * Rule:
 * - JSX / className / style MUST match Trade1.tsx
 * - Design changes are NOT allowed here
 *
 * ============================================================
 */

import TradingViewChart from "@/components/TradingViewChart";

type Props = {
  symbol: string;
  mode: "perpetual" | "spot";
};

export default function TradeChart({ symbol, mode }: Props) {
  return (
    <div
      className="flex-shrink-0 bg-card/30 border-b border-white/5"
      style={{ height: "300px" }}
    >
      <TradingViewChart symbol={symbol} mode={mode} />
    </div>
  );
}
