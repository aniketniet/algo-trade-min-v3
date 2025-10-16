

"use client"
import { Copy, Edit, Loader2, AlertCircle } from "lucide-react";
import React, { useState } from "react";
import { useProfileApi } from "@/hooks/useProfileApi";

export default function AlgoroomsProfile() {
  const [activeTab, setActiveTab] = useState("Subscriptions");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<{
    username: string;
    phone: string;
  }>({
    username: '',
    phone: ''
  });

  const { 
    profileData, 
    referrals, 
    notifications, 
    subscriptions, 
    loading, 
    error, 
    updateProfile 
  } = useProfileApi() as {
    profileData: any;
    referrals: any[];
    notifications: any[];
    subscriptions: any[];
    loading: boolean;
    error: string | null;
    updateProfile: (data: any) => Promise<{ success: boolean; message: string }>;
  };

  const indices = [
    { name: "NIFTY", value: "24726.45(-0.10 %)", color: "text-red-500" },
    { name: "BNF", value: "55919.95(-0.31 %)", color: "text-red-500" },
    { name: "FN", value: "26440.60(-0.15 %)", color: "text-red-500" },
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleEditClick = () => {
    if (profileData) {
      setEditForm({
        username: profileData.username || '',
        phone: profileData.phone || ''
      });
      setIsEditing(true);
    }
  };

  const handleSaveEdit = async () => {
    const result = await updateProfile(editForm);
    if (result?.success) {
      setIsEditing(false);
    } else {
      alert(result?.message || 'Failed to update profile');
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm({ username: '', phone: '' });
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  const formatCurrency = (amount: number) => {
    return `₹ ${amount.toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 mx-auto mb-4 text-red-600" />
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">No profile data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              {profileData?.profileImage ? (
                <img
                  src={profileData.profileImage}
                  alt="Profile"
                  className="w-full h-full rounded-xl object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                  {profileData?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                {profileData?.username || 'User'}
              </h2>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                {/* <span>👤 {profileData?.referralCode || 'N/A'}</span> */}
                <span>📱 {profileData?.phone || 'Not provided'}</span>
                <span>✉️ {profileData?.email}</span>
              </div>
            </div>
          </div>
          {!isEditing ? (
            <button 
              onClick={handleEditClick}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <Edit className="w-4 h-4" />
              <span>Edit</span>
            </button>
          ) : (
            <div className="flex space-x-2">
              <button 
                onClick={handleSaveEdit}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                <span>Save</span>
              </button>
              <button 
                onClick={handleCancelEdit}
                className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                <span>Cancel</span>
              </button>
            </div>
          )}
        </div>

        {/* Edit Form */}
        {isEditing && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Edit Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={editForm.username}
                  onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 font-bold">₹</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {formatCurrency(profileData?.walletAmount || 0)}
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
                  {profileData?.backtestCredit || 0}
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
                  {profileData?.plan || 'Free Plan'}
                </p>
                <p className="text-sm text-gray-600">Active Plan</p>
              </div>
            </div>
          </div>
        </div>

        {/* Referral Link */}
        {/* <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">
                Referral Link:
              </p>
              <p className="text-sm text-blue-600 font-mono">
                {profileData?.referralLink || 'Not available'}
              </p>
            </div>
            <button
              onClick={() => copyToClipboard(profileData?.referralLink || '')}
              className="flex items-center space-x-1 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
            >
              <Copy className="w-4 h-4" />
              <span>Copy</span>
            </button>
          </div>
        </div> */}

        <div className="mt-4 text-sm text-gray-600">
          Joined on {formatDate(profileData?.joinedDate || '')}
        </div>
      </div>

      {/* Tabs Section */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            {["Subscriptions"].map((tab) => (
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
            <div>
              {referrals.length > 0 ? (
                <div>
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Your Referrals ({referrals.length})
                    </h3>
                    <p className="text-sm text-gray-600">
                      Total earnings: {formatCurrency(profileData?.referralEarnings || 0)}
                    </p>
                  </div>
                  <div className="space-y-3">
                    {referrals.map((referral: any) => (
                      <div key={referral.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-800">{referral.username}</p>
                          <p className="text-sm text-gray-600">{referral.email}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">
                            Joined: {formatDate(referral.joinedDate)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
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
                  <p className="text-gray-400 text-sm mt-2">
                    Share your referral link to start earning rewards
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "Notifications" && (
            <div>
              {notifications.length > 0 ? (
                <div className="space-y-3">
                  {notifications.map((notification: any, index: number) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-800">{notification.message}</p>
                      <p className="text-sm text-gray-600 mt-1">{notification.date}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-gray-500 text-lg">No notifications yet!</p>
                  <p className="text-gray-400 text-sm mt-2">
                    You'll receive notifications about your account activity here
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "Subscriptions" && (
            <div>
              {subscriptions.length > 0 ? (
                <div className="space-y-4">
                  {subscriptions.map((subscription: any, index: number) => (
                    <div key={index} className="p-6 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {subscription.plan}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          subscription.status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {subscription.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Start Date:</p>
                          <p className="font-medium">{formatDate(subscription.startDate)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">End Date:</p>
                          <p className="font-medium">
                            {subscription.endDate ? formatDate(subscription.endDate) : 'No expiry'}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <p className="text-gray-600 text-sm mb-2">Features:</p>
                        <div className="flex flex-wrap gap-2">
                          {subscription.features.map((feature: any, idx: number) => (
                            <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-gray-500 text-lg">No active subscriptions!</p>
                  <p className="text-gray-400 text-sm mt-2">
                    Upgrade your plan to unlock more features
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
