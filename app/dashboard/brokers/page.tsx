"use client";

import {
  Activity,
  ChevronDown,
  Wifi,
  WifiOff,
  RefreshCw,
  Edit,
  Trash2,
  Power,
  PowerOff,
  Plus,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import BrokerModal from "@/components/broker-modal";

import axios from "axios";
// @ts-ignore
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function BrokersPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [availableBrokers, setAvailableBrokers] = useState<any[]>([]);
  const [connectedBrokers, setConnectedBrokers] = useState<any[]>([]);
  const [engineStatuses, setEngineStatuses] = useState<Record<string, string>>({});
  const [engineLoadingStates, setEngineLoadingStates] = useState<Record<string, boolean>>({});
  const [connectionStates, setConnectionStates] = useState<Record<string, { isConnected: boolean; isLoading: boolean; error?: string }>>({});
  const [profileData, setProfileData] = useState<Record<string, any>>({});
  const [profileLoadingStates, setProfileLoadingStates] = useState<Record<string, boolean>>({});
  const [showAddBrokerModal, setShowAddBrokerModal] = useState(false);
  const [selectedBrokerForModal, setSelectedBrokerForModal] = useState<string | null>(null);
  const [refreshLoadingStates, setRefreshLoadingStates] = useState<Record<string, boolean>>({});
  const base_url = process.env.NEXT_PUBLIC_API_BASE_LOCAL_URL || 'http://localhost:4000/api';

  // Debug: Log available brokers state changes
  console.log("BrokersPage - Available brokers:", availableBrokers);

  // Fetch available brokers
  const getAvailableBrokers = async () => {
    try {
      const token = Cookies.get("token");
      const { data } = await axios.get(`${base_url}/brokers/available`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Available brokers API response:", data);
      setAvailableBrokers(data.data || []);
    } catch (err) {
      console.error("Error fetching available brokers:", err);
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
      console.log("Using fallback brokers:", fallbackBrokers);
      setAvailableBrokers(fallbackBrokers);
    }
  };

  // Fetch connected brokers
  const getConnectedBrokers = async () => {
    try {
      setIsLoading(true);
      const token = Cookies.get("token");
      const { data } = await axios.get(`${base_url}/brokers/connected`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setConnectedBrokers(data.data || []);
    } catch (err) {
      console.error("Error fetching connected brokers:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Check broker connection status
  const checkBrokerConnection = async (brokerId: string) => {
    try {
      setConnectionStates(prev => ({
        ...prev,
        [brokerId]: { isConnected: false, isLoading: true }
      }));

      const token = Cookies.get("token");
      const response = await axios.get(`${base_url}/brokers/${brokerId}/status`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const isConnected = response.data.data?.connected || false;
      setConnectionStates(prev => ({
        ...prev,
        [brokerId]: { isConnected, isLoading: false }
      }));

      if (isConnected && response.data.data?.profile) {
        setProfileData(prev => ({
          ...prev,
          [brokerId]: response.data.data.profile
        }));
      }

    } catch (err) {
      console.error(`Error checking ${brokerId} connection:`, err);
      setConnectionStates(prev => ({
        ...prev,
        [brokerId]: { isConnected: false, isLoading: false, error: err.message }
      }));
    }
  };

  // Fetch broker profile data
  const fetchProfileData = async (brokerId: string) => {
    try {
      setProfileLoadingStates(prev => ({
        ...prev,
        [brokerId]: true
      }));

      const token = Cookies.get("token");
      const response = await axios.get(`${base_url}/brokers/${brokerId}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProfileData(prev => ({
        ...prev,
        [brokerId]: response.data.data
      }));

    } catch (err) {
      console.error("Error fetching profile data:", err);
    } finally {
      setProfileLoadingStates(prev => ({
        ...prev,
        [brokerId]: false
      }));
    }
  };

  const getTradeEngineStatus = async (brokerId: string) => {
    try {
      const token = Cookies.get("token");
      // For now, we'll default to "Stopped" since the backend doesn't have a status endpoint
      // The status will be updated when the user toggles the switch
      setEngineStatuses(prev => ({
        ...prev,
        [brokerId]: "Stopped"
      }));
    } catch (err) {
      console.error("Error fetching trade engine status:", err);
      setEngineStatuses(prev => ({
        ...prev,
        [brokerId]: "Stopped"
      }));
    }
  };

  // Connect to a broker
  const connectBroker = async (brokerId: string) => {
    try {
      setConnectionStates(prev => ({
        ...prev,
        [brokerId]: { isConnected: false, isLoading: true }
      }));

      const token = Cookies.get("token");
      
      if (brokerId === 'dhan') {
        // For Dhan, show the modal for manual token input
        setSelectedBrokerForModal('dhan');
        setShowAddBrokerModal(true);
        setConnectionStates(prev => ({
          ...prev,
          [brokerId]: { isConnected: false, isLoading: false }
        }));
        return;
      }
      
      // Get the broker connection URL from backend for other brokers
      const { data } = await axios.get(`${base_url}/brokers/${brokerId}/connect`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (data.data?.loginUrl) {
        // Open in new window for OAuth flow
        const popup = window.open(data.data.loginUrl, `${brokerId}_auth`, 'width=600,height=800');
        
        // Listen for popup completion
        const checkClosed = setInterval(() => {
          if (popup?.closed) {
            clearInterval(checkClosed);
            // Refresh connection status after popup closes
            setTimeout(() => {
              checkBrokerConnection(brokerId);
              getConnectedBrokers();
            }, 1000);
          }
        }, 1000);
      } else {
        // Direct connection
        await getConnectedBrokers();
        await checkBrokerConnection(brokerId);
      }

    } catch (err) {
      console.error(`Error connecting to ${brokerId}:`, err);
      alert(`Failed to connect to ${brokerId}. Please try again.`);
      setConnectionStates(prev => ({
        ...prev,
        [brokerId]: { isConnected: false, isLoading: false, error: err.message }
      }));
    }
  };

  // Disconnect from a broker
  const disconnectBroker = async (brokerId: string) => {
    try {
      setConnectionStates(prev => ({
        ...prev,
        [brokerId]: { isConnected: false, isLoading: true }
      }));

      const token = Cookies.get("token");
      await axios.delete(`${base_url}/brokers/${brokerId}/disconnect`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Refresh data
      await getConnectedBrokers();
      setConnectionStates(prev => ({
        ...prev,
        [brokerId]: { isConnected: false, isLoading: false }
      }));

    } catch (err) {
      console.error(`Error disconnecting from ${brokerId}:`, err);
      alert(`Failed to disconnect from ${brokerId}. Please try again.`);
      setConnectionStates(prev => ({
        ...prev,
        [brokerId]: { isConnected: true, isLoading: false, error: err.message }
      }));
    }
  };

  const toggleTradeEngine = async (brokerId: string, enabled: boolean) => {
    try {
      setEngineLoadingStates(prev => ({
        ...prev,
        [brokerId]: true
      }));
      const token = Cookies.get("token");
      
      const requestBody = {
        TradeEngineName: `${brokerId}_${Date.now()}`, // Generate unique engine name
        BrokerClientId: brokerId,
        ConnectOptions: enabled ? "Start" : "Stop"
      };

      const { data } = await axios.post(
        `${base_url}/trading-engine/start-stop-trade-engine`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (data.Status === "Success") {
        setEngineStatuses(prev => ({
          ...prev,
          [brokerId]: data.Data.status || (enabled ? "Running" : "Stopped")
        }));
      } else {
        throw new Error(data.Message || "Failed to toggle trade engine");
      }
    } catch (err) {
      console.error(`Error ${enabled ? 'starting' : 'stopping'} trade engine:`, err);
      alert(`Failed to ${enabled ? 'start' : 'stop'} trade engine. Please try again.`);
    } finally {
      setEngineLoadingStates(prev => ({
        ...prev,
        [brokerId]: false
      }));
    }
  };

  // Refresh Dhan token
  const refreshDhanToken = async (brokerId: string) => {
    if (brokerId !== 'dhan') return;
    
    try {
      setRefreshLoadingStates(prev => ({
        ...prev,
        [brokerId]: true
      }));

      const token = Cookies.get("token");
      const { data } = await axios.post(`${base_url}/brokers/dhan/refresh`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        alert('Dhan token refreshed successfully!');
        // Refresh connection status
        await checkBrokerConnection(brokerId);
        await getConnectedBrokers();
      } else {
        alert(`Failed to refresh Dhan token: ${data.message}`);
      }
    } catch (err) {
      console.error('Error refreshing Dhan token:', err);
      alert('Failed to refresh Dhan token. Please try again.');
    } finally {
      setRefreshLoadingStates(prev => ({
        ...prev,
        [brokerId]: false
      }));
    }
  };

  useEffect(() => {
    getAvailableBrokers();
    getConnectedBrokers();
  }, []);

  // Initialize with fallback brokers if none are loaded
  useEffect(() => {
    if (availableBrokers.length === 0) {
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
      setAvailableBrokers(fallbackBrokers);
    }
  }, [availableBrokers.length]);

  useEffect(() => {
    // Check connection status for each connected broker
    connectedBrokers.forEach(broker => {
      getTradeEngineStatus(broker.id);
      checkBrokerConnection(broker.id);
    });
  }, [connectedBrokers]);

  // const brokers = [
  //   {
  //     id: 1,
  //     name: "Interactive Brokers",
  //     type: "Stock & Options",
  //     status: "Connected",
  //     balance: "$87,432.50",
  //     equity: "$89,123.75",
  //     margin: "$45,000.00",
  //     lastSync: "2 minutes ago",
  //     trades: 1247,
  //     commission: "$0.005/share",
  //   },
  //   {
  //     id: 2,
  //     name: "TD Ameritrade",
  //     type: "Forex & Futures",
  //     status: "Connected",
  //     balance: "$23,567.80",
  //     equity: "$24,890.30",
  //     margin: "$12,000.00",
  //     lastSync: "5 minutes ago",
  //     trades: 432,
  //     commission: "$0.65/contract",
  //   },
  //   {
  //     id: 3,
  //     name: "Binance",
  //     type: "Cryptocurrency",
  //     status: "Disconnected",
  //     balance: "$15,234.90",
  //     equity: "$14,987.60",
  //     margin: "$0.00",
  //     lastSync: "2 hours ago",
  //     trades: 2156,
  //     commission: "0.1%",
  //   },
  //   {
  //     id: 4,
  //     name: "Alpaca",
  //     type: "Stock Trading",
  //     status: "Connected",
  //     balance: "$12,890.45",
  //     equity: "$13,245.80",
  //     margin: "$5,000.00",
  //     lastSync: "1 minute ago",
  //     trades: 876,
  //     commission: "$0.00",
  //   },
  // ];

  return (
    <main className="flex-1 overflow-auto bg-gray-50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">
              Broker Connections
            </h1>
            <p className="text-gray-600">
              Manage your trading accounts and broker integrations
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <Button
              onClick={() => setShowAddBrokerModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Broker
            </Button>
          </div>
        </div>



        {/* Summary Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-gray-200 bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Available Brokers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{availableBrokers.length}</div>
              <p className="text-xs text-gray-500 mt-1">Brokers supported</p>
            </CardContent>
          </Card>

          <Card className="border-gray-200 bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Connected Brokers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{connectedBrokers.length}</div>
              <p className="text-xs text-gray-500 mt-1">
                {connectedBrokers.filter(b => b.isConnected).length} active
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-200 bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Active Engines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Object.values(engineStatuses).filter(status => status === "Running").length}
              </div>
              <p className="text-xs text-gray-500 mt-1">Trading engines running</p>
            </CardContent>
          </Card>

          <Card className="border-gray-200 bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Connection Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Object.values(connectionStates).filter(state => state.isConnected).length}
              </div>
              <p className="text-xs text-gray-500 mt-1">Brokers connected</p>
            </CardContent>
          </Card>
        </div>

        {/* Available Brokers */}
        {availableBrokers.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Available Brokers</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {availableBrokers.map((broker) => {
                const isConnected = connectedBrokers.some(conn => conn.id === broker.id && conn.isConnected);
                const connectionState = connectionStates[broker.id];
                
                return (
                  <Card key={broker.id} className="border-gray-200 bg-white">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                            <span className="text-2xl">
                              {broker.id === 'angel' ? '🅰️' : broker.id === 'dhan' ? '🏦' : '📊'}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold">{broker.name}</h3>
                            <p className="text-sm text-gray-600">{broker.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {isConnected ? (
                            <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50">
                              <CheckCircle className="mr-1 h-3 w-3" />
                              Connected
                            </Badge>
                          ) : (
                            <Button
                              onClick={() => connectBroker(broker.id)}
                              disabled={connectionState?.isLoading}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                              size="sm"
                            >
                              {connectionState?.isLoading ? (
                                <>
                                  <RefreshCw className="mr-2 h-3 w-3 animate-spin" />
                                  Connecting...
                                </>
                              ) : (
                                <>
                                  <ExternalLink className="mr-2 h-3 w-3" />
                                  Connect
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm text-gray-600">Features:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {broker.features?.map((feature, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        {connectionState?.error && (
                          <Alert className="border-red-200 bg-red-50">
                            <AlertCircle className="h-4 w-4 text-red-600" />
                            <AlertDescription className="text-red-700 text-sm">
                              {connectionState.error}
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Connected Brokers */}
        {connectedBrokers.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Connected Brokers</h2>
            <div className="grid gap-6">
              {connectedBrokers.map((broker) => (
                <Card key={broker.id} className="border-gray-200 bg-white">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                          <span className="text-2xl">
                            {broker.id === 'angel' ? '🅰️' : broker.id === 'dhan' ? '🏦' : '📊'}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">{broker.name}</h3>
                          <p className="text-sm text-gray-600">
                            {broker.profile?.clientCode || broker.profile?.dhanClientId || 'N/A'}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex items-center gap-1">
                              {engineStatuses[broker.id] === "Running" ? (
                                <Power className="h-3 w-3 text-green-600" />
                              ) : (
                                <PowerOff className="h-3 w-3 text-red-600" />
                              )}
                              <span className="text-xs text-gray-500">Trade Engine:</span>
                            </div>
                            <Badge
                              variant="outline"
                              className={
                                engineStatuses[broker.id] === "Running"
                                  ? "border-green-200 text-green-700 bg-green-50 text-xs"
                                  : "border-red-200 text-red-700 bg-red-50 text-xs"
                              }
                            >
                              {engineStatuses[broker.id] || "Stopped"}
                            </Badge>
                            <Switch
                              checked={engineStatuses[broker.id] === "Running"}
                              onCheckedChange={(enabled) => toggleTradeEngine(broker.id, enabled)}
                              disabled={engineLoadingStates[broker.id]}
                              className="scale-75"
                            />
                            {engineLoadingStates[broker.id] && (
                              <RefreshCw className="h-3 w-3 animate-spin text-gray-500" />
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={
                            broker.isConnected
                              ? "border-green-200 text-green-700"
                              : "border-red-200 text-red-700"
                          }
                        >
                          {broker.isConnected ? (
                            <Wifi className="mr-1 h-3 w-3" />
                          ) : (
                            <WifiOff className="mr-1 h-3 w-3" />
                          )}
                          {broker.isConnected ? "Connected" : "Disconnected"}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {broker.id === 'dhan' && (
                              <DropdownMenuItem 
                                onClick={() => refreshDhanToken(broker.id)}
                                disabled={refreshLoadingStates[broker.id]}
                                className="text-blue-600"
                              >
                                {refreshLoadingStates[broker.id] ? (
                                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                  <RefreshCw className="mr-2 h-4 w-4" />
                                )}
                                Refresh Token
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem 
                              onClick={() => disconnectBroker(broker.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Disconnect
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Show profile data if broker is connected and profile data is available */}
                    {broker.isConnected && broker.profile ? (
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-gray-600">Client Code</p>
                            <p className="text-lg font-semibold">
                              {broker.profile.clientCode || broker.profile.dhanClientId || 'N/A'}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Name</p>
                            <p className="text-lg font-semibold">
                              {broker.profile.name || 'N/A'}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-gray-600">Email</p>
                            <p className="text-lg font-semibold">
                              {broker.profile.email || 'N/A'}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Mobile</p>
                            <p className="text-lg font-semibold">
                              {broker.profile.mobile || 'N/A'}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          {broker.id === 'dhan' ? (
                            <>
                              <div>
                                <p className="text-sm text-gray-600">Active Segments</p>
                                <p className="text-lg font-semibold">
                                  {broker.profile.activeSegment || 'N/A'}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Token Validity</p>
                                <p className="text-lg font-semibold">
                                  {broker.profile.tokenValidity || 'N/A'}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Data Plan</p>
                                <p className="text-lg font-semibold">
                                  {broker.profile.dataPlan || 'N/A'}
                                </p>
                              </div>
                            </>
                          ) : (
                            <>
                              <div>
                                <p className="text-sm text-gray-600">Exchange Enabled</p>
                                <p className="text-lg font-semibold">
                                  {broker.profile.exchanges?.join(', ') || 'N/A'}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Product Types</p>
                                <p className="text-lg font-semibold">
                                  {broker.profile.productTypes?.join(', ') || 'N/A'}
                                </p>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    ) : broker.isConnected ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="text-center">
                          <RefreshCw className="h-6 w-6 animate-spin text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">Loading profile data...</p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fetchProfileData(broker.id)}
                            className="mt-2"
                            disabled={profileLoadingStates[broker.id]}
                          >
                            {profileLoadingStates[broker.id] ? (
                              <>
                                <RefreshCw className="mr-2 h-3 w-3 animate-spin" />
                                Loading...
                              </>
                            ) : (
                              "Refresh Profile"
                            )}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center py-8">
                        <div className="text-center">
                          <WifiOff className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">Broker not connected</p>
                          <p className="text-xs text-gray-400 mt-1 mb-4">Connect to view profile data</p>
                          <Button
                            onClick={() => connectBroker(broker.id)}
                            disabled={connectionStates[broker.id]?.isLoading}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            size="sm"
                          >
                            {connectionStates[broker.id]?.isLoading ? (
                              <>
                                <RefreshCw className="mr-2 h-3 w-3 animate-spin" />
                                Connecting...
                              </>
                            ) : (
                              `Connect ${broker.name}`
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {connectedBrokers.length === 0 && availableBrokers.length === 0 && !isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <WifiOff className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Brokers Available</h3>
              <p className="text-gray-500 mb-4">There are no brokers available to connect at the moment.</p>
              <Button
                onClick={() => getAvailableBrokers()}
                variant="outline"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Loading brokers...</p>
            </div>
          </div>
        )}
      </div>

      {/* Add Broker Modal */}
      {showAddBrokerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">Add New Broker</h2>
              <button
                onClick={() => setShowAddBrokerModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid gap-4 md:grid-cols-2">
                {availableBrokers.map((broker) => {
                  const isConnected = connectedBrokers.some(conn => conn.id === broker.id && conn.isConnected);
                  
                  return (
                    <Card key={broker.id} className="border-gray-200 bg-white">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                            <span className="text-xl">
                              {broker.id === 'angel' ? '🅰️' : broker.id === 'dhan' ? '🏦' : '📊'}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold">{broker.name}</h3>
                            <p className="text-sm text-gray-600">{broker.description}</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <p className="text-xs text-gray-500">Features:</p>
                            <div className="flex flex-wrap gap-1">
                              {broker.features?.map((feature, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <Button
                            onClick={() => {
                              connectBroker(broker.id);
                              setShowAddBrokerModal(false);
                            }}
                            disabled={isConnected || connectionStates[broker.id]?.isLoading}
                            className="w-full"
                            size="sm"
                          >
                            {isConnected ? (
                              <>
                                <CheckCircle className="mr-2 h-3 w-3" />
                                Connected
                              </>
                            ) : connectionStates[broker.id]?.isLoading ? (
                              <>
                                <RefreshCw className="mr-2 h-3 w-3 animate-spin" />
                                Connecting...
                              </>
                            ) : (
                              <>
                                <ExternalLink className="mr-2 h-3 w-3" />
                                Connect
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Broker Modal */}
      <BrokerModal
        isOpen={showAddBrokerModal}
        onClose={() => {
          setShowAddBrokerModal(false);
          setSelectedBrokerForModal(null);
          // Refresh the brokers list when modal closes
          getConnectedBrokers();
        }}
        preselectedBroker={selectedBrokerForModal}
      />
    </main>
  );
}
