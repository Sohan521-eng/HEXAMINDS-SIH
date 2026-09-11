"use client";

import React, { useState } from "react";
import { CycloneStatusCard } from "@/components/dashboard/CycloneStatusCard";
import { RealTimeParameters } from "@/components/dashboard/RealTimeParameters";
import { MapLayerCanvas } from "@/components/map/MapLayerCanvas";
import { TrendCharts } from "@/components/dashboard/TrendCharts";
import XaiAssistantPanel from "@/components/xai/XaiAssistantPanel";
import { Bot, Sparkles, X, ChevronRight, Cpu } from "lucide-react";

export default function DashboardPage() {
  const [isXaiDrawerOpen, setIsXaiDrawerOpen] = useState(false);
  const [activeRightTab, setActiveRightTab] = useState<"overview" | "xai">("overview");

  return (
    <div className="space-y-4 relative">
      {/* Top Controls Bar: Basin Telemetry & AI Studio Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[#00F2FE] bg-[#00F2FE]/10 px-2.5 py-1 rounded-lg border border-[#00F2FE]/30 font-bold">
            BAY OF BENGAL • SECTOR BOB-02
          </span>
          <span className="text-xs text-[#8E9EB5] hidden sm:inline">
            Active Cycle: INSAT-3DR Rapid Scan (15m)
          </span>
        </div>

        {/* Action Button: AI Explainability & Reasoning Studio */}
        <button
          onClick={() => setIsXaiDrawerOpen(true)}
          className="group flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-[#00F2FE]/10 hover:bg-[#00F2FE]/20 border border-[#00F2FE]/40 hover:border-[#00F2FE] text-xs font-rajdhani font-bold tracking-wider uppercase text-white shadow-[0_0_16px_rgba(0,242,254,0.2)] transition-all cursor-pointer active:scale-95"
        >
          <div className="w-2 h-2 rounded-full bg-[#00F2FE] animate-ping" />
          <Bot className="w-4 h-4 text-[#00F2FE]" />
          <span>AI Explainability Studio</span>
          <span className="text-[10px] font-mono text-[#00F2FE] bg-[#00F2FE]/20 px-1.5 py-0.5 rounded border border-[#00F2FE]/40">
            XAI
          </span>
        </button>
      </div>

      {/* Top Row: Weather Parameter Micro-Cards */}
      <RealTimeParameters />

      {/* Central Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-[500px]">
        {/* Left/Center 2 Cols: Geospatial Satellite Map (MapLibre + deck.gl) */}
        <div className="lg:col-span-2 flex flex-col">
          <MapLayerCanvas />
        </div>

        {/* Right 1 Col: Active Cyclone Status & Forecast Overview / Embedded XAI Studio */}
        <div className="flex flex-col gap-4">
          <CycloneStatusCard />

          {/* Right Sub-Tabs: Trends vs Embedded AI Reasoning */}
          <div className="flex items-center justify-between bg-[#0F1B2F] p-1 rounded-xl border border-[#1E3252] text-xs font-rajdhani">
            <button
              onClick={() => setActiveRightTab("overview")}
              className={`flex-1 py-1.5 rounded-lg font-bold uppercase transition cursor-pointer ${
                activeRightTab === "overview"
                  ? "bg-[#00F2FE]/20 text-[#00F2FE] border border-[#00F2FE]/40 shadow-sm"
                  : "text-[#8E9EB5] hover:text-white"
              }`}
            >
              Meteorological Trends
            </button>
            <button
              onClick={() => setActiveRightTab("xai")}
              className={`flex-1 py-1.5 rounded-lg font-bold uppercase transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeRightTab === "xai"
                  ? "bg-[#00F2FE]/20 text-[#00F2FE] border border-[#00F2FE]/40 shadow-sm"
                  : "text-[#8E9EB5] hover:text-white"
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-[#00F2FE]" />
              <span>XAI Assistant</span>
            </button>
          </div>

          {activeRightTab === "overview" ? (
            <TrendCharts />
          ) : (
            <div className="h-[440px] flex flex-col">
              <XaiAssistantPanel className="h-full rounded-xl p-4 shadow-none" />
            </div>
          )}
        </div>
      </div>




      {/* Slide-Over Drawer Modal for Full XAI Assistant */}
      {isXaiDrawerOpen && (
        <div 
          onClick={() => setIsXaiDrawerOpen(false)}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-end p-2 sm:p-6 transition-opacity"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl h-[90vh] max-h-[720px] flex flex-col animate-in slide-in-from-right duration-300"
          >
            <XaiAssistantPanel 
              onClose={() => setIsXaiDrawerOpen(false)}
              className="h-full"
            />
          </div>
        </div>
      )}
    </div>
  );
}

