import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

/**
 * @typedef {Object} DashboardStats
 * @property {number} totalTrades
 * @property {number} activeStrategies
 * @property {number} totalBrokers
 * @property {number} portfolioValue
 * @property {number} todayPnL
 * @property {number} winRate
 * @property {number} totalStrategies
 * @property {number} completedStrategies
 * @property {number} backtestedStrategies
 */

/**
 * @typedef {Object} DashboardStrategy
 * @property {string} _id
 * @property {string} name
 * @property {string} type
 * @property {string} status
 * @property {Array} instruments
 * @property {string} createdAt
 * @property {string} [updatedAt]
 */

/**
 * @typedef {Object} DashboardActivity
 * @property {string} id
 * @property {string} type
 * @property {string} message
 * @property {string} details
 * @property {string} status
 * @property {Date} timestamp
 */

/**
 * @typedef {Object} DashboardBroker
 * @property {string} _id
 * @property {string} name
 * @property {string} status
 * @property {string} createdAt
 */

/**
 * @typedef {Object} DashboardData
 * @property {DashboardStats|null} stats
 * @property {DashboardStrategy[]} strategies
 * @property {DashboardActivity[]} activities
 * @property {DashboardBroker[]} brokers
 * @property {boolean} loading
 * @property {string|null} error
 */

/**
 * Custom hook for fetching dashboard data
 * @returns {DashboardData & { refreshData: () => void }}
 */
export const useDashboardData = () => {
  const [dashboardData, setDashboardData] = useState({
    stats: null,
    strategies: [],
    activities: [],
    brokers: [],
    loading: true,
    error: null
  });

  const base_url = process.env.NEXT_PUBLIC_API_BASE_LOCAL_URL || 'http://localhost:4000/api';

  const fetchDashboardData = async () => {
    try {
      setDashboardData(prev => ({ ...prev, loading: true, error: null }));
      const token = Cookies.get("token");

      console.log("🔍 Fetching dashboard data from:", base_url);
      console.log("🔑 Token available:", !!token);
      console.log("🔑 Token value:", token ? `${token.substring(0, 20)}...` : 'No token');
      
      if (!token) {
        console.log("❌ No authentication token found - user may not be logged in");
        setDashboardData(prev => ({
          ...prev,
          loading: false,
          error: 'User not authenticated. Please log in.'
        }));
        return;
      }

      // Fetch all dashboard data in parallel
      const statsUrl = `${base_url}/users/stats`;
      const strategiesUrl = `${base_url}/strategies`;
      const brokersUrl = `${base_url}/users/brokers`;
      
      console.log("📊 Stats URL:", statsUrl);
      console.log("📈 Strategies URL:", strategiesUrl);
      console.log("🏦 Brokers URL:", brokersUrl);

      const [statsResponse, strategiesResponse, brokersResponse] = await Promise.allSettled([
        // Fetch user stats
        axios.get(statsUrl, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        // Fetch user's strategies
        axios.get(strategiesUrl, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        // Fetch user's brokers
        axios.get(brokersUrl, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      // Process stats
      let stats = {
        totalTrades: 0,
        activeStrategies: 0,
        totalBrokers: 0,
        portfolioValue: 0,
        todayPnL: 0,
        winRate: 0,
        totalStrategies: 0,
        completedStrategies: 0,
        backtestedStrategies: 0
      };

      if (statsResponse.status === 'fulfilled' && statsResponse.value.data.success) {
        stats = {
          ...stats,
          ...statsResponse.value.data.data
        };
        console.log("✅ Stats fetched successfully:", stats);
      } else {
        console.log("❌ Stats fetch failed:", statsResponse.status, statsResponse.reason?.response?.data);
      }

      // Process strategies
      let strategies = [];
      if (strategiesResponse.status === 'fulfilled' && strategiesResponse.value.data.success) {
        const strategiesData = strategiesResponse.value.data.data;
        strategies = Array.isArray(strategiesData) ? strategiesData : [];
        console.log("✅ Strategies fetched successfully:", strategies.length, "strategies");
        console.log("📋 Strategies data type:", typeof strategiesData, "isArray:", Array.isArray(strategiesData));
      } else {
        console.log("❌ Strategies fetch failed:", strategiesResponse.status, strategiesResponse.reason?.response?.data);
      }

      // Process brokers
      let brokers = [];
      if (brokersResponse.status === 'fulfilled' && brokersResponse.value.data.success) {
        const brokersData = brokersResponse.value.data.data;
        brokers = Array.isArray(brokersData) ? brokersData : [];
        console.log("✅ Brokers fetched successfully:", brokers.length, "brokers");
        console.log("🏦 Brokers data type:", typeof brokersData, "isArray:", Array.isArray(brokersData));
      } else {
        console.log("❌ Brokers fetch failed:", brokersResponse.status, brokersResponse.reason?.response?.data);
      }

      // Generate mock activities based on strategies and recent data
      const activities = generateMockActivities(strategies);

      console.log("📊 Final processed data:", {
        stats,
        strategiesCount: strategies.length,
        brokersCount: brokers.length,
        activitiesCount: activities.length
      });

      setDashboardData({
        stats: {
          ...stats,
          activeStrategies: strategies.filter(s => s.status === 'active').length,
          totalBrokers: brokers.length
        },
        strategies: strategies.slice(0, 3), // Show only first 3 for dashboard
        activities,
        brokers,
        loading: false,
        error: null
      });

      console.log("✅ Dashboard data set successfully");

    } catch (error) {
      console.error('❌ Error fetching dashboard data:', error);
      console.error('❌ Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText
      });
      setDashboardData(prev => ({
        ...prev,
        loading: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch dashboard data'
      }));
    }
  };

  const generateMockActivities = (strategies) => {
    const activities = [];
    const now = new Date();

    // Ensure strategies is an array
    if (!Array.isArray(strategies)) {
      console.log("⚠️ Strategies is not an array:", strategies);
      return activities; // Return empty activities array
    }

    // Generate activities based on strategies
    strategies.forEach((strategy, index) => {
      const timeAgo = new Date(now.getTime() - (index + 1) * 5 * 60000); // 5 minutes apart
      
      if (strategy.status === 'active') {
        activities.push({
          id: `activity-${strategy._id}-1`,
          type: 'trade',
          message: `Strategy "${strategy.name}" executed ${Math.random() > 0.5 ? 'BUY' : 'SELL'} order`,
          details: `${strategy.instruments?.[0]?.symbol || 'NIFTY'} • ₹${(Math.random() * 1000 + 100).toFixed(2)} • ${formatTimeAgo(timeAgo)}`,
          status: 'success',
          timestamp: timeAgo
        });
      }

      if (strategy.status === 'backtested') {
        activities.push({
          id: `activity-${strategy._id}-2`,
          type: 'backtest',
          message: `Backtest completed for "${strategy.name}"`,
          details: `ROI: +${(Math.random() * 30 + 5).toFixed(1)}% • ${formatTimeAgo(timeAgo)}`,
          status: 'info',
          timestamp: timeAgo
        });
      }
    });

    // Add some generic activities
    activities.push({
      id: 'activity-generic-1',
      type: 'system',
      message: 'New broker connection established',
      details: 'Angel Broking • 1 hour ago',
      status: 'success',
      timestamp: new Date(now.getTime() - 60 * 60000)
    });

    return activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 4);
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / 60000);
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const refreshData = () => {
    fetchDashboardData();
  };

  return {
    ...dashboardData,
    refreshData
  };
};
