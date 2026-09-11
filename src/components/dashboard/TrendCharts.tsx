"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { AreaChart, Activity } from "lucide-react";

export function TrendCharts() {
  return (
    <Card variant="glass" className="p-4 flex flex-col h-full min-h-[260px]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[var(--color-ai-cyan)]" />
          <h3 className="text-sm font-semibold text-white">Meteorological Trends & Rapid Intensification</h3>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1 text-[var(--color-ai-cyan)]">
            <span className="w-2 h-2 rounded-full bg-[var(--color-ai-cyan)]" /> Wind (kts)
          </span>
          <span className="flex items-center gap-1 text-[var(--color-solar-coral)]">
            <span className="w-2 h-2 rounded-full bg-[var(--color-solar-coral)]" /> Pressure (hPa)
          </span>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-[var(--border-subtle)] rounded-lg p-6 text-center bg-[var(--bg-base)]/40">
        <AreaChart className="w-10 h-10 text-[var(--text-muted)] mb-2" />
        <p className="text-xs font-medium text-slate-200">
          Recharts Temporal Projection Chart [Placeholder]
        </p>
        <p className="text-[11px] text-[var(--text-muted)] max-w-sm mt-1">
          Historical 24-hr observation curve combined with 48-hr AI ensemble intensity trajectory forecasts.
        </p>
      </div>
    </Card>
  );
}
