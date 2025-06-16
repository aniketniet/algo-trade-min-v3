"use client";

import React, { useState, useEffect } from "react";
import { Plus, Target, Play, Pause, TrendingDown, FileText, Clock } from "lucide-react";
import { useStrategies } from "@/context/StrategyContext";
import StrategyForm from "@/components/StrategyForm";
import StrategyList from "@/components/StrategyList";


export default function AlgoroomStrategyPage() {
  const [activeTab, setActiveTab] = useState("Create Strategy");
  const { strategies, loading, fetchStrategies, createStrategy } = useStrategies();

  useEffect(() => {
    if (activeTab === "My Strategies") {
      fetchStrategies({ mode: "backtest" });
    }
  }, [activeTab]);

  const handleCreateStrategy = async (strategyData) => {
    try {
      await createStrategy(strategyData);
      setActiveTab("My Strategies");
    } catch (error) {
      console.error("Failed to create strategy:", error);
    }
  };

  const tabs = [
    "Create Strategy",
    "My Strategies",
    "Deployed Strategies",
    "Strategy Template",
    "My Portfolio",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="w-full">
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
            <StrategyForm onSubmit={handleCreateStrategy} />
          )}

          {activeTab === "My Strategies" && (
            <StrategyList strategies={strategies} loading={loading} />
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