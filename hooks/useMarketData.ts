"use client"

import { useState, useEffect } from 'react'
import { fetchMarketData } from '@/lib/marketApi'

interface MarketData {
  name: string
  value: string
  change: string
  changeType: 'positive' | 'negative'
  symbol: string
}

export const useMarketData = () => {
  const [marketData, setMarketData] = useState<MarketData[]>([
    { name: "NIFTY", value: "24687.70", change: "-0.25", changeType: "negative", symbol: "NSE:NIFTY" },
    { name: "BNF", value: "55861.40", change: "+0.20", changeType: "positive", symbol: "NSE:BANKNIFTY" },
    { name: "FN", value: "26417.10", change: "-0.31", changeType: "negative", symbol: "NSE:CNXFINANCE" },
  ])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await fetchMarketData()
      setMarketData(data)
    } catch (err) {
      console.error('Error fetching market data:', err)
      setError('Failed to fetch market data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    
    // Update every 30 seconds during market hours
    const interval = setInterval(() => {
      const now = new Date()
      const day = now.getDay()
      const hour = now.getHours()
      
      // Only update during market hours (Monday-Friday, 9:00 AM - 3:30 PM IST)
      if (day >= 1 && day <= 5 && hour >= 9 && hour < 16) {
        fetchData()
      }
    }, 30000)
    
    return () => clearInterval(interval)
  }, [])

  return { marketData, loading, error, refetch: fetchData }
}
