"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Bell, Shield, Clock } from "lucide-react";
import { AlertBadge } from "@/components/ui/AlertBadge";

export function Topbar() {
  return (
    <header className="h-16 border-b border-[#1E3252] bg-[#050B14]/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2 group">
          <Image 
            src="/logo.png" 
            alt="CYTORN Logo" 
            width={48} 
            height={48} 
            unoptimized
            className="w-11 h-11 object-contain translate-y-0.5 drop-shadow-[0_3px_10px_rgba(0,0,0,0.7)] drop-shadow-[0_0_8px_rgba(0,242,254,0.35)] group-hover:scale-105 transition-transform shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black tracking-tight text-white">
                CYTORN
              </span>
              <AlertBadge tier="ai">OPERATIONAL</AlertBadge>
            </div>
            <p className="text-[10px] text-[#8E9EB5]">
              National Cyclone Command Center • SIH 2026
            </p>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {/* Dual Clock */}
        <div className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-[#0F1B2F] border border-[#1E3252] text-xs font-mono">
          <Clock className="w-3.5 h-3.5 text-[#00F2FE]" />
          <span className="text-white font-bold">10:48 UTC</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-300">16:18 IST</span>
        </div>

        {/* Live Feed Status */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0F1B2F] border border-[#1E3252] text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-[#10E7A2] animate-ping" />
          <span className="text-[#8E9EB5]">MOSDAC Stream:</span>
          <span className="text-[#10E7A2] font-bold">Synced</span>
        </div>

        {/* Alerts Bell */}
        <Link
          href="/alerts"
          aria-label="Active Alerts"
          className="relative p-2 rounded-lg bg-[#0F1B2F] border border-[#1E3252] hover:border-[#FF5E36]/50 text-slate-300 hover:text-white transition"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#FF5E36] animate-pulse" />
        </Link>

        {/* User Account / Role Pill */}
        <Link
          href="/login"
          className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-lg bg-[#0F1B2F] border border-[#1E3252] hover:border-[#00F2FE]/40 transition text-xs font-mono"
        >
          <span className="text-white font-bold">Scientist (IMD)</span>
          <div className="w-6 h-6 rounded-full bg-[#00F2FE]/20 text-[#00F2FE] flex items-center justify-center font-bold text-[10px]">
            SC
          </div>
        </Link>
      </div>
    </header>
  );
}
