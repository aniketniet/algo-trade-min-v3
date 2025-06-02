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
  Download,
  Filter,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { DashboardChart } from "@/components/dashboard-chart";
import { DashboardPieChart } from "@/components/dashboard-pie-chart";

export default function ReportsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const reports = [
    {
      id: 1,
      name: "Monthly Performance Report",
      type: "Performance",
      period: "January 2024",
      generatedAt: "2024-02-01 09:00",
      size: "2.4 MB",
      format: "PDF",
    },
    {
      id: 2,
      name: "Risk Analysis Report",
      type: "Risk",
      period: "Q4 2023",
      generatedAt: "2024-01-15 14:30",
      size: "1.8 MB",
      format: "PDF",
    },
    {
      id: 3,
      name: "Strategy Comparison",
      type: "Analysis",
      period: "2023 Full Year",
      generatedAt: "2024-01-10 11:15",
      size: "3.2 MB",
      format: "Excel",
    },
    {
      id: 4,
      name: "Trade Execution Report",
      type: "Execution",
      period: "Last 30 Days",
      generatedAt: "2024-01-20 16:45",
      size: "892 KB",
      format: "CSV",
    },
  ];

  return (
    <main className="flex-1 overflow-auto bg-gray-50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">
              Reports & Analytics
            </h1>
            <p className="text-gray-600">
              Comprehensive analysis and reporting for your trading performance
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="border-gray-300">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
          </div>
        </div>

        {/* Analytics Overview */}
        <Tabs defaultValue="overview" className="mb-8">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
            <TabsTrigger value="execution">Execution</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Summary Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="border-gray-200 bg-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Total P&L
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    +$27,394.57
                  </div>
                  <p className="text-xs text-gray-500 mt-1">This month</p>
                </CardContent>
              </Card>

              <Card className="border-gray-200 bg-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Win Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">72.3%</div>
                  <p className="text-xs text-gray-500 mt-1">
                    1,247 winning trades
                  </p>
                </CardContent>
              </Card>

              <Card className="border-gray-200 bg-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Sharpe Ratio
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2.14</div>
                  <p className="text-xs text-gray-500 mt-1">
                    Risk-adjusted return
                  </p>
                </CardContent>
              </Card>

              <Card className="border-gray-200 bg-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Max Drawdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">-4.2%</div>
                  <p className="text-xs text-gray-500 mt-1">Peak to trough</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="col-span-2 border-gray-200 bg-white">
                <CardHeader>
                  <CardTitle>Portfolio Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <DashboardChart />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200 bg-white">
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
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="border-gray-200 bg-white">
                <CardHeader>
                  <CardTitle>Monthly Returns</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">January 2024</span>
                      <span className="font-semibold text-green-600">
                        +8.2%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">December 2023</span>
                      <span className="font-semibold text-green-600">
                        +12.1%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">November 2023</span>
                      <span className="font-semibold text-red-600">-2.3%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">October 2023</span>
                      <span className="font-semibold text-green-600">
                        +15.7%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200 bg-white">
                <CardHeader>
                  <CardTitle>Strategy Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Momentum Scalper</span>
                      <span className="font-semibold text-green-600">
                        +24.3%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Mean Reversion</span>
                      <span className="font-semibold text-green-600">
                        +18.7%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Trend Following</span>
                      <span className="font-semibold text-green-600">
                        +31.2%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Breakout Hunter</span>
                      <span className="font-semibold text-red-600">-2.1%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="risk" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="border-gray-200 bg-white">
                <CardHeader>
                  <CardTitle>Risk Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Value at Risk (95%)</span>
                      <span className="font-semibold">$2,847</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Beta</span>
                      <span className="font-semibold">0.87</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Volatility</span>
                      <span className="font-semibold">12.4%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Correlation to S&P 500</span>
                      <span className="font-semibold">0.23</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200 bg-white">
                <CardHeader>
                  <CardTitle>Drawdown Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Current Drawdown</span>
                      <span className="font-semibold text-red-600">-1.2%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Max Drawdown</span>
                      <span className="font-semibold text-red-600">-4.2%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Avg Drawdown</span>
                      <span className="font-semibold text-red-600">-2.1%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Recovery Time</span>
                      <span className="font-semibold">3.2 days</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200 bg-white">
                <CardHeader>
                  <CardTitle>Position Sizing</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Avg Position Size</span>
                      <span className="font-semibold">2.3%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Max Position Size</span>
                      <span className="font-semibold">5.0%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Portfolio Utilization</span>
                      <span className="font-semibold">78.5%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Cash Reserve</span>
                      <span className="font-semibold">21.5%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="execution" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="border-gray-200 bg-white">
                <CardHeader>
                  <CardTitle>Execution Quality</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Avg Fill Time</span>
                      <span className="font-semibold">0.34s</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Slippage</span>
                      <span className="font-semibold">0.02%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Fill Rate</span>
                      <span className="font-semibold">98.7%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Rejected Orders</span>
                      <span className="font-semibold">1.3%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200 bg-white">
                <CardHeader>
                  <CardTitle>Trading Costs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Total Commissions</span>
                      <span className="font-semibold">$1,247.50</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Avg Commission/Trade</span>
                      <span className="font-semibold">$0.65</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Market Impact</span>
                      <span className="font-semibold">0.01%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Total Trading Costs</span>
                      <span className="font-semibold">$1,892.30</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Generated Reports */}
        <Card className="border-gray-200 bg-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Generated Reports</CardTitle>
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Reports</SelectItem>
                  <SelectItem value="performance">Performance</SelectItem>
                  <SelectItem value="risk">Risk</SelectItem>
                  <SelectItem value="analysis">Analysis</SelectItem>
                  <SelectItem value="execution">Execution</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">{report.name}</h4>
                      <p className="text-sm text-gray-600">
                        {report.type} • {report.period}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">{report.size}</p>
                      <p className="text-xs text-gray-500">
                        {report.generatedAt}
                      </p>
                    </div>
                    <Badge variant="outline" className="border-gray-200">
                      {report.format}
                    </Badge>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
