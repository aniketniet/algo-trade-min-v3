"use client"

import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'

interface MarketData {
  name: string
  value: string
  change: string
  changeType: 'positive' | 'negative'
  symbol: string
  fullName?: string
  lastPrice?: number
  previousClose?: number
  dayChange?: string
  dayChangePercent?: string
  volume?: number
  timestamp?: string
  error?: string
}

interface MarketStatus {
  isOpen: boolean
  nextOpen: string
  currentTime: string
  timezone: string
}

interface MarketDataResponse {
  Status: string
  Message: string
  Data: {
    indices: MarketData[]
    timestamp: string
    source: string
    marketStatus: MarketStatus
  }
}

export const useRealTimeMarketData = () => {
  const [marketData, setMarketData] = useState<MarketData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [marketStatus, setMarketStatus] = useState<MarketStatus | null>(null)
  const [lastUpdate, setLastUpdate] = useState<string | null>(null)

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_LOCAL_URL || "http://103.189.173.82:4000/api"

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const token = Cookies.get("token")
      if (!token) {
        throw new Error("Authentication token not found")
      }

      const response = await axios.get(
        `${API_BASE_URL}/market-data/indices`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.data.Status === "Success") {
        const data = response.data.Data
        setMarketData(data.indices)
        setMarketStatus(data.marketStatus)
        setLastUpdate(data.timestamp)
      } else {
        throw new Error(response.data.Message || "Failed to fetch market data")
      }
    } catch (err: any) {
      console.error('Error fetching market data:', err)
      setError(err?.response?.data?.Message || err.message || 'Failed to fetch market data')
      
      // Fallback to static data if API fails
      setMarketData([
        { name: "NIFTY", value: "24687.70", change: "-0.25", changeType: "negative", symbol: "NSE:NIFTY" },
        { name: "BNF", value: "55861.40", change: "+0.20", changeType: "positive", symbol: "NSE:BANKNIFTY" },
        { name: "FN", value: "26417.10", change: "-0.31", changeType: "negative", symbol: "NSE:CNXFINANCE" },
      ])
    } finally {
      setLoading(false)
    }
  }, [API_BASE_URL])

  useEffect(() => {
    // Initial fetch
    fetchData()
    
    // Set up real-time updates
    let interval: NodeJS.Timeout | null = null
    
    const setupInterval = () => {
      // Clear existing interval
      if (interval) {
        clearInterval(interval)
      }
      
      // Set up new interval based on market status
      if (marketStatus?.isOpen) {
        // Market is open - update every 5 seconds for real-time data
        interval = setInterval(fetchData, 5000)
      } else {
        // Market is closed - update every 30 seconds
        interval = setInterval(fetchData, 30000)
      }
    }
    
    // Set up initial interval
    setupInterval()
    
    // Re-setup interval when market status changes
    const statusCheckInterval = setInterval(() => {
      const now = new Date()
      const istTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}))
      const day = istTime.getDay()
      const hour = istTime.getHours()
      const minute = istTime.getMinutes()
      const currentTime = hour * 100 + minute
      
      const marketStart = 915 // 9:15 AM
      const marketEnd = 1530 // 3:30 PM
      const isWeekday = day >= 1 && day <= 5
      const isMarketHours = currentTime >= marketStart && currentTime <= marketEnd
      const isMarketOpen = isWeekday && isMarketHours
      
      // If market status changed, re-setup interval
      if (marketStatus?.isOpen !== isMarketOpen) {
        setupInterval()
      }
    }, 60000) // Check every minute
    
    return () => {
      if (interval) {
        clearInterval(interval)
      }
      clearInterval(statusCheckInterval)
    }
  }, [fetchData, marketStatus?.isOpen])

  // Manual refresh function
  const refresh = useCallback(() => {
    fetchData()
  }, [fetchData])

  // Get single index data
  const getSingleIndex = useCallback(async (symbol: string) => {
    try {
      const token = Cookies.get("token")
      if (!token) {
        throw new Error("Authentication token not found")
      }

      const response = await axios.get(
        `${API_BASE_URL}/market-data/indices/${symbol}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.data.Status === "Success") {
        return response.data.Data
      } else {
        throw new Error(response.data.Message || "Failed to fetch index data")
      }
    } catch (err: any) {
      console.error('Error fetching single index data:', err)
      throw err
    }
  }, [API_BASE_URL])

  return { 
    marketData, 
    loading, 
    error, 
    marketStatus,
    lastUpdate,
    refresh,
    getSingleIndex
  }
}

