import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { RefreshCw, AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react';

interface DebugInfo {
  timestamp: string;
  timezone: string;
  marketConditions: {
    currentTime: string;
    dayOfWeek: string;
    isTradeDay: boolean;
    isMarketOpen: boolean;
    marketHours: string;
    currentTimeValue: number;
  };
  userCredentials: {
    hasAngelCredentials: boolean;
    hasAuthToken: boolean;
    hasFeedToken: boolean;
    clientCode: string | null;
  };
  strategies: {
    total: number;
    deployed: number;
    active: number;
    details: Array<{
      strategyId: string;
      strategyName: string;
      status: string;
      runnerRunning: boolean;
      deploymentRunning: boolean;
      startTime: string;
      squareOffTime: string;
      tradeDays: string[];
      legs: any[];
      runnerSnapshot: any;
    }>;
  };
  runnerManager: {
    available: boolean;
    totalRunners: number;
  };
}

const TradingDebugPanel: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDebugInfo = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_LOCAL_URL || 'http://localhost:4000/api'}/trading-engine/debug`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.Status === 'Success') {
        setDebugInfo(data.Data);
      } else {
        throw new Error(data.Message || 'Failed to fetch debug info');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDebugInfo();
    // Refresh every 30 seconds
    const interval = setInterval(fetchDebugInfo, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (condition: boolean) => {
    return condition ? (
      <CheckCircle className="w-4 h-4 text-green-500" />
    ) : (
      <XCircle className="w-4 h-4 text-red-500" />
    );
  };

  const getStatusBadge = (condition: boolean, trueText: string, falseText: string) => {
    return (
      <Badge variant={condition ? "default" : "destructive"}>
        {condition ? trueText : falseText}
      </Badge>
    );
  };

  if (loading && !debugInfo) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin" />
            Trading Engine Debug
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading debug information...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            Trading Engine Debug
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-600 mb-4">{error}</div>
          <Button onClick={fetchDebugInfo} disabled={loading}>
            {loading ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : null}
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!debugInfo) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Trading Engine Debug
          </span>
          <Button onClick={fetchDebugInfo} size="sm" disabled={loading}>
            {loading ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : null}
            Refresh
          </Button>
        </CardTitle>
        <p className="text-sm text-gray-600">
          Last updated: {debugInfo.timestamp} ({debugInfo.timezone})
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Market Conditions */}
        <div>
          <h3 className="font-semibold mb-3">Market Conditions</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <span>Current Time:</span>
              <span className="font-mono">{debugInfo.marketConditions.currentTime}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Day of Week:</span>
              <span>{debugInfo.marketConditions.dayOfWeek}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Trade Day:</span>
              <div className="flex items-center gap-2">
                {getStatusIcon(debugInfo.marketConditions.isTradeDay)}
                {getStatusBadge(debugInfo.marketConditions.isTradeDay, "Yes", "No")}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span>Market Open:</span>
              <div className="flex items-center gap-2">
                {getStatusIcon(debugInfo.marketConditions.isMarketOpen)}
                {getStatusBadge(debugInfo.marketConditions.isMarketOpen, "Open", "Closed")}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span>Market Hours:</span>
              <span>{debugInfo.marketConditions.marketHours}</span>
            </div>
          </div>
        </div>

        {/* User Credentials */}
        <div>
          <h3 className="font-semibold mb-3">Angel One Credentials</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <span>Has Credentials:</span>
              <div className="flex items-center gap-2">
                {getStatusIcon(debugInfo.userCredentials.hasAngelCredentials)}
                {getStatusBadge(debugInfo.userCredentials.hasAngelCredentials, "Yes", "No")}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span>Auth Token:</span>
              <div className="flex items-center gap-2">
                {getStatusIcon(debugInfo.userCredentials.hasAuthToken)}
                {getStatusBadge(debugInfo.userCredentials.hasAuthToken, "Valid", "Missing")}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span>Feed Token:</span>
              <div className="flex items-center gap-2">
                {getStatusIcon(debugInfo.userCredentials.hasFeedToken)}
                {getStatusBadge(debugInfo.userCredentials.hasFeedToken, "Valid", "Missing")}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span>Client Code:</span>
              <span className="font-mono">{debugInfo.userCredentials.clientCode || "N/A"}</span>
            </div>
          </div>
        </div>

        {/* Runner Manager */}
        <div>
          <h3 className="font-semibold mb-3">Runner Manager</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <span>Available:</span>
              <div className="flex items-center gap-2">
                {getStatusIcon(debugInfo.runnerManager.available)}
                {getStatusBadge(debugInfo.runnerManager.available, "Yes", "No")}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span>Active Runners:</span>
              <span>{debugInfo.runnerManager.totalRunners}</span>
            </div>
          </div>
        </div>

        {/* Strategies */}
        <div>
          <h3 className="font-semibold mb-3">
            Strategies ({debugInfo.strategies.total} total, {debugInfo.strategies.deployed} deployed)
          </h3>
          {debugInfo.strategies.details.length === 0 ? (
            <p className="text-gray-500">No strategies found</p>
          ) : (
            <div className="space-y-3">
              {debugInfo.strategies.details.map((strategy) => (
                <div key={strategy.strategyId} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{strategy.strategyName}</span>
                    <div className="flex gap-2">
                      {getStatusBadge(strategy.runnerRunning, "Running", "Stopped")}
                      {getStatusBadge(strategy.deploymentRunning, "Deployed", "Not Deployed")}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                    <div>ID: {strategy.strategyId}</div>
                    <div>Status: {strategy.status}</div>
                    <div>Start: {strategy.startTime}</div>
                    <div>End: {strategy.squareOffTime}</div>
                    <div>Days: {strategy.tradeDays.join(', ')}</div>
                    <div>Legs: {strategy.legs.length}</div>
                  </div>
                  {strategy.runnerSnapshot && (
                    <div className="mt-2 text-sm">
                      <span className="font-medium">Runner Status: </span>
                      <span>Entered: {strategy.runnerSnapshot.entered ? 'Yes' : 'No'}</span>
                      {strategy.runnerSnapshot.entered && (
                        <span className="ml-2">P&L: ₹{strategy.runnerSnapshot.netPnl}</span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TradingDebugPanel;
