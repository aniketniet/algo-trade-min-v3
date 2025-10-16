"use client";

import React, { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import axios from "axios";
// @ts-ignore
import Cookies from "js-cookie";

interface Broker {
  id: string;
  name: string;
  description: string;
  logo: string;
  features: string[];
  isAvailable: boolean;
  authUrl: string;
}

const BrokerModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBroker, setSelectedBroker] = useState<Broker | null>(null);
  const [formData, setFormData] = useState({});
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const token = Cookies.get("token");
  const base_url = process.env.NEXT_PUBLIC_API_BASE_LOCAL_URL || 'http://localhost:4000/api';

  // Debug: Log brokers state changes
  console.log("BrokerModal - Current brokers state:", brokers);

  // Initialize with fallback brokers
  useEffect(() => {
    if (brokers.length === 0) {
      const fallbackBrokers = [
        {
          id: 'angel',
          name: 'Angel One',
          description: 'Angel One SmartAPI for trading',
          logo: '/images/brokers/angel-one.png',
          features: ['Equity', 'F&O', 'Currency', 'Commodity'],
          isAvailable: true,
          authUrl: '/api/brokers/angel/connect'
        },
        {
          id: 'dhan',
          name: 'Dhan',
          description: 'Dhan API for trading',
          logo: '/images/brokers/dhan.png',
          features: ['Equity', 'F&O', 'Currency'],
          isAvailable: true,
          authUrl: '/api/brokers/dhan/connect'
        }
      ];
      setBrokers(fallbackBrokers);
    }
  }, []);

  useEffect(() => {
    const fetchBrokers = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${base_url}/brokers/available`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Broker modal - Available brokers API response:", response.data);
        setBrokers(response.data.data || []);
      } catch (err) {
        console.error("Broker modal - Error fetching available brokers:", err);
        // Fallback to hardcoded brokers if API fails
        const fallbackBrokers = [
          {
            id: 'angel',
            name: 'Angel One',
            description: 'Angel One SmartAPI for trading',
            logo: '/images/brokers/angel-one.png',
            features: ['Equity', 'F&O', 'Currency', 'Commodity'],
            isAvailable: true,
            authUrl: '/api/brokers/angel/connect'
          },
          {
            id: 'dhan',
            name: 'Dhan',
            description: 'Dhan API for trading',
            logo: '/images/brokers/dhan.png',
            features: ['Equity', 'F&O', 'Currency'],
            isAvailable: true,
            authUrl: '/api/brokers/dhan/connect'
          }
        ];
        console.log("Broker modal - Using fallback brokers:", fallbackBrokers);
        setBrokers(fallbackBrokers);
        setError(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) fetchBrokers();
  }, [isOpen]);

  const handleInputChange = (fieldName: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleFileChange = async (fieldName: string, file: any) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("brokerId", selectedBroker?.id || "");
    formData.append("fieldId", fieldName);

    try {
      const response = await axios.post(`${base_url}/user/submissions`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setFormData((prev) => ({
        ...prev,
        [fieldName]: response.data.fileUrl,
      }));
    } catch (err) {
      console.error("Error uploading file:", err);
    }
  };

  const handleBrokerSelect = (broker: Broker) => {
    setSelectedBroker(broker);
    setFormData({});
  };

  function extractTokens(callbackUrl: string): any {
  try {
    const url = new URL(callbackUrl);
    const params = url.searchParams;

    const authToken = params.get("auth_token");
    const refreshToken = params.get("refresh_token");

    if (!authToken || !refreshToken) {
      throw new Error("Missing auth_token or refresh_token in URL");
    }

    return {
      authToken,
      refreshToken,
    };
  } catch (e) {
    console.error("Failed to parse URL:", e);
    return null;
  }
}

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      // Get the broker connection URL from backend
        const { data } = await axios.get(`${base_url}/brokers/${selectedBroker?.id}/connect`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      
      if (data.data?.loginUrl) {
        // Open in new window for OAuth flow
        const popup = window.open(data.data.loginUrl, `${selectedBroker?.id}_auth`, 'width=600,height=800');
        
        // Listen for popup completion
        const checkClosed = setInterval(() => {
          if (popup?.closed) {
            clearInterval(checkClosed);
            alert(`${selectedBroker?.name} connection completed!`);
            setIsOpen(false);
            setSelectedBroker(null);
            setFormData({});
          }
        }, 1000);
      } else {
        // Direct connection (like Dhan sandbox)
        alert(`${selectedBroker?.name} connected successfully!`);
        setIsOpen(false);
        setSelectedBroker(null);
        setFormData({});
      }

    } catch (err) {
      console.error("Error connecting to broker:", err);
      alert(`Failed to connect to ${selectedBroker?.name}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setSelectedBroker(null);
    setFormData({});
  };

  const getBrokerLogo = (brokerName: string) => {
    const logos: Record<string, string> = {
      "Home Insurance": "🏠",
      "Up Stock": "📈",
      Upstock: "🔺",
      satish: "👤",
      AngelOne: "🅰️",
    };
    return logos[brokerName] || "📊";
  };

  const getBrokerColor = (brokerName: string) => {
    const colors: Record<string, string> = {
      "Home Insurance": "bg-green-500",
      "Up Stock": "bg-purple-500",
      Upstock: "bg-blue-500",
      satish: "bg-yellow-500",
      AngelOne: "bg-red-500",
    };
    return colors[brokerName] || "bg-gray-500";
  };

  return (
    <div className="p-8">
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Add Broker
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl mx-4 max-h-[90vh] overflow-hidden animate-fadeIn">
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-3">
                {selectedBroker && (
                  <button
                    onClick={handleBack}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ←
                  </button>
                )}
                <h2 className="text-xl font-semibold">
                  {selectedBroker ? `Add ${selectedBroker.name}` : "Add new broker"}
                </h2>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setSelectedBroker(null);
                  setFormData({});
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex h-[calc(90vh-80px)] transition-all duration-500 ease-in-out">
              {/* LEFT - Brokers */}
              <div className="w-1/2 p-6 border-r overflow-y-auto">
                {isLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  <>
                    <input
                      type="text"
                      placeholder="Search Brokers"
                      className="w-full mb-6 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <h3 className="text-sm font-medium text-gray-500 mb-4">
                      Available Brokers ({brokers.length})
                    </h3>
                    {error && (
                      <div className="text-yellow-600 text-sm mb-4 p-2 bg-yellow-50 rounded">
                        API Error: {error}. Showing fallback brokers.
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                      {brokers.length === 0 ? (
                        <div className="col-span-2 text-center py-8 text-gray-500">
                          No brokers available
                        </div>
                      ) : (
                        brokers.map((broker) => (
                        <button
                          key={broker.id}
                          onClick={() => handleBrokerSelect(broker)}
                          className={`flex flex-col items-center p-4 border rounded-lg transition-all 
                            ${
                              selectedBroker?.id === broker.id
                                ? "border-blue-500 bg-blue-50 shadow-md"
                                : "border-gray-200 hover:border-blue-300 hover:shadow-sm"
                            }`}
                        >
                          <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white text-lg mb-2">
                            {broker.id === 'angel' ? '🅰️' : broker.id === 'dhan' ? '🏦' : '📊'}
                          </div>
                          <span className="text-sm font-medium text-gray-700">{broker.name}</span>
                          <span className="text-xs text-gray-500 mt-1">{broker.description}</span>
                        </button>
                        ))
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* RIGHT - Form */}
              <div className="w-1/2 p-6 overflow-y-auto">
                {!selectedBroker ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-600 mb-2">Select a Broker</h3>
                    <p className="text-gray-500">Choose a broker from the left to configure your connection</p>
                  </div>
                ) : (
                  <div className="animate-fadeIn">
                    <div className="flex items-center gap-3 mb-6">
                      <div className={`w-12 h-12 rounded-full ${getBrokerColor(selectedBroker.name)} flex items-center justify-center text-white text-lg`}>
                        {getBrokerLogo(selectedBroker.name)}
                      </div>
                      <div>
                        <h3 className="font-semibold">{selectedBroker.name}</h3>
                        <p className="text-sm text-blue-600 cursor-pointer">How to add {selectedBroker.name}? →</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Description:</p>
                        <p className="text-gray-800">{selectedBroker.description}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Features:</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedBroker.features?.map((feature, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-blue-800">
                          You will be redirected to connect your {selectedBroker.name} account.
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className={`w-full mt-6 ${isLoading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"} text-white py-3 rounded-lg font-medium`}
                    >
                      {isLoading
                        ? "Connecting..."
                        : `Connect ${selectedBroker.name}`}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrokerModal;
