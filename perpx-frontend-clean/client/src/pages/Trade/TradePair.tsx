/**
 * ============================================================
 * TradePair (SSOT: pairs.json)
 * ============================================================
 *
 * - Trading pair selector
 * - Real-time price display (Binance WebSocket)
 * - Pair list from /api/pairs.json (enabled only)
 *
 * ============================================================
 */

import { useState, useEffect, useRef } from "react";
import { ChevronDown, Star } from "lucide-react";
import { usePairs } from "@/hooks/usePairs";

/* =========================
 * Types
 * ========================= */

type Props = {
  symbol: string;
  onChange: (symbol: string) => void;
};

/* =========================
 * Component
 * ========================= */

export default function TradePair({ symbol, onChange }: Props) {
  const { pairs, loading } = usePairs();
  const [showPairSelector, setShowPairSelector] = useState(false);

  const [currentPrice, setCurrentPrice] = useState(0);
  const [priceChange, setPriceChange] = useState(0);

  const wsRef = useRef<WebSocket | null>(null);

  /* =========================
   * WebSocket: price ticker
   * ========================= */
  useEffect(() => {
    if (!symbol) return;

    // Binance uses e.g. BTCUSDT
    const wsSymbol = `${symbol.toLowerCase()}usdt`;
    const wsUrl = `wss://stream.binance.com:9443/ws/${wsSymbol}@ticker`;

    if (wsRef.current) {
      wsRef.current.close();
    }

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setCurrentPrice(parseFloat(data.c));
        setPriceChange(parseFloat(data.P));
      } catch {
        // ignore parse error
      }
    };

    return () => {
      ws.close();
    };
  }, [symbol]);

  /* =========================
   * Auto-select first pair
   * ========================= */
  useEffect(() => {
    if (!loading && pairs.length > 0 && !pairs.find(p => p.symbol === symbol)) {
      onChange(pairs[0].symbol);
    }
  }, [loading, pairs, symbol, onChange]);

  const currentPair = pairs.find(p => p.symbol === symbol);

  /* =========================
   * Render
   * ========================= */

  return (
    <>
      {/* ===== Pair Selector Header ===== */}
      <div className="bg-card/50 border-b border-white/5 p-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowPairSelector(!showPairSelector)}
            className="flex items-center gap-2 hover:bg-white/5 rounded-lg p-2 transition-colors"
          >
            <Star className="h-4 w-4 text-yellow-500" />
            <span className="text-white font-bold">
              {currentPair?.display ?? symbol}
            </span>
            <ChevronDown className="h-4 w-4 text-white/60" />
          </button>

          <div className="text-right">
            <div className="text-2xl font-bold text-white">
              {currentPrice
                ? currentPrice.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                : "--"}
            </div>
            <div
              className={`text-sm ${
                priceChange >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {priceChange >= 0 ? "+" : ""}
              {priceChange.toFixed(2)}%
            </div>
          </div>
        </div>
      </div>

      {/* ===== Pair Selector Dropdown ===== */}
      {showPairSelector && (
        <div className="bg-card border-b border-white/5 max-h-60 overflow-y-auto">
          {pairs.map((pair) => (
            <button
              key={pair.symbol}
              onClick={() => {
                onChange(pair.symbol);
                setShowPairSelector(false);
              }}
              className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition-colors border-b border-white/5"
            >
              <div className="flex items-center gap-2">
                <Star
                  className={`h-4 w-4 ${
                    pair.symbol === symbol
                      ? "text-yellow-500"
                      : "text-white/20"
                  }`}
                />
                <div className="text-left">
                  <div className="text-white font-medium">
                    {pair.display}
                  </div>
                  <div className="text-xs text-white/60">
                    {pair.symbol}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </>
  );
}
