"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import Noise from "@/components/ui/Noise";
import {
  Satellite,
  Palette,
  Upload,
  Sliders,
} from "lucide-react";

export type SatelliteSource = "INSAT-3DR" | "INSAT-3D" | "GOES-16" | "Himawari-9";
export type SpectralBand = "TIR-1" | "TIR-2" | "MIR" | "VIS" | "WV";
export type ColorCurve = "dvorak" | "rainbow" | "grayscale";

export interface RadiometricSettings {
  contrast: number;    // 50 – 150 (percentage)
  brightness: number;  // 50 – 150 (percentage)
  gamma: number;       // 0.5 – 2.0
  tempClipping: number;// -80 to 30 (°C)
}

interface RadiometricStripProps {
  selectedSource: SatelliteSource;
  onSourceChange: (source: SatelliteSource) => void;
  selectedBand: SpectralBand;
  onBandChange: (band: SpectralBand) => void;
  selectedCurve: ColorCurve;
  onCurveChange: (curve: ColorCurve) => void;
  onOpenUpload: () => void;
  onOpenAdjustments?: () => void;
  radiometrics?: RadiometricSettings;
  onRadiometricsChange?: (settings: RadiometricSettings) => void;
  onResetRadiometrics?: () => void;
}

/* ─── Shared Framer Motion Variants ─── */
const PANEL_VARIANTS = {
  hidden: {
    opacity: 0,
    scale: 0.90,
    y: -14,
    filter: "blur(8px)",
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.35,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      staggerChildren: 0.045,
      delayChildren: 0.03,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.92,
    y: -10,
    filter: "blur(6px)",
    transition: {
      duration: 0.25,
      ease: [0.25, 1, 0.5, 1] as [number, number, number, number],
    },
  },
};

const ITEM_VARIANTS = {
  hidden: { opacity: 0, x: -8, y: -2 },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration: 0.22,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

/* ─── Shared GSAP Pill Hook ─── */
function useGsapPill() {
  const btnRef    = useRef<HTMLButtonElement | null>(null);
  const circleRef = useRef<HTMLSpanElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tlRef     = useRef<any>(null);

  useEffect(() => {
    const layout = () => {
      const circle = circleRef.current;
      const btn    = btnRef.current;
      if (!circle || !btn) return;
      const { width: w, height: h } = btn.getBoundingClientRect();
      if (!w || !h) return;
      const R     = ((w * w) / 4 + h * h) / (2 * h);
      const D     = Math.ceil(2 * R) + 2;
      const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
      circle.style.width  = `${D}px`;
      circle.style.height = `${D}px`;
      circle.style.bottom = `-${delta}px`;
      import("gsap").then(({ gsap }) => {
        gsap.set(circle, { xPercent: -50, scale: 0, transformOrigin: `50% ${D - delta}px` });
        const label = btn.querySelector<HTMLElement>(".sp-label");
        const hover = btn.querySelector<HTMLElement>(".sp-label-hover");
        if (label) gsap.set(label, { y: 0 });
        if (hover) gsap.set(hover, { y: h + 100, opacity: 0 });
        tlRef.current?.kill();
        const tl = gsap.timeline({ paused: true });
        tl.to(circle, { scale: 1.5, xPercent: -50, duration: 1.6, ease: "power2.easeOut", overwrite: "auto" }, 0);
        if (label) tl.to(label, { y: -(h + 8), duration: 1.6, ease: "power2.easeOut", overwrite: "auto" }, 0);
        if (hover) tl.to(hover, { y: 0, opacity: 1, duration: 1.6, ease: "power2.easeOut", overwrite: "auto" }, 0);
        tlRef.current = tl;
      });
    };
    layout();
    window.addEventListener("resize", layout);
    document.fonts?.ready.then(layout).catch(() => {});
    return () => window.removeEventListener("resize", layout);
  }, []);

  const handleEnter = () =>
    tlRef.current?.tweenTo(tlRef.current.duration(), { duration: 0.3, ease: "power2.easeOut", overwrite: "auto" });
  const handleLeave = () =>
    tlRef.current?.tweenTo(0, { duration: 0.25, ease: "power2.easeOut", overwrite: "auto" });

  return { btnRef, circleRef, handleEnter, handleLeave };
}

/* ─── Shared Pill Button Shell ─── */
function PillButton({
  btnRef,
  circleRef,
  handleEnter,
  handleLeave,
  open,
  onClick,
  icon,
  label,
  accentColor = "#00F2FE",
}: {
  btnRef: React.RefObject<HTMLButtonElement | null>;
  circleRef: React.RefObject<HTMLSpanElement | null>;
  handleEnter: () => void;
  handleLeave: () => void;
  open: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  accentColor?: string;
}) {
  return (
    <button
      ref={btnRef}
      type="button"
      onClick={onClick}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "6px",
        height: "34px",
        padding: "0 12px",
        background: "rgba(15, 27, 47, 0.90)",
        border: `1px solid ${open ? accentColor : `${accentColor}8C`}`,
        borderRadius: "0.5rem",
        boxShadow: open
          ? `0 6px 18px rgba(0,0,0,0.45), 0 0 14px ${accentColor}59`
          : "0 4px 14px rgba(0,0,0,0.35)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        color: "#FFFFFF",
        fontFamily: "var(--font-rajdhani, sans-serif)",
        fontWeight: 700,
        fontSize: "12px",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        whiteSpace: "nowrap",
        cursor: "pointer",
        overflow: "hidden",
        transition: "border-color 0.25s ease, box-shadow 0.25s ease",
        flexShrink: 0,
      }}
    >
      {/* GSAP bubble */}
      <span
        ref={circleRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "50%",
          bottom: 0,
          borderRadius: "50%",
          background: accentColor,
          zIndex: 1,
          pointerEvents: "none",
          willChange: "transform",
        }}
      />
      {/* Default label */}
      <span
        className="sp-label"
        style={{
          position: "relative",
          zIndex: 2,
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          willChange: "transform",
          color: open ? accentColor : "#FFFFFF",
          transition: "color 0.25s ease",
        }}
      >
        {icon}
        {label}
      </span>
      {/* Hover label */}
      <span
        className="sp-label-hover"
        aria-hidden="true"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          height: "100%",
          zIndex: 3,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          gap: "6px",
          color: "#050B14",
          fontWeight: 800,
          willChange: "transform, opacity",
        }}
      >
        {icon}
        {label}
      </span>
    </button>
  );
}

/* ─── Satellite Source Pill ─── */
interface SourceOption { id: SatelliteSource; label: string; agency: string; latency: string }

function SatelliteSourcePill({
  sources,
  selectedSource,
  onSourceChange,
}: {
  sources: SourceOption[];
  selectedSource: SatelliteSource;
  onSourceChange: (s: SatelliteSource) => void;
}) {
  const [open, setOpen]       = useState(false);
  const [mounted, setMounted] = useState(false);
  const wrapRef               = useRef<HTMLDivElement | null>(null);
  const dropdownRef           = useRef<HTMLDivElement | null>(null);
  const [dropPos, setDropPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const { btnRef, circleRef, handleEnter, handleLeave } = useGsapPill();

  useEffect(() => { setMounted(true); }, []);

  const updateDropPos = () => {
    if (btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setDropPos({ top: r.bottom + 6, left: r.left });
    }
  };

  useEffect(() => {
    if (!open) return;
    updateDropPos();
    const h = () => updateDropPos();
    window.addEventListener("scroll", h, true);
    window.addEventListener("resize", h);
    return () => { window.removeEventListener("scroll", h, true); window.removeEventListener("resize", h); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!wrapRef.current?.contains(t) && !dropdownRef.current?.contains(t)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const currentLabel = sources.find((s) => s.id === selectedSource)?.label ?? selectedSource;

  return (
    <div ref={wrapRef} style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: "6px" }}>
      <PillButton
        btnRef={btnRef}
        circleRef={circleRef}
        handleEnter={handleEnter}
        handleLeave={handleLeave}
        open={open}
        onClick={() => { if (!open) updateDropPos(); setOpen((o) => !o); }}
        icon={<Satellite style={{ width: 14, height: 14 }} />}
        label={currentLabel}
      />

      {mounted && typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              ref={dropdownRef}
              key="satellite-source-dropdown"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={PANEL_VARIANTS}
              style={{ position: "fixed", top: dropPos.top, left: dropPos.left, zIndex: 9999, transformOrigin: "top left" }}
              className="min-w-[220px] bg-[#0F1B2F]/95 backdrop-blur-xl border border-[rgba(0,242,254,0.45)] rounded-xl p-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.8),0_0_16px_rgba(0,242,254,0.18)] transform-gpu overflow-hidden"
            >
              <Noise patternSize={250} patternScaleX={2.5} patternScaleY={2.5} patternRefreshInterval={2} patternAlpha={10} />
              <div className="relative z-10 flex flex-col space-y-1">
                {sources.map((s) => {
                  const active = s.id === selectedSource;
                  return (
                    <motion.button
                      key={s.id}
                      variants={ITEM_VARIANTS}
                      type="button"
                      onClick={() => { onSourceChange(s.id); setOpen(false); }}
                      className={`flex items-center justify-between w-full px-2.5 py-2 rounded-lg border transition-all duration-200 cursor-pointer text-left ${
                        active
                          ? "bg-[rgba(0,242,254,0.14)] border-[rgba(0,242,254,0.5)] shadow-[0_0_12px_rgba(0,242,254,0.22)]"
                          : "bg-transparent border-transparent hover:bg-white/[0.06] hover:border-white/10"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-6 h-6 rounded-md flex items-center justify-center ${active ? "bg-[#00F2FE]/20 text-[#00F2FE]" : "bg-white/5 text-[#8E9EB5]"}`}>
                          <Satellite className="w-3.5 h-3.5 shrink-0" />
                        </div>
                        <div>
                          <div className={`text-xs font-bold font-rajdhani uppercase tracking-wider ${active ? "text-[#00F2FE]" : "text-white"}`}>{s.label}</div>
                          <div className="text-[10px] text-[#8E9EB5] font-mono leading-tight">{s.agency}</div>
                        </div>
                      </div>
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                        active
                          ? "bg-[#10E7A2]/15 text-[#10E7A2] border-[#10E7A2]/40"
                          : "bg-white/5 text-[#8E9EB5] border-white/10"
                      }`}>{s.latency}</span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}

/* ─── Filters Pill — cyan accent, directly opens full adjustments modal ─── */
function FiltersPill({
  onOpenAdjustments,
}: {
  onOpenAdjustments?: () => void;
}) {
  const { btnRef, circleRef, handleEnter, handleLeave } = useGsapPill();

  return (
    <PillButton
      btnRef={btnRef}
      circleRef={circleRef}
      handleEnter={handleEnter}
      handleLeave={handleLeave}
      open={false}
      onClick={() => { if (onOpenAdjustments) onOpenAdjustments(); }}
      icon={<Sliders style={{ width: 14, height: 14 }} />}
      label="Filters"
      accentColor="#00F2FE"
    />
  );
}

/* ─── Upload Pill — same GSAP bubble, no dropdown ─── */
function UploadPill({ onClick }: { onClick: () => void }) {
  const { btnRef, circleRef, handleEnter, handleLeave } = useGsapPill();

  return (
    <PillButton
      btnRef={btnRef}
      circleRef={circleRef}
      handleEnter={handleEnter}
      handleLeave={handleLeave}
      open={false}
      onClick={onClick}
      icon={<Upload style={{ width: 14, height: 14 }} />}
      label="Upload .NC/.H5"
      accentColor="#D946EF"
    />
  );
}

/* ═══════════════════════════════════════════════════════════
   RadiometricStrip — Main export
   ═══════════════════════════════════════════════════════════ */
export function RadiometricStrip({
  selectedSource,
  onSourceChange,
  selectedBand,
  onBandChange,
  selectedCurve,
  onCurveChange,
  onOpenUpload,
  onOpenAdjustments,
}: RadiometricStripProps) {
  const sources: SourceOption[] = [
    { id: "INSAT-3DR",  label: "INSAT-3DR Live",    agency: "ISRO", latency: "42ms" },
    { id: "INSAT-3D",   label: "INSAT-3D Archival",  agency: "ISRO", latency: "58ms" },
    { id: "GOES-16",    label: "GOES-16 (East)",      agency: "NOAA", latency: "89ms" },
    { id: "Himawari-9", label: "Himawari-9",           agency: "JMA",  latency: "74ms" },
  ];

  const bands: { id: SpectralBand; name: string; wavelength: string; desc: string }[] = [
    { id: "TIR-1", name: "TIR-1", wavelength: "10.8 µm", desc: "Thermal IR Eyewall" },
    { id: "TIR-2", name: "TIR-2", wavelength: "12.0 µm", desc: "Split Window" },
    { id: "MIR",   name: "MIR",   wavelength: "3.9 µm",  desc: "Low Cloud & SST" },
    { id: "VIS",   name: "VIS",   wavelength: "0.65 µm", desc: "Optical Convection" },
    { id: "WV",    name: "WV",    wavelength: "6.8 µm",  desc: "Upper Shear & Moisture" },
  ];

  const curves: { id: ColorCurve; label: string; tag: string }[] = [
    { id: "dvorak",    label: "Dvorak BD Curve",   tag: "WMO Standard" },
    { id: "rainbow",   label: "Rainbow Thermal",    tag: "High Dynamic" },
    { id: "grayscale", label: "Inverted Grayscale", tag: "Raw Radiance" },
  ];

  return (
    <div
      className="relative backdrop-blur-xl rounded-xl p-3 shadow-[0_4px_24px_rgba(0,0,0,0.6)] overflow-hidden"
      style={{
        background: "#0F1B2F",
        border: "1.5px solid rgba(0, 242, 254, 0.55)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,242,254,0.12)",
      }}
    >
      {/* Noise film-grain */}
      <Noise
        patternSize={250}
        patternScaleX={1.2}
        patternScaleY={1.2}
        patternRefreshInterval={2}
        patternAlpha={9}
      />

      <div className="relative z-[1] flex flex-wrap items-center justify-between gap-3">
        {/* ── Left: Source & Band Selectors ── */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Source Dropdown Pill */}
          <SatelliteSourcePill
            sources={sources}
            selectedSource={selectedSource}
            onSourceChange={onSourceChange}
          />

          {/* Spectral Channel Pills */}
          <div className="flex items-center gap-1 p-1 rounded-lg bg-[#0F1B2F]/90 backdrop-blur-xl border border-[rgba(0,242,254,0.4)] shadow-[0_4px_16px_rgba(0,0,0,0.6),0_0_12px_rgba(0,242,254,0.15)]">
            <span className="text-[10px] font-mono uppercase font-bold text-[#8E9EB5] px-1.5 hidden md:inline tracking-wider">
              Band:
            </span>
            {bands.map((b) => {
              const active = selectedBand === b.id;
              return (
                <button
                  key={b.id}
                  onClick={() => onBandChange(b.id)}
                  title={`${b.name} (${b.wavelength}) — ${b.desc}`}
                  className={`h-7 px-2.5 rounded-md text-xs font-mono font-bold flex items-center justify-center transition cursor-pointer ${
                    active
                      ? "bg-[#00F2FE]/15 border border-[#00F2FE]/70 text-[#00F2FE] shadow-[0_0_8px_rgba(0,242,254,0.15)]"
                      : "bg-[#050B14]/70 hover:bg-[#00F2FE]/15 border border-[#1E3252] hover:border-[#00F2FE]/60 text-[#8E9EB5] hover:text-[#00F2FE]"
                  }`}
                >
                  <span>{b.name}</span>
                  <span className="hidden lg:inline text-[9px] opacity-75 ml-1 font-normal">
                    {b.wavelength}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Color Curve Selector */}
          <div className="flex items-center gap-1 p-1 rounded-lg bg-[#0F1B2F]/90 backdrop-blur-xl border border-[rgba(0,242,254,0.4)] shadow-[0_4px_16px_rgba(0,0,0,0.6),0_0_12px_rgba(0,242,254,0.15)]">
            <Palette className="w-3.5 h-3.5 text-[#8E9EB5] ml-1 hidden sm:inline shrink-0" />
            <span className="text-[10px] font-mono uppercase font-bold text-[#8E9EB5] px-1 hidden md:inline tracking-wider">
              Ramp:
            </span>
            {curves.map((c) => {
              const active = selectedCurve === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => onCurveChange(c.id)}
                  className={`h-7 px-2.5 rounded-md text-xs font-mono font-bold flex items-center justify-center transition cursor-pointer ${
                    active
                      ? c.id === "dvorak"
                        ? "bg-[#D946EF]/15 border border-[#D946EF]/70 text-[#D946EF] shadow-[0_0_8px_rgba(217,70,239,0.15)]"
                        : c.id === "rainbow"
                        ? "bg-[#00F2FE]/15 border border-[#00F2FE]/70 text-[#00F2FE] shadow-[0_0_8px_rgba(0,242,254,0.15)]"
                        : "bg-white/15 border border-white/70 text-white shadow-[0_0_8px_rgba(255,255,255,0.15)]"
                      : "bg-[#050B14]/70 hover:bg-[#00F2FE]/15 border border-[#1E3252] hover:border-[#00F2FE]/60 text-[#8E9EB5] hover:text-[#00F2FE]"
                  }`}
                >
                  {c.id === "dvorak" ? "Dvorak BD" : c.id === "rainbow" ? "Thermal" : "Grayscale"}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Right: Filters & Upload Pills + Scientist Badge ── */}
        <div className="flex items-center gap-2">
          {/* Filters Pill — green accent, opens quick-access dropdown */}
          <FiltersPill onOpenAdjustments={onOpenAdjustments} />

          {/* Upload Pill — magenta accent, no dropdown */}
          <UploadPill onClick={onOpenUpload} />

          {/* Scientist Identification Pill */}
          <div className="hidden xl:flex items-center gap-2 pl-2 border-l border-[#1E3252]">
            <div className="w-7 h-7 rounded-full bg-[#00F2FE]/15 border border-[#00F2FE]/40 flex items-center justify-center text-[#00F2FE] font-bold text-xs">
              SC
            </div>
            <div className="text-left leading-tight">
              <div className="text-[11px] font-rajdhani font-bold text-white uppercase tracking-wide">
                Dr. K. Radhakrishnan
              </div>
              <div className="text-[9px] font-mono text-[#00F2FE]">
                Lead ISRO Meteorologist
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
