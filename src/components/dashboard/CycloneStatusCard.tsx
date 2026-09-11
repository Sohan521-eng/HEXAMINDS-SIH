"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { AlertBadge } from "@/components/ui/AlertBadge";
import { ShieldCheck, Clock, MapPin, AlertTriangle } from "lucide-react";

export function CycloneStatusCard() {
  return (
    <Card variant="glass" className="p-4 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[var(--color-ai-cyan)] bg-[var(--color-ai-cyan)]/10 px-2 py-0.5 rounded border border-[var(--color-ai-cyan)]/30 shadow-[0_0_10px_rgba(0,242,254,0.15)]">
              BOB-02/2026
            </span>
            {/* Palette 4: IMD Stage 3 Cyclone Warning */}
            <AlertBadge tier="warning">Stage 3 Warning</AlertBadge>
          </div>
          <span className="text-[11px] text-[var(--text-muted)] flex items-center gap-1">
            <Clock className="w-3 h-3" /> Updated 8m ago
          </span>
        </div>

        <div className="mb-3">
          <h2 className="text-xl font-black tracking-tight text-[var(--text-primary)] flex items-center gap-2">
            CYCLONE "REMIGR"
          </h2>
          <p className="text-xs text-[var(--text-muted)] flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3 text-[var(--color-ai-cyan)]" /> Bay of Bengal • East Coast Threat Sector
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 my-3">
          {/* Palette 1 & 2: Intensity */}
          <div className="p-2.5 rounded-lg bg-[var(--bg-base)]/80 border border-[var(--border-subtle)]">
            <span className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">Intensity</span>
            <div className="text-sm font-bold text-[var(--color-solar-coral)] mt-0.5 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-[var(--color-solar-coral)]" /> Category 4 Severe
            </div>
          </div>

          {/* Palette 5: AI Model Confidence */}
          <div className="p-2.5 rounded-lg bg-[var(--bg-base)]/80 border border-[var(--border-subtle)]">
            <span className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">AI Confidence</span>
            <div className="text-sm font-bold text-[var(--color-ai-mint)] mt-0.5 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[var(--color-ai-mint)]" /> 96.4%
            </div>
          </div>
        </div>
      </div>

      {/* Palette 4: Landfall countdown */}
      <div className="pt-2.5 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--text-muted)]">
        <span>Estimated Landfall:</span>
        <span className="font-bold text-[var(--color-solar-coral)] font-mono tracking-wide">
          T-24h (Puri-Dhamra Sector)
        </span>
      </div>
    </Card>
  );
}
