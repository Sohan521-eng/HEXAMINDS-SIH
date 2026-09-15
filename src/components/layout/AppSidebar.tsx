"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Radio, 
  Satellite, 
  Compass, 
  ShieldAlert, 
  Cpu, 
  Settings, 
  MapPin, 
  Home 
} from "lucide-react";

export function AppSidebar() {
  const pathname = usePathname();

  if (
    pathname === "/dashboard" || 
    pathname?.startsWith("/dashboard") ||
    pathname === "/satellite-analyzer" ||
    pathname?.startsWith("/satellite-analyzer")
  ) {
    return null;
  }

  const navigation = [
    { name: "Live Command", href: "/dashboard", icon: Radio },
    { name: "Satellite Analyzer", href: "/satellite-analyzer", icon: Satellite },
    { name: "AI Trajectory", href: "/forecast", icon: Compass },
    { name: "Disaster Alerts", href: "/alerts", icon: ShieldAlert },
    { name: "Model Performance", href: "/model-metrics", icon: Cpu },
  ];

  return (
    <aside className="w-64 border-r border-[#1E3252] bg-[#050B14]/95 backdrop-blur-xl flex flex-col justify-between shrink-0 p-4 h-[calc(100vh-4rem)] sm:h-[calc(100vh-5rem)] sticky top-16 sm:top-20">
      <div className="space-y-6">
        <div>
          <p className="px-3 text-[10px] font-mono font-bold uppercase tracking-wider text-[#8E9EB5] mb-2">
            Mission Operations
          </p>
          <nav className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? "bg-[#00F2FE]/15 text-[#00F2FE] border border-[#00F2FE]/40 shadow-[0_0_15px_rgba(0,242,254,0.15)] font-bold"
                      : "text-[#8E9EB5] hover:text-white hover:bg-[#0F1B2F]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div>
          <p className="px-3 text-[10px] font-mono font-bold uppercase tracking-wider text-[#8E9EB5] mb-2">
            Monitored Basin
          </p>
          <div className="px-3 py-2.5 rounded-lg bg-[#0F1B2F] border border-[#1E3252] text-xs">
            <div className="flex items-center gap-2 text-white mb-1">
              <MapPin className="w-3.5 h-3.5 text-[#00F2FE]" />
              <span className="font-bold">Bay of Bengal</span>
            </div>
            <p className="text-[10px] text-[#8E9EB5]">IMD Priority Sector • BOB-02</p>
          </div>
        </div>
      </div>

      <div className="space-y-1 pt-4 border-t border-[#1E3252]">
        <Link
          href="/settings"
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition ${
            pathname === "/settings"
              ? "text-[#00F2FE] font-bold"
              : "text-[#8E9EB5] hover:text-white hover:bg-[#0F1B2F]"
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>System Settings</span>
        </Link>
        <Link
          href="/"
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-[#8E9EB5] hover:text-white hover:bg-[#0F1B2F] transition"
        >
          <Home className="w-4 h-4" />
          <span>Exit to Public Portal</span>
        </Link>
      </div>
    </aside>
  );
}
