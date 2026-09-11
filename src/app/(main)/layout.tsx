import React from "react";
import { Topbar } from "@/components/layout/Topbar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { XaiFloatingWidget } from "@/components/xai/XaiFloatingWidget";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] flex flex-col pt-16 sm:pt-20">
      {/* Top Control Bar with dual UTC/IST clock, storm selector, and sync status */}
      <Topbar />

      <div className="flex flex-1 overflow-hidden">
        {/* Persistent Operational Navigation Sidebar */}
        <AppSidebar />

        {/* Dynamic Mission Page Content (Pages 3 through 8) */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>

      {/* Floating Tactical Cyclone AI Assistant Trigger */}
      <XaiFloatingWidget stormName="Cyclone MOCHA" />
    </div>
  );
}
