"use client";

import React, { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  ChevronDown,
  LogOut,
  Search,
  SearchCodeIcon,
  Settings,
  User,
} from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { useAuth } from "@/context/authContext";
import { useProfileApi } from "@/hooks/useProfileApi";

const DashboardNavbar = () => {
  const [isPassportChangeDialogOpen, setPassportChangeDialogOpen] = useState(false);
  const { logout } = useAuth();
  
  // Get profile data from API
  const { profileData, loading } = useProfileApi() as {
    profileData: any;
    loading: boolean;
  };

  const handleLogOut = () => {
    logout();
    console.log("User logged out");
  };

 
  const handleDialogClose = () => {
    setPassportChangeDialogOpen(false);
    const dialog = document.getElementById("passport-change-dialog") as HTMLDialogElement | null;
    if (dialog) dialog.close();
  };
 

  return (
    <div>
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
          {/* Pricing Button */}
          <Link href="/dashboard/packages">
            <Button
              variant="outline"
              className="text-sm font-medium text-blue-600 border-blue-600 hover:bg-blue-50"
            >
              Pricing
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="text-gray-500 hover:text-gray-700"
          >
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 text-sm font-medium text-gray-800"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-400">
                  {loading ? (
                    <User className="h-4 w-4 text-white" />
                  ) : profileData?.profileImage ? (
                    <img 
                      src={profileData.profileImage} 
                      alt="Profile" 
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-white text-sm font-medium">
                      {profileData?.username ? profileData.username.charAt(0).toUpperCase() : 'U'}
                    </span>
                  )}
                </div>
                <span className="hidden md:inline-block">
                  {loading ? 'Loading...' : (profileData?.username || 'User')}
                </span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white text-gray-800">
              <Link href="/dashboard/profile" passHref>
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem onClick={handleLogOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

    
    </div>
  );
};

export default DashboardNavbar;
