"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Activity,
  Bell,
  ChevronDown,
  Home,
  LogOut,
  Menu,
  MessageSquare,
  Plus,
  Search,
  Settings,
  TrendingUp,
  User,
  Calendar,
  Target,
  TestTube,
  FileText,
  Play,
  Download,
  BarChart3,
  TrendingDown,
  Clock,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

export default function BacktestPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNewBacktestOpen, setIsNewBacktestOpen] = useState(false);

  const backtests = [
    {
      id: 1,
      name: "Momentum Scalper - Q4 2023",
      strategy: "Momentum Scalper",
      period: "2023-10-01 to 2023-12-31",
      status: "Completed",
      roi: 24.3,
      trades: 1247,
      winRate: 78.5,
      maxDrawdown: 3.2,
      sharpe: 2.1,
      sortino: 2.8,
      calmar: 7.6,
      duration: "2h 34m",
      completedAt: "2024-01-20 14:30",
    },
    {
      id: 2,
      name: "Mean Reversion - Full Year 2023",
      strategy: "Mean Reversion",
      period: "2023-01-01 to 2023-12-31",
      status: "Running",
      roi: 18.7,
      trades: 432,
      winRate: 65.2,
      maxDrawdown: 5.1,
      sharpe: 1.8,
      sortino: 2.3,
      calmar: 3.7,
      duration: "Running...",
      progress: 67,
    },
    {
      id: 3,
      name: "Breakout Hunter - Crypto Bull Run",
      strategy: "Breakout Hunter",
      period: "2023-03-01 to 2023-06-30",
      status: "Failed",
      roi: -2.1,
      trades: 156,
      winRate: 45.8,
      maxDrawdown: 8.7,
      sharpe: 0.3,
      sortino: 0.1,
      calmar: -0.2,
      duration: "Failed at 23%",
      completedAt: "2024-01-19 09:15",
    },
    {
      id: 4,
      name: "Trend Following - Bear Market Test",
      strategy: "Trend Following",
      period: "2022-06-01 to 2022-12-31",
      status: "Completed",
      roi: 31.2,
      trades: 89,
      winRate: 58.4,
      maxDrawdown: 12.3,
      sharpe: 1.4,
      sortino: 1.9,
      calmar: 2.5,
      duration: "4h 12m",
      completedAt: "2024-01-15 16:45",
    },
  ];

  return (
   
        <main className="flex-1 overflow-auto bg-gray-50 p-4 md:p-6">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold md:text-3xl">
                  Strategy Backtesting
                </h1>
                <p className="text-gray-600">
                  Test your strategies against historical market data
                </p>
              </div>
              <Dialog
                open={isNewBacktestOpen}
                onOpenChange={setIsNewBacktestOpen}
              >
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="mr-2 h-4 w-4" />
                    New Backtest
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Create New Backtest</DialogTitle>
                    <DialogDescription>
                      Configure parameters for your strategy backtest.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="backtest-name">Backtest Name</Label>
                      <Input
                        id="backtest-name"
                        placeholder="Enter backtest name"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="strategy-select">Strategy</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select strategy" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="momentum">
                            Momentum Scalper
                          </SelectItem>
                          <SelectItem value="mean-reversion">
                            Mean Reversion
                          </SelectItem>
                          <SelectItem value="breakout">
                            Breakout Hunter
                          </SelectItem>
                          <SelectItem value="trend">Trend Following</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="start-date">Start Date</Label>
                        <Input id="start-date" type="date" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="end-date">End Date</Label>
                        <Input id="end-date" type="date" />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="initial-capital">Initial Capital</Label>
                      <Input
                        id="initial-capital"
                        type="number"
                        placeholder="100000"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="commission">Commission per Trade</Label>
                      <Input
                        id="commission"
                        type="number"
                        step="0.01"
                        placeholder="0.005"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Start Backtest
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Summary Cards */}
            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="border-gray-200 bg-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Total Backtests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4</div>
                  <p className="text-xs text-gray-500 mt-1">
                    2 completed, 1 running, 1 failed
                  </p>
                </CardContent>
              </Card>

              <Card className="border-gray-200 bg-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Best ROI
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">31.2%</div>
                  <p className="text-xs text-gray-500 mt-1">
                    Trend Following strategy
                  </p>
                </CardContent>
              </Card>

              <Card className="border-gray-200 bg-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Avg Sharpe Ratio
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1.65</div>
                  <p className="text-xs text-gray-500 mt-1">
                    Risk-adjusted returns
                  </p>
                </CardContent>
              </Card>

              <Card className="border-gray-200 bg-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Total Trades
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,924</div>
                  <p className="text-xs text-gray-500 mt-1">
                    Across all backtests
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Backtests List */}
            <div className="grid gap-6">
              {backtests.map((backtest) => (
                <Card key={backtest.id} className="border-gray-200 bg-white">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                          <TestTube className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">
                            {backtest.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {backtest.strategy} • {backtest.period}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={
                            backtest.status === "Completed"
                              ? "border-green-200 text-green-700"
                              : backtest.status === "Running"
                              ? "border-blue-200 text-blue-700"
                              : "border-red-200 text-red-700"
                          }
                        >
                          {backtest.status === "Completed" ? (
                            <BarChart3 className="mr-1 h-3 w-3" />
                          ) : backtest.status === "Running" ? (
                            <Clock className="mr-1 h-3 w-3" />
                          ) : (
                            <TrendingDown className="mr-1 h-3 w-3" />
                          )}
                          {backtest.status}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <BarChart3 className="mr-2 h-4 w-4" />
                              View Results
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              Export Report
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Play className="mr-2 h-4 w-4" />
                              Run Again
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {backtest.status === "Running" && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">
                            Progress
                          </span>
                          <span className="text-sm text-gray-600">
                            {backtest.progress}%
                          </span>
                        </div>
                        <Progress value={backtest.progress} className="h-2" />
                      </div>
                    )}
                    <div className="grid gap-4 md:grid-cols-4">
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-600">ROI</p>
                          <p
                            className={`text-lg font-semibold ${
                              backtest.roi >= 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {backtest.roi >= 0 ? "+" : ""}
                            {backtest.roi}%
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Total Trades</p>
                          <p className="font-semibold">
                            {backtest.trades.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-600">Win Rate</p>
                          <p className="font-semibold">{backtest.winRate}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Max Drawdown</p>
                          <p className="font-semibold text-red-600">
                            {backtest.maxDrawdown}%
                          </p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-600">Sharpe Ratio</p>
                          <p className="font-semibold">{backtest.sharpe}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Sortino Ratio</p>
                          <p className="font-semibold">{backtest.sortino}</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-600">Calmar Ratio</p>
                          <p className="font-semibold">{backtest.calmar}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Duration</p>
                          <p className="text-sm text-gray-500">
                            {backtest.duration}
                          </p>
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
