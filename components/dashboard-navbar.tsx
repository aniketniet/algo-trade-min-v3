"use client";

import React, { useState } from "react";
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
import { Input } from "postcss";
import { useAuth } from "@/context/authContext";

const DashboardNavbar = () => {
  const [isPassportChangeDialogOpen, setPassportChangeDialogOpen] =
    useState(false);

      const { logout} = useAuth();

  const handleLogOut = () => {
    logout();
    // Optionally redirect to login page or show a message
    console.log("User logged out");
  }
  


    

  const handlePassportChange = () => {
    setPassportChangeDialogOpen(true);
    const dialog = document.getElementById(
      "passport-change-dialog"
    ) as HTMLDialogElement | null;
    if (dialog) {
      dialog.showModal();
    }
  };

  const handleDialogClose = () => {
    setPassportChangeDialogOpen(false);
    const dialog = document.getElementById(
      "passport-change-dialog"
    ) as HTMLDialogElement | null;
    if (dialog) {
      dialog.close();
    }
  };

  const handleDialogConfirm = () => {
    console.log("Passport changed");
    handleDialogClose();
  };

  const handleDialogCancel = () => {
    handleDialogClose();
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
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="hidden md:inline-block">John Doe</span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 bg-white text-gray-800"
            >
              <Link href="/dashboard/profile" passHref>
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handlePassportChange}>
                <SearchCodeIcon className="mr-2 h-4 w-4" />
                <span>Change Passport</span>
              </DropdownMenuItem>
           
                <DropdownMenuItem onClick={handleLogOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
          
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Passport Change Dialog */}
      <dialog
        id="passport-change-dialog"
        className="rounded-lg p-0 w-full max-w-md"
      >
        <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Change Passport
          </h3>
          <button
            type="button"
            onClick={handleDialogClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <span className="sr-only">Close</span>
            &times;
          </button>
        </div>
        <form method="dialog" className="bg-white p-6 rounded-lg shadow-lg">
          <label className="text-md text-gray-600 mb-4">Passport</label>

          <input
            type="password"
            className="mb-4 w-full border border-gray-300 rounded-md p-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Enter New Passport"
          />
          <label className="text-md text-gray-600 mb-2">
            Confirm New Passport
          </label>
          <input
            type="password"
            className="mb-4 w-full border border-gray-300 rounded-md p-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Enter Confirm Passport"
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={handleDialogCancel}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDialogConfirm}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Confirm
            </button>
          </div>
        </form>
      </dialog>
    </div>
  );
};

export default DashboardNavbar;
