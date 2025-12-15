"use client";

type Props = {
  symbol: string;
};

export default function TradeHeader({ symbol }: Props) {
  return (
    <div className="h-12 flex items-center justify-between px-4 border-b border-white/10 bg-[#0B0E11]">
      <div className="text-sm font-semibold text-white">
        {symbol}
      </div>

      <div className="text-xs text-white/50">
        Perpetual
      </div>
    </div>
  );
}
