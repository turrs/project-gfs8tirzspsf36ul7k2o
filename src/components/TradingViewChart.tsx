import React, { useEffect, useRef, useState } from 'react';

const getTradingViewSymbol = (fromToken, toToken) => {
  if (!fromToken) return 'BINANCE:SOLUSDT';
  return `BINANCE:${fromToken.symbol}USDT`;
};

const TradingViewChart = ({ fromToken, toToken }) => {
  const container = useRef(null);
  const [chartVisible, setChartVisible] = useState(true);

  useEffect(() => {
    setChartVisible(true); // Reset visibility on token change
    if (!container.current) return;
    container.current.innerHTML = '';
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      // @ts-ignore
      if (window.TradingView) {
        try {
          // @ts-ignore
          new window.TradingView.widget({
            autosize: true,
            symbol: getTradingViewSymbol(fromToken, toToken),
            interval: '1',
            timezone: 'Etc/UTC',
            theme: 'dark',
            style: '1',
            locale: 'en',
            toolbar_bg: '#1C1C28',
            enable_publishing: false,
            hide_top_toolbar: false,
            hide_legend: false,
            withdateranges: true,
            allow_symbol_change: true,
            details: true,
            hotlist: true,
            calendar: true,
            container_id: container.current.id,
            // Add error handler for symbol not found
            error: () => setChartVisible(false),
          });
        } catch {
          setChartVisible(false);
        }
      } else {
        setChartVisible(false);
      }
    };
    script.onerror = () => setChartVisible(false);
    container.current.appendChild(script);
  }, [fromToken, toToken]);

  if (!chartVisible) return null;

  return (
    <div className="w-full h-[500px] bg-[#1C1C28] rounded-2xl border border-[#2A2A3A] overflow-hidden">
      <div id="tradingview_chart_container" ref={container} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default TradingViewChart; 