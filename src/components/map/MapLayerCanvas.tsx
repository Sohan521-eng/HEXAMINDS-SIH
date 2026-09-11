"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Map, Layers, Navigation, Maximize2 } from "lucide-react";

export function MapLayerCanvas() {
  return (
    <Card variant="glass" className="relative overflow-hidden w-full h-full min-h-[440px] flex flex-col">
      {/* Map Control Overlay Header */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2 bg-[#0F1B2F]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#1E3252] shadow-lg text-xs">
          <Map className="w-4 h-4 text-[#00F2FE]" />
          <span className="font-semibold text-white">Geospatial Satellite & Radar View</span>
          <span className="text-[10px] text-[#8E9EB5] font-mono">MapLibre GL + deck.gl</span>
        </div>

        <div className="pointer-events-auto flex items-center gap-2">
          <button className="p-2 rounded-lg bg-[#0F1B2F]/90 backdrop-blur-md border border-[#1E3252] hover:border-[#00F2FE]/40 text-slate-300 hover:text-white transition shadow-lg">
            <Layers className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg bg-[#0F1B2F]/90 backdrop-blur-md border border-[#1E3252] hover:border-[#00F2FE]/40 text-slate-300 hover:text-white transition shadow-lg">
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Map Canvas Frame */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-[#050B14] via-[#0F1B2F]/40 to-[#050B14] relative">
        <div className="w-20 h-20 rounded-full border border-[#00F2FE]/30 flex items-center justify-center bg-[#00F2FE]/5 mb-4 animate-pulse shadow-[0_0_20px_rgba(0,242,254,0.15)]">
          <Navigation className="w-8 h-8 text-[#00F2FE] rotate-45" />
        </div>
        <h3 className="text-base font-bold text-slate-200">
          Geospatial Map Canvas [MapLibre GL JS + deck.gl Container]
        </h3>
        <p className="text-xs text-[#8E9EB5] max-w-sm mt-1">
          High-performance rendering of multi-source INSAT-3DR satellite infrared overlays, Doppler radar reflectivity, and AI-predicted trajectory vectors.
        </p>

        {/* Coordinates indicator */}
        <div className="absolute bottom-3 left-3 bg-[#0F1B2F]/80 backdrop-blur border border-[#1E3252] rounded px-2.5 py-1 text-[11px] font-mono text-[#8E9EB5]">
          14.234° N, 88.512° E | Zoom: 6.2 | North Indian Ocean Basin
        </div>
      </div>
    </Card>
  );
}
