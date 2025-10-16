"use client";

import React, { useState } from "react";
import { Target, Play, Pause, TrendingDown, Rocket, Edit, MoreVertical, Trash2 } from "lucide-react";
import { useStrategiesList } from "@/hooks/useStrategyApi";
import axios from "axios";
// @ts-ignore
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

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_LOCAL_URL || "http://localhost:4000/api";

  const handleBacktestClick = (strategyId: string) => {
    setOpenDropdownId((prev) => (prev === strategyId ? null : strategyId));
  };

  const handleNavigateToBacktestPage = (strategyId: string) => {
   router.push(`/dashboard/backtest?strategyId=${strategyId}`);
  };

  const handleEditStrategy = (strategyId: string) => {
    console.log('🔍 Edit strategy clicked for ID:', strategyId);
    router.push(`/dashboard/strategies?edit=${strategyId}`);
    setOpenActionMenuId(null);
  };

  const handleDeleteStrategy = async (strategyId: string, strategyName: string, strategyStatus: string) => {
    // Check if strategy is active
    if (strategyStatus === 'active') {
      alert('Cannot delete active strategy. Please stop the strategy first before deleting it.');
      setOpenActionMenuId(null);
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete the strategy "${strategyName}"? This action cannot be undone.`
    );
    
    if (!confirmed) return;

    try {
      const token = Cookies.get("token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      setLoadingId(strategyId);

      const response = await axios.delete(`${API_BASE_URL}/strategies/${strategyId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        alert("Strategy deleted successfully!");
        // Refresh the strategies list
        window.location.reload();
      } else {
        throw new Error(response.data.message || "Failed to delete strategy");
      }
    } catch (err: any) {
      console.error("❌ Delete strategy error:", err);
      
      let errorMessage = "Error deleting strategy: ";
      if (err?.response?.status === 401) {
        errorMessage += "Authentication failed. Please log in again.";
      } else if (err?.response?.data?.message) {
        errorMessage += err.response.data.message;
      } else {
        errorMessage += err.message;
      }
      
      alert(errorMessage);
    } finally {
      setLoadingId(null);
      setOpenActionMenuId(null);
    }
  };

  const handleActionMenuClick = (strategyId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('🔍 Action menu clicked for strategy:', strategyId, 'Current open:', openActionMenuId);
    setOpenActionMenuId(openActionMenuId === strategyId ? null : strategyId);
  };

  const runBacktest = async (strategyId: string, period: string, useEnhanced = true) => {
    try {
      const token = Cookies.get("token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      console.log("🔐 Token found:", token.substring(0, 20) + "...");
      console.log("📊 Running backtest for strategy:", strategyId, "period:", period);

      setLoadingId(strategyId);

      // Use the new backtest API
      const response = await axios.post(
        `${API_BASE_URL}/backtest/${strategyId}`,
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
      console.error("❌ Backtest error:", err);
      console.error("❌ Response data:", err?.response?.data);
      console.error("❌ Status:", err?.response?.status);
      
      let errorMessage = "Error running backtest: ";
      if (err?.response?.status === 401) {
        errorMessage += "Authentication failed. Please log in again.";
      } else if (err?.response?.data?.message) {
        errorMessage += err.response.data.message;
      } else {
        errorMessage += err.message;
      }
      
      alert(errorMessage);
    } finally {
      setLoadingId(null);
      setOpenDropdownId(null);
    }
  };

  const deployStrategy = async (strategy: any, actionType: "Start" | "Stop" | "Pause" | "Resume") => {
    try {
      const token = Cookies.get("token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      setDeployLoadingId(strategy._id);

      // Use the new strategy toggle API
      const response = await axios.post(
        `${API_BASE_URL}/strategies/${strategy._id}/toggle`,
        { action: actionType.toLowerCase() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        alert(`Strategy ${actionType.toLowerCase()}ed successfully!`);
        // Optionally refresh the strategies list
        window.location.reload();
      } else {
        throw new Error(response.data.message || "Failed to deploy strategy");
      }
    } catch (err: any) {
      alert("Error deploying strategy: " + (err?.response?.data?.Message || err.message));
    } finally {
      setDeployLoadingId(null);
    }
  };

  // Helper function to determine the appropriate action based on strategy status
  const getDeployAction = (strategy: any) => {
    switch (strategy.status) {
      case 'draft':
      case 'backtested':
      case 'stopped':
        return 'Start';
      case 'active':
        return 'Stop';
      case 'paused':
        return 'Resume';
      default:
        return 'Start';
    }
  };

  // Helper function to get the appropriate button text
  const getDeployButtonText = (strategy: any) => {
    switch (strategy.status) {
      case 'draft':
      case 'backtested':
      case 'stopped':
        return 'Deploy';
      case 'active':
        return 'Stop';
      case 'paused':
        return 'Resume';
      default:
        return 'Deploy';
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
        {strategies && strategies.length > 0 && strategies.map((strategy) => {
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
                  <h3 className="text-lg font-semibold">{strategy.name}</h3>
                  <p className="text-sm text-gray-600">
                    {strategy.type}
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
                        <button
                          className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${
                            strategy.status === 'active' 
                              ? 'text-gray-400 cursor-not-allowed' 
                              : 'hover:bg-red-50 text-red-600'
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteStrategy(strategy._id, strategy.name, strategy.status);
                          }}
                          disabled={loadingId === strategy._id || strategy.status === 'active'}
                          title={strategy.status === 'active' ? 'Cannot delete active strategy. Stop it first.' : 'Delete strategy'}
                        >
                          <Trash2 className="w-3 h-3" />
                          {loadingId === strategy._id ? "Deleting..." : "Delete Strategy"}
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
                            Select Time Period
                          </div>
                          {["1m", "3m", "6m"].map((period) => (
                            <button
                              key={period}
                              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center justify-between"
                              onClick={() => runBacktest(strategy._id, period, true)}
                            >
                              <span>{period}</span>
                              {/* <span className="text-xs text-green-600">✓</span> */}
                            </button>
                          ))}
                          {/* <div className="px-3 py-2 text-xs font-semibold text-gray-500 border-t border-b">
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
                          ))} */}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Show Deploy button for all strategies */}
                  <div className="flex gap-1">
                    <button
                      className={`text-xs px-3 py-1 rounded transition-colors flex items-center gap-1 ${
                        strategy.status === 'active' 
                          ? 'bg-red-600 text-white hover:bg-red-700' 
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        deployStrategy(strategy, getDeployAction(strategy) as any);
                      }}
                      disabled={deployLoadingId === strategy._id}
                    >
                      {deployLoadingId === strategy._id ? (
                        "Processing..."
                      ) : (
                        <>
                          <Rocket className="w-3 h-3" />
                          {getDeployButtonText(strategy)}
                        </>
                      )}
                    </button>
                      
                      {isActive && (
                        <TerminalButton 
                          strategyId={strategy.strategyId || strategy._id}
                          onOpenTerminal={openTerminal}
                          disabled={false}
                        />
                      )}
                    </div>
                </div>
              </div>
            </div>
          );

          const cardDetails = (
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Order Type</p>
                  <p className="font-semibold">{strategy.order_type || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Trading Hours</p>
                  <p className="font-semibold">
                    {strategy.start_time || 'N/A'} - {strategy.square_off_time || 'N/A'}
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Max Profit</p>
                  <p className="font-semibold">₹{strategy.risk_management?.exit_when_overall_profit_amount || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Max Loss</p>
                  <p className="font-semibold">₹{strategy.risk_management?.exit_when_overall_loss_amount || 'N/A'}</p>
                </div>
              </div>
              {/* <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Profit Trailing</p>
                  <p className="font-semibold">{strategy.profit_trailing || 'N/A'}</p>
                </div>
                
              </div> */}
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Created</p>
                  <p className="text-sm text-gray-500">
                    {new Date(strategy.created_at || strategy.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {/* <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="text-sm text-gray-500 capitalize">{strategy.status || 'draft'}</p>
                </div> */}
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
        
        {(!strategies || strategies.length === 0) && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Strategies Found</h3>
            <p className="text-gray-500">You haven't created any strategies yet. Start by creating your first strategy!</p>
          </div>
        )}
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
