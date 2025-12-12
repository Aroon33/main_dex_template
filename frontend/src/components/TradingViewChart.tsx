"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    TradingView: any;
  }
}

export default function TradingViewChart({ symbol = "ETHUSD" }) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.onload = () => {
      // ← ここで再度チェックするのが重要！
      if (!container.current) return;

      new window.TradingView.widget({
        autosize: true,
        symbol,
        interval: "60",
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        locale: "en",
        toolbar_bg: "#000000",
        container_id: container.current.id, // ← ここでTSがOKになる
      });
    };

    document.body.appendChild(script);
  }, [symbol]);

  return <div id="tv_chart" className="h-[600px]" ref={container}></div>;
}
