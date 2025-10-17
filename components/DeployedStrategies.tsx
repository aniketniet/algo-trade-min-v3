"use client";

import React, { useState, useEffect } from "react";
import { 
  Target, 
  Play, 
  Pause, 
  TrendingDown, 
  Wifi, 
  WifiOff, 
  Power, 
  PowerOff,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  Trash2,
  X
} from "lucide-react";
import axios from "axios";
// @ts-ignore
import Cookies from "js-cookie";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useTerminal } from "@/hooks/useTerminal";
import StrategyTerminal from "./StrategyTerminal";
import TerminalButton from "./TerminalButton";

interface DeploymentDetail {
  strategyId: string;
  StrategyName: string;
  UserId: string;
  DeploymentDetail: any[];
  OrderDetails: any[];
}

interface BrokerData {
  id: string;
  UserId: string;
  BrokerId: string;
  BrokerClientId: string;
  BrokerName: string;
  brokerLogoUrl: string;
  TradeEngineName: string;
  TradeEngineStatus: string;
  BrokerLoginStatus: boolean;
  MaxProfit: number | null;
  MaxLoss: number | null;
  APIRedirectUrl: string;
  APILoginUrl: string;
  brokerAuthQueryString: string;
  Running: number;
  Deployed: number;
  DeploymentDetail: DeploymentDetail[];
}

const DeployedStrategies = () => {
  const [brokerData, setBrokerData] = useState<BrokerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [engineLoadingStates, setEngineLoadingStates] = useState<Record<string, boolean>>({});
  const [undeployLoadingStates, setUndeployLoadingStates] = useState<Record<string, boolean>>({});
  const { isTerminalOpen, currentStrategyId, openTerminal, closeTerminal } = useTerminal();

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_LOCAL_URL || "http://localhost:4000/api";

  const fetchDeployedStrategies = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = Cookies.get("token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      // Use the new trading engine endpoint for active strategies
      const response = await axios.get(
        `${API_BASE_URL}/trading/strategies/active`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        const strategiesData = response.data.data;
        const strategies = strategiesData.strategies || [];
        
        // Group strategies by broker
        const brokerGroups: { [key: string]: any[] } = {};
        strategies.forEach((strategy: any) => {
          const broker = strategy.broker || 'default';
          if (!brokerGroups[broker]) {
            brokerGroups[broker] = [];
          }
          brokerGroups[broker].push(strategy);
        });

        // Transform the data to match the expected format
        const transformedBrokerData = Object.entries(brokerGroups).map(([brokerName, brokerStrategies]) => ({
          id: `${brokerName}-broker`,
          UserId: 'current-user',
          BrokerId: brokerName,
          BrokerClientId: `${brokerName}-client`,
          BrokerName: brokerName.charAt(0).toUpperCase() + brokerName.slice(1),
          brokerLogoUrl: `/api/placeholder/32/32`,
          TradeEngineName: `${brokerName}-engine`,
          TradeEngineStatus: 'Running',
          BrokerLoginStatus: true,
          MaxProfit: null,
          MaxLoss: null,
          APIRedirectUrl: '',
          APILoginUrl: '',
          brokerAuthQueryString: '',
          Running: brokerStrategies.filter((s: any) => s.status === 'active' && s.isActiveInEngine).length,
          Deployed: brokerStrategies.length,
          DeploymentDetail: brokerStrategies.map((strategy: any) => ({
            strategyId: strategy.id,
            StrategyName: strategy.name,
            UserId: 'current-user',
            DeploymentDetail: [{
              Running_Status: strategy.status === 'active' && strategy.isActiveInEngine,
              MaxProfit: 0, // This would come from actual trading data
              MaxLoss: 0, // This would come from actual trading data
              TotalPnl: 0, // This would come from actual trading data
              RunningPositionsCount: 0 // This would come from actual trading data
            }],
            OrderDetails: []
          }))
        }));

        setBrokerData(transformedBrokerData);
      } else {
        throw new Error(response.data.message || "Failed to fetch deployed strategies");
      }
    } catch (err: any) {
      console.error("Error fetching deployed strategies:", err);
      setError(err?.response?.data?.message || err.message || "Failed to fetch deployed strategies");
    } finally {
      setLoading(false);
    }
  };

  const toggleTradeEngine = async (brokerId: string, enabled: boolean) => {
    try {
      setEngineLoadingStates(prev => ({
        ...prev,
        [brokerId]: true
      }));

      const token = Cookies.get("token");
      
      // For broker-specific engines, we need to start/stop individual strategies
      // Get all strategies for this broker
      const brokerStrategies = brokerData.find(b => b.id === brokerId)?.DeploymentDetail || [];
      
      if (enabled) {
        // Start all strategies for this broker
        const startPromises = brokerStrategies.map(async (strategy: any) => {
          try {
            const response = await axios.post(
              `${API_BASE_URL}/trading/strategies/${strategy.strategyId}/start`,
              {},
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            return response.data.success;
          } catch (error: any) {
            console.error(`Failed to start strategy ${strategy.strategyId}:`, error);
            // If strategy is already active, consider it a success
            if (error?.response?.data?.message?.includes('already active')) {
              return true;
            }
            return false;
          }
        });
        
        const results = await Promise.all(startPromises);
        const successCount = results.filter(r => r).length;
        
        if (successCount > 0) {
          alert(`Started ${successCount} out of ${brokerStrategies.length} strategies for ${brokerId}`);
        } else if (brokerStrategies.length === 0) {
          alert(`No strategies found for ${brokerId}`);
        } else {
          throw new Error("Failed to start any strategies");
        }
      } else {
        // Stop all strategies for this broker
        const stopPromises = brokerStrategies.map(async (strategy: any) => {
          try {
            const response = await axios.post(
              `${API_BASE_URL}/trading/strategies/${strategy.strategyId}/stop`,
              {},
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            return response.data.success;
          } catch (error: any) {
            console.error(`Failed to stop strategy ${strategy.strategyId}:`, error);
            // If strategy is already stopped, consider it a success
            if (error?.response?.data?.message?.includes('already stopped')) {
              return true;
            }
            return false;
          }
        });
        
        const results = await Promise.all(stopPromises);
        const successCount = results.filter(r => r).length;
        
        if (successCount > 0) {
          alert(`Stopped ${successCount} out of ${brokerStrategies.length} strategies for ${brokerId}`);
        } else if (brokerStrategies.length === 0) {
          alert(`No strategies found for ${brokerId}`);
        } else {
          throw new Error("Failed to stop any strategies");
        }
      }

      // Refresh the data to get updated status
      await fetchDeployedStrategies();
    } catch (err: any) {
      console.error(`Error ${enabled ? 'starting' : 'stopping'} trade engine:`, err);
      alert(`Failed to ${enabled ? 'start' : 'stop'} trade engine. Please try again.`);
    } finally {
      setEngineLoadingStates(prev => ({
        ...prev,
        [brokerId]: false
      }));
    }
  };

  const undeployStrategy = async (strategyId: string, strategyName: string) => {
    if (!confirm(`Are you sure you want to remove "${strategyName}" from deployed strategies? This will stop the strategy and move it back to your strategy list.`)) {
      return;
    }

    try {
      setUndeployLoadingStates(prev => ({
        ...prev,
        [strategyId]: true
      }));

      const token = Cookies.get("token");
      
      // First try to stop the strategy if it's active
      try {
        const stopResponse = await axios.post(
          `${API_BASE_URL}/trading/strategies/${strategyId}/stop`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        if (stopResponse.data.success) {
          console.log(`✅ Strategy ${strategyName} stopped successfully`);
        }
      } catch (stopError: any) {
        // If strategy is already stopped, that's fine - continue with removal
        if (stopError?.response?.data?.message?.includes('already stopped')) {
          console.log(`ℹ️ Strategy ${strategyName} was already stopped`);
        } else {
          console.warn(`⚠️ Failed to stop strategy: ${stopError?.response?.data?.message || stopError.message}`);
        }
      }

      // Now remove the strategy from the trading engine
      const removeResponse = await axios.delete(
        `${API_BASE_URL}/trading/strategies/${strategyId}/remove`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (removeResponse.data.success) {
        alert(`Strategy "${strategyName}" has been successfully removed from deployed strategies.`);
        // Refresh the data to get updated status
        await fetchDeployedStrategies();
      } else {
        throw new Error(removeResponse.data.message || "Failed to remove strategy");
      }
    } catch (err: any) {
      console.error("Error undeploying strategy:", err);
      alert(`Failed to remove strategy. ${err?.response?.data?.message || err.message}`);
    } finally {
      setUndeployLoadingStates(prev => ({
        ...prev,
        [strategyId]: false
      }));
    }
  };

  useEffect(() => {
    fetchDeployedStrategies();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading deployed strategies...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Error</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <Button onClick={fetchDeployedStrategies} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!brokerData || brokerData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Target className="w-8 h-8 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Deployed Strategies</h3>
          <p className="text-gray-500">You haven't deployed any strategies yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Deployed Strategies</h1>
          <p className="text-gray-600">Monitor your active trading strategies and broker connections</p>
        </div>
        <Button onClick={fetchDeployedStrategies} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="space-y-6">
        {brokerData.map((broker) => (
          <Card key={broker.id} className="border-gray-200 bg-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                    <img
                      src={broker.brokerLogoUrl}
                      alt={broker.BrokerName}
                      className="w-8 h-8 rounded"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{broker.BrokerName}</h3>
                    <p className="text-sm text-gray-600">Client ID: {broker.BrokerClientId}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  {/* Broker Connection Status */}
                  <Badge
                    variant="outline"
                    className={
                      broker.BrokerLoginStatus
                        ? "border-green-200 text-green-700"
                        : "border-red-200 text-red-700"
                    }
                  >
                    {broker.BrokerLoginStatus ? (
                      <Wifi className="mr-1 h-3 w-3" />
                    ) : (
                      <WifiOff className="mr-1 h-3 w-3" />
                    )}
                    {broker.BrokerLoginStatus ? "Connected" : "Disconnected"}
                  </Badge>

                  {/* Trade Engine Status */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {broker.TradeEngineStatus === "Running" ? (
                        <Power className="h-4 w-4 text-green-600" />
                      ) : (
                        <PowerOff className="h-4 w-4 text-red-600" />
                      )}
                      <span className="text-sm font-medium">Engine:</span>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        broker.TradeEngineStatus === "Running"
                          ? "border-green-200 text-green-700 bg-green-50"
                          : "border-red-200 text-red-700 bg-red-50"
                      }
                    >
                      {broker.TradeEngineStatus}
                    </Badge>
                    <Switch
                      checked={broker.TradeEngineStatus === "Running"}
                      onCheckedChange={(enabled) => toggleTradeEngine(broker.id, enabled)}
                      disabled={engineLoadingStates[broker.id] || !broker.BrokerLoginStatus}
                    />
                    {engineLoadingStates[broker.id] && (
                      <RefreshCw className="h-4 w-4 animate-spin text-gray-500" />
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {/* Strategy Statistics */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{broker.Deployed}</div>
                  <div className="text-sm text-gray-600">Total Deployed</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{broker.Running}</div>
                  <div className="text-sm text-gray-600">Currently Running</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{broker.Deployed - broker.Running}</div>
                  <div className="text-sm text-gray-600">Paused</div>
                </div>
              </div>

              {/* Deployed Strategies List */}
              {broker.DeploymentDetail.length > 0 ? (
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-700">Deployed Strategies</h4>
                  <div className="grid gap-4">
                    {broker.DeploymentDetail.map((strategy) => {
                      const latestDeployment = strategy.DeploymentDetail[0];
                      const isActive = latestDeployment?.Running_Status;
                      
                      return (
                        <div key={strategy.strategyId} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Target className="w-4 h-4 text-blue-600" />
                              </div>
                              <div>
                                <h5 className="font-semibold">{strategy.StrategyName}</h5>
                                <p className="text-sm text-gray-600">ID: {strategy.strategyId}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <TerminalButton 
                                strategyId={strategy.strategyId}
                                onOpenTerminal={openTerminal}
                                disabled={!isActive}
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => undeployStrategy(strategy.strategyId, strategy.StrategyName)}
                                disabled={undeployLoadingStates[strategy.strategyId]}
                                className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 text-sm"
                              >
                                {/* {undeployLoadingStates[strategy.strategyId] ? (
                                  <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                                ) : (
                                  <X className="w-3 h-3 mr-1" />
                                )} */}
                                {undeployLoadingStates[strategy.strategyId] ? "Removing..." : "Remove"}
                              </Button>
                              <Badge
                                variant="outline"
                                className={
                                  isActive
                                    ? "border-green-200 text-green-700 bg-green-50"
                                    : "border-yellow-200 text-yellow-700 bg-yellow-50"
                                }
                              >
                                {isActive ? (
                                  <Play className="mr-1 h-3 w-3" />
                                ) : (
                                  <Pause className="mr-1 h-3 w-3" />
                                )}
                                {isActive ? "Active" : "Paused"}
                              </Badge>
                            </div>
                          </div>

                          {latestDeployment && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-gray-600">Max Profit:</span>
                                <div className="font-semibold">₹{latestDeployment.MaxProfit || 0}</div>
                              </div>
                              <div>
                                <span className="text-gray-600">Max Loss:</span>
                                <div className="font-semibold">₹{latestDeployment.MaxLoss || 0}</div>
                              </div>
                              <div>
                                <span className="text-gray-600">Total P&L:</span>
                                <div className={`font-semibold ${latestDeployment.TotalPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  ₹{latestDeployment.TotalPnl || 0}
                                </div>
                              </div>
                              <div>
                                <span className="text-gray-600">Running Positions:</span>
                                <div className="font-semibold">{latestDeployment.RunningPositionsCount || 0}</div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">No strategies deployed on this broker</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Terminal Modal */}
      {isTerminalOpen && currentStrategyId && (
        <StrategyTerminal 
          strategyId={currentStrategyId} 
          onClose={closeTerminal} 
        />
      )}
    </div>
  );
};

export default DeployedStrategies;
