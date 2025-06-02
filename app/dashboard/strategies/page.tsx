"use client";

import React, { useState } from "react";
import {
  Plus,
  Target,
  Play,
  Pause,
  TrendingDown,
  FileText,
  Clock,
} from "lucide-react";

export default function AlgoroomStrategyPage() {
  const [activeTab, setActiveTab] = useState("Create Strategy");
  const [strategyType, setStrategyType] = useState("Time Based");
  const [orderType, setOrderType] = useState("MIS");
  // const [selectedInstruments, setSelectedInstruments] = useState([]);
  const [startTime, setStartTime] = useState("09:16");
  const [endTime, setEndTime] = useState("03:15");
  const [selectedDays, setSelectedDays] = useState([
    "MON",
    "TUE",
    "WED",
    "THU",
    "FRI",
  ]);
  const [noTradeAfter, setNoTradeAfter] = useState("03:15");
  const [profitTrailing, setProfitTrailing] = useState("No Trailing");
  const [strategyName, setStrategyName] = useState("");

  const indices = [
    {
      name: "NIFTY",
      value: "24776.60",
      change: "-0.14",
      color: "text-red-500",
    },
    { name: "BNF", value: "55903.40", change: "0.28", color: "text-green-500" },
    { name: "FN", value: "26448.40", change: "-0.19", color: "text-red-500" },
  ];

  const strategies = [
    {
      id: 1,
      name: "Momentum Scalper",
      description: "High-frequency momentum trading strategy for NASDAQ stocks",
      status: "Running",
      market: "NASDAQ",
      timeframe: "1m",
      roi: 24.3,
      trades: 1247,
      winRate: 78.5,
      maxDrawdown: 3.2,
      sharpe: 2.1,
      createdAt: "2024-01-15",
      lastModified: "2024-01-20",
    },
    {
      id: 2,
      name: "Mean Reversion",
      description: "Statistical arbitrage strategy for S&P 500 components",
      status: "Running",
      market: "S&P 500",
      timeframe: "5m",
      roi: 18.7,
      trades: 432,
      winRate: 65.2,
      maxDrawdown: 5.1,
      sharpe: 1.8,
      createdAt: "2024-01-10",
      lastModified: "2024-01-18",
    },
  ];

  const tabs = [
    "Create Strategy",
    "My Strategies",
    "Deployed Strategies",
    "Strategy Template",
    "My Portfolio",
  ];
  const days = ["MON", "TUE", "WED", "THU", "FRI"];

  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const addInstrument = () => {
    // Placeholder for add instrument functionality
    console.log("Add instrument clicked");
  };

  return (
    <div className="min-h-screen  bg-gray-50">
      {/* Main Content */}
      <div className="w-full ">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="w-full p-6">
          {activeTab === "Create Strategy" && (
            <div className="max-w-4xl">
              {/* Strategy Type */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4">Strategy Type</h2>
                <div className="flex gap-4">
                  <button
                    onClick={() => setStrategyType("Time Based")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      strategyType === "Time Based"
                        ? "bg-blue-100 text-blue-700 border border-blue-200"
                        : "bg-gray-100 text-gray-600 border border-gray-200"
                    }`}
                  >
                    Time Based
                  </button>
                  <button
                    onClick={() => setStrategyType("Indicator Based")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      strategyType === "Indicator Based"
                        ? "bg-blue-100 text-blue-700 border border-blue-200"
                        : "bg-gray-100 text-gray-600 border border-gray-200"
                    }`}
                  >
                    Indicator Based
                  </button>
                </div>
              </div>

              {/* Select Instruments */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4">
                  Select Instruments
                </h2>
                <div
                  onClick={addInstrument}
                  className="w-64 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
                >
                  <Plus className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-blue-600 font-medium">
                    Add Instruments.
                  </span>
                </div>
              </div>

              {/* Order Configuration */}
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="font-medium mb-4">Order Type</h3>
                  <div className="flex gap-4">
                    {["MIS", "CNC", "BTST"].map((type) => (
                      <label
                        key={type}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="orderType"
                          value={type}
                          checked={orderType === type}
                          onChange={(e) => setOrderType(e.target.value)}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-sm">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-4">Timing</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Start time
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="time"
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                        <span className="text-xs text-gray-500">AM</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Square off
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="time"
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                        <span className="text-xs text-gray-500">PM</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trading Days */}
              <div className="mb-8">
                <h3 className="font-medium mb-4">Trading Days</h3>
                <div className="flex gap-2">
                  {days.map((day) => (
                    <button
                      key={day}
                      onClick={() => toggleDay(day)}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        selectedDays.includes(day)
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ready-made Templates */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  Readymade Templates
                  <button className="text-blue-600 hover:text-blue-700">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </button>
                </h2>
              </div>

              {/* Order Legs */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Order Legs</h2>
                  <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                    ADD LEG
                  </button>
                </div>
              </div>

              {/* Risk Management */}
              <div className="mb-8 border-t border-gray-200 pt-6">
                <h2 className="text-lg font-semibold mb-6">Risk management</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <input
                      type="text"
                      placeholder="Exit When Over All Profit In Amount (INR)"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Exit When Over All Loss In Amount(INR)"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <div className="relative">
                      <label className="block absolute -top-3 left-2 bg-white text-sm text-gray-600 mb-2">
                        No Trade After
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="time"
                          value={noTradeAfter}
                          onChange={(e) => setNoTradeAfter(e.target.value)}
                          className="px-3 py-2 border border-blue-500 rounded-lg text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-xs text-gray-500">PM</span>
                        <Clock className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profit Trailing */}
              <div className="mb-8 border-t border-gray-200 pt-6">
                <h2 className="text-lg font-semibold mb-4">Profit Trailing</h2>
                <div className="flex gap-6">
                  {[
                    "No Trailing",
                    "Lock Fix Profit",
                    "Trail Profit",
                    "Lock and Trail",
                  ].map((option) => (
                    <label
                      key={option}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="profitTrailing"
                        value={option}
                        checked={profitTrailing === option}
                        onChange={(e) => setProfitTrailing(e.target.value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Strategy Name and Save */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 mr-4">
                    <input
                      type="text"
                      placeholder="Strategy name"
                      value={strategyName}
                      onChange={(e) => setStrategyName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <svg
                        className="w-5 h-5 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                        />
                      </svg>
                    </button>
                    <button className="px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                      Save & Continue
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "My Strategies" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">My Trading Strategies</h1>
                  <p className="text-gray-600">
                    Manage and monitor your algorithmic trading strategies
                  </p>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="text-sm font-medium text-gray-600 mb-2">
                    Total Strategies
                  </div>
                  <div className="text-2xl font-bold">4</div>
                  <p className="text-xs text-gray-500 mt-1">
                    2 running, 1 paused, 1 stopped
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="text-sm font-medium text-gray-600 mb-2">
                    Avg ROI
                  </div>
                  <div className="text-2xl font-bold text-green-600">18.0%</div>
                  <p className="text-xs text-gray-500 mt-1">
                    Across all strategies
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="text-sm font-medium text-gray-600 mb-2">
                    Total Trades
                  </div>
                  <div className="text-2xl font-bold">1,924</div>
                  <p className="text-xs text-gray-500 mt-1">This month</p>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="text-sm font-medium text-gray-600 mb-2">
                    Avg Win Rate
                  </div>
                  <div className="text-2xl font-bold">62.0%</div>
                  <p className="text-xs text-gray-500 mt-1">Weighted average</p>
                </div>
              </div>

              {/* Strategies List */}
              <div className="space-y-4">
                {strategies.map((strategy) => (
                  <div
                    key={strategy.id}
                    className="bg-white rounded-lg border border-gray-200 p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Target className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">
                            {strategy.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {strategy.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${
                            strategy.status === "Running"
                              ? "border-green-200 text-green-700 bg-green-50"
                              : strategy.status === "Paused"
                              ? "border-yellow-200 text-yellow-700 bg-yellow-50"
                              : "border-red-200 text-red-700 bg-red-50"
                          }`}
                        >
                          {strategy.status === "Running" ? (
                            <Play className="w-3 h-3" />
                          ) : strategy.status === "Paused" ? (
                            <Pause className="w-3 h-3" />
                          ) : (
                            <TrendingDown className="w-3 h-3" />
                          )}
                          {strategy.status}
                        </span>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-4">
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-600">Market</p>
                          <p className="font-semibold">{strategy.market}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Timeframe</p>
                          <p className="font-semibold">{strategy.timeframe}</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-600">ROI</p>
                          <p
                            className={`font-semibold ${
                              strategy.roi >= 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {strategy.roi >= 0 ? "+" : ""}
                            {strategy.roi}%
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Total Trades</p>
                          <p className="font-semibold">
                            {strategy.trades.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-600">Win Rate</p>
                          <p className="font-semibold">{strategy.winRate}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Max Drawdown</p>
                          <p className="font-semibold text-red-600">
                            {strategy.maxDrawdown}%
                          </p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-600">Sharpe Ratio</p>
                          <p className="font-semibold">{strategy.sharpe}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Created</p>
                          <p className="text-sm text-gray-500">
                            {strategy.createdAt}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(activeTab === "Deployed Strategies" ||
            activeTab === "Strategy Template" ||
            activeTab === "My Portfolio") && (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  {activeTab}
                </h3>
                <p className="text-gray-500">
                  This section is under development
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
