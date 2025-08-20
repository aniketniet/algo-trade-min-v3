

"use client"
import { Copy, Edit } from "lucide-react";
import React, { useState } from "react";


export default function AlgoroomsProfile() {
  const [activeTab, setActiveTab] = useState("My Referrals");

  const profileData = {
    name: "mr. satish",
    userId: "AR376161",
    phone: "+918076650048",
    email: "palsatish311@gmail.com",
    walletAmount: "₹ 0.00",
    backtestCredit: "50.00",
    plan: "Free Plan",
    referralLink: "https://web.algorooms.com/login?referral_code=AR376161",
    joinedDate: "02/06/2025",
  };

  const indices = [
    { name: "NIFTY", value: "24726.45(-0.10 %)", color: "text-red-500" },
    { name: "BNF", value: "55919.95(-0.31 %)", color: "text-red-500" },
    { name: "FN", value: "26440.60(-0.15 %)", color: "text-red-500" },
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex-1">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face&auto=format"
                alt="Profile"
                className="w-full h-full rounded-xl object-cover"
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                {profileData.name}
              </h2>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>👤 {profileData.userId}</span>
                <span>📱 {profileData.phone}</span>
                <span>✉️ {profileData.email}</span>
              </div>
            </div>
          </div>
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            <Edit className="w-4 h-4" />
            <span>Edit</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 font-bold">₹</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {profileData.walletAmount}
                </p>
                <p className="text-sm text-gray-600">Wallet Amount</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-bold">📊</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {profileData.backtestCredit}
                </p>
                <p className="text-sm text-gray-600">Backtest Credit</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 font-bold">⭐</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {profileData.plan}
                </p>
                <p className="text-sm text-gray-600">Active Plan</p>
              </div>
            </div>
          </div>
        </div>

        {/* Referral Link */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">
                Referral Link:
              </p>
              <p className="text-sm text-blue-600 font-mono">
                {profileData.referralLink}
              </p>
            </div>
            <button
              onClick={() => copyToClipboard(profileData.referralLink)}
              className="flex items-center space-x-1 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
            >
              <Copy className="w-4 h-4" />
              <span>Copy</span>
            </button>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Joined on {profileData.joinedDate}
        </div>
      </div>

      {/* Tabs Section */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            {["Notifications", "Subscriptions", "My Referrals"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6 min-h-96">
          {activeTab === "My Referrals" && (
            <div className="text-center py-16">
              <div className="w-32 h-32 mx-auto mb-6 opacity-50">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  <circle cx="100" cy="80" r="8" fill="#e5e7eb" />
                  <rect
                    x="85"
                    y="95"
                    width="30"
                    height="40"
                    rx="4"
                    fill="#e5e7eb"
                  />
                  <rect
                    x="70"
                    y="145"
                    width="60"
                    height="8"
                    rx="4"
                    fill="#e5e7eb"
                  />
                  <rect
                    x="80"
                    y="160"
                    width="40"
                    height="6"
                    rx="3"
                    fill="#e5e7eb"
                  />
                </svg>
              </div>
              <p className="text-gray-500 text-lg">No referrals found!</p>
            </div>
          )}

          {activeTab === "Notifications" && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No notifications yet!</p>
            </div>
          )}

          {activeTab === "Subscriptions" && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No active subscriptions!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
