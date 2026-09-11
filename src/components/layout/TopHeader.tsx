import React from "react";
import Image from "next/image";
import { Bell, Activity } from "lucide-react";
import { AlertBadge } from "@/components/ui/AlertBadge";

export function TopHeader() {
  return (
    <header className="h-16 border-b border-[var(--border-subtle)] bg-[var(--bg-base)]/85 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <Image 
          src="/logo.png" 
          alt="CYTORN Logo" 
          width={48} 
          height={48} 
          unoptimized
          className="w-11 h-11 object-contain translate-y-0.5 drop-shadow-[0_3px_10px_rgba(0,0,0,0.7)] drop-shadow-[0_0_8px_rgba(0,242,254,0.35)] shrink-0"
        />
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold tracking-tight text-[var(--text-primary)] flex items-center gap-2">
              CYTORN <span className="text-xs font-mono font-normal text-[var(--color-ai-cyan)]">v1.0-alpha</span>
            </h1>
            <AlertBadge tier="ai">SIH 2026</AlertBadge>
          </div>
          <p className="text-xs text-[var(--text-muted)]">
            Tropical Cyclone AI Prediction & Monitoring System
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs">
          <span className="w-2 h-2 rounded-full bg-[var(--alert-stage-1-watch)] animate-ping" />
          <span className="text-[var(--text-secondary)]">INSAT-3DR Live Feed:</span>
          <span className="font-mono text-[var(--alert-stage-1-watch)]">Synced</span>
        </div>

        <button
          aria-label="Alerts"
          className="p-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--color-ai-cyan)]/40 text-[var(--text-muted)] hover:text-white transition"
        >
          <Bell className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
