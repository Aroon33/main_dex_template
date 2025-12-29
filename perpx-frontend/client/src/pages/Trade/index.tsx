/**
 * ============================================================
 * Trade Page – Single Source of Truth (IMPORTANT)
 * ============================================================
 *
 * ■ 接続ルール（絶対遵守）
 * ------------------------------------------------------------
 * - provider / account は必ず AccountContext から取得する
 * - BrowserProvider を新規生成しない
 * - window.ethereum を直接参照しない
 * - このファイルは「Tradeページの動作基準点」とする
 *
 * Data Flow:
 * Wallet (MetaMask)
 *   -> AccountContext (provider, account)
 *     -> Trade Page (this file)
 *
 * ■ 編集ルール
 * ------------------------------------------------------------
 * - 追加・変更する場合は「このファイルを丸ごとコピー」して作業する
 * - 差分追加は禁止（必ず上下数行を含めて置き換える）
 * - UI 分割は後続ステップで行う
 *
 * ============================================================
 */

import Header from "@/components/Header";
import TradingViewChart from "@/components/TradingViewChart";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, Star } from "lucide-react";
import { toast } from "sonner";

import { useLanguage } from "@/contexts/LanguageContext";
import { useAccount } from "@/contexts/AccountContext";

/* ============================================================
 * Constants
 * ============================================================
 */

const TRADING_PAIRS = [
  { symbol: "BTCUSDT", name: "Bitcoin", price: 111062.6, change: 3.17 },
  { symbol: "ETHUSDT", name: "Ethereum", price: 3842.5, change: 2.45 },
];

/* ============================================================
 * Trade Page (Entry)
 * ============================================================
 */

export default function Trade() {
  /* ---------------------------
   * Context (ONLY SOURCE)
   * --------------------------- */
  const { provider, account } = useAccount();
  const { t } = useLanguage();

  /* ---------------------------
   * Guard
   * --------------------------- */
  if (!provider || !account) {
    return null;
  }

  /* ---------------------------
   * State
   * --------------------------- */
  const [selectedPair, setSelectedPair] = useState(TRADING_PAIRS[0]);
  const [showPairSelector, setShowPairSelector] = useState(false);

  const [currentPrice, setCurrentPrice] = useState(selectedPair.price);
  const [priceChange, setPriceChange] = useState(selectedPair.change);

  const [tradeMode, setTradeMode] = useState<"perpetual" | "spot">("perpetual");
  const [orderType, setOrderType] = useState<"market" | "limit" | "stop">("market");

  const [amount, setAmount] = useState("");
  const [limitPrice, setLimitPrice] = useState("");
  const [stopPrice, setStopPrice] = useState("");

  const wsRef = useRef<WebSocket | null>(null);

  /* ---------------------------
   * Effect: Price (Binance WS)
   * --------------------------- */
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

  /* ---------------------------
   * Handlers
   * --------------------------- */
  const handleTrade = (side: "buy" | "sell") => {
    if (!amount || Number(amount) <= 0) {
      toast.error("Invalid amount");
      return;
    }
    toast.success(\`\${side.toUpperCase()} order submitted\`);
  };

  /* ============================================================
   * Render
   * ============================================================
   */

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Mode Switch */}
      <div className="flex border-b border-white/10">
        {["perpetual", "spot"].map((mode) => (
          <button
            key={mode}
            onClick={() => setTradeMode(mode as any)}
            className={\`flex-1 py-3 text-sm border-b-2 \${
              tradeMode === mode
                ? "border-primary text-white"
                : "border-transparent text-white/60"
            }\`}
          >
            {t(\`trade.\${mode}\`)}
          </button>
        ))}
      </div>

      {/* Pair Selector */}
      <div className="p-3 border-b border-white/10">
        <button
          onClick={() => setShowPairSelector(!showPairSelector)}
          className="flex items-center gap-2"
        >
          <Star className="h-4 w-4 text-yellow-500" />
          <span>{selectedPair.symbol}</span>
          <ChevronDown className="h-4 w-4" />
        </button>
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

      {/* Chart */}
      <div className="h-[300px] border-b border-white/10">
        <TradingViewChart symbol={selectedPair.symbol} mode={tradeMode} />
      </div>

      {/* Order Panel */}
      <div className="p-4 space-y-3 flex-1 overflow-y-auto">
        <div className="flex gap-2">
          {["market", "limit", "stop"].map((t) => (
            <button
              key={t}
              onClick={() => setOrderType(t as any)}
              className={\`flex-1 py-2 \${
                orderType === t ? "bg-primary text-white" : "text-white/60"
              }\`}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>

        {orderType !== "market" && (
          <Input
            value={limitPrice}
            onChange={(e) => setLimitPrice(e.target.value)}
            placeholder="Price"
          />
        )}

        {orderType === "stop" && (
          <Input
            value={stopPrice}
            onChange={(e) => setStopPrice(e.target.value)}
            placeholder="Stop Price"
          />
        )}

        <Input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
        />

        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button
            onClick={() => handleTrade("buy")}
            className="bg-green-500 text-white py-6"
          >
            BUY
          </Button>
          <Button
            onClick={() => handleTrade("sell")}
            className="bg-red-500 text-white py-6"
          >
            SELL
          </Button>
        </div>
      </div>
    </div>
  );
}
