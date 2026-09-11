"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { WarningPill } from "@/components/ui/WarningPill";
import { SatellitePill } from "@/components/ui/SatellitePill";
import { DashboardPill } from "@/components/ui/DashboardPill";
import { MenuPill } from "@/components/ui/MenuPill";
import { SlideOverMenu } from "@/components/landing/SlideOverMenu";

export function GlobalNav() {
  const [tacticalMenuOpen, setTacticalMenuOpen] = useState(false);

  return (
    <>
      <header 
        id="global-nav" 
        className="fixed top-0 left-0 right-0 z-50 h-16 sm:h-20 transition-all duration-300 flex items-center px-4 sm:px-8 lg:px-12 w-full"
        style={{
          background: "linear-gradient(180deg, rgba(224, 252, 255, 0.22) 0%, rgba(0, 242, 254, 0.10) 100%)",
          backdropFilter: "blur(24px) saturate(200%)",
          WebkitBackdropFilter: "blur(24px) saturate(200%)",
          boxShadow: "0 10px 25px -2px rgba(0, 0, 0, 0.7), 0 18px 36px -6px rgba(0, 0, 0, 0.45), 0 6px 14px -3px rgba(0, 242, 254, 0.25), inset 0 1px 0 0 rgba(224, 252, 255, 0.5)",
        }}
      >
        <div className="w-full relative flex items-center justify-between">
          
          {/* 1. LEFT: Brand Logo & Title */}
          <div className="flex items-center gap-3 shrink-0 z-10">
            <Link 
              href="/" 
              className="group flex items-center gap-1.5 sm:gap-2 shrink-0"
            >
              <Image 
                src="/logo.png" 
                alt="CYTORN Logo" 
                width={64} 
                height={64} 
                unoptimized
                priority
                className="w-11 h-11 sm:w-13 sm:h-13 md:w-14 md:h-14 object-contain translate-y-0.5 sm:translate-y-1 drop-shadow-[0_4px_12px_rgba(0,0,0,0.7)] drop-shadow-[0_0_8px_rgba(0,242,254,0.35)] group-hover:scale-105 group-hover:drop-shadow-[0_0_16px_rgba(0,242,254,0.65)] transition-all duration-300 shrink-0"
              />
              <div className="flex flex-col">
                <span 
                  className="text-lg sm:text-2xl font-extrabold tracking-[0.06em] text-white font-orbitron uppercase transition-all duration-300 group-hover:text-[#00F2FE] group-hover:[text-shadow:0_2px_4px_#000000,0_0_16px_rgba(0,242,254,0.9)]"
                  style={{
                    textShadow: "0 2px 4px #000000, 0 4px 12px rgba(0, 0, 0, 0.9), 0 0 16px rgba(0, 242, 254, 0.35)"
                  }}
                >
                  CYTORN
                </span>
                <span 
                  className="text-[7px] sm:text-[8.5px] uppercase tracking-[0.18em] text-slate-300 mt-1 font-jetbrains font-semibold hidden sm:inline transition-colors duration-300 group-hover:text-[#00F2FE]/80"
                  style={{
                    textShadow: "0 1px 3px #000000, 0 2px 6px rgba(0, 0, 0, 0.95)"
                  }}
                >
                  Deep-Tech Climate OS
                </span>
              </div>
            </Link>
          </div>

          {/* 2. CENTER: The Navigation Action Pills */}
          <div className="hidden md:flex items-center justify-center gap-2 sm:gap-2.5 lg:gap-3.5 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto z-10">
            {/* Button 1: Active Warning Pill */}
            <WarningPill href="/alerts" />

            {/* Button 2: Analyze Satellite Feed Pill */}
            <SatellitePill href="/satellite-analyzer" />

            {/* Button 3: Launch Dashboard React Bits Pill */}
            <DashboardPill href="/dashboard" />
          </div>

          {/* 3. RIGHT: Tactical Drawer Menu Button & Mobile Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 z-10">
            {/* On mobile (<sm), show the compact WarningPill */}
            <div className="flex sm:hidden items-center mr-1">
              <WarningPill href="/alerts" />
            </div>

            {/* Tactical Drawer Menu Button (React Bits Pill styling) */}
            <MenuPill onClick={() => setTacticalMenuOpen(true)} />
          </div>
        </div>
      </header>

      {/* Fullscreen Tactical Navigation Drawer */}
      <SlideOverMenu 
        isOpen={tacticalMenuOpen} 
        onClose={() => setTacticalMenuOpen(false)} 
      />
    </>
  );
}
