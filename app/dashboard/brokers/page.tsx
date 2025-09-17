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
import BrokerModal from "@/components/broker-modal";

import axios from "axios";
// @ts-ignore
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function BrokersPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [brokers, setBrokers] = useState<any[]>([]);
  const [engineStatuses, setEngineStatuses] = useState<Record<string, string>>({});
  const [engineLoadingStates, setEngineLoadingStates] = useState<Record<string, boolean>>({});
  const [tokenValidationStates, setTokenValidationStates] = useState<Record<string, { isValid: boolean; isLoading: boolean }>>({});
  const [showConnectButton, setShowConnectButton] = useState<Record<string, boolean>>({});
  const [profileData, setProfileData] = useState<Record<string, any>>({});
  const [profileLoadingStates, setProfileLoadingStates] = useState<Record<string, boolean>>({});
  const base_url = process.env.NEXT_PUBLIC_API_BASE_LOCAL_URL;

  const getConnectedBrokers = async () => {
    try {
      setIsLoading(true);

      const token = Cookies.get("token"); // Get token from cookies
      console.log("token::::", token);

      const { data } = await axios.get(
        `${base_url}/trading-engine/user-broker-data`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBrokers(data.brokers);
    } catch (err) {
      console.error("Error connecting AngelOne:", err);
      alert("Failed to connect AngelOne. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const validateAngelOneTokens = async (brokerId: string) => {
    try {
      setTokenValidationStates(prev => ({
        ...prev,
        [brokerId]: { isValid: false, isLoading: true }
      }));

      const token = Cookies.get("token");
      const response = await axios.get(`${base_url}/user/AG-profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // If we get here, tokens are valid
      setTokenValidationStates(prev => ({
        ...prev,
        [brokerId]: { isValid: true, isLoading: false }
      }));
      setShowConnectButton(prev => ({
        ...prev,
        [brokerId]: false
      }));

      // Store profile data
      setProfileData(prev => ({
        ...prev,
        [brokerId]: response.data
      }));

    } catch (err) {
      console.error("Error validating Angel One tokens:", err);
      setTokenValidationStates(prev => ({
        ...prev,
        [brokerId]: { isValid: false, isLoading: false }
      }));
      setShowConnectButton(prev => ({
        ...prev,
        [brokerId]: true
      }));
    }
  };

  const fetchProfileData = async (brokerId: string) => {
    try {
      setProfileLoadingStates(prev => ({
        ...prev,
        [brokerId]: true
      }));

      const token = Cookies.get("token");
      const response = await axios.get(`${base_url}/user/AG-profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProfileData(prev => ({
        ...prev,
        [brokerId]: response.data
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

  const connectAngelOne = async (brokerId: string) => {
    try {
      setTokenValidationStates(prev => ({
        ...prev,
        [brokerId]: { isValid: false, isLoading: true }
      }));

      const token = Cookies.get("token");
      
      // Get the Angel One connection URL from backend
      const { data } = await axios.get(`${base_url}/user/connect-angelone`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Direct redirect to Angel One publisher login
      window.location.href = data.url;

    } catch (err) {
      console.error("Error connecting to Angel One:", err);
      alert("Failed to connect to Angel One. Please try again.");
      setTokenValidationStates(prev => ({
        ...prev,
        [brokerId]: { isValid: false, isLoading: false }
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

  useEffect(() => {
    getConnectedBrokers();
  }, []);

  useEffect(() => {
    // Fetch trade engine status and validate tokens for each broker
    brokers.forEach(broker => {
      getTradeEngineStatus(broker.id);
      // Validate Angel One tokens if it's an Angel One broker
      if (broker.BrokerName === 'AngelOne' || broker.BrokerName === 'Angel One') {
        // Set initial state for showConnectButton based on broker login status
        setShowConnectButton(prev => ({
          ...prev,
          [broker.id]: broker.BrokerLoginStatus !== true
        }));
        validateAngelOneTokens(broker.id);
      }
    });
  }, [brokers]);

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
            <BrokerModal />
            {/* <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={connectAG}
              disabled={isLoading}
            >
              {isLoading ? "Connecting..." : "Connect AngelOne"}
            </Button> */}
          </div>
        </div>



        {/* Summary Cards */}
        {/* <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-gray-200 bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$139,125.65</div>
              <p className="text-xs text-gray-500 mt-1">Across all brokers</p>
            </CardContent>
          </Card>

          <Card className="border-gray-200 bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Connected Brokers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3/4</div>
              <p className="text-xs text-gray-500 mt-1">1 disconnected</p>
            </CardContent>
          </Card>

          <Card className="border-gray-200 bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Trades
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4,711</div>
              <p className="text-xs text-gray-500 mt-1">This month</p>
            </CardContent>
          </Card>

          <Card className="border-gray-200 bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Avg Commission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$0.12</div>
              <p className="text-xs text-gray-500 mt-1">Per trade</p>
            </CardContent>
          </Card>
        </div> */}

        {/* Brokers List */}
        <div className="grid gap-6">
          {brokers?.map((broker) => (
            <Card key={broker.id} className="border-gray-200 bg-white">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                      <Image
                        src={broker.brokerLogoUrl}
                        alt={broker.name}
                        width={48}
                        height={48}
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{broker.BrokerName}</h3>
                      <p className="text-sm text-gray-600">{broker.BrokerClientId}</p>
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
                  <div>
                    
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Show connect button if tokens are invalid */}
                    {showConnectButton[broker.id] && (broker.BrokerName === 'AngelOne' || broker.BrokerName === 'Angel One') ? (
                      <Button
                        onClick={() => connectAngelOne(broker.id)}
                        disabled={tokenValidationStates[broker.id]?.isLoading}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        size="sm"
                      >
                        {tokenValidationStates[broker.id]?.isLoading ? (
                          <>
                            <RefreshCw className="mr-2 h-3 w-3 animate-spin" />
                            Connecting...
                          </>
                        ) : (
                          "Connect"
                        )}
                      </Button>
                    ) : (
                      <>
                        <Badge
                          variant="outline"
                          className={
                            broker.BrokerLoginStatus === true
                              ? "border-green-200 text-green-700"
                              : "border-red-200 text-red-700"
                          }
                        >
                          {broker.BrokerLoginStatus === true ? (
                            <Wifi className="mr-1 h-3 w-3" />
                          ) : (
                            <WifiOff className="mr-1 h-3 w-3" />
                          )}
                          {broker.BrokerLoginStatus === true ? "Connected" : "Disconnected"}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Disconnect
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Show profile data if broker is connected and profile data is available */}
                {broker.BrokerLoginStatus === true && tokenValidationStates[broker.id]?.isValid && profileData[broker.id] ? (
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600">Client Code</p>
                        <p className="text-lg font-semibold">
                          {profileData[broker.id]?.data?.clientcode || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Name</p>
                        <p className="text-lg font-semibold">
                          {profileData[broker.id]?.data?.name || 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="text-lg font-semibold">
                          {profileData[broker.id]?.data?.email || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Mobile</p>
                        <p className="text-lg font-semibold">
                          {profileData[broker.id]?.data?.mobile || 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600">Exchange Enabled</p>
                        <p className="text-lg font-semibold">
                          {profileData[broker.id]?.data?.exchanges?.join(', ') || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Product Types</p>
                        <p className="text-lg font-semibold">
                          {profileData[broker.id]?.data?.productTypes?.join(', ') || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : broker.BrokerLoginStatus === true && tokenValidationStates[broker.id]?.isValid ? (
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
                      {/* Show connect button for Angel One brokers */}
                      {(broker.BrokerName === 'AngelOne' || broker.BrokerName === 'Angel One') && (
                        <Button
                          onClick={() => connectAngelOne(broker.id)}
                          disabled={tokenValidationStates[broker.id]?.isLoading}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          size="sm"
                        >
                          {tokenValidationStates[broker.id]?.isLoading ? (
                            <>
                              <RefreshCw className="mr-2 h-3 w-3 animate-spin" />
                              Connecting...
                            </>
                          ) : (
                            "Connect Angel One"
                          )}
                        </Button>
                      )}
                      
                      {/* Fallback connect button for any other broker */}
                      {!(broker.BrokerName === 'AngelOne' || broker.BrokerName === 'Angel One') && (
                        <Button
                          onClick={() => {
                            alert(`Connect functionality for ${broker.BrokerName} is not yet implemented.`);
                          }}
                          className="bg-gray-600 hover:bg-gray-700 text-white"
                          size="sm"
                        >
                          Connect {broker.BrokerName}
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
