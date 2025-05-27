"use client"

import { useState } from "react"
import Link from "next/link"
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
  Pause,
  Copy,
  Edit,
  Trash2,
  BarChart3,
  TrendingDown,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function StrategiesPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isCreateStrategyOpen, setIsCreateStrategyOpen] = useState(false)

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
    {
      id: 3,
      name: "Breakout Hunter",
      description: "Cryptocurrency breakout strategy with volume confirmation",
      status: "Paused",
      market: "Crypto",
      timeframe: "15m",
      roi: -2.1,
      trades: 156,
      winRate: 45.8,
      maxDrawdown: 8.7,
      sharpe: 0.3,
      createdAt: "2024-01-05",
      lastModified: "2024-01-19",
    },
    {
      id: 4,
      name: "Trend Following",
      description: "Long-term trend following strategy for forex majors",
      status: "Stopped",
      market: "Forex",
      timeframe: "1h",
      roi: 31.2,
      trades: 89,
      winRate: 58.4,
      maxDrawdown: 12.3,
      sharpe: 1.4,
      createdAt: "2023-12-20",
      lastModified: "2024-01-15",
    },
  ]

  return (
    <div className="flex min-h-screen bg-white text-gray-800">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col border-r border-gray-200 bg-white md:flex">
        <div className="flex h-20 items-center border-b border-gray-200 px-6">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <TrendingUp className="h-6 w-6 text-blue-600" />
            <span>Algo Tradex Mind</span>
          </Link>
        </div>
        <nav className="flex-1 space-y-1 px-2 py-4">
          <Link
            href="/dashboard"
            className="flex items-center rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          >
            <Home className="mr-3 h-5 w-5 text-gray-500" />
            Dashboard
          </Link>
          <Link
            href="/dashboard/brokers"
            className="flex items-center rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          >
            <Activity className="mr-3 h-5 w-5 text-gray-500" />
            Brokers
          </Link>
          <Link
            href="/dashboard/strategies"
            className="flex items-center rounded-md bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700"
          >
            <Target className="mr-3 h-5 w-5 text-blue-600" />
            Strategies
          </Link>
          <Link
            href="/dashboard/backtest"
            className="flex items-center rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          >
            <TestTube className="mr-3 h-5 w-5 text-gray-500" />
            Backtest
          </Link>
          <Link
            href="/dashboard/reports"
            className="flex items-center rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          >
            <FileText className="mr-3 h-5 w-5 text-gray-500" />
            Reports
          </Link>
          <Link
            href="#"
            className="flex items-center rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          >
            <Calendar className="mr-3 h-5 w-5 text-gray-500" />
            Calendar
          </Link>
          <Link
            href="#"
            className="flex items-center rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          >
            <MessageSquare className="mr-3 h-5 w-5 text-gray-500" />
            Messages
          </Link>
          <Link
            href="#"
            className="flex items-center rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          >
            <Settings className="mr-3 h-5 w-5 text-gray-500" />
            Settings
          </Link>
        </nav>
        <div className="border-t border-gray-200 p-4">
          <Link
            href="/"
            className="flex items-center rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          >
            <LogOut className="mr-3 h-5 w-5 text-gray-500" />
            Logout
          </Link>
        </div>
      </aside>

      {/* Mobile sidebar */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="ghost" size="icon" className="flex md:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="border-r border-gray-200 bg-white p-0">
          {/* Mobile nav content */}
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Top navigation */}
        <header className="flex h-20 items-center justify-between border-b border-gray-200 bg-white px-4 md:px-6">
          <div className="relative ml-4 hidden md:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <input
              type="search"
              placeholder="Search strategies..."
              className="w-64 rounded-md border border-gray-300 bg-white py-2 pl-8 pr-4 text-sm text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-4 md:ml-auto">
            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-400">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="hidden md:inline-block">John Doe</span>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white text-gray-800">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Strategies content */}
        <main className="flex-1 overflow-auto bg-gray-50 p-4 md:p-6">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold md:text-3xl">Trading Strategies</h1>
                <p className="text-gray-600">Create, manage, and monitor your algorithmic trading strategies</p>
              </div>
              <Dialog open={isCreateStrategyOpen} onOpenChange={setIsCreateStrategyOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Strategy
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Create New Strategy</DialogTitle>
                    <DialogDescription>
                      Build a new algorithmic trading strategy with custom parameters.
                    </DialogDescription>
                  </DialogHeader>
                  <Tabs defaultValue="basic" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="basic">Basic Info</TabsTrigger>
                      <TabsTrigger value="parameters">Parameters</TabsTrigger>
                      <TabsTrigger value="risk">Risk Management</TabsTrigger>
                    </TabsList>
                    <TabsContent value="basic" className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="strategy-name">Strategy Name</Label>
                        <Input id="strategy-name" placeholder="Enter strategy name" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" placeholder="Describe your strategy..." />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="market">Market</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select market" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="stocks">Stocks</SelectItem>
                            <SelectItem value="forex">Forex</SelectItem>
                            <SelectItem value="crypto">Cryptocurrency</SelectItem>
                            <SelectItem value="futures">Futures</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="timeframe">Timeframe</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select timeframe" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1m">1 Minute</SelectItem>
                            <SelectItem value="5m">5 Minutes</SelectItem>
                            <SelectItem value="15m">15 Minutes</SelectItem>
                            <SelectItem value="1h">1 Hour</SelectItem>
                            <SelectItem value="4h">4 Hours</SelectItem>
                            <SelectItem value="1d">1 Day</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TabsContent>
                    <TabsContent value="parameters" className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="entry-signal">Entry Signal</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select entry signal" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ma-cross">Moving Average Crossover</SelectItem>
                            <SelectItem value="rsi-oversold">RSI Oversold</SelectItem>
                            <SelectItem value="breakout">Price Breakout</SelectItem>
                            <SelectItem value="mean-reversion">Mean Reversion</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="exit-signal">Exit Signal</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select exit signal" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="take-profit">Take Profit</SelectItem>
                            <SelectItem value="stop-loss">Stop Loss</SelectItem>
                            <SelectItem value="trailing-stop">Trailing Stop</SelectItem>
                            <SelectItem value="time-based">Time Based</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="ma-period">MA Period</Label>
                          <Input id="ma-period" type="number" placeholder="20" />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="rsi-period">RSI Period</Label>
                          <Input id="rsi-period" type="number" placeholder="14" />
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="risk" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="position-size">Position Size (%)</Label>
                          <Input id="position-size" type="number" placeholder="2" />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="max-positions">Max Positions</Label>
                          <Input id="max-positions" type="number" placeholder="5" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="stop-loss">Stop Loss (%)</Label>
                          <Input id="stop-loss" type="number" placeholder="2" />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="take-profit">Take Profit (%)</Label>
                          <Input id="take-profit" type="number" placeholder="4" />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="max-drawdown">Max Drawdown (%)</Label>
                        <Input id="max-drawdown" type="number" placeholder="10" />
                      </div>
                    </TabsContent>
                  </Tabs>
                  <DialogFooter>
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                      Create Strategy
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Summary Cards */}
            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="border-gray-200 bg-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Strategies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4</div>
                  <p className="text-xs text-gray-500 mt-1">2 running, 1 paused, 1 stopped</p>
                </CardContent>
              </Card>

              <Card className="border-gray-200 bg-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Avg ROI</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">18.0%</div>
                  <p className="text-xs text-gray-500 mt-1">Across all strategies</p>
                </CardContent>
              </Card>

              <Card className="border-gray-200 bg-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Trades</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,924</div>
                  <p className="text-xs text-gray-500 mt-1">This month</p>
                </CardContent>
              </Card>

              <Card className="border-gray-200 bg-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Avg Win Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">62.0%</div>
                  <p className="text-xs text-gray-500 mt-1">Weighted average</p>
                </CardContent>
              </Card>
            </div>

            {/* Strategies List */}
            <div className="grid gap-6">
              {strategies.map((strategy) => (
                <Card key={strategy.id} className="border-gray-200 bg-white">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                          <Target className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">{strategy.name}</h3>
                          <p className="text-sm text-gray-600">{strategy.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={
                            strategy.status === "Running"
                              ? "border-green-200 text-green-700"
                              : strategy.status === "Paused"
                                ? "border-yellow-200 text-yellow-700"
                                : "border-red-200 text-red-700"
                          }
                        >
                          {strategy.status === "Running" ? (
                            <Play className="mr-1 h-3 w-3" />
                          ) : strategy.status === "Paused" ? (
                            <Pause className="mr-1 h-3 w-3" />
                          ) : (
                            <TrendingDown className="mr-1 h-3 w-3" />
                          )}
                          {strategy.status}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {strategy.status === "Running" ? (
                              <DropdownMenuItem>
                                <Pause className="mr-2 h-4 w-4" />
                                Pause Strategy
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem>
                                <Play className="mr-2 h-4 w-4" />
                                Start Strategy
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem>
                              <Copy className="mr-2 h-4 w-4" />
                              Clone Strategy
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Strategy
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <BarChart3 className="mr-2 h-4 w-4" />
                              View Analytics
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Strategy
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
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
                          <p className={`font-semibold ${strategy.roi >= 0 ? "text-green-600" : "text-red-600"}`}>
                            {strategy.roi >= 0 ? "+" : ""}
                            {strategy.roi}%
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Total Trades</p>
                          <p className="font-semibold">{strategy.trades.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-600">Win Rate</p>
                          <p className="font-semibold">{strategy.winRate}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Max Drawdown</p>
                          <p className="font-semibold text-red-600">{strategy.maxDrawdown}%</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-600">Sharpe Ratio</p>
                          <p className="font-semibold">{strategy.sharpe}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Created</p>
                          <p className="text-sm text-gray-500">{strategy.createdAt}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
