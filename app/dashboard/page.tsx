"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowUp,
  ArrowDown,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Users,
  Activity,
  DollarSign,
  Target,
  AlertCircle
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

import { DashboardChart } from "@/components/dashboard-chart";
import { DashboardPieChart } from "@/components/dashboard-pie-chart";
import TradingViewMarketOverview from "@/components/TradingViewMarketOverview";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useRiskDisclaimer } from "@/hooks/useRiskDisclaimer";

export default function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [accepted, setAccepted] = useState(false);
  
  // Use dynamic dashboard data
  const { 
    stats, 
    strategies, 
    activities, 
    brokers, 
    loading, 
    error, 
    refreshData 
  } = useDashboardData();

  // Use risk disclaimer hook
  const { 
    showModal: showRiskModal, 
    loading: riskDisclaimerLoading, 
    error: riskDisclaimerError, 
    acceptRiskDisclaimer 
  } = useRiskDisclaimer();

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (showRiskModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showRiskModal]);

  return (
    <>
      <Dialog open={showRiskModal}>
        <DialogContent
          className="max-w-lg rounded-2xl p-0 shadow-xl border border-gray-300"
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <div className="p-6 bg-white text-sm text-gray-800 rounded-2xl">
            <DialogHeader className="border-b-2 border-gray-200">
              <DialogTitle className="text-lg font-bold text-gray-900 mb-4">
                ⚠️ Risk Disclosures on Derivatives
              </DialogTitle>
            </DialogHeader>

            <ul className="space-y-4 mb-6 mt-2 text-xs leading-relaxed">
              {[
                "9 out of 10 individual traders in equity Futures and Options Segment incurred net losses.",
                "On an average, loss makers registered net trading loss close to ₹50,000.",
                "Over and above the net trading losses, loss makers paid an additional 28% as transaction costs.",
                "Those making net trading profits paid 15–50% of such profits as transaction costs.",
              ].map((text, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-1 h-4 w-4 rounded-full border-2 border-gray-500 flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-gray-500" />
                  </div>
                  <span>{text}</span>
                </li>
              ))}
            </ul>

            <p className="text-xs text-gray-600 mb-5 leading-snug">
              📚 Source:{" "}
              <a
                href="https://www.sebi.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 underline"
              >
                SEBI
              </a>{" "}
              study dated January 25, 2023 on <i>"Analysis of Profit and Loss of Individual Traders dealing in equity Futures and Options (F&O) Segment"</i>,
              wherein aggregate-level findings are based on FY 2021-22.
            </p>



            <div className="flex justify-between items-center gap-2 border-t-2 border-gray-200 pt-4">
              <div className="flex items-center">
                <input
                  id="accept-terms"
                  type="checkbox"
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                  className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="accept-terms" className="ml-3 text-sm text-gray-800 leading-snug">
                  I accept all the{" "}
                  <a href="#" className="text-blue-700 underline">
                    terms & conditions
                  </a>
                </label>
              </div>
              <Button
                disabled={!accepted}
                onClick={async () => {
                  const success = await acceptRiskDisclaimer();
                  if (success) {
                    setAccepted(false); // Reset checkbox
                  }
                }}
                className="bg-gray-800 text-white px-6 py-2 rounded-md text-sm disabled:bg-gray-200 disabled:text-gray-400"
              >
                I Understand
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <main className="flex-1 overflow-auto bg-gray-50 p-4 md:p-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold md:text-3xl">Dashboard Overview</h1>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={refreshData}
                disabled={loading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Badge
                variant="outline"
                className="border-green-200 text-green-700"
              >
                Live Trading
              </Badge>
              <Badge variant="outline" className="border-blue-200 text-blue-700">
                {loading ? (
                  <Skeleton className="h-4 w-20" />
                ) : (
                  `${stats?.activeStrategies || 0} Active Strategies`
                )}
              </Badge>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* KPI Cards */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <Card className="border-gray-200 w-full text-white bg-[rgb(12,_11,_58)]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-white flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Brokers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  {loading ? (
                    <Skeleton className="h-8 w-full bg-gray-700" />
                  ) : (
                    <Link href="/dashboard/brokers" className="w-full">
                      <Button
                        asChild
                        className="w-full bg-white text-blue-900 hover:bg-white rounded-full"
                      >
                        <div className="flex items-center justify-center text-sm">
                          {(stats?.totalBrokers || 0) > 0 ? (
                            <>
                              <ArrowUp className="mr-1 h-4 w-4 text-green-600" />
                              {stats?.totalBrokers} broker{(stats?.totalBrokers || 0) > 1 ? 's' : ''} connected
                            </>
                          ) : (
                            <>
                              <ArrowUp className="mr-1 h-4 w-4 text-green-600" />
                              No brokers added
                            </>
                          )}
                        </div>
                      </Button>
                    </Link>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    {(stats?.totalBrokers || 0) > 0 ? 'Manage your brokers' : 'Click to add a broker'}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-gray-200 w-full text-white bg-[rgb(12,_11,_58)]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-white flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Total Trades
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  {loading ? (
                    <Skeleton className="h-8 w-20 bg-gray-700" />
                  ) : (
                    <>
                      <div className="text-2xl font-bold">
                        {stats?.totalTrades?.toLocaleString() || '0'}
                      </div>
                      <div className="ml-2 flex items-center text-sm text-green-600">
                        <ArrowUp className="mr-1 h-4 w-4" />
                        {stats?.winRate?.toFixed(1) || '0'}%
                      </div>
                    </>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">Win Rate</p>
              </CardContent>
            </Card>

            <Card className="border-gray-200 w-full text-white bg-[rgb(12,_11,_58)]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-white flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Portfolio Value
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  {loading ? (
                    <Skeleton className="h-8 w-24 bg-gray-700" />
                  ) : (
                    <>
                      <div className="text-2xl font-bold">
                        ₹{stats?.portfolioValue?.toLocaleString() || '0'}
                      </div>
                      <div className="ml-2 flex items-center text-sm text-green-600">
                        <TrendingUp className="mr-1 h-4 w-4" />
                        +2.1%
                      </div>
                    </>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">Total Value</p>
              </CardContent>
            </Card>

            <Card className="border-gray-200 w-full text-white bg-[rgb(12,_11,_58)]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-white flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Today's P&L
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  {loading ? (
                    <Skeleton className="h-8 w-20 bg-gray-700" />
                  ) : (
                    <>
                      <div className={`text-2xl font-bold ${(stats?.todayPnL || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        ₹{stats?.todayPnL?.toFixed(2) || '0.00'}
                      </div>
                      <div className={`ml-2 flex items-center text-sm ${(stats?.todayPnL || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {(stats?.todayPnL || 0) >= 0 ? (
                          <ArrowUp className="mr-1 h-4 w-4" />
                        ) : (
                          <ArrowDown className="mr-1 h-4 w-4" />
                        )}
                        {Math.abs(stats?.todayPnL || 0) > 0 ? 'Live' : '0%'}
                      </div>
                    </>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">Today's Performance</p>
              </CardContent>
            </Card>



            {/* <Card className="border-gray-200 bg-white text-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Portfolio Value
                </CardTitle>
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
            </Card> */}
            {/* 
            <Card className="border-gray-200 bg-white text-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Today's P&L
                </CardTitle>
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
            </Card> */}
            {/* 
            <Card className="border-gray-200 bg-white text-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Win Rate
                </CardTitle>
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
            </Card> */}

            {/* <Card className="border-gray-200 bg-white text-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Sharpe Ratio
                </CardTitle>
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
            </Card> */}
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
                 <CardTitle>Global Markets</CardTitle>
               </CardHeader>
               <CardContent>
                 <div className="h-[500px]">
                   <TradingViewMarketOverview />
                 </div>
               </CardContent>
             </Card>
          </div>

          {/* Active Strategies and Recent Activity */}
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="border-gray-200 bg-white text-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Active Strategies
                  <Link href="/dashboard/strategies">
                    <Button variant="outline" size="sm">
                      View All
                    </Button>
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                        <div className="flex-1">
                          <Skeleton className="h-4 w-32 mb-2" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                        <div className="text-right">
                          <Skeleton className="h-4 w-16 mb-2" />
                          <Skeleton className="h-5 w-16" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : strategies.length > 0 ? (
                  <div className="space-y-4">
                    {strategies.map((strategy) => (
                      <div key={strategy._id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                        <div>
                          <h4 className="font-medium">{strategy.name}</h4>
                          <p className="text-sm text-gray-600">
                            {strategy.instruments?.[0]?.symbol || 'NIFTY'} • {strategy.type === 'time_based' ? 'Time Based' : 'Indicator Based'}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm font-medium ${
                            strategy.status === 'active' ? 'text-green-600' : 
                            strategy.status === 'paused' ? 'text-yellow-600' : 
                            'text-gray-600'
                          }`}>
                            {strategy.status === 'active' ? '+₹432.50' : 
                             strategy.status === 'paused' ? '-₹45.20' : 
                             '₹0.00'}
                          </div>
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              strategy.status === 'active' ? 'border-green-200 text-green-700' :
                              strategy.status === 'paused' ? 'border-yellow-200 text-yellow-700' :
                              'border-gray-200 text-gray-700'
                            }`}
                          >
                            {strategy.status === 'active' ? 'Running' :
                             strategy.status === 'paused' ? 'Paused' :
                             strategy.status === 'completed' ? 'Completed' :
                             strategy.status === 'backtested' ? 'Backtested' :
                             'Draft'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Strategies Yet</h3>
                    <p className="text-gray-600 mb-4">Create your first trading strategy to get started.</p>
                    <Link href="/dashboard/strategies">
                      <Button>Create Strategy</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-gray-200 bg-white text-gray-800">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex items-center gap-3">
                        <Skeleton className="h-2 w-2 rounded-full" />
                        <div className="flex-1">
                          <Skeleton className="h-4 w-full mb-2" />
                          <Skeleton className="h-3 w-3/4" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : activities.length > 0 ? (
                  <div className="space-y-4">
                    {activities.map((activity) => (
                      <div key={activity.id} className="flex items-center gap-3">
                        <div className={`h-2 w-2 rounded-full ${
                          activity.status === 'success' ? 'bg-green-500' :
                          activity.status === 'error' ? 'bg-red-500' :
                          activity.status === 'info' ? 'bg-blue-500' :
                          'bg-gray-500'
                        }`}></div>
                        <div className="flex-1">
                          <p className="text-sm">
                            {activity.message}
                          </p>
                          <p className="text-xs text-gray-500">
                            {activity.details}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Recent Activity</h3>
                    <p className="text-gray-600">Activity will appear here as you use the platform.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
