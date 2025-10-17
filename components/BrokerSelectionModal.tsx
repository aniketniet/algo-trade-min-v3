"use client";

import React, { useState, useEffect } from "react";
import { X, CheckCircle, AlertCircle, Wifi, WifiOff } from "lucide-react";
import axios from "axios";
// @ts-ignore
import Cookies from "js-cookie";

interface Broker {
  id: string;
  name: string;
  logoUrl: string;
  isConnected: boolean;
  connectionStatus: string;
  lastConnected?: string;
}

interface BrokerSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBroker: (brokerId: string) => void;
  strategyId: string;
  strategyName: string;
}

const BrokerSelectionModal: React.FC<BrokerSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelectBroker,
  strategyId,
  strategyName
}) => {
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deploying, setDeploying] = useState<string | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_LOCAL_URL || "http://localhost:4000/api";

  useEffect(() => {
    if (isOpen) {
      fetchBrokers();
    }
  }, [isOpen]);

  const fetchBrokers = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = Cookies.get("token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      // Fetch available brokers
      const availableResponse = await axios.get(`${API_BASE_URL}/brokers/available`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Fetch connected brokers
      const connectedResponse = await axios.get(`${API_BASE_URL}/brokers/connected`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const availableBrokers = availableResponse.data.data || [];
      const connectedBrokers = connectedResponse.data.data || [];

      console.log('🔍 Available brokers:', availableBrokers);
      console.log('🔍 Connected brokers:', connectedBrokers);

      // Merge broker data
      const brokerData: Broker[] = availableBrokers.map((broker: any) => {
        const connected = connectedBrokers.find((c: any) => c.id === broker.id);
        return {
          id: broker.id,
          name: broker.name,
          logoUrl: broker.logoUrl || `/api/placeholder/32/32`,
          isConnected: !!connected && connected.isConnected,
          connectionStatus: (connected && connected.isConnected) ? 'connected' : 'disconnected',
          lastConnected: connected?.connectedAt
        };
      });

      console.log('🔍 Final broker data:', brokerData);
      setBrokers(brokerData);
    } catch (err: any) {
      console.error("Error fetching brokers:", err);
      setError(err?.response?.data?.message || err.message || "Failed to fetch brokers");
    } finally {
      setLoading(false);
    }
  };

  const handleDeployToBroker = async (brokerId: string) => {
    try {
      setDeploying(brokerId);
      setError(null);

      const token = Cookies.get("token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      // First validate if strategy can be deployed on this broker
      const validateResponse = await axios.get(
        `${API_BASE_URL}/trading/strategies/${strategyId}/validate?broker=${brokerId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (!validateResponse.data.success) {
        throw new Error(validateResponse.data.message || "Strategy validation failed");
      }

      // Deploy strategy to the selected broker
      const deployResponse = await axios.post(
        `${API_BASE_URL}/trading/strategies/${strategyId}/add`,
        { broker: brokerId },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (deployResponse.data.success) {
        alert(`Strategy "${strategyName}" deployed successfully to ${brokerId}!`);
        onSelectBroker(brokerId);
        onClose();
      } else {
        throw new Error(deployResponse.data.message || "Failed to deploy strategy");
      }
    } catch (err: any) {
      console.error("Error deploying strategy:", err);
      setError(err?.response?.data?.message || err.message || "Failed to deploy strategy");
    } finally {
      setDeploying(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold">Deploy Strategy</h2>
            <p className="text-gray-600">Select a broker to deploy "{strategyName}"</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading brokers...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {brokers.map((broker) => (
              <div
                key={broker.id}
                className={`border rounded-lg p-4 transition-all ${
                  broker.isConnected
                    ? "border-green-200 bg-green-50 hover:bg-green-100"
                    : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border">
                      <img
                        src={broker.logoUrl}
                        alt={broker.name}
                        className="w-8 h-8 rounded"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{broker.name}</h3>
                      <div className="flex items-center gap-2">
                        {broker.isConnected ? (
                          <>
                            <Wifi className="w-4 h-4 text-green-600" />
                            <span className="text-green-700 text-sm">Connected</span>
                          </>
                        ) : (
                          <>
                            <WifiOff className="w-4 h-4 text-red-600" />
                            <span className="text-red-700 text-sm">Not Connected</span>
                          </>
                        )}
                      </div>
                      {broker.lastConnected && (
                        <p className="text-xs text-gray-500">
                          Last connected: {new Date(broker.lastConnected).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {broker.isConnected ? (
                      <button
                        onClick={() => handleDeployToBroker(broker.id)}
                        disabled={deploying === broker.id}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {deploying === broker.id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Deploying...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            Deploy
                          </>
                        )}
                      </button>
                    ) : (
                      <div className="text-center">
                        <p className="text-sm text-gray-500 mb-2">Connect broker first</p>
                        <button
                          onClick={() => {
                            onClose();
                            // Navigate to brokers page
                            window.location.href = '/dashboard/brokers';
                          }}
                          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                        >
                          Connect
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BrokerSelectionModal;
