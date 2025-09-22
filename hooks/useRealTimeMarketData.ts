"use client"

import { useState, useEffect, useRef, useCallback } from 'react'

interface MarketData {
  name: string
  value: string
  change: string
  changeType: 'positive' | 'negative'
  symbol: string
  token?: string
  timestamp?: string
}

interface WebSocketMessage {
  type: string
  data: MarketData | MarketData[]
}

interface UseRealTimeMarketDataReturn {
  marketData: MarketData[]
  loading: boolean
  error: string | null
  isConnected: boolean
  lastUpdate: Date | null
  reconnect: () => void
}

export const useRealTimeMarketData = (): UseRealTimeMarketDataReturn => {
  const [marketData, setMarketData] = useState<MarketData[]>([
    { name: "NIFTY50", value: "0.00", change: "0.00", changeType: "positive", symbol: "NSE:NIFTY50" },
    { name: "BANKNIFTY", value: "0.00", change: "0.00", changeType: "positive", symbol: "NSE:BANKNIFTY" },
    { name: "FINNIFTY", value: "0.00", change: "0.00", changeType: "positive", symbol: "NSE:FINNIFTY" },
  ])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const reconnectAttempts = useRef(0)
  const maxReconnectAttempts = 5
  const reconnectDelay = 3000

  const connect = useCallback(() => {
    try {
      setError(null)
      
      // Determine WebSocket URL based on environment
      const wsUrl = process.env.NODE_ENV === 'production' 
        ? `wss://https://algotradexmind.com/server/api/ws/market-data`
        : 'ws://localhost:4000/ws/market-data'
      
      console.log('[WS] Connecting to:', wsUrl)
      
      wsRef.current = new WebSocket(wsUrl)
      
      wsRef.current.onopen = () => {
        console.log('[WS] Connected to market data stream')
        setIsConnected(true)
        setLoading(false)
        reconnectAttempts.current = 0
        
        // Send ping to keep connection alive
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({ type: 'ping', timestamp: Date.now() }))
        }
      }
      
      wsRef.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data)
          console.log('[WS] Received message:', message)
          
          switch (message.type) {
            case 'market_data':
              // Single market data update
              if (Array.isArray(message.data)) {
                setMarketData(prevData => {
                  const newData = [...prevData]
                  message.data.forEach(update => {
                    const index = newData.findIndex(item => item.name === update.name)
                    if (index !== -1) {
                      newData[index] = { ...newData[index], ...update }
                    }
                  })
                  return newData
                })
              } else {
                setMarketData(prevData => {
                  const newData = [...prevData]
                  const index = newData.findIndex(item => item.name === message.data.name)
                  if (index !== -1) {
                    newData[index] = { ...newData[index], ...message.data }
                  }
                  return newData
                })
              }
              setLastUpdate(new Date())
              break
              
            case 'market_data_batch':
              // Initial batch of market data
              if (Array.isArray(message.data)) {
                setMarketData(message.data)
                setLastUpdate(new Date())
              }
              break
              
            case 'pong':
              // Response to ping
              console.log('[WS] Received pong')
              break
              
            default:
              console.log('[WS] Unknown message type:', message.type)
          }
        } catch (err) {
          console.error('[WS] Error parsing message:', err)
          setError('Failed to parse market data')
        }
      }
      
      wsRef.current.onclose = (event) => {
        console.log('[WS] Connection closed:', event.code, event.reason)
        setIsConnected(false)
        
        // Attempt to reconnect if not a manual close
        if (event.code !== 1000 && reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++
          console.log(`[WS] Attempting to reconnect (${reconnectAttempts.current}/${maxReconnectAttempts})...`)
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect()
          }, reconnectDelay * reconnectAttempts.current)
        } else if (reconnectAttempts.current >= maxReconnectAttempts) {
          setError('Failed to connect to market data stream after multiple attempts')
          setLoading(false)
        }
      }
      
      wsRef.current.onerror = (error) => {
        console.error('[WS] WebSocket error:', error)
        setError('Connection error')
        setIsConnected(false)
      }
      
    } catch (err) {
      console.error('[WS] Failed to create WebSocket connection:', err)
      setError('Failed to connect to market data stream')
      setLoading(false)
    }
  }, [])

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }
    
    if (wsRef.current) {
      wsRef.current.close(1000, 'Manual disconnect')
      wsRef.current = null
    }
    
    setIsConnected(false)
  }, [])

  const reconnect = useCallback(() => {
    console.log('[WS] Manual reconnect requested')
    disconnect()
    reconnectAttempts.current = 0
    setError(null)
    setLoading(true)
    connect()
  }, [connect, disconnect])

  useEffect(() => {
    connect()
    
    // Cleanup on unmount
    return () => {
      disconnect()
    }
  }, [connect, disconnect])

  // Send periodic pings to keep connection alive
  useEffect(() => {
    if (!isConnected) return
    
    const pingInterval = setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'ping', timestamp: Date.now() }))
      }
    }, 30000) // Ping every 30 seconds
    
    return () => clearInterval(pingInterval)
  }, [isConnected])

  return {
    marketData,
    loading,
    error,
    isConnected,
    lastUpdate,
    reconnect
  }
}