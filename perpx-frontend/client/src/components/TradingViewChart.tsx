import { useEffect, useRef, memo } from 'react';

interface TradingViewChartProps {
  symbol?: string;
  mode?: 'perpetual' | 'spot';
  onPriceUpdate?: (price: number) => void;
}

function TradingViewChart({ symbol = 'BTCUSDT', mode = 'perpetual', onPriceUpdate }: TradingViewChartProps) {
  const container = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<any>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const priceIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!container.current) return;

    let isMounted = true;

    // Clear previous widget
    if (container.current) {
      container.current.innerHTML = '';
    }

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.type = 'text/javascript';
    scriptRef.current = script;
    
    script.onload = () => {
      if (!isMounted) return;
      if (typeof (window as any).TradingView !== 'undefined' && container.current) {
        // Format symbol for TradingView
        const formattedSymbol = mode === 'perpetual' 
          ? `BINANCE:${symbol}`
          : `BINANCE:${symbol}`;

        try {
          widgetRef.current = new (window as any).TradingView.widget({
            autosize: true,
            symbol: formattedSymbol,
            interval: '15',
            timezone: 'Asia/Tokyo',
            theme: 'dark',
            style: '1',
            locale: 'en',
            toolbar_bg: '#0a0e1a',
            enable_publishing: false,
            hide_side_toolbar: false,
            allow_symbol_change: true,
            container_id: 'tradingview_widget',
            backgroundColor: '#0a0e1a',
            gridColor: 'rgba(255, 255, 255, 0.06)',
            hide_top_toolbar: false,
            save_image: false,
            studies: [],
            disabled_features: [
              'use_localstorage_for_settings',
              'header_symbol_search',
            ],
            enabled_features: [
              'study_templates',
              'side_toolbar_in_fullscreen_mode',
            ],
            overrides: {
              'paneProperties.background': '#0a0e1a',
              'paneProperties.backgroundType': 'solid',
              'paneProperties.vertGridProperties.color': 'rgba(255, 255, 255, 0.06)',
              'paneProperties.horzGridProperties.color': 'rgba(255, 255, 255, 0.06)',
              'scalesProperties.textColor': '#AAA',
              'mainSeriesProperties.candleStyle.upColor': '#22c55e',
              'mainSeriesProperties.candleStyle.downColor': '#ef4444',
              'mainSeriesProperties.candleStyle.borderUpColor': '#22c55e',
              'mainSeriesProperties.candleStyle.borderDownColor': '#ef4444',
              'mainSeriesProperties.candleStyle.wickUpColor': '#22c55e',
              'mainSeriesProperties.candleStyle.wickDownColor': '#ef4444',
            },
          });

          // ✅ NEW: Poll for price updates every 2 seconds
          if (widgetRef.current && onPriceUpdate) {
            widgetRef.current.onChartReady(() => {
              const chart = widgetRef.current.activeChart();
              
              // Function to get latest price
              const updatePrice = () => {
                try {
                  const bars = chart.getSeries().data();
                  if (bars && bars.length > 0) {
                    const latestBar = bars[bars.length - 1];
                    if (latestBar && latestBar.close) {
                      onPriceUpdate(latestBar.close);
                    }
                  }
                } catch (error) {
                  console.warn('Failed to get price:', error);
                }
              };

              // Get initial price
              updatePrice();

              // Poll for price updates every 2 seconds
              priceIntervalRef.current = setInterval(updatePrice, 2000);
            });
          }
        } catch (error) {
          console.error('TradingView widget creation error:', error);
        }
      }
    };

    document.head.appendChild(script);

    return () => {
      isMounted = false;
      
      // Clear price polling interval
      if (priceIntervalRef.current) {
        clearInterval(priceIntervalRef.current);
        priceIntervalRef.current = null;
      }
      
      // Safely remove widget
      if (widgetRef.current) {
        try {
          const widgetContainer = document.getElementById('tradingview_widget');
          if (widgetContainer && widgetContainer.parentNode && typeof widgetRef.current.remove === 'function') {
            widgetRef.current.remove();
          }
        } catch (error) {
          console.warn('TradingView widget cleanup warning:', error);
        }
        widgetRef.current = null;
      }
      
      // Remove script
      if (scriptRef.current && scriptRef.current.parentNode) {
        try {
          scriptRef.current.parentNode.removeChild(scriptRef.current);
        } catch (error) {
          console.warn('Script cleanup warning:', error);
        }
      }
    };
  }, [symbol, mode, onPriceUpdate]);

  return (
    <div
      id="tradingview_widget"
      ref={container}
      className="w-full h-full"
      style={{ minHeight: '400px' }}
    />
  );
}

export default memo(TradingViewChart);
