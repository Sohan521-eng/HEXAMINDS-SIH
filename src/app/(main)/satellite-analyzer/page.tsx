"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { AlertBadge } from "@/components/ui/AlertBadge";
import { Button } from "@/components/ui/Button";
import { ImageUploader } from "@/components/analyzer/ImageUploader";
import XaiAssistantPanel from "@/components/xai/XaiAssistantPanel";
import { Layers, Eye, Cpu, Play, CheckCircle2, Bot, Sparkles } from "lucide-react";

export default function SatelliteAnalyzerPage() {
  const [selectedBand, setSelectedBand] = useState<"TIR-1" | "TIR-2" | "WV" | "VIS">("TIR-1");
  const [colorCurve, setColorCurve] = useState<"dvorak" | "rainbow" | "grayscale">("dvorak");
  const [xaiBlend, setXaiBlend] = useState(65);
  const [isXaiDrawerOpen, setIsXaiDrawerOpen] = useState(false);

  return (
    <div className="space-y-4 relative">
      {/* Page Title & Status Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-[#1E3252]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-white">
              AI Satellite Analyzer & Pattern Studio
            </h1>
            <AlertBadge tier="ai">ConvNeXt-ViT v2.4</AlertBadge>
          </div>
          <p className="text-xs text-[#8E9EB5] mt-0.5">
            Deep convective pattern classification, automated Dvorak wind estimation, and Grad-CAM attention explainability.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsXaiDrawerOpen(true)}
            className="group flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#00F2FE]/10 hover:bg-[#00F2FE]/20 border border-[#00F2FE]/40 hover:border-[#00F2FE] text-xs font-rajdhani font-bold tracking-wider uppercase text-white shadow-[0_0_15px_rgba(0,242,254,0.2)] transition cursor-pointer active:scale-95"
          >
            <Bot className="w-4 h-4 text-[#00F2FE]" />
            <span>Explain Predictions</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#10E7A2] animate-pulse" />
          </button>
          <Button variant="secondary" size="sm">
            Live INSAT-3DR Stream
          </Button>
          <Button variant="primary" size="sm">
            <Play className="w-3.5 h-3.5 mr-1.5 fill-current" /> Run AI Inference
          </Button>
        </div>
      </div>


      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left/Center 2 Cols: Main Imagery Canvas & XAI Overlay */}
        <div className="lg:col-span-2 space-y-4">
          <Card variant="glass" className="p-4 relative min-h-[460px] flex flex-col justify-between">
            {/* Canvas Controls Overlay */}
            <div className="flex items-center justify-between z-10">
              {/* Spectral Channel Pills */}
              <div className="flex items-center gap-1.5 bg-[#050B14]/80 p-1 rounded-lg border border-[#1E3252]">
                {(["TIR-1", "TIR-2", "WV", "VIS"] as const).map((band) => (
                  <button
                    key={band}
                    onClick={() => setSelectedBand(band)}
                    className={`px-2.5 py-1 rounded text-xs font-mono transition-all cursor-pointer ${
                      selectedBand === band
                        ? "bg-[#00F2FE]/20 text-[#00F2FE] border border-[#00F2FE]/40"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {band}
                  </button>
                ))}
              </div>

              {/* Enhancement Curve */}
              <div className="flex items-center gap-1 text-xs font-mono">
                <span className="text-slate-400">Curve:</span>
                <button
                  onClick={() => setColorCurve("dvorak")}
                  className={`px-2 py-0.5 rounded cursor-pointer ${
                    colorCurve === "dvorak"
                      ? "bg-[#D946EF]/20 text-[#D946EF] border border-[#D946EF]/40"
                      : "text-slate-400"
                  }`}
                >
                  Dvorak BD
                </button>
                <button
                  onClick={() => setColorCurve("rainbow")}
                  className={`px-2 py-0.5 rounded cursor-pointer ${
                    colorCurve === "rainbow"
                      ? "bg-[#00F2FE]/20 text-[#00F2FE] border border-[#00F2FE]/40"
                      : "text-slate-400"
                  }`}
                >
                  Thermal Rainbow
                </button>
              </div>
            </div>

            {/* Imagery Preview Frame */}
            <div className="my-6 flex-1 flex flex-col items-center justify-center p-8 text-center border border-dashed border-[#1E3252] rounded-xl bg-[#050B14]/60 relative overflow-hidden">
              <div className="w-16 h-16 rounded-full border border-[#00F2FE]/40 flex items-center justify-center bg-[#00F2FE]/10 mb-3 shadow-[0_0_20px_rgba(0,242,254,0.2)]">
                <Eye className="w-7 h-7 text-[#00F2FE]" />
              </div>
              <h3 className="text-base font-bold text-white">
                Multi-Spectral Ingestion Canvas [INSAT-3DR TIR-1]
              </h3>
              <p className="text-xs text-[#8E9EB5] max-w-md mt-1">
                Detected Pattern: <span className="text-[#00F2FE] font-bold">Curved Band / Distinct Eye Pinpointing</span>
              </p>

              {/* Bounding Box Indicator */}
              <div className="absolute inset-x-24 inset-y-16 border-2 border-[#00FFA3] rounded-lg pointer-events-none opacity-60 flex items-start justify-end p-2">
                <span className="text-[10px] font-mono bg-[#00FFA3] text-black px-1.5 py-0.5 font-bold rounded">
                  LLCC Conf: 96.4%
                </span>
              </div>
            </div>

            {/* XAI Grad-CAM Slider Controls */}
            <div className="pt-3 border-t border-[#1E3252] flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#00FFA3]" />
                <span className="font-mono text-slate-300">Grad-CAM Heatmap Blend:</span>
                <span className="font-mono text-[#00FFA3] font-bold">{xaiBlend}%</span>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                value={xaiBlend}
                onChange={(e) => setXaiBlend(Number(e.target.value))}
                className="w-48 accent-[#00F2FE] cursor-pointer"
              />
            </div>
          </Card>

          {/* Raster Uploader Widget */}
          <ImageUploader />
        </div>

        {/* Right 1 Col: AI Inference & Dvorak Breakdown */}
        <div className="space-y-4">
          <Card variant="glass" className="p-4 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#1E3252]">
              <span className="text-xs font-mono font-bold text-white uppercase">Inference Readout</span>
              <AlertBadge tier="warning">Category 4</AlertBadge>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between p-2 rounded bg-[#050B14] border border-[#1E3252]">
                <span className="text-[#8E9EB5]">Identified Pattern:</span>
                <span className="text-white font-bold">Eye Pattern (Dvorak)</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-[#050B14] border border-[#1E3252]">
                <span className="text-[#8E9EB5]">Calculated T-Number:</span>
                <span className="text-[#00F2FE] font-mono font-bold">T 5.5 / CI 5.5</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-[#050B14] border border-[#1E3252]">
                <span className="text-[#8E9EB5]">Estimated Peak Wind:</span>
                <span className="text-[#FF5E36] font-mono font-bold">155 km/h (84 kts)</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-[#050B14] border border-[#1E3252]">
                <span className="text-[#8E9EB5]">Central Pressure (Pc):</span>
                <span className="text-[#00F2FE] font-mono font-bold">964 hPa</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-[#050B14] border border-[#1E3252]">
                <span className="text-[#8E9EB5]">Center Coords (LLCC):</span>
                <span className="text-white font-mono">14.23°N, 88.51°E</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#1E3252]">
              <p className="text-[11px] font-mono uppercase text-[#8E9EB5] mb-2 font-bold">
                Feature Attribution Summary
              </p>
              <ul className="space-y-1 text-xs text-slate-300 mb-4">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10E7A2]" />
                  Cold cloud top temperature &lt; -75°C
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10E7A2]" />
                  Symmetric eyewall convection band
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10E7A2]" />
                  Rapid outflow divergence in WV channel
                </li>
              </ul>

              <button
                onClick={() => setIsXaiDrawerOpen(true)}
                className="w-full py-2.5 px-3 rounded-xl bg-[#00F2FE]/10 hover:bg-[#00F2FE]/20 border border-[#00F2FE]/40 hover:border-[#00F2FE] text-[#00F2FE] hover:text-white font-rajdhani font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(0,242,254,0.15)]"
              >
                <Bot className="w-4 h-4" />
                <span>Launch Cyclone AI Assistant</span>
              </button>
            </div>
          </Card>
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


