"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowUp,
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

import { DashboardChart } from "@/components/dashboard-chart";
import { DashboardPieChart } from "@/components/dashboard-pie-chart";
import TradingViewMarketOverview from "@/components/TradingViewMarketOverview";

export default function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showRiskModal, setShowRiskModal] = useState(true);
  const [accepted, setAccepted] = useState(false);

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
                onClick={() => {
                  localStorage.setItem("risk_disclaimer_accepted", "true");
                  setShowRiskModal(false);
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
              <Badge
                variant="outline"
                className="border-green-200 text-green-700"
              >
                Live Trading
              </Badge>
              <Badge variant="outline" className="border-blue-200 text-blue-700">
                3 Active Strategies
              </Badge>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-2">

            <Card className="border-gray-200 w-full  text-white bg-[rgb(12,_11,_58)]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-white">
                  Add new Broker
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <Link href="/dashboard/brokers" className="w-full">
                    <Button
                      asChild
                      className="w-full bg-white text-blue-900 hover:bg-white rounded-full"

                    >
                      <div className="ml-2 flex items-center text-sm text-green-600">
                        <ArrowUp className="mr-1 h-4 w-4" />
                        No brokers added
                      </div>
                    </Button>
                  </Link>

                  <p className="text-xs text-gray-500 mt-1">Click to add a broker</p>
                </div>

              </CardContent>
            </Card>
            <Card className="border-gray-200 w-full  text-white bg-[rgb(12,_11,_58)]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-white">
                  Total Trades
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="text-2xl font-bold ">1,234</div>
                  <div className="ml-2 flex items-center text-sm text-green-600">
                    <ArrowUp className="mr-1 h-4 w-4" />
                    5.6%
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
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
                <CardTitle>Active Strategies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                    <div>
                      <h4 className="font-medium">Momentum Scalper</h4>
                      <p className="text-sm text-gray-600">
                        NASDAQ • 1m timeframe
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-green-600">
                        +$432.50
                      </div>
                      <Badge
                        variant="outline"
                        className="border-green-200 text-green-700 text-xs"
                      >
                        Running
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                    <div>
                      <h4 className="font-medium">Mean Reversion</h4>
                      <p className="text-sm text-gray-600">
                        S&P 500 • 5m timeframe
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-green-600">
                        +$287.30
                      </div>
                      <Badge
                        variant="outline"
                        className="border-green-200 text-green-700 text-xs"
                      >
                        Running
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                    <div>
                      <h4 className="font-medium">Breakout Hunter</h4>
                      <p className="text-sm text-gray-600">
                        Crypto • 15m timeframe
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-red-600">
                        -$45.20
                      </div>
                      <Badge
                        variant="outline"
                        className="border-yellow-200 text-yellow-700 text-xs"
                      >
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
                      <p className="text-sm">
                        Strategy "Momentum Scalper" executed BUY order
                      </p>
                      <p className="text-xs text-gray-500">
                        AAPL • $187.42 • 2 minutes ago
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                    <div className="flex-1">
                      <p className="text-sm">
                        Backtest completed for "Trend Following"
                      </p>
                      <p className="text-xs text-gray-500">
                        ROI: +24.3% • 5 minutes ago
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-red-500"></div>
                    <div className="flex-1">
                      <p className="text-sm">
                        Strategy "Breakout Hunter" stopped
                      </p>
                      <p className="text-xs text-gray-500">
                        Risk limit reached • 12 minutes ago
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <div className="flex-1">
                      <p className="text-sm">New broker connection established</p>
                      <p className="text-xs text-gray-500">
                        Interactive Brokers • 1 hour ago
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
