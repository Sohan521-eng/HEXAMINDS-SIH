"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { 
  TrendingUp, 
  Download, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowUpRight 
} from "lucide-react";
import Noise from "@/components/ui/Noise";
import { gsap } from "gsap";

interface DispatchPillProps {
  href?: string;
  onClick?: () => void;
  icon: React.ReactNode;
  iconHover?: React.ReactNode;
  label: string;
  labelHover?: string;
  right?: React.ReactNode;
  rightHover?: React.ReactNode;
  circleColor?: string;
  className?: string;
  ease?: string;
}

function DispatchPill({
  href,
  onClick,
  icon,
  iconHover,
  label,
  labelHover,
  right,
  rightHover,
  circleColor = "#00F2FE",
  className = "",
  ease = "power2.easeOut",
}: DispatchPillProps) {
  const pillRef = useRef<HTMLAnchorElement & HTMLButtonElement>(null);
  const circleRef = useRef<HTMLSpanElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const layout = () => {
      const circle = circleRef.current;
      const pill = pillRef.current;
      if (!circle || !pill) return;

      const rect = pill.getBoundingClientRect();
      const { width: w, height: h } = rect;
      if (w === 0 || h === 0) return;

      const R = ((w * w) / 4 + h * h) / (2 * h);
      const D = Math.ceil(2 * R) + 4;
      const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 2;
      const originY = D - delta;

      circle.style.width = `${D}px`;
      circle.style.height = `${D}px`;
      circle.style.bottom = `-${delta}px`;
      circle.style.backgroundColor = circleColor;

      gsap.set(circle, {
        xPercent: -50,
        scale: 0,
        transformOrigin: `50% ${originY}px`,
      });

      const labelEl = pill.querySelector(".pill-label");
      const whiteEl = pill.querySelector(".pill-label-hover");

      if (labelEl) gsap.set(labelEl, { y: 0 });
      if (whiteEl) gsap.set(whiteEl, { y: h + 12, opacity: 0 });

      tlRef.current?.kill();
      const tl = gsap.timeline({ paused: true });

      tl.to(circle, { scale: 1.25, xPercent: -50, duration: 1.6, ease, overwrite: "auto" }, 0);
      if (labelEl) {
        tl.to(labelEl, { y: -(h + 8), duration: 1.6, ease, overwrite: "auto" }, 0);
      }
      if (whiteEl) {
        gsap.set(whiteEl, { y: Math.ceil(h + 30), opacity: 0 });
        tl.to(whiteEl, { y: 0, opacity: 1, duration: 1.6, ease, overwrite: "auto" }, 0);
      }

      tlRef.current = tl;
    };

    layout();
    const onResize = () => layout();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [ease, circleColor]);

  const handleEnter = () => {
    tlRef.current?.tweenTo(tlRef.current.duration(), {
      duration: 0.3,
      ease,
      overwrite: "auto",
    });
  };

  const handleLeave = () => {
    tlRef.current?.tweenTo(0, {
      duration: 0.25,
      ease,
      overwrite: "auto",
    });
  };

  const content = (
    <>
      <span 
        className="hover-circle" 
        ref={circleRef} 
        aria-hidden="true" 
        style={{ backgroundColor: circleColor }}
      />
      <span className="label-stack">
        <span className="pill-label">
          <span className="flex items-center gap-2">
            {icon}
            <span>{label}</span>
          </span>
          {right}
        </span>
        <span className="pill-label-hover" aria-hidden="true">
          <span className="flex items-center gap-2">
            {iconHover ?? icon}
            <span className="font-extrabold">{labelHover ?? label}</span>
          </span>
          {rightHover ?? right}
        </span>
      </span>
    </>
  );

  if (href) {
    return (
      <Link
        ref={pillRef}
        href={href}
        className={`dispatch-pill ${className}`}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      ref={pillRef}
      onClick={onClick}
      type="button"
      className={`dispatch-pill ${className}`}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {content}
    </button>
  );
}

interface ActionDispatchPanelProps {
  onOpenXai?: () => void;
}

export function ActionDispatchPanel({ onOpenXai }: ActionDispatchPanelProps) {
  const [broadcastConfirmed, setBroadcastConfirmed] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const handleExport = () => {
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);
  };

  const handleBroadcast = () => {
    setBroadcastConfirmed((prev) => !prev);
  };

  return (
    <Card 
      variant="glass" 
      className="relative overflow-hidden p-4 flex flex-col justify-between h-full min-h-[360px] bg-[#0F1B2F]/90 backdrop-blur-xl border border-[rgba(0,242,254,0.4)] shadow-[0_0_15px_rgba(0,242,254,0.1)]"
    >
      {/* React Bits Noise Background Overlay */}
      <Noise
        patternSize={250}
        patternScaleX={1.2}
        patternScaleY={1.2}
        patternRefreshInterval={2}
        patternAlpha={9}
      />

      {/* Foreground Content */}
      <div className="relative z-10 flex flex-col justify-between flex-1">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-3 border-b border-[#1E3252] pb-2.5">
            <h3 className="font-rajdhani text-sm font-bold uppercase tracking-wider text-[#00F2FE]">
              Action Dispatch Hub
            </h3>
            <span className="text-[10px] font-mono text-[#00F2FE] bg-[#00F2FE]/10 px-2 py-0.5 rounded border border-[#00F2FE]/30 uppercase">
              Ops Ready
            </span>
          </div>

          <p className="text-[11px] text-[#00F2FE] mb-4">
            Direct operational dispatch triggers for rapid response coordination, model exports, and national civil emergency broadcasting.
          </p>

          {/* Action Buttons Stack matching ScientistProfilePill 3D & GSAP hover effect */}
          <div className="flex flex-col gap-2.5">
            {/* Button 1: Forecast & Trajectory Link (Cyan) */}
            <DispatchPill
              href="/forecast"
              className="dispatch-pill-cyan"
              circleColor="#00F2FE"
              icon={<TrendingUp className="w-4 h-4 text-[#00F2FE] shrink-0" />}
              iconHover={<TrendingUp className="w-4 h-4 text-[#050B14] shrink-0" />}
              label="Forecast & Trajectory Ensembles"
              right={<ArrowUpRight className="w-4 h-4 text-[#00F2FE] shrink-0" />}
              rightHover={<ArrowUpRight className="w-4 h-4 text-[#050B14] shrink-0" />}
            />

            {/* Button 2: Export GeoJSON / KML (Deeper shade of blue) */}
            <DispatchPill
              onClick={handleExport}
              className="dispatch-pill-blue"
              circleColor="#1D63FF"
              icon={
                exportSuccess ? (
                  <CheckCircle2 className="w-4 h-4 text-[#10E7A2] shrink-0" />
                ) : (
                  <Download className="w-4 h-4 text-[#60A5FA] shrink-0" />
                )
              }
              iconHover={
                exportSuccess ? (
                  <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                ) : (
                  <Download className="w-4 h-4 text-white shrink-0" />
                )
              }
              label={exportSuccess ? "GeoJSON Package Exported!" : "Export GeoJSON / KML Vector"}
              right={<span className="text-[10px] font-mono text-[#93C5FD]">v2.4</span>}
              rightHover={<span className="text-[10px] font-mono text-white font-bold">v2.4</span>}
            />

            {/* Button 3: Broadcast Alert (NDMA - Orange) */}
            <div>
              <DispatchPill
                onClick={handleBroadcast}
                className={`dispatch-pill-orange ${broadcastConfirmed ? "!border-[#10E7A2] !shadow-[0_0_22px_rgba(16,231,162,0.45)]" : ""}`}
                circleColor={broadcastConfirmed ? "#10E7A2" : "#FF5E36"}
                icon={
                  broadcastConfirmed ? (
                    <CheckCircle2 className="w-4 h-4 text-[#10E7A2] shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-[#FF5E36] shrink-0" />
                  )
                }
                iconHover={
                  broadcastConfirmed ? (
                    <CheckCircle2 className="w-4 h-4 text-[#050B14] shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-[#050B14] shrink-0" />
                  )
                }
                label={
                  broadcastConfirmed
                    ? "NDMA Channel Armed: Broadcast Ready"
                    : "Broadcast Alert (NDMA / CAP-IN)"
                }
                right={
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                      broadcastConfirmed
                        ? "bg-[#10E7A2]/20 text-[#10E7A2] border border-[#10E7A2]/40"
                        : "bg-[#FF5E36]/25 text-[#FF5E36] border border-[#FF5E36]/50"
                    }`}
                  >
                    STAGE 3
                  </span>
                }
                rightHover={
                  <span className="text-[9px] font-mono bg-black/25 text-[#050B14] px-1.5 py-0.5 rounded font-bold">
                    STAGE 3
                  </span>
                }
              />
              {broadcastConfirmed && (
                <p className="text-[10px] font-mono text-[#10E7A2] mt-1.5 px-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Encrypted link verified with State Emergency Operations Center (SEOC).
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Protocol Footer */}
        <div className="mt-4 pt-2.5 border-t border-[#1E3252] flex items-center justify-between text-[10px] font-mono text-[#8E9EB5]">
          <span>CAP-IN Protocol: v1.2</span>
          <span className="text-[#00F2FE]">IMD Priority Sector 02</span>
        </div>
      </div>
    </Card>
  );
}
