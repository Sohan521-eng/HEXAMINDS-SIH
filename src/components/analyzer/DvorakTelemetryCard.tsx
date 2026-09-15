"use client";

import React, { useRef, useState, useEffect } from "react";
import { 
  Wind, 
  Gauge, 
  Eye, 
  Compass, 
  ShieldAlert, 
  Activity, 
  CheckCircle2, 
  BarChart3 
} from "lucide-react";
import { ShinyBadge } from "@/components/ui/ShinyBadge";
import { ShinyText } from "@/components/ui/ShinyText";
import Noise from "@/components/ui/Noise";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? React.useLayoutEffect : useEffect;

export interface PatternDistribution {
  eyePattern: number;
  curvedBand: number;
  cdo: number;
  shearPattern: number;
  embeddedCenter: number;
}

export interface DvorakTelemetry {
  primaryPattern: string;
  confidence: number;
  tNumber: string;
  ciNumber: string;
  vmaxKmh: number;
  vmaxKts: number;
  pcHpa: number;
  rmwKm: number;
  category: string;
  probabilities: PatternDistribution;
}

interface DvorakTelemetryCardProps {
  data: DvorakTelemetry;
}

export function DvorakTelemetryCard({ data }: DvorakTelemetryCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const patternBannerRef = useRef<HTMLDivElement>(null);
  const tNoRef = useRef<HTMLDivElement>(null);
  const ciRef = useRef<HTMLDivElement>(null);
  const vmaxRef = useRef<HTMLDivElement>(null);
  const pressureRef = useRef<HTMLDivElement>(null);
  const [maskStyle, setMaskStyle] = useState<React.CSSProperties>({});

  useIsomorphicLayoutEffect(() => {
    const updateCutouts = () => {
      if (!cardRef.current) return;
      const cardRect = cardRef.current.getBoundingClientRect();
      if (cardRect.width === 0 || cardRect.height === 0) return;

      const cw = Math.round(cardRect.width);
      const ch = Math.round(cardRect.height);

      const makePath = (el: HTMLElement | null, r: number) => {
        if (!el) return "";
        const b = el.getBoundingClientRect();
        const x = Math.round(b.left - cardRect.left);
        const y = Math.round(b.top - cardRect.top);
        const w = Math.round(b.width);
        const h = Math.round(b.height);
        if (w <= 0 || h <= 0) return "";
        return `M ${x + r} ${y} H ${x + w - r} Q ${x + w} ${y} ${x + w} ${y + r} V ${y + h - r} Q ${x + w} ${y + h} ${x + w - r} ${y + h} H ${x + r} Q ${x} ${y + h} ${x} ${y + h - r} V ${y + r} Q ${x} ${y} ${x + r} ${y} Z`;
      };

      const pathBanner = makePath(patternBannerRef.current, 12);
      const pathTNo = makePath(tNoRef.current, 8);
      const pathCI = makePath(ciRef.current, 8);
      const pathVmax = makePath(vmaxRef.current, 8);
      const pathPressure = makePath(pressureRef.current, 8);

      const paths = [pathBanner, pathTNo, pathCI, pathVmax, pathPressure].filter(Boolean).join(" ");
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${cw}" height="${ch}"><path fill-rule="evenodd" fill="#000" d="M 0 0 H ${cw} V ${ch} H 0 Z ${paths}" /></svg>`;
      const dataUri = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;

      setMaskStyle({
        WebkitMaskImage: dataUri,
        maskImage: dataUri,
        WebkitMaskSize: "100% 100%",
        maskSize: "100% 100%",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
      });
    };

    updateCutouts();

    const resizeObserver = new ResizeObserver(updateCutouts);
    if (cardRef.current) resizeObserver.observe(cardRef.current);
    if (patternBannerRef.current) resizeObserver.observe(patternBannerRef.current);
    if (tNoRef.current) resizeObserver.observe(tNoRef.current);
    if (ciRef.current) resizeObserver.observe(ciRef.current);
    if (vmaxRef.current) resizeObserver.observe(vmaxRef.current);
    if (pressureRef.current) resizeObserver.observe(pressureRef.current);

    const timer = setTimeout(updateCutouts, 60);
    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(updateCutouts).catch(() => {});
    }
    window.addEventListener("resize", updateCutouts);

    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateCutouts);
    };
  }, []);

  const probList = [
    { label: "Eye Pattern", val: data.probabilities.eyePattern, color: "#00F2FE" },
    { label: "Curved Band", val: data.probabilities.curvedBand, color: "#10E7A2" },
    { label: "CDO Overcast", val: data.probabilities.cdo, color: "#D946EF" },
    { label: "Shear Pattern", val: data.probabilities.shearPattern, color: "#F59E0B" },
    { label: "Embedded Center", val: data.probabilities.embeddedCenter, color: "#8E9EB5" },
  ];

  return (
    <div 
      ref={cardRef}
      className="relative overflow-hidden bg-transparent border border-[rgba(0,242,254,0.4)] rounded-xl p-4 shadow-[0_0_15px_rgba(0,242,254,0.1),0_4px_24px_rgba(0,0,0,0.6)]"
    >
      {/* Background layer with punched-out cutouts so the bg behind the card is visible */}
      <div 
        className="absolute inset-0 bg-[#0F1B2F]/90 backdrop-blur-xl pointer-events-none"
        style={maskStyle}
      >
        <Noise
          patternSize={250}
          patternScaleX={1.2}
          patternScaleY={1.2}
          patternRefreshInterval={2}
          patternAlpha={8}
        />
      </div>

      <div className="relative z-10 space-y-4">
        {/* Header & Primary Category Card */}
      <div className="flex items-center justify-between pb-2 border-b border-[#1E3252]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#00F2FE]/15 border border-[#00F2FE]/40 flex items-center justify-center text-[#00F2FE] shadow-[0_0_10px_rgba(0,242,254,0.25)]">
            <Eye className="w-3.5 h-3.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]" />
          </div>
          <span 
            className="font-rajdhani text-xs font-bold text-[#00F2FE] uppercase tracking-wider"
            style={{ textShadow: "0 1px 2px #000000, 0 2px 6px rgba(0,0,0,0.95), 0 0 10px rgba(0,0,0,0.9)" }}
          >
            Pattern Classification & Dvorak HUD
          </span>
        </div>
        <ShinyBadge
          speed={2.5}
          spread={90}
          yoyo
          borderColor="rgba(255, 94, 54, 0.45)"
          borderShineColor="#FFA78B"
          surfaceColor="rgba(255, 94, 54, 0.05)"
          surfaceShineColor="rgba(255, 255, 255, 0.35)"
          roundedClassName="rounded-md"
          innerClassName="px-2.5 py-0.5 bg-[#070D18]/95 border-[#FF5E36]/40 flex items-center gap-1.5"
          className="shadow-[0_0_10px_rgba(255,94,54,0.2)]"
        >
          <ShinyText
            text={data.category}
            speed={2.5}
            color="#FFA07A"
            shineColor="#FFFFFF"
            spread={90}
            className="text-[11px] font-mono font-extrabold uppercase tracking-wider whitespace-nowrap drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]"
          />
        </ShinyBadge>
      </div>

      {/* Identified Pattern Main Banner (Cutout Aperture) */}
      <div 
        ref={patternBannerRef}
        className="p-3 rounded-xl bg-transparent border border-[rgba(0,242,254,0.45)] shadow-[inset_0_2px_8px_rgba(0,0,0,0.85),0_0_10px_rgba(0,242,254,0.12)] flex items-center justify-between"
      >
        <div>
          <p 
            className="text-[10px] font-mono text-[#00F2FE] uppercase"
            style={{ textShadow: "0 1px 2px #000000, 0 2px 6px rgba(0,0,0,0.95), 0 0 10px rgba(0,0,0,0.9)" }}
          >
            Identified Meteorological Pattern:
          </p>
          <h4 className="text-base font-black font-rajdhani uppercase tracking-wider flex items-center gap-1.5 mt-0.5">
            <span className="heading-gradient-shadow-wrapper">
              <span className="heading-moving-gradient font-black font-rajdhani uppercase tracking-wider">
                {data.primaryPattern}
              </span>
            </span>
          </h4>
        </div>
        <div className="text-right shrink-0">
          <p 
            className="text-[10px] font-mono text-[#00F2FE]"
            style={{ textShadow: "0 1px 2px #000000, 0 2px 6px rgba(0,0,0,0.95), 0 0 10px rgba(0,0,0,0.9)" }}
          >
            Confidence
          </p>
          <div className="text-base font-mono font-bold text-[#10E7A2]">
            {data.confidence.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Multi-Class Probability Distribution Bars */}
      <div className="space-y-3">
        <div 
          className="flex items-center justify-between text-[10px] font-mono uppercase text-[#00F2FE]"
          style={{ textShadow: "0 1px 2px #000000, 0 2px 6px rgba(0,0,0,0.95), 0 0 10px rgba(0,0,0,0.9)" }}
        >
          <span className="flex items-center gap-1.5">
            <BarChart3 className="w-3 h-3 text-[#00F2FE] drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]" />
            <span>Multi-Class Softmax Probability:</span>
          </span>
          <span>WMO Classes</span>
        </div>

        <div className="space-y-3 pt-0.5">
          {probList.map((item) => (
            <div key={item.label} className="space-y-1.5">
              <div 
                className="flex justify-between text-[11px] font-mono"
                style={{
                  color: item.color,
                  textShadow: "0 1px 2px #000000, 0 2px 6px rgba(0,0,0,0.95), 0 0 10px rgba(0,0,0,0.9)",
                }}
              >
                <span className="font-medium tracking-wide flex items-center gap-1">
                  <span>•</span>
                  <span>{item.label}</span>
                </span>
                <span className="font-bold tracking-wider">{item.val.toFixed(1)}%</span>
              </div>
              <div className="w-full h-1.5 bg-[#050B14] rounded-full overflow-hidden border border-[#1E3252]/60 shadow-inner">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.max(item.val, 2)}%`,
                    backgroundColor: item.color,
                    boxShadow: `0 0 8px ${item.color}66`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Automated Dvorak Telemetry Grid */}
      <div className="pt-2 border-t border-[#1E3252] space-y-2">
        <span 
          className="text-[10px] font-mono uppercase text-[#00F2FE] block font-bold"
          style={{ textShadow: "0 1px 2px #000000, 0 2px 6px rgba(0,0,0,0.95), 0 0 10px rgba(0,0,0,0.9)" }}
        >
          Empirical Dvorak Wind & Pressure Diagnostics:
        </span>

        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          {/* T-Number (Cutout Aperture) */}
          <div 
            ref={tNoRef}
            className="p-2.5 rounded-lg bg-transparent border border-[rgba(0,242,254,0.45)] shadow-[inset_0_2px_6px_rgba(0,0,0,0.85),0_0_8px_rgba(0,242,254,0.1)]"
          >
            <div className="text-[10px] text-[#8E9EB5]">Dvorak T-No:</div>
            <div className="text-sm font-bold text-[#00F2FE] mt-0.5">{data.tNumber}</div>
          </div>

          {/* CI-Number (Cutout Aperture) */}
          <div 
            ref={ciRef}
            className="p-2.5 rounded-lg bg-transparent border border-[rgba(0,242,254,0.45)] shadow-[inset_0_2px_6px_rgba(0,0,0,0.85),0_0_8px_rgba(0,242,254,0.1)]"
          >
            <div className="text-[10px] text-[#8E9EB5]">Current Intensity:</div>
            <div className="text-sm font-bold text-[#00F2FE] mt-0.5">{data.ciNumber}</div>
          </div>

          {/* Vmax (Cutout Aperture) */}
          <div 
            ref={vmaxRef}
            className="p-2.5 rounded-lg bg-transparent border border-[rgba(0,242,254,0.45)] shadow-[inset_0_2px_6px_rgba(0,0,0,0.85),0_0_8px_rgba(0,242,254,0.1)]"
          >
            <div className="text-[10px] text-[#8E9EB5] flex items-center gap-1">
              <Wind className="w-3 h-3 text-[#FF5E36]" />
              <span>Max Wind (Vmax):</span>
            </div>
            <div className="text-sm font-bold text-[#FF5E36] mt-0.5">
              {data.vmaxKmh} km/h <span className="text-[10px] text-slate-400 font-normal">({data.vmaxKts} kts)</span>
            </div>
          </div>

          {/* Central Pressure (Cutout Aperture) */}
          <div 
            ref={pressureRef}
            className="p-2.5 rounded-lg bg-transparent border border-[rgba(0,242,254,0.45)] shadow-[inset_0_2px_6px_rgba(0,0,0,0.85),0_0_8px_rgba(0,242,254,0.1)]"
          >
            <div className="text-[10px] text-[#8E9EB5] flex items-center gap-1">
              <Gauge className="w-3 h-3 text-[#10E7A2]" />
              <span>Central Pressure:</span>
            </div>
            <div className="text-sm font-bold text-[#10E7A2] mt-0.5">
              {data.pcHpa} hPa
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}
