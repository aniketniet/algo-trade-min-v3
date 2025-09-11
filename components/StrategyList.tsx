"use client";

import React, { useState } from "react";
import { Target, Play, Pause, TrendingDown, Rocket, Edit, MoreVertical } from "lucide-react";
import { useStrategiesList } from "@/hooks/useStrategyApi";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useTerminal } from "@/hooks/useTerminal";
import StrategyTerminal from "./StrategyTerminal";
import TerminalButton from "./TerminalButton";

const StrategyList = () => {
  const { strategies, loading, error } = useStrategiesList();
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [deployLoadingId, setDeployLoadingId] = useState<string | null>(null);
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
  const router = useRouter();
  const { isTerminalOpen, currentStrategyId, openTerminal, closeTerminal } = useTerminal();

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_LOCAL_URL || "http://103.189.173.82:4000/api";

  const handleBacktestClick = (strategyId: string) => {
    setOpenDropdownId((prev) => (prev === strategyId ? null : strategyId));
  };

  const handleNavigateToBacktestPage = (strategyId: string) => {
   router.push(`/dashboard/backtest?strategyId=${strategyId}`);
  };

  const handleEditStrategy = (strategyId: string) => {
    router.push(`/dashboard/strategies?edit=${strategyId}`);
    setOpenActionMenuId(null);
  };

  const handleActionMenuClick = (strategyId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenActionMenuId(openActionMenuId === strategyId ? null : strategyId);
  };

  const runBacktest = async (strategyId: string, period: string, useEnhanced = true) => {
    try {
      const token = Cookies.get("token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      setLoadingId(strategyId);

      // Use enhanced backtest by default
      const endpoint = useEnhanced 
        ? `${API_BASE_URL}/user/backtest-enhanced/${strategyId}`
        : `${API_BASE_URL}/user/backtest/${strategyId}`;

      const response = await axios.post(
        endpoint,
        { period },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const backtestType = useEnhanced ? "Enhanced" : "Standard";
      alert(`${backtestType} backtest completed for ${period}! Check results for detailed analysis.`);
      router.push(`/dashboard/backtest?strategyId=${strategyId}`);
    } catch (err: any) {
      alert("Error running backtest: " + (err?.response?.data?.message || err.message));
    } finally {
      setLoadingId(null);
      setOpenDropdownId(null);
    }
  };

  const deployStrategy = async (strategy: any, actionType: "Start" | "Stop") => {
    try {
      const token = Cookies.get("token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      setDeployLoadingId(strategy._id);

      const requestBody = {
        ActionType: actionType,
        BrokerClientId: strategy.brokerClientId || "default", // You might need to get this from strategy or user context
        BrokerId: strategy.brokerId || "default", // You might need to get this from strategy or user context
        StrategyId: strategy.strategyId || strategy._id,
        isLiveMode: strategy.mode === "live"
      };

      const response = await axios.post(
        `${API_BASE_URL}/trading-engine/deploy-strategy`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.Status === "Success") {
        alert(`Strategy ${actionType.toLowerCase()}ed successfully!`);
        // Optionally refresh the strategies list
        window.location.reload();
      } else {
        throw new Error(response.data.Message || "Failed to deploy strategy");
      }
    } catch (err: any) {
      alert("Error deploying strategy: " + (err?.response?.data?.Message || err.message));
    } finally {
      setDeployLoadingId(null);
    }
  };

  if (loading) return <div className="text-center py-8">Loading strategies...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
  if (!strategies || strategies.length === 0) return <div className="text-center py-8">No strategies found</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Trading Strategies</h1>
          <p className="text-gray-600">Manage and monitor your algorithmic trading strategies</p>
        </div>
      </div>

      <div className="space-y-4">
        {strategies.map((strategy) => {
          const isBacktested = strategy.status === "backtested";
          const isActive = strategy.status === "active";
          const isPaused = strategy.status === "paused";

          const cardContent = (
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{strategy.strategyName}</h3>
                  <p className="text-sm text-gray-600">
                    {strategy.strategyType} • {strategy.instruments.join(", ")}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 relative">
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${
                    strategy.status === "active"
                      ? "border-green-200 text-green-700 bg-green-50"
                      : strategy.status === "paused"
                      ? "border-yellow-200 text-yellow-700 bg-yellow-50"
                      : "border-red-200 text-red-700 bg-red-50"
                  }`}
                >
                  {strategy.status === "active" ? (
                    <Play className="w-3 h-3" />
                  ) : strategy.status === "paused" ? (
                    <Pause className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {strategy.status}
                </span>

                <div className="flex gap-2 items-center">
                  {/* Action Menu */}
                  <div className="relative">
                    <button
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      onClick={(e) => handleActionMenuClick(strategy._id, e)}
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {/* Action Menu Dropdown */}
                    {openActionMenuId === strategy._id && (
                      <div className="absolute right-0 mt-2 bg-white border border-gray-300 rounded shadow-md z-50 w-40">
                        <button
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditStrategy(strategy._id);
                          }}
                        >
                          <Edit className="w-3 h-3" />
                          Edit Strategy
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Show Backtest button only if NOT backtested */}
                  {!isBacktested && (
                    <div className="relative">
                      <button
                        className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                        onClick={() => handleBacktestClick(strategy._id)}
                      >
                        {loadingId === strategy._id ? "Processing..." : "Backtest"}
                      </button>

                      {/* Enhanced Dropdown */}
                      {openDropdownId === strategy._id && (
                        <div className="absolute right-0 mt-2 bg-white border border-gray-300 rounded shadow-md z-50 w-48">
                          <div className="px-3 py-2 text-xs font-semibold text-gray-500 border-b">
                            Enhanced Backtest
                          </div>
                          {["1m", "3m", "6m"].map((period) => (
                            <button
                              key={period}
                              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center justify-between"
                              onClick={() => runBacktest(strategy._id, period, true)}
                            >
                              <span>{period}</span>
                              <span className="text-xs text-green-600">✓</span>
                            </button>
                          ))}
                          <div className="px-3 py-2 text-xs font-semibold text-gray-500 border-t border-b">
                            Standard Backtest
                          </div>
                          {["1m", "3m", "6m"].map((period) => (
                            <button
                              key={`std-${period}`}
                              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                              onClick={() => runBacktest(strategy._id, period, false)}
                            >
                              {period}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Show Deploy button only if backtested */}
                  {isBacktested && (
                    <div className="flex gap-1">
                      {!isActive && (
                        <button
                          className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors flex items-center gap-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            deployStrategy(strategy, "Start");
                          }}
                          disabled={deployLoadingId === strategy._id}
                        >
                          {deployLoadingId === strategy._id ? (
                            "Starting..."
                          ) : (
                            <>
                              <Rocket className="w-3 h-3" />
                              Deploy
                            </>
                          )}
                        </button>
                      )}
                      
                      {isActive && (
                        <>
                          <TerminalButton 
                            strategyId={strategy.strategyId || strategy._id}
                            onOpenTerminal={openTerminal}
                            disabled={false}
                          />
                          <button
                            className="text-xs bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              deployStrategy(strategy, "Stop");
                            }}
                            disabled={deployLoadingId === strategy._id}
                          >
                            {deployLoadingId === strategy._id ? "Stopping..." : "Stop"}
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );

          const cardDetails = (
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Order Type</p>
                  <p className="font-semibold">{strategy.orderType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Trading Hours</p>
                  <p className="font-semibold">
                    {strategy.startTime} - {strategy.squareOffTime}
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Max Profit</p>
                  <p className="font-semibold">₹{strategy.riskManagement.exitWhenProfit}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Max Loss</p>
                  <p className="font-semibold">₹{strategy.riskManagement.exitWhenLoss}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Profit Trailing</p>
                  <p className="font-semibold">{strategy.profitTrailing}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Mode</p>
                  <p className="font-semibold capitalize">{strategy.mode}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Created</p>
                  <p className="text-sm text-gray-500">
                    {new Date(strategy.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Version</p>
                  <p className="text-sm text-gray-500">{strategy.__v}</p>
                </div>
              </div>
            </div>
          );

          return isBacktested ? (
            <div
              key={strategy._id}
              className="bg-white rounded-lg border border-gray-200 p-6 cursor-pointer hover:shadow-md transition"
              onClick={() => handleNavigateToBacktestPage(strategy._id)}
            >
              {cardContent}
              {cardDetails}
            </div>
          ) : (
            <div key={strategy._id} className="bg-white rounded-lg border border-gray-200 p-6">
              {cardContent}
              {cardDetails}
            </div>
          );
        })}
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

export default StrategyList;
