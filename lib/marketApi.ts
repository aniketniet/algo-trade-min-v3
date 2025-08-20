// Market API service with multiple data sources

interface MarketData {
  name: string
  value: string
  change: string
  changeType: 'positive' | 'negative'
  symbol: string
}

// Yahoo Finance API (no API key required)
export const fetchYahooFinanceData = async (): Promise<MarketData[]> => {
  try {
    const symbols = ['^NSEI', '^NSEBANK', '^CNXFIN']
    const promises = symbols.map(async (symbol) => {
      const response = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`)
      return response.json()
    })
    
    const results = await Promise.all(promises)
    
    const defaultData = [
      { name: "NIFTY", symbol: "NSE:NIFTY" },
      { name: "BNF", symbol: "NSE:BANKNIFTY" },
      { name: "FN", symbol: "NSE:CNXFINANCE" },
    ]
    
    return defaultData.map((item, index) => {
      const result = results[index]
      if (result && result.chart && result.chart.result && result.chart.result[0]) {
        const quote = result.chart.result[0].indicators.quote[0]
        const meta = result.chart.result[0].meta
        
        const currentPrice = meta.regularMarketPrice || quote.close[quote.close.length - 1]
        const previousClose = meta.previousClose || quote.close[quote.close.length - 2]
        const change = currentPrice - previousClose
        const changePercent = (change / previousClose) * 100
        
        return {
          ...item,
          value: currentPrice.toFixed(2),
          change: `${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}`,
          changeType: changePercent >= 0 ? 'positive' : 'negative'
        }
      }
      
      // Fallback data if API fails
      return {
        ...item,
        value: "0.00",
        change: "0.00",
        changeType: 'positive' as const
      }
    })
  } catch (error) {
    console.error('Yahoo Finance API error:', error)
    throw error
  }
}

// Alpha Vantage API (requires API key)
export const fetchAlphaVantageData = async (): Promise<MarketData[]> => {
  const API_KEY = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY
  if (!API_KEY) {
    throw new Error('Alpha Vantage API key not found')
  }
  
  try {
    const symbols = ['NIFTY.BSE', 'BANKNIFTY.BSE', 'CNXFINANCE.BSE']
    const promises = symbols.map(async (symbol) => {
      const response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`)
      return response.json()
    })
    
    const results = await Promise.all(promises)
    
    const defaultData = [
      { name: "NIFTY", symbol: "NSE:NIFTY" },
      { name: "BNF", symbol: "NSE:BANKNIFTY" },
      { name: "FN", symbol: "NSE:CNXFINANCE" },
    ]
    
    return defaultData.map((item, index) => {
      const result = results[index]
      if (result && result['Global Quote']) {
        const quote = result['Global Quote']
        const currentPrice = parseFloat(quote['05. price'])
        const change = parseFloat(quote['09. change'])
        const changePercent = parseFloat(quote['10. change percent'].replace('%', ''))
        
        return {
          ...item,
          value: currentPrice.toFixed(2),
          change: `${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}`,
          changeType: changePercent >= 0 ? 'positive' : 'negative'
        }
      }
      
      return {
        ...item,
        value: "0.00",
        change: "0.00",
        changeType: 'positive' as const
      }
    })
  } catch (error) {
    console.error('Alpha Vantage API error:', error)
    throw error
  }
}

// Mock data for development/testing
export const getMockData = (): MarketData[] => {
  return [
    { 
      name: "NIFTY", 
      value: (24687.70 + Math.random() * 100).toFixed(2), 
      change: (Math.random() > 0.5 ? '+' : '-') + (Math.random() * 2).toFixed(2), 
      changeType: Math.random() > 0.5 ? 'positive' : 'negative', 
      symbol: "NSE:NIFTY" 
    },
    { 
      name: "BNF", 
      value: (55861.40 + Math.random() * 200).toFixed(2), 
      change: (Math.random() > 0.5 ? '+' : '-') + (Math.random() * 3).toFixed(2), 
      changeType: Math.random() > 0.5 ? 'positive' : 'negative', 
      symbol: "NSE:BANKNIFTY" 
    },
    { 
      name: "FN", 
      value: (26417.10 + Math.random() * 150).toFixed(2), 
      change: (Math.random() > 0.5 ? '+' : '-') + (Math.random() * 2.5).toFixed(2), 
      changeType: Math.random() > 0.5 ? 'positive' : 'negative', 
      symbol: "NSE:CNXFINANCE" 
    },
  ]
}

// Main function to fetch market data with fallbacks
export const fetchMarketData = async (): Promise<MarketData[]> => {
  try {
    // Try Yahoo Finance first (no API key required)
    return await fetchYahooFinanceData()
  } catch (error) {
    console.log('Yahoo Finance failed, trying Alpha Vantage...')
    
    try {
      // Try Alpha Vantage as fallback
      return await fetchAlphaVantageData()
    } catch (alphaError) {
      console.log('Alpha Vantage failed, using mock data...')
      
      // Use mock data as final fallback
      return getMockData()
    }
  }
}
