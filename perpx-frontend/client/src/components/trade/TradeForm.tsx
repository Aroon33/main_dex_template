/**
 * ============================================================
 * TradeForm
 * ============================================================
 *
 * Role:
 * - Open position (market)
 *
 * Rule:
 * - UI ONLY (no blockchain logic)
 * - Use WRITE hook only
 *
 * ============================================================
 */

"use client";

import { useState } from "react";
import { useOpenPosition } from "@/hooks/trade";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Props = {
  symbol: string; // e.g. "tUSD"
};

export default function TradeForm({ symbol }: Props) {
  const { openPosition, loading, error } = useOpenPosition();
  const [sizeUsd, setSizeUsd] = useState("");

  const onLong = async () => {
    await openPosition({
      symbol,
      sizeUsd: Number(sizeUsd),
    });
    setSizeUsd("");
  };

  const onShort = async () => {
    await openPosition({
      symbol,
      sizeUsd: -Number(sizeUsd),
    });
    setSizeUsd("");
  };

  return (
    <Card className="p-4 space-y-3">
      <div className="font-medium">Open Position</div>

      <input
        className="w-full border rounded px-2 py-1 text-sm"
        placeholder="Size (USD)"
        value={sizeUsd}
        onChange={(e) => setSizeUsd(e.target.value)}
      />

      <div className="flex gap-2">
        <Button
          className="flex-1"
          disabled={loading || !sizeUsd}
          onClick={onLong}
        >
          Long
        </Button>

        <Button
          className="flex-1"
          variant="destructive"
          disabled={loading || !sizeUsd}
          onClick={onShort}
        >
          Short
        </Button>
      </div>

      {error && (
        <div className="text-xs text-red-500">
          {error}
        </div>
      )}
    </Card>
  );
}
