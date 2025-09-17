"use client"

import {
  Activity,
  Calendar,
  ExternalLink,
  FileText,
  Instagram,
  LogOut,
  Menu,
  MessageCircle,
  MessageSquare,
  Phone,
  Settings,
  Target,
  TestTube,
  TrendingUp,
  Youtube,
  BarChart
} from "lucide-react"
import Link from "next/link"
import React, { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { useRealTimeMarketData } from "@/hooks/useRealTimeMarketData"


const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: <TrendingUp /> },
  { href: "/dashboard/brokers", label: "Brokers", icon: <Activity /> },
  { href: "/dashboard/strategies", label: "Strategies", icon: <Target /> },
  // { href: "/dashboard/backtest", label: "Backtest", icon: <TestTube /> },
  { href: "/dashboard/reports", label: "Reports", icon: <FileText /> },
  // { href: "/dashboard/trading", label: "Trading", icon: <BarChart /> },
//   { href: "#", label: "Calendar", icon: <Calendar /> },
//   { href: "#", label: "Messages", icon: <MessageSquare /> },
//   { href: "#", label: "Settings", icon: <Settings /> },
]



const DashboardSidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const pathname = usePathname()
  const { marketData: indices, loading, error, isConnected, lastUpdate } = useRealTimeMarketData()

  const renderNavLink = (href: string, label: string, icon: React.ReactNode) => {
    const isActive = pathname === href
    return (
      <Link
        key={label}
        href={href}
        onClick={() => setIsSidebarOpen(false)}
        className={`flex items-center rounded-md px-4 py-2 text-sm font-medium ${
          isActive ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        }`}
      >
        <span className={`mr-3 h-5 w-5 ${isActive ? "text-blue-600" : "text-gray-500"}`}>
          {icon}
        </span>
        {label}
      </Link>
    )
  }


   const handleIndexClick = (index: { name: string; symbol: string }) => {
    // Option 1: Redirect to TradingView chart with specific chart ID
    const encodedSymbol = encodeURIComponent(index.symbol)
    const chartId = 'neonMV7B' // You can change this to any chart ID you prefer
    const tradingViewUrl = `https://in.tradingview.com/chart/${chartId}/?symbol=${encodedSymbol}`
    
    // Option 2: Alternative - redirect to symbol page (uncomment if preferred)
    // const tradingViewUrl = `https://in.tradingview.com/symbols/${index.symbol}/`
    
    window.open(tradingViewUrl, '_blank')
  }

  const renderIndices = () => (
    <div className="px-2 py-4 border-t border-gray-200">
      <div className="flex items-center justify-between px-4 mb-2">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Indices
        </h3>
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
            isConnected 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              isConnected ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            {isConnected ? 'Live' : 'Offline'}
          </div>
          {loading && (
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
          )}
        </div>
      </div>
      <div className="space-y-2">
        {indices.map((index) => (
          <div 
            key={index.name} 
            className="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-gray-50 rounded-md transition-colors"
            onClick={() => handleIndexClick(index)}
          >
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-900">{index.name}</span>
              <ExternalLink className="ml-2 h-3 w-3 text-gray-400" />
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">
                {loading ? (
                  <div className="animate-pulse bg-gray-200 h-4 w-16 rounded"></div>
                ) : (
                  index.value
                )}
              </div>
              <div className={`text-xs ${
                index.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {loading ? (
                  <div className="animate-pulse bg-gray-200 h-3 w-12 rounded"></div>
                ) : (
                  `(${index.change}%)`
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {error && (
        <div className="px-4 mt-2">
          <p className="text-xs text-red-500">{error}</p>
        </div>
      )}
      {/* {lastUpdate && (
        <div className="px-4 mt-2">
          <p className="text-xs text-gray-400">
            Last update: {new Date(lastUpdate).toLocaleTimeString()}
          </p>
        </div>
      )} */}
    </div>
  )



  const renderHelpDesk = () => (
    <div className="px-2 py-4 border-t border-gray-200">
      <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
        Help Desk
      </h3>
      <div className="space-y-1">
        <Link
          href="tel:+917042132888"
          className="flex items-center rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        >
          <Phone className="mr-3 h-4 w-4 text-gray-500" />
          Call us +917042132888
        </Link>
        <Link
          href="#"
          className="flex items-center rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        >
          <MessageCircle className="mr-3 h-4 w-4 text-gray-500" />
          Chat with us!
        </Link>
      </div>
    </div>
  )

  const renderSocialLinks = () => (
    <div className="px-2 py-4 border-t border-gray-200">
      <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
        Join Us
      </h3>
      <div className="space-y-1">
        <Link
          href="#"
          className="flex items-center rounded-md px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700"
        >
          <Youtube className="mr-3 h-4 w-4" />
          How to use AlgoTrade Mind?
        </Link>
        <Link
          href="#"
          className="flex items-center rounded-md px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 hover:text-blue-700"
        >
          <MessageCircle className="mr-3 h-4 w-4" />
          Realtime Updates
        </Link>
        <Link
          href="#"
          className="flex items-center rounded-md px-4 py-2 text-sm font-medium text-purple-600 hover:bg-purple-50 hover:text-purple-700"
        >
          <Instagram className="mr-3 h-4 w-4" />
          Join Instagram
        </Link>
      </div>
    </div>
  )

  return (
    <div>
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-col border-r border-gray-200 bg-white md:flex fixed top-0 left-0 h-screen overflow-y-auto z-30">
        
        <div className="flex h-20 items-center justify-center border-b border-gray-200 px-6 ">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            {/* <TrendingUp className="h-6 w-6 text-blue-600" /> */}
            <Image 
                src="/site-logo.png"
                alt="Algo Tradex Mind Logo"
                width={150}
                height={10}
               
            />
           
          </Link>
        </div>
        <nav className="flex-1 space-y-1 px-2 py-4 ">
        {navLinks.map((link) => renderNavLink(link.href, link.label, link.icon))}
        {renderIndices()}
        {renderHelpDesk()}
        {/* {renderSocialLinks()} */}
        </nav>
        {/* <div className="border-t border-gray-200 p-4">
          <Link
            href="/"
            className="flex items-center rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          >
            <LogOut className="mr-3 h-5 w-5 text-gray-500" />
            Logout
          </Link>
        </div> */}
      </aside>

      {/* Mobile Sidebar */}
      {/* <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="ghost" size="icon" className="flex md:hidden">
            <Menu className="h-10 w-10" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 border-r border-gray-200 bg-white p-0">
          <div className="flex h-20 items-center border-b border-gray-200 px-6">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold" onClick={() => setIsSidebarOpen(false)}>
              <TrendingUp className="h-6 w-6 text-blue-600" />
              <span>Algo Tradex Mind</span>
            </Link>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navLinks.map((link) => renderNavLink(link.href, link.label, link.icon))}
          </nav>
          <div className="border-t border-gray-200 p-4">
            <Link
              href="/"
              onClick={() => setIsSidebarOpen(false)}
              className="flex items-center rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            >
              <LogOut className="mr-3 h-5 w-5 text-gray-500" />
              Logout
            </Link>
          </div>
        </SheetContent>
      </Sheet> */}
    </div>
  )
}

export default DashboardSidebar;
