"use client"

import React, { useEffect, useRef, memo } from 'react';

function TradingViewMarketOverview() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
      {
        "colorTheme": "light",
        "dateRange": "12M",
        "locale": "en",
        "largeChartUrl": "",
        "isTransparent": false,
        "showFloatingTooltip": false,
        "plotLineColorGrowing": "rgba(41, 98, 255, 1)",
        "plotLineColorFalling": "rgba(41, 98, 255, 1)",
        "gridLineColor": "rgba(240, 243, 250, 0)",
        "scaleFontColor": "#DBDBDB",
        "belowLineFillColorGrowing": "rgba(41, 98, 255, 0.12)",
        "belowLineFillColorFalling": "rgba(41, 98, 255, 0.12)",
        "belowLineFillColorGrowingBottom": "rgba(41, 98, 255, 0)",
        "belowLineFillColorFallingBottom": "rgba(41, 98, 255, 0)",
        "symbolActiveColor": "rgba(41, 98, 255, 0.12)",
        "tabs": [
          {
            "title": "Indices",
            "symbols": [
              {
                "s": "FOREXCOM:SPXUSD",
                "d": "S&P 500 Index"
              },
              {
                "s": "FOREXCOM:NSXUSD",
                "d": "US 100 Cash CFD"
              },
              {
                "s": "FOREXCOM:DJI",
                "d": "Dow Jones Industrial Average Index"
              },
              {
                "s": "INDEX:NKY",
                "d": "Japan 225"
              },
              {
                "s": "INDEX:DEU40",
                "d": "DAX Index"
              },
              {
                "s": "FOREXCOM:UKXGBP",
                "d": "FTSE 100 Index"
              }
            ],
            "originalTitle": "Indices"
          },
          {
            "title": "Futures",
            "symbols": [
              {
                "s": "BMFBOVESPA:ISP1!",
                "d": "S&P 500"
              },
              {
                "s": "BMFBOVESPA:EUR1!",
                "d": "Euro"
              },
              {
                "s": "CMCMARKETS:GOLD",
                "d": "Gold"
              },
              {
                "s": "PYTH:WTI3!",
                "d": "WTI Crude Oil"
              },
              {
                "s": "BMFBOVESPA:CCM1!",
                "d": "Corn"
              }
            ],
            "originalTitle": "Futures"
          },
          {
            "title": "Bonds",
            "symbols": [
              {
                "s": "EUREX:FGBL1!",
                "d": "Euro Bund"
              },
              {
                "s": "EUREX:FBTP1!",
                "d": "Euro BTP"
              },
              {
                "s": "EUREX:FGBM1!",
                "d": "Euro BOBL"
              }
            ],
            "originalTitle": "Bonds"
          },
          {
            "title": "Forex",
            "symbols": [
              {
                "s": "FX:EURUSD",
                "d": "EUR to USD"
              },
              {
                "s": "FX:GBPUSD",
                "d": "GBP to USD"
              },
              {
                "s": "FX:USDJPY",
                "d": "USD to JPY"
              },
              {
                "s": "FX:USDCHF",
                "d": "USD to CHF"
              },
              {
                "s": "FX:AUDUSD",
                "d": "AUD to USD"
              },
              {
                "s": "FX:USDCAD",
                "d": "USD to CAD"
              }
            ],
            "originalTitle": "Forex"
          }
        ],
        "support_host": "https://www.tradingview.com",
        "backgroundColor": "#ffffff",
        "width": "100%",
        "height": "600",
        "showSymbolLogo": true,
        "showChart": true
      }`;
    
    container.current.appendChild(script);

    return () => {
      if (container.current) {
        const scripts = container.current.querySelectorAll('script');
        scripts.forEach(script => script.remove());
      }
    };
  }, []);

  return (
    <div className="tradingview-widget-container" ref={container} style={{ height: "600px", width: "100%" }}>
      <div className="tradingview-widget-container__widget" style={{ height: "calc(100% - 32px)", width: "100%" }}></div>
      <div className="tradingview-widget-copyright">
        <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
          <span className="blue-text">Market data by TradingView</span>
        </a>
      </div>
    </div>
  );
}

export default memo(TradingViewMarketOverview);
