import { useEffect, useRef, memo } from "react";

interface TradingViewChartProps {
  symbol?: string;
  mode?: "perpetual" | "spot";
  onPriceUpdate?: (price: number) => void;
}

function TradingViewChart({
  symbol = "BTCUSDT",
  mode = "perpetual",
  onPriceUpdate,
}: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<any>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const priceIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let isMounted = true;

    // clear container
    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.type = "text/javascript";
    scriptRef.current = script;

    script.onload = () => {
      if (!isMounted || !(window as any).TradingView || !containerRef.current) {
        return;
      }

      const formattedSymbol = `BINANCE:${symbol}`;

      widgetRef.current = new (window as any).TradingView.widget({
        container: containerRef.current,   // ← これが最重要
        width: "100%",
        height: "100%",
        symbol: formattedSymbol,
        interval: "15",
        timezone: "Asia/Tokyo",
        theme: "dark",
        style: "1",
        locale: "en",
        toolbar_bg: "#0a0e1a",
        enable_publishing: false,
        hide_top_toolbar: false,
        save_image: false,
        disabled_features: [
          "use_localstorage_for_settings",
          "header_symbol_search",
        ],
        overrides: {
          "paneProperties.background": "#0a0e1a",
          "paneProperties.backgroundType": "solid",
        },
      });
    };

    document.head.appendChild(script);

    return () => {
      isMounted = false;

      if (priceIntervalRef.current) {
        clearInterval(priceIntervalRef.current);
        priceIntervalRef.current = null;
      }

      if (widgetRef.current && typeof widgetRef.current.remove === "function") {
        widgetRef.current.remove();
        widgetRef.current = null;
      }

      if (scriptRef.current?.parentNode) {
        scriptRef.current.parentNode.removeChild(scriptRef.current);
      }
    };
  }, [symbol, mode, onPriceUpdate]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{ minHeight: "400px" }}
    />
  );
}

export default memo(TradingViewChart);
