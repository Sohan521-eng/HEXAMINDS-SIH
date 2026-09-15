"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Noise from "@/components/ui/Noise";
import { ElasticSlider } from "@/components/ui/ElasticSlider";
import {
  Sliders,
  RotateCcw,
  X,
  Check,
  Contrast,
  SunMedium,
  Gauge,
  Thermometer,
  MinusIcon,
  PlusIcon,
} from "lucide-react";

export interface RadiometricSettings {
  contrast: number;     // 50 – 150 (percentage)
  brightness: number;   // 50 – 150 (percentage)
  gamma: number;        // 0.5 – 2.0
  tempClipping: number; // -80 to 30 (°C)
}

interface RadiometricAdjustmentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: RadiometricSettings;
  onChange: (settings: RadiometricSettings) => void;
  onReset: () => void;
}

const PANEL_VARIANTS = {
  hidden:  { opacity: 0, x: 40, scale: 0.97, filter: "blur(6px)" },
  visible: {
    opacity: 1, x: 0, scale: 1, filter: "blur(0px)",
    transition: {
      duration: 0.35,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      staggerChildren: 0.055,
      delayChildren: 0.04,
    },
  },
  exit: {
    opacity: 0, x: 32, scale: 0.96, filter: "blur(5px)",
    transition: { duration: 0.25, ease: [0.25, 1, 0.5, 1] as [number, number, number, number] },
  },
};

const ROW_VARIANTS = {
  hidden:  { opacity: 0, y: 10 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

/* ─── Per-slider accent via CSS custom property ─── */
function AccentSliderWrap({
  accent,
  children,
}: {
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={
        {
          "--es-accent": accent,
          "--es-accent-dim": `${accent}55`,
          "--es-accent-glow": `${accent}8C`,
        } as React.CSSProperties
      }
      className="accent-slider-wrap w-full"
    >
      {children}
    </div>
  );
}

/* ─── Single slider row ─── */
function SliderRow({
  label,
  icon,
  displayValue,
  accent,
  leftIcon,
  rightIcon,
  value,
  startingValue,
  maxValue,
  isStepped,
  stepSize,
  hints,
  onChange,
}: {
  label: string;
  icon: React.ReactNode;
  displayValue: string;
  accent: string;
  leftIcon: React.ReactNode;
  rightIcon: React.ReactNode;
  value: number;
  startingValue: number;
  maxValue: number;
  isStepped?: boolean;
  stepSize?: number;
  hints: [string, string, string];
  onChange: (v: number) => void;
}) {
  return (
    <motion.div variants={ROW_VARIANTS} className="space-y-1.5">
      {/* Label row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span style={{ color: accent }}>{icon}</span>
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-300">{label}</span>
        </div>
        <span className="text-[12px] font-mono font-bold" style={{ color: accent }}>
          {displayValue}
        </span>
      </div>
      {/* Elastic slider with per-accent theming */}
      <AccentSliderWrap accent={accent}>
        <ElasticSlider
          value={value}
          startingValue={startingValue}
          maxValue={maxValue}
          isStepped={isStepped}
          stepSize={stepSize}
          leftIcon={leftIcon}
          rightIcon={rightIcon}
          onChange={onChange}
          className="rm-elastic"
        />
      </AccentSliderWrap>
      {/* Hint labels */}
      <div className="flex justify-between text-[9px] font-mono text-[#8E9EB5] px-1">
        <span>{hints[0]}</span>
        <span>{hints[1]}</span>
        <span>{hints[2]}</span>
      </div>
    </motion.div>
  );
}

/* ─── Icon helpers ─── */
function SmIcon({ color, children }: { color: string; children: React.ReactNode }) {
  return <span style={{ color, opacity: 0.75, display: "flex" }}>{children}</span>;
}

export function RadiometricAdjustmentsModal({
  isOpen,
  onClose,
  settings,
  onChange,
  onReset,
}: RadiometricAdjustmentsModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Invisible click-outside layer — NO backdrop dim */}
          <div className="fixed inset-0 z-40" onClick={onClose} aria-hidden="true" />

          {/* Floating panel — top-right, satellite image stays fully visible */}
          <motion.div
            key="radiometric-panel"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={PANEL_VARIANTS}
            className="fixed z-50 overflow-hidden"
            style={{
              top: "7rem",
              right: "1rem",
              width: "300px",
              background: "rgba(10, 18, 32, 0.97)",
              border: "1px solid rgba(0, 242, 254, 0.45)",
              borderRadius: "1rem",
              boxShadow:
                "0 8px 40px rgba(0,0,0,0.85), 0 0 0 1px rgba(0,242,254,0.10), 0 0 24px rgba(0,242,254,0.12)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Noise patternSize={250} patternScaleX={2} patternScaleY={2} patternRefreshInterval={2} patternAlpha={10} />

            <div className="relative z-10 p-4 space-y-5">
              {/* ── Header ── */}
              <motion.div variants={ROW_VARIANTS} className="flex items-center justify-between pb-3 border-b border-[#1E3252]">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#00F2FE]/10 border border-[#00F2FE]/30 flex items-center justify-center text-[#00F2FE]">
                    <Sliders className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="font-rajdhani text-[12px] font-bold text-white uppercase tracking-wider leading-tight">
                      Radiometric Filters
                    </h3>
                    <p className="text-[9px] font-mono text-[#8E9EB5] leading-tight">
                      Live pixel calibration
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>

              {/* ── Sliders ── */}
              <div className="space-y-5">
                <SliderRow
                  label="Contrast"
                  icon={<Contrast className="w-3 h-3" />}
                  displayValue={`${settings.contrast}%`}
                  accent="#00F2FE"
                  leftIcon={<SmIcon color="#00F2FE"><MinusIcon className="w-3.5 h-3.5" /></SmIcon>}
                  rightIcon={<SmIcon color="#00F2FE"><PlusIcon className="w-3.5 h-3.5" /></SmIcon>}
                  value={settings.contrast}
                  startingValue={50}
                  maxValue={150}
                  hints={["50% Soft", "100% Nominal", "150% Hard"]}
                  onChange={(v) => onChange({ ...settings, contrast: Math.round(v) })}
                />

                <SliderRow
                  label="Brightness"
                  icon={<SunMedium className="w-3 h-3" />}
                  displayValue={`${settings.brightness}%`}
                  accent="#00F2FE"
                  leftIcon={<SmIcon color="#00F2FE"><MinusIcon className="w-3.5 h-3.5" /></SmIcon>}
                  rightIcon={<SmIcon color="#00F2FE"><PlusIcon className="w-3.5 h-3.5" /></SmIcon>}
                  value={settings.brightness}
                  startingValue={50}
                  maxValue={150}
                  hints={["50% Dark", "100% Std", "150% Bright"]}
                  onChange={(v) => onChange({ ...settings, brightness: Math.round(v) })}
                />

                <SliderRow
                  label="Gamma (γ)"
                  icon={<Gauge className="w-3 h-3" />}
                  displayValue={settings.gamma.toFixed(2)}
                  accent="#10E7A2"
                  leftIcon={<SmIcon color="#10E7A2"><MinusIcon className="w-3.5 h-3.5" /></SmIcon>}
                  rightIcon={<SmIcon color="#10E7A2"><PlusIcon className="w-3.5 h-3.5" /></SmIcon>}
                  value={Math.round(settings.gamma * 100)}
                  startingValue={50}
                  maxValue={200}
                  hints={["0.50 Boost", "1.00 Linear", "2.00 Eye"]}
                  onChange={(v) => onChange({ ...settings, gamma: parseFloat((v / 100).toFixed(2)) })}
                />

                <SliderRow
                  label="Temp Clipping"
                  icon={<Thermometer className="w-3 h-3" />}
                  displayValue={`${settings.tempClipping}°C`}
                  accent="#FF5E36"
                  leftIcon={<SmIcon color="#FF5E36"><MinusIcon className="w-3.5 h-3.5" /></SmIcon>}
                  rightIcon={<SmIcon color="#FF5E36"><PlusIcon className="w-3.5 h-3.5" /></SmIcon>}
                  value={settings.tempClipping}
                  startingValue={-80}
                  maxValue={30}
                  hints={["-80°C Core", "-25°C", "+30°C Sea"]}
                  onChange={(v) => onChange({ ...settings, tempClipping: Math.round(v) })}
                />
              </div>

              {/* ── Footer ── */}
              <motion.div variants={ROW_VARIANTS} className="pt-3 border-t border-[#1E3252] flex items-center justify-between gap-2">
                <button
                  onClick={onReset}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] font-mono text-slate-300 hover:text-white transition cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
                <button
                  onClick={onClose}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#00F2FE] hover:bg-[#00D2FF] text-[#050B14] font-rajdhani font-bold text-[11px] uppercase tracking-wider transition cursor-pointer shadow-[0_0_12px_rgba(0,242,254,0.3)]"
                >
                  <Check className="w-3 h-3 stroke-[3]" />
                  Apply
                </button>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
