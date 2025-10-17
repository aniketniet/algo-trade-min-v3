import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const StrategyTerminal = ({ strategyId, onClose }: { strategyId: string; onClose: () => void }) => {
  const [terminalData, setTerminalData] = useState<any>(null);
  const [statusData, setStatusData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_LOCAL_URL || 'http://localhost:4000/api';

  // Fetch terminal data
  const fetchTerminalData = async () => {
    try {
      const token = Cookies.get('token');
      if (!token) {
        setError('Authentication token not found');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/trading/strategy-terminal/${strategyId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setTerminalData(response.data.Data);
    } catch (error: any) {
      console.error('Error fetching terminal data:', error);
      setError('Failed to fetch terminal data');
    }
  };

  // Fetch real-time status
  const fetchStatus = async () => {
    try {
      const token = Cookies.get('token');
      if (!token) return;

      const response = await axios.get(`${API_BASE_URL}/trading/strategy-status/${strategyId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setStatusData(response.data.Data);
    } catch (error: any) {
      console.error('Error fetching status:', error);
    }
  };

  // Initial load
  useEffect(() => {
    fetchTerminalData();
    fetchStatus();
    setLoading(false);
  }, [strategyId]);

  // Auto-refresh every 5 seconds
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchStatus();
    }, 5000);

    return () => clearInterval(interval);
  }, [autoRefresh, strategyId]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading terminal...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg max-w-md">
          <div className="text-red-600 mb-4">
            <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={onClose}
            className="w-full bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 text-green-400 p-6 rounded-lg w-full max-w-4xl h-4/5 overflow-y-auto">
        {/* Terminal Header */}
        <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-mono font-bold">
              Strategy Terminal - {terminalData?.strategyName}
            </h2>
            <div className={`px-2 py-1 rounded text-xs font-bold ${
              statusData?.isRunning ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
            }`}>
              {statusData?.isRunning ? 'RUNNING' : 'STOPPED'}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <label className="flex items-center text-sm">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="mr-2"
              />
              Auto-refresh
            </label>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white px-2 py-1"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Terminal Content */}
        <div className="h-full overflow-auto font-mono text-sm">
          {/* Strategy Info */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-800 p-3 rounded">
              <h3 className="text-blue-400 mb-2">Strategy Details</h3>
              <div className="space-y-1">
                <div>ID: {terminalData?.strategyId}</div>
                <div>Status: {terminalData?.status}</div>
                <div>Mode: {terminalData?.mode}</div>
                <div>Deployed: {new Date(terminalData?.deployedAt).toLocaleString()}</div>
              </div>
            </div>
            <div className="bg-gray-800 p-3 rounded">
              <h3 className="text-blue-400 mb-2">Live Status</h3>
              <div className="space-y-1">
                <div>Running: {statusData?.isRunning ? 'Yes' : 'No'}</div>
                <div>Total P&L: ₹{statusData?.deploymentInfo?.totalPnl || 0}</div>
                <div>Positions: {statusData?.deploymentInfo?.runningPositions || 0}</div>
                <div>Pending Orders: {statusData?.deploymentInfo?.pendingOrders || 0}</div>
                {statusData?.deploymentInfo && (
                  <>
                    <div className="text-xs text-gray-400 mt-2">Debug Info:</div>
                    <div className="text-xs text-gray-400">DB Status: {statusData?.deploymentInfo?.runningStatusFromDeployment ? 'Running' : 'Stopped'}</div>
                    <div className="text-xs text-gray-400">Engine Status: {statusData?.deploymentInfo?.runningStatusFromRunner ? 'Running' : 'Stopped'}</div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-gray-800 p-3 rounded mb-4">
            <h3 className="text-blue-400 mb-2">Recent Orders</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-1">Order ID</th>
                    <th className="text-left py-1">Symbol</th>
                    <th className="text-left py-1">Type</th>
                    <th className="text-left py-1">Qty</th>
                    <th className="text-left py-1">Entry</th>
                    <th className="text-left py-1">Exit</th>
                    <th className="text-left py-1">P&L</th>
                    <th className="text-left py-1">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {terminalData?.recentOrders?.map((order: any, index: number) => (
                    <tr key={index} className="border-b border-gray-700">
                      <td className="py-1">{order.orderId}</td>
                      <td className="py-1">{order.tradingSymbol}</td>
                      <td className={`py-1 ${order.transactionType === 'BUY' ? 'text-green-400' : 'text-red-400'}`}>
                        {order.transactionType}
                      </td>
                      <td className="py-1">{order.qty}</td>
                      <td className="py-1">₹{order.entryPrice}</td>
                      <td className="py-1">₹{order.exitPrice || '-'}</td>
                      <td className={`py-1 ${order.pnl > 0 ? 'text-green-400' : order.pnl < 0 ? 'text-red-400' : ''}`}>
                        ₹{order.pnl || '-'}
                      </td>
                      <td className={`py-1 ${
                        order.orderStatus === 'COMPLETE' ? 'text-green-400' :
                        order.orderStatus === 'PENDING' ? 'text-yellow-400' :
                        'text-red-400'
                      }`}>
                        {order.orderStatus}
                      </td>
                    </tr>
                  ))}
                  {(!terminalData?.recentOrders || terminalData.recentOrders.length === 0) && (
                    <tr>
                      <td colSpan={8} className="py-4 text-center text-gray-500">
                        No orders yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Strategy Configuration */}
          <div className="bg-gray-800 p-3 rounded">
            <h3 className="text-blue-400 mb-2">Strategy Configuration</h3>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <div>Start Time: {terminalData?.strategyConfig?.startTime}</div>
                <div>Square Off: {terminalData?.strategyConfig?.squareOffTime}</div>
                <div>Order Type: {terminalData?.strategyConfig?.orderType}</div>
              </div>
              <div>
                <div>Trade Days: {terminalData?.strategyConfig?.tradeDays?.join(', ')}</div>
                <div>Instruments: {terminalData?.strategyConfig?.instruments?.join(', ')}</div>
              </div>
            </div>
          </div>

          {/* Last Update */}
          <div className="mt-4 text-xs text-gray-500 text-center">
            Last updated: {statusData?.lastUpdate ? new Date(statusData.lastUpdate).toLocaleString() : 'Never'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrategyTerminal;
