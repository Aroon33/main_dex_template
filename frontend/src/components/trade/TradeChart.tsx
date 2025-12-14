"use client";

import dynamic from "next/dynamic";

const TVChart = dynamic(
  () => import("@/src/components/TradingViewChart"),
  { ssr: false }
);

export default function TradeChart() {
  return (
    <div className="h-full">
      <TVChart symbol="BTCUSD" />
    </div>
  );
}
