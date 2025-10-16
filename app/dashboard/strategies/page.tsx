"use client";

import React, { useState, useEffect } from "react";
import { Plus, Target, Play, Pause, TrendingDown, FileText, Clock, ArrowLeft } from "lucide-react";
import NewStrategyForm from "@/components/NewStrategyForm";
import StrategyList from "@/components/StrategyList";
import DeployedStrategies from "@/components/DeployedStrategies";
import { useSearchParams } from "next/navigation";
import axios from "axios";
// @ts-ignore
import Cookies from "js-cookie";


export default function AlgoroomStrategyPage() {
  const [activeTab, setActiveTab] = useState("Create Strategy");
  const searchParams = useSearchParams();
  const editStrategyId = searchParams.get('edit');
  
  console.log('🔍 Page component - searchParams:', searchParams.toString());
  console.log('🔍 Page component - editStrategyId:', editStrategyId);

  useEffect(() => {
    console.log('🔍 Edit strategy ID detected:', editStrategyId);
    if (editStrategyId) {
      setActiveTab("Create Strategy");
    }
  }, [editStrategyId]);

  const handleCreateStrategy = async (strategyData) => {
    try {
      // Use the new backend API
      const token = Cookies.get("token");
      const base_url = process.env.NEXT_PUBLIC_API_BASE_LOCAL_URL || 'http://localhost:4000/api';
      
      let response;
      
      if (editStrategyId) {
        // Update existing strategy
        response = await axios.put(`${base_url}/strategies/${editStrategyId}`, strategyData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        // Create new strategy
        response = await axios.post(`${base_url}/strategies`, strategyData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      
      if (response.data.success) {
        const action = editStrategyId ? "updated" : "created";
        alert(`Strategy ${action} successfully!`);
        setActiveTab("My Strategies");
        // Clear edit mode and refresh strategies list
        if (editStrategyId) {
          window.history.replaceState({}, '', '/dashboard/strategies');
        }
        window.location.reload();
      } else {
        throw new Error(response.data.message || `Failed to ${editStrategyId ? 'update' : 'create'} strategy`);
      }
    } catch (error) {
      console.error(`Failed to ${editStrategyId ? 'update' : 'create'} strategy:`, error);
      const action = editStrategyId ? 'update' : 'create';
      alert(`Failed to ${action} strategy: ${error.response?.data?.message || error.message}`);
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
            <div>
              {editStrategyId && (
                <div className="mb-6">
                  <button
                    onClick={() => {
                      setActiveTab("My Strategies");
                      // Remove edit parameter from URL
                      window.history.replaceState({}, '', '/dashboard/strategies');
                    }}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Strategies
                  </button>
                  <h2 className="text-xl font-semibold mt-2">Edit Strategy</h2>
                  <p className="text-gray-600">Modify your strategy configuration</p>
                </div>
              )}
              <NewStrategyForm 
                onSubmit={handleCreateStrategy} 
                strategyId={editStrategyId || undefined}
                isEditMode={!!editStrategyId}
              />
              {console.log('🔍 Passing props to NewStrategyForm:', {
                strategyId: editStrategyId || undefined,
                isEditMode: !!editStrategyId
              })}
            </div>
          )}

          {activeTab === "My Strategies" && (
            <StrategyList />
          )}

          {activeTab === "Deployed Strategies" && (
            <DeployedStrategies />
          )}
          
          {(activeTab === "Strategy Template" ||
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