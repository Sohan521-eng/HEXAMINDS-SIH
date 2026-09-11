"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Map, Layers, Navigation, Maximize2 } from "lucide-react";

export function SatelliteMapView() {
  return (
    <Card variant="glass" className="relative overflow-hidden w-full h-full min-h-[420px] flex flex-col">
      {/* Map Control Overlay Header */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2 bg-[var(--bg-surface)]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] shadow-lg text-xs">
          <Map className="w-4 h-4 text-[var(--color-ai-cyan)]" />
          <span className="font-semibold text-white">Geospatial Satellite View</span>
          <span className="text-[10px] text-[var(--text-muted)] font-mono">MapLibre GL</span>
        </div>

        <div className="pointer-events-auto flex items-center gap-2">
          <button className="p-2 rounded-lg bg-[var(--bg-surface)]/90 backdrop-blur-md border border-[var(--border-subtle)] hover:border-[var(--color-ai-cyan)]/40 text-[var(--text-muted)] hover:text-white transition shadow-lg">
            <Layers className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg bg-[var(--bg-surface)]/90 backdrop-blur-md border border-[var(--border-subtle)] hover:border-[var(--color-ai-cyan)]/40 text-[var(--text-muted)] hover:text-white transition shadow-lg">
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Map Canvas Placeholder */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-[var(--bg-base)] via-[var(--bg-surface)]/40 to-[var(--bg-base)] relative">
        <div className="w-20 h-20 rounded-full border border-[var(--color-ai-cyan)]/30 flex items-center justify-center bg-[var(--color-ai-cyan)]/5 mb-4 animate-pulse shadow-[0_0_20px_rgba(0,242,254,0.15)]">
          <Navigation className="w-8 h-8 text-[var(--color-ai-cyan)] rotate-45" />
        </div>
        <h3 className="text-base font-semibold text-slate-200">
          Geospatial Map Canvas [MapLibre GL Container]
        </h3>
        <p className="text-xs text-[var(--text-muted)] max-w-sm mt-1">
          Visualizes real-time INSAT-3DR satellite infrared overlays, Doppler radar reflectivity, and AI-predicted cone of uncertainty.
        </p>

        {/* Coordinates indicator */}
        <div className="absolute bottom-3 left-3 bg-[var(--bg-surface)]/80 backdrop-blur border border-[var(--border-subtle)] rounded px-2 py-1 text-[11px] font-mono text-[var(--text-muted)]">
          14.234° N, 88.512° E | Zoom: 6.2
        </div>
      </div>
    </Card>
  );
}
