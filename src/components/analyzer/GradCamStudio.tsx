"use client";

import React, { useRef, useState, useEffect } from "react";
import { 
  Sparkles, 
  Layers, 
  Cpu, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck,
  Zap
} from "lucide-react";
import Noise from "@/components/ui/Noise";
import ElasticSlider from "@/components/ui/ElasticSlider";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? React.useLayoutEffect : useEffect;

interface GradCamStudioProps {
  blend: number;
  onBlendChange: (blend: number) => void;
  onOpenXaiAssistant?: () => void;
}

export function GradCamStudio({
  blend,
  onBlendChange,
}: GradCamStudioProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const sliderBoxRef = useRef<HTMLDivElement>(null);
  const feat1Ref = useRef<HTMLDivElement>(null);
  const feat2Ref = useRef<HTMLDivElement>(null);
  const feat3Ref = useRef<HTMLDivElement>(null);
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

      const pathSlider = makePath(sliderBoxRef.current, 12);
      const path1 = makePath(feat1Ref.current, 8);
      const path2 = makePath(feat2Ref.current, 8);
      const path3 = makePath(feat3Ref.current, 8);

      const paths = [pathSlider, path1, path2, path3].filter(Boolean).join(" ");
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
    if (sliderBoxRef.current) resizeObserver.observe(sliderBoxRef.current);
    if (feat1Ref.current) resizeObserver.observe(feat1Ref.current);
    if (feat2Ref.current) resizeObserver.observe(feat2Ref.current);
    if (feat3Ref.current) resizeObserver.observe(feat3Ref.current);

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
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#1E3252]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#00F2FE]/15 border border-[#00F2FE]/40 flex items-center justify-center text-[#00F2FE]">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3
                className="font-rajdhani text-xs font-bold text-[#00F2FE] uppercase tracking-wider"
                style={{ textShadow: "1px 2px 6px rgba(0,0,0,0.95)" }}
              >
                AI (XAI) Grad-CAM & Attention Studio
              </h3>
            </div>
          </div>
        </div>

      {/* Blend Slider & Segmented Controls (Cut-out Aperture) */}
      <div 
        ref={sliderBoxRef}
        className="p-3 rounded-xl bg-transparent border border-[rgba(0,242,254,0.45)] shadow-[inset_0_2px_8px_rgba(0,0,0,0.85),0_0_10px_rgba(0,242,254,0.12)] space-y-2.5"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-300">
            <Layers className="w-3.5 h-3.5 text-[#00F2FE]" />
            <span
              className="text-[#00F2FE]"
              style={{ textShadow: "1px 2px 6px rgba(0,0,0,0.95)" }}
            >
              Grad-CAM Alpha Heatmap Blend:
            </span>
            <span className="text-[#00F2FE] font-bold text-sm">{blend}%</span>
          </div>

          {/* Instant Snap Segmented Toggles */}
          <div className="flex items-center gap-1 p-1 rounded-lg bg-[#0F1B2F]/90 backdrop-blur-xl border border-[rgba(0,242,254,0.4)] shadow-[0_4px_16px_rgba(0,0,0,0.6),0_0_12px_rgba(0,242,254,0.15)]">
            <button
              type="button"
              onClick={() => onBlendChange(0)}
              className={`h-7 px-2.5 rounded-md border flex items-center justify-center transition cursor-pointer text-xs font-mono ${
                blend === 0
                  ? "bg-[#00F2FE]/20 border-[#00F2FE]/50 text-[#00F2FE] font-bold"
                  : "bg-[#050B14]/70 hover:bg-[#00F2FE]/20 border-[#1E3252] hover:border-[#00F2FE] text-[#8E9EB5] hover:text-[#00F2FE]"
              }`}
            >
              Raw (0%)
            </button>
            <button
              type="button"
              onClick={() => onBlendChange(65)}
              className={`h-7 px-2.5 rounded-md border flex items-center justify-center transition cursor-pointer text-xs font-mono ${
                blend === 65
                  ? "bg-[#00F2FE]/20 border-[#00F2FE]/50 text-[#00F2FE] font-bold"
                  : "bg-[#050B14]/70 hover:bg-[#00F2FE]/20 border-[#1E3252] hover:border-[#00F2FE] text-[#8E9EB5] hover:text-[#00F2FE]"
              }`}
            >
              Balanced (65%)
            </button>
            <button
              type="button"
              onClick={() => onBlendChange(100)}
              className={`h-7 px-2.5 rounded-md border flex items-center justify-center transition cursor-pointer text-xs font-mono ${
                blend === 100
                  ? "bg-[#00F2FE]/20 border-[#00F2FE]/50 text-[#00F2FE] font-bold"
                  : "bg-[#050B14]/70 hover:bg-[#00F2FE]/20 border-[#1E3252] hover:border-[#00F2FE] text-[#8E9EB5] hover:text-[#00F2FE]"
              }`}
            >
              Heatmap (100%)
            </button>
          </div>
        </div>

        {/* Dynamic Range Slider (React Bits ElasticSlider) */}
        <div className="space-y-0.5">
          <div
            style={
              {
                "--es-accent": "#00F2FE",
                "--es-accent-dim": "#00F2FE55",
                "--es-accent-glow": "#00F2FE8C",
              } as React.CSSProperties
            }
            className="accent-slider-wrap w-full"
          >
            <ElasticSlider
              value={blend}
              defaultValue={65}
              startingValue={0}
              maxValue={100}
              isStepped={true}
              stepSize={1}
              onChange={(val) => onBlendChange(Math.round(val))}
              className="rm-elastic w-full"
              showThumb={true}
            />
          </div>
          <div className="flex justify-between text-[9px] font-mono text-slate-500 pt-0.5">
            <span>0% (Raw Satellite TIR-1)</span>
            <span>50%</span>
            <span>100% (Pure Neural Activation)</span>
          </div>
        </div>
      </div>

      {/* Automated Natural Language Feature Attribution Synthesis */}
      <div className="space-y-2">
        <span className="text-[10px] font-mono uppercase text-[#10E7A2] block font-bold flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#10E7A2]" />
          <span style={{ textShadow: "1px 2px 6px rgba(0,0,0,0.95)" }}>
            Automated Physical Feature Attribution (ConvNeXt Layer-4 Gradients):
          </span>
        </span>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs font-mono">
          {/* Feature 1 (Cut-out Aperture) */}
          <div
            ref={feat1Ref}
            className="p-2.5 rounded-lg bg-transparent border border-[rgba(0,242,254,0.45)] shadow-[inset_0_2px_6px_rgba(0,0,0,0.85),0_0_8px_rgba(0,242,254,0.1)] space-y-1"
          >
            <div 
              className="flex items-center gap-1 text-[#10E7A2] font-bold text-[11px]"
              style={{ textShadow: "0 1px 2px #000000, 0 2px 6px rgba(0,0,0,0.95), 0 0 10px rgba(0,0,0,0.9)" }}
            >
              <CheckCircle2 className="w-3 h-3 shrink-0" />
              <span>Eyewall Gradient</span>
            </div>
            <p 
              className="text-[10px] text-[#10E7A2] font-medium leading-relaxed"
              style={{ textShadow: "0 1px 2px #000000, 0 2px 6px rgba(0,0,0,0.95), 0 0 10px rgba(0,0,0,0.9)" }}
            >
              Symmetrical eye surrounded by uniform cold ring (&lt; -75°C, ΔT = 42.6°C). Strongest radial activation weight.
            </p>
          </div>

          {/* Feature 2 (Cut-out Aperture) */}
          <div
            ref={feat2Ref}
            className="p-2.5 rounded-lg bg-transparent border border-[rgba(0,242,254,0.45)] shadow-[inset_0_2px_6px_rgba(0,0,0,0.85),0_0_8px_rgba(0,242,254,0.1)] space-y-1"
          >
            <div 
              className="flex items-center gap-1 text-[#00F2FE] font-bold text-[11px]"
              style={{ textShadow: "0 1px 2px #000000, 0 2px 6px rgba(0,0,0,0.95), 0 0 10px rgba(0,0,0,0.9)" }}
            >
              <CheckCircle2 className="w-3 h-3 shrink-0" />
              <span>Spiral Feeder Band</span>
            </div>
            <p 
              className="text-[10px] text-[#00F2FE] font-medium leading-relaxed"
              style={{ textShadow: "0 1px 2px #000000, 0 2px 6px rgba(0,0,0,0.95), 0 0 10px rgba(0,0,0,0.9)" }}
            >
              Primary convective rainband wraps 1.35π radians into storm vortex. ViT attention confirms sustained angular momentum.
            </p>
          </div>

          {/* Feature 3 (Cut-out Aperture) */}
          <div
            ref={feat3Ref}
            className="p-2.5 rounded-lg bg-transparent border border-[rgba(0,242,254,0.45)] shadow-[inset_0_2px_6px_rgba(0,0,0,0.85),0_0_8px_rgba(0,242,254,0.1)] space-y-1"
          >
            <div 
              className="flex items-center gap-1 text-[#FF5E36] font-bold text-[11px]"
              style={{ textShadow: "0 1px 2px #000000, 0 2px 6px rgba(0,0,0,0.95), 0 0 10px rgba(0,0,0,0.9)" }}
            >
              <CheckCircle2 className="w-3 h-3 shrink-0" />
              <span>Low Vertical Shear</span>
            </div>
            <p 
              className="text-[10px] text-[#FF5E36] font-medium leading-relaxed"
              style={{ textShadow: "0 1px 2px #000000, 0 2px 6px rgba(0,0,0,0.95), 0 0 10px rgba(0,0,0,0.9)" }}
            >
              LLCC-to-convective core displacement &lt; 18 km. Favorable atmospheric environment for rapid intensification.
            </p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}


