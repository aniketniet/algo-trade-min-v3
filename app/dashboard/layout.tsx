import DashboardNavbar from "@/components/dashboard-navbar";
import DashboardSidebar from "@/components/dashboard-sidebar";

import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen ">
      <DashboardSidebar />
      <div className="flex flex-col flex-1">
        <DashboardNavbar />
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
}
