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
  Wifi,
  WifiOff,
  RefreshCw,
  Edit,
  Trash2,
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

export default function BrokersPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isAddBrokerOpen, setIsAddBrokerOpen] = useState(false)

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
            className="flex items-center rounded-md bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700"
          >
            <Activity className="mr-3 h-5 w-5 text-blue-600" />
            Brokers
          </Link>
          <Link
            href="/dashboard/strategies"
            className="flex items-center rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          >
            <Target className="mr-3 h-5 w-5 text-gray-500" />
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
          {/* Mobile nav content - same as desktop but with onClick handlers */}
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
              placeholder="Search brokers..."
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

        {/* Brokers content */}
        <main className="flex-1 overflow-auto bg-gray-50 p-4 md:p-6">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold md:text-3xl">Broker Connections</h1>
                <p className="text-gray-600">Manage your trading accounts and broker integrations</p>
              </div>
              <Dialog open={isAddBrokerOpen} onOpenChange={setIsAddBrokerOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Broker
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add New Broker</DialogTitle>
                    <DialogDescription>Connect a new broker to start trading with your strategies.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="broker-type">Broker</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a broker" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ib">Interactive Brokers</SelectItem>
                          <SelectItem value="td">TD Ameritrade</SelectItem>
                          <SelectItem value="alpaca">Alpaca</SelectItem>
                          <SelectItem value="binance">Binance</SelectItem>
                          <SelectItem value="coinbase">Coinbase Pro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="api-key">API Key</Label>
                      <Input id="api-key" placeholder="Enter your API key" type="password" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="api-secret">API Secret</Label>
                      <Input id="api-secret" placeholder="Enter your API secret" type="password" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="account-type">Account Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select account type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="live">Live Trading</SelectItem>
                          <SelectItem value="paper">Paper Trading</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                      Connect Broker
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Summary Cards */}
            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="border-gray-200 bg-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Balance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$139,125.65</div>
                  <p className="text-xs text-gray-500 mt-1">Across all brokers</p>
                </CardContent>
              </Card>

              <Card className="border-gray-200 bg-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Connected Brokers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3/4</div>
                  <p className="text-xs text-gray-500 mt-1">1 disconnected</p>
                </CardContent>
              </Card>

              <Card className="border-gray-200 bg-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Trades</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4,711</div>
                  <p className="text-xs text-gray-500 mt-1">This month</p>
                </CardContent>
              </Card>

              <Card className="border-gray-200 bg-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Avg Commission</CardTitle>
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
                          <p className="text-lg font-semibold">{broker.trades.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-600">Commission Rate</p>
                          <p className="text-lg font-semibold">{broker.commission}</p>
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
      </div>
    </div>
  )
}
