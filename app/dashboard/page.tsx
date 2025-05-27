"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowUp,
  Bell,
  Calendar,
  ChevronDown,
  Home,
  LogOut,
  Menu,
  MessageSquare,
  Search,
  Settings,
  TrendingUp,
  User,
  Activity,
  Target,
  TestTube,
  FileText,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"

import { DashboardChart } from "@/components/dashboard-chart"
import { DashboardPieChart } from "@/components/dashboard-pie-chart"

export default function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-white text-gray-800">
      {/* Sidebar for desktop */}
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
            className="flex items-center rounded-md bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700"
          >
            <Home className="mr-3 h-5 w-5 text-blue-600" />
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
          <div className="flex h-20 items-center border-b border-gray-200 px-6">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold">
              <TrendingUp className="h-6 w-6 text-blue-600" />
              <span>Algo Tradex Mind</span>
            </Link>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            <Link
              href="/dashboard"
              className="flex items-center rounded-md bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700"
              onClick={() => setIsSidebarOpen(false)}
            >
              <Home className="mr-3 h-5 w-5 text-blue-600" />
              Dashboard
            </Link>
            <Link
              href="/dashboard/brokers"
              className="flex items-center rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              onClick={() => setIsSidebarOpen(false)}
            >
              <Activity className="mr-3 h-5 w-5 text-gray-500" />
              Brokers
            </Link>
            <Link
              href="/dashboard/strategies"
              className="flex items-center rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              onClick={() => setIsSidebarOpen(false)}
            >
              <Target className="mr-3 h-5 w-5 text-gray-500" />
              Strategies
            </Link>
            <Link
              href="/dashboard/backtest"
              className="flex items-center rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              onClick={() => setIsSidebarOpen(false)}
            >
              <TestTube className="mr-3 h-5 w-5 text-gray-500" />
              Backtest
            </Link>
            <Link
              href="/dashboard/reports"
              className="flex items-center rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              onClick={() => setIsSidebarOpen(false)}
            >
              <FileText className="mr-3 h-5 w-5 text-gray-500" />
              Reports
            </Link>
            <Link
              href="#"
              className="flex items-center rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              onClick={() => setIsSidebarOpen(false)}
            >
              <Calendar className="mr-3 h-5 w-5 text-gray-500" />
              Calendar
            </Link>
            <Link
              href="#"
              className="flex items-center rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              onClick={() => setIsSidebarOpen(false)}
            >
              <MessageSquare className="mr-3 h-5 w-5 text-gray-500" />
              Messages
            </Link>
            <Link
              href="#"
              className="flex items-center rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              onClick={() => setIsSidebarOpen(false)}
            >
              <Settings className="mr-3 h-5 w-5 text-gray-500" />
              Settings
            </Link>
          </nav>
          <div className="border-t border-gray-200 p-4">
            <Link
              href="/"
              className="flex items-center rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              onClick={() => setIsSidebarOpen(false)}
            >
              <LogOut className="mr-3 h-5 w-5 text-gray-500" />
              Logout
            </Link>
          </div>
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
              placeholder="Search..."
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
                <DropdownMenuItem className="hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Dashboard content */}
        <main className="flex-1 overflow-auto bg-gray-50 p-4 md:p-6">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-2xl font-bold md:text-3xl">Dashboard Overview</h1>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-green-200 text-green-700">
                  Live Trading
                </Badge>
                <Badge variant="outline" className="border-blue-200 text-blue-700">
                  3 Active Strategies
                </Badge>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="border-gray-200 bg-white text-gray-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Portfolio Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <div className="text-2xl font-bold">$127,394.57</div>
                    <div className="ml-2 flex items-center text-sm text-green-600">
                      <ArrowUp className="mr-1 h-4 w-4" />
                      8.2%
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">+$9,642 this month</p>
                </CardContent>
              </Card>

              <Card className="border-gray-200 bg-white text-gray-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Today's P&L</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <div className="text-2xl font-bold">$1,294.57</div>
                    <div className="ml-2 flex items-center text-sm text-green-600">
                      <ArrowUp className="mr-1 h-4 w-4" />
                      2.1%
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">142 trades executed</p>
                </CardContent>
              </Card>

              <Card className="border-gray-200 bg-white text-gray-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Win Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <div className="text-2xl font-bold">78.3%</div>
                    <div className="ml-2 flex items-center text-sm text-green-600">
                      <ArrowUp className="mr-1 h-4 w-4" />
                      3.2%
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
                </CardContent>
              </Card>

              <Card className="border-gray-200 bg-white text-gray-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Sharpe Ratio</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <div className="text-2xl font-bold">2.47</div>
                    <div className="ml-2 flex items-center text-sm text-green-600">
                      <ArrowUp className="mr-1 h-4 w-4" />
                      0.3
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Risk-adjusted return</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts and Quick Actions */}
            <div className="mb-8 grid gap-6 lg:grid-cols-3">
              <Card className="col-span-2 border-gray-200 bg-white text-gray-800">
                <CardHeader>
                  <CardTitle>Portfolio Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <DashboardChart />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200 bg-white text-gray-800">
                <CardHeader>
                  <CardTitle>Strategy Allocation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <DashboardPieChart />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Active Strategies and Recent Activity */}
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="border-gray-200 bg-white text-gray-800">
                <CardHeader>
                  <CardTitle>Active Strategies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                      <div>
                        <h4 className="font-medium">Momentum Scalper</h4>
                        <p className="text-sm text-gray-600">NASDAQ • 1m timeframe</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-green-600">+$432.50</div>
                        <Badge variant="outline" className="border-green-200 text-green-700 text-xs">
                          Running
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                      <div>
                        <h4 className="font-medium">Mean Reversion</h4>
                        <p className="text-sm text-gray-600">S&P 500 • 5m timeframe</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-green-600">+$287.30</div>
                        <Badge variant="outline" className="border-green-200 text-green-700 text-xs">
                          Running
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                      <div>
                        <h4 className="font-medium">Breakout Hunter</h4>
                        <p className="text-sm text-gray-600">Crypto • 15m timeframe</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-red-600">-$45.20</div>
                        <Badge variant="outline" className="border-yellow-200 text-yellow-700 text-xs">
                          Paused
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200 bg-white text-gray-800">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <div className="flex-1">
                        <p className="text-sm">Strategy "Momentum Scalper" executed BUY order</p>
                        <p className="text-xs text-gray-500">AAPL • $187.42 • 2 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                      <div className="flex-1">
                        <p className="text-sm">Backtest completed for "Trend Following"</p>
                        <p className="text-xs text-gray-500">ROI: +24.3% • 5 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-red-500"></div>
                      <div className="flex-1">
                        <p className="text-sm">Strategy "Breakout Hunter" stopped</p>
                        <p className="text-xs text-gray-500">Risk limit reached • 12 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <div className="flex-1">
                        <p className="text-sm">New broker connection established</p>
                        <p className="text-xs text-gray-500">Interactive Brokers • 1 hour ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
