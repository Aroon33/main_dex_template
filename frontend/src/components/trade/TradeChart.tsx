"use client";

import dynamic from "next/dynamic";

const TradingViewChart = dynamic(
  () => import("@/src/components/TradingViewChart"),
  { ssr: false }
);

type Props = {
  symbol: string;
};

export default function TradeChart({ symbol }: Props) {
  return (
    <div className="h-full w-full">
      <TradingViewChart symbol={symbol} />
    </div>
  );
}
