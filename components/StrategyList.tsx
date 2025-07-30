"use client";

import React, { useState } from "react";
import { Target, Play, Pause, TrendingDown } from "lucide-react";
import { useStrategiesList } from "@/hooks/useStrategyApi";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const StrategyList = () => {
  const { strategies, loading, error } = useStrategiesList();
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const router = useRouter();

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_LOCAL_URL || "http://103.189.173.82:4000/api";

  const handleBacktestClick = (strategyId: string) => {
    setOpenDropdownId((prev) => (prev === strategyId ? null : strategyId));
  };

  const handleNavigateToBacktestPage = (strategyId: string) => {
   router.push(`/dashboard/backtest?strategyId=${strategyId}`);
  };

  const runBacktest = async (strategyId: string, period: string) => {
    try {
      const token = Cookies.get("token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      setLoadingId(strategyId);

      await axios.post(
        `${API_BASE_URL}/user/backtest/${strategyId}`,
        { period },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(`Backtest started for ${period}`);
      router.push(`/dashboard/backtest?strategyId=${strategyId}`);
    } catch (err: any) {
      alert("Error running backtest: " + (err?.response?.data?.message || err.message));
    } finally {
      setLoadingId(null);
      setOpenDropdownId(null);
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

                {/* Show Backtest button only if NOT backtested */}
                {!isBacktested && (
                  <div className="relative">
                    <button
                      className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                      onClick={() => handleBacktestClick(strategy._id)}
                    >
                      {loadingId === strategy._id ? "Processing..." : "Backtest"}
                    </button>

                    {/* Dropdown */}
                    {openDropdownId === strategy._id && (
                      <div className="absolute right-0 mt-2 bg-white border border-gray-300 rounded shadow-md z-50 w-32">
                        {["1m", "3m", "6m"].map((period) => (
                          <button
                            key={period}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                            onClick={() => runBacktest(strategy._id, period)}
                          >
                            {period}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
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
    </div>
  );
};

export default StrategyList;
