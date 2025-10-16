"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
//@ts-ignore
import Cookies from "js-cookie";
import {
  TestTube,
  BarChart2,
  ArrowUp,
  ArrowDown,
  Clock,
  TrendingUp,
  TrendingDown,
  Percent,
  Download,
  Play,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type TradeResult = {
  symbol: string;
  qty: number;
  entryPrice: number;
  exitPrice: number | null;
  entryTime: string;
  exitTime: string | null;
  pnl: number;
  stopLoss: number;
  target: number;
  reason: string;
};

type EquityPoint = {
  date: string;
  equity: number;
};

type BacktestResult = {
  strategyId: string;
  strategyName?: string;
  initialCapital: number;
  finalEquity: number;
  totalReturnPct: string;
  totalPnl: string;
  totalTrades: number;
  winningLegs: number;
  losingLegs: number;
  winRate: string;
  trades: TradeResult[];
  equityCurve: EquityPoint[];
  period: string;
  runAt: string;
};

export default function BacktestPage() {
  const searchParams = useSearchParams();
  const strategyId = searchParams.get("strategyId");
  const [backtestData, setBacktestData] = useState<BacktestResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const base_url =
    process.env.NEXT_PUBLIC_API_BASE_LOCAL_URL || "http://localhost:4000/api";

  useEffect(() => {
    if (!strategyId) {
      setError("No strategyId provided in query params.");
      return;
    }

    const fetchBacktestData = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = Cookies.get("token");
        if (!token) throw new Error("Authentication token not found.");

        const response = await axios.get(
          `${base_url}/backtest/results/${strategyId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Backtest data response:", response.data.data);

        // The API returns an array of backtest results, we want the most recent one
        const backtestResults = response.data.data;
        console.log("Backtest results array:", backtestResults);
        
        if (backtestResults && backtestResults.length > 0) {
          const latestResult = backtestResults[0];
          console.log("Setting backtest data to:", latestResult);
          setBacktestData(latestResult); // Take the first (most recent) result
        } else {
          setError("No backtest results found for this strategy.");
        }
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to fetch backtest data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBacktestData();
  }, [strategyId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <main className="flex-1 overflow-auto p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Backtest Results</h1>
          <div className="flex gap-2">
            {/* <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
            <Button>
              <Play className="mr-2 h-4 w-4" />
              Run Again
            </Button> */}
          </div>
        </div>

        {loading && (
          <div className="text-center py-8">Loading backtest data...</div>
        )}
        {error && <div className="text-center py-8 text-red-500">{error}</div>}
        
        {/* Debug information */}
        {!loading && !error && !backtestData && (
          <div className="text-center py-8 text-yellow-600">
            No backtest data available. Check console for details.
          </div>
        )}

        {!loading && !error && backtestData && (
          <>
            {/* Summary Cards */}
            <div className="grid gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      Initial Capital
                    </span>
                    <BarChart2 className="h-4 w-4 text-gray-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(backtestData.initialCapital)}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      Final Equity
                    </span>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(backtestData.finalEquity)}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      Total Return
                    </span>
                    <Percent className="h-4 w-4 text-blue-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div
                    className={`text-2xl font-bold ${
                      parseFloat(backtestData.totalReturnPct) >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {backtestData.totalReturnPct}%
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      Win Rate
                    </span>
                    <TrendingUp className="h-4 w-4 text-blue-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {backtestData.winRate}%
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {backtestData.winningLegs} wins / {backtestData.losingLegs}{" "}
                    losses
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="grid gap-6 md:grid-cols-3">
              {/* Equity Curve Chart */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TestTube className="h-5 w-5 text-blue-600" />
                    Equity Curve
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={backtestData.equityCurve}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis
                          tickFormatter={(value) =>
                            formatCurrency(value).replace("₹", "")
                          }
                        />
                        <Tooltip
                          formatter={(value) => [
                            formatCurrency(Number(value)),
                            "Equity",
                          ]}
                          labelFormatter={(label) => `Date: ${label}`}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="equity"
                          name="Equity"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          activeDot={{ r: 8 }}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
                <CardFooter className="text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>
                      Backtest ran on {formatDate(backtestData.runAt)}
                    </span>
                  </div>
                </CardFooter>
              </Card>

              {/* Trade Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle>Trade Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-600 mb-2">
                        Performance Metrics
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Total Trades</span>
                          <span className="font-medium">
                            {backtestData.totalTrades}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Winning Trades</span>
                          <span className="font-medium text-green-600">
                            {backtestData.winningLegs} ({backtestData.winRate}%)
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Losing Trades</span>
                          <span className="font-medium text-red-600">
                            {backtestData.losingLegs} (
                            {(100 - parseFloat(backtestData.winRate)).toFixed(
                              2
                            )}
                            %)
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total P&L</span>
                          <span
                            className={`font-medium ${
                              parseFloat(backtestData.totalPnl) >= 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {formatCurrency(parseFloat(backtestData.totalPnl))}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-600 mb-2">
                        Recent Trades
                      </h3>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {backtestData.trades
                          ?.slice(0, 5)
                          .map((trade, index) => (
                            <div key={index} className="border rounded p-2">
                              <div className="flex justify-between">
                                <span className="font-medium">
                                  {trade.symbol}
                                </span>
                                <span
                                  className={`text-xs ${
                                    trade.pnl >= 0
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }`}
                                >
                                  {trade.pnl >= 0 ? "+" : ""}
                                  {trade.pnl.toFixed(2)}
                                </span>
                              </div>
                              <div className="flex justify-between text-xs text-gray-500">
                                <span>Qty: {trade.qty}</span>
                                <span>
                                  {new Date(
                                    trade.entryTime
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Trades Table */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Trade History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto max-h-[400px] overflow-y-auto border rounded">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Symbol
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Entry
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Exit
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Qty
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          P&L
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Reason
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {backtestData.trades?.map((trade, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {trade.symbol}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatCurrency(trade.entryPrice)}
                            <div className="text-xs text-gray-400">
                              {new Date(trade.entryTime).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {trade.exitPrice
                              ? formatCurrency(trade.exitPrice)
                              : "-"}
                            {trade.exitTime && (
                              <div className="text-xs text-gray-400">
                                {new Date(trade.exitTime).toLocaleDateString()}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {trade.qty}
                          </td>
                          <td
                            className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                              trade.pnl >= 0 ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {trade.pnl >= 0 ? "+" : ""}
                            {trade.pnl.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {trade.reason || "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </main>
  );
}
