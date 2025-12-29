/**
 * ============================================================
 * TradePair
 * ============================================================
 *
 * Role:
 * - Trading pair selector
 * - Real-time price display (Binance WS)
 *
 * Connection Rule:
 * - provider / account are NOT handled here
 * - This component is UI + local state only
 *
 * ============================================================
 */

import { useState, useEffect, useRef } from "react";
import { ChevronDown, Star } from "lucide-react";

const TRADING_PAIRS = [
  { symbol: "BTCUSDT", name: "Bitcoin", price: 111062.6, change: 3.17 },
  { symbol: "ETHUSDT", name: "Ethereum", price: 3842.5, change: 2.45 },
];

export default function TradePair() {
  const [selectedPair, setSelectedPair] = useState(TRADING_PAIRS[0]);
  const [showPairSelector, setShowPairSelector] = useState(false);

  const [currentPrice, setCurrentPrice] = useState(selectedPair.price);
  const [priceChange, setPriceChange] = useState(selectedPair.change);

  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const symbol = selectedPair.symbol.toLowerCase();
    const ws = new WebSocket(
      `wss://stream.binance.com:9443/ws/${symbol}@ticker`
    );

    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setCurrentPrice(parseFloat(data.c));
        setPriceChange(parseFloat(data.P));
      } catch {}
    };

    return () => ws.close();
  }, [selectedPair.symbol]);

  return (
    <>
      <div className="p-3 border-b border-white/10">
        <button
          onClick={() => setShowPairSelector(!showPairSelector)}
          className="flex items-center gap-2"
        >
          <Star className="h-4 w-4 text-yellow-500" />
          <span className="text-white font-bold">{selectedPair.symbol}</span>
          <ChevronDown className="h-4 w-4 text-white/60" />
        </button>

        <div className="text-right mt-2">
          <div className="text-2xl font-bold text-white">
            {currentPrice.toLocaleString()}
          </div>
          <div className={priceChange >= 0 ? "text-green-500" : "text-red-500"}>
            {priceChange >= 0 ? "+" : ""}
            {priceChange.toFixed(2)}%
          </div>
        </div>
      </div>

      {showPairSelector && (
        <div className="border-b border-white/10">
          {TRADING_PAIRS.map((p) => (
            <button
              key={p.symbol}
              onClick={() => {
                setSelectedPair(p);
                setCurrentPrice(p.price);
                setPriceChange(p.change);
                setShowPairSelector(false);
              }}
              className="block w-full p-3 text-left hover:bg-white/5"
            >
              {p.symbol}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
