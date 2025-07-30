"use client";

import {
  Activity,
  ChevronDown,
  Wifi,
  WifiOff,
  RefreshCw,
  Edit,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Badge } from "@/components/ui/badge";
import BrokerModal from "@/components/broker-modal";

import axios from "axios";
// @ts-ignore
import Cookies from "js-cookie";
import { useState } from "react";

export default function BrokersPage() {
  const [isLoading, setIsLoading] = useState(false);
  const base_url = process.env.NEXT_PUBLIC_API_BASE_LOCAL_URL;

  // const connectAG = async () => {
  //   try {
  //     setIsLoading(true);

  //     const token = Cookies.get("token"); // Get token from cookies
  //     console.log("token::::", token);

  //     const { data } = await axios.get(
  //       `${base_url}/user/connect-angelone`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     window.location.assign(data.url); // Redirect to AngelOne auth URL
  //   } catch (err) {
  //     console.error("Error connecting AngelOne:", err);
  //     alert("Failed to connect AngelOne. Please try again.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const brokers = [
    {
      id: 1,
      name: "Interactive Brokers",
      type: "Stock & Options",
      status: "Connected",
      balance: "$87,432.50",
      equity: "$89,123.75",
      margin: "$45,000.00",
      lastSync: "2 minutes ago",
      trades: 1247,
      commission: "$0.005/share",
    },
    {
      id: 2,
      name: "TD Ameritrade",
      type: "Forex & Futures",
      status: "Connected",
      balance: "$23,567.80",
      equity: "$24,890.30",
      margin: "$12,000.00",
      lastSync: "5 minutes ago",
      trades: 432,
      commission: "$0.65/contract",
    },
    {
      id: 3,
      name: "Binance",
      type: "Cryptocurrency",
      status: "Disconnected",
      balance: "$15,234.90",
      equity: "$14,987.60",
      margin: "$0.00",
      lastSync: "2 hours ago",
      trades: 2156,
      commission: "0.1%",
    },
    {
      id: 4,
      name: "Alpaca",
      type: "Stock Trading",
      status: "Connected",
      balance: "$12,890.45",
      equity: "$13,245.80",
      margin: "$5,000.00",
      lastSync: "1 minute ago",
      trades: 876,
      commission: "$0.00",
    },
  ];

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
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
        </div>

        {/* Brokers List */}
        <div className="grid gap-6">
          {brokers.map((broker) => (
            <Card key={broker.id} className="border-gray-200 bg-white">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                      <Activity className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{broker.name}</h3>
                      <p className="text-sm text-gray-600">{broker.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={
                        broker.status === "Connected"
                          ? "border-green-200 text-green-700"
                          : "border-red-200 text-red-700"
                      }
                    >
                      {broker.status === "Connected" ? (
                        <Wifi className="mr-1 h-3 w-3" />
                      ) : (
                        <WifiOff className="mr-1 h-3 w-3" />
                      )}
                      {broker.status}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Sync Account
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Disconnect
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Account Balance</p>
                      <p className="text-lg font-semibold">{broker.balance}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Equity</p>
                      <p className="text-lg font-semibold">{broker.equity}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Margin Available</p>
                      <p className="text-lg font-semibold">{broker.margin}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Trades</p>
                      <p className="text-lg font-semibold">
                        {broker.trades.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Commission Rate</p>
                      <p className="text-lg font-semibold">
                        {broker.commission}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Last Sync</p>
                      <p className="text-sm text-gray-500">{broker.lastSync}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
