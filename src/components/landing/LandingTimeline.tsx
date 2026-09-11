"use client";

import React from "react";
import { Compass, AlertTriangle, ShieldAlert, Radio } from "lucide-react";
import { ShinyBadge } from "@/components/ui/ShinyBadge";
import { TiltedCard } from "@/components/ui/TiltedCard";

export function LandingTimeline() {
  const steps = [
    {
      num: "1",
      time: "T-72H TO LANDFALL",
      stage: "Stage 1: Pre-Cyclone Watch",
      title: "Genesis & Deep Convection",
      color: "#10B981",
      gradient: "from-[#0F1B2F] via-[#050B14] to-[#10B981]/15",
      badgeClass: "bg-[#10B981]/15 text-[#10B981] border-[#10B981]/50",
      description:
        "INSAT-3DR TIR-1 identifies low-level circulation centers (LLCC) with surface pressure dropping below 1004 hPa. Fishermen advisories initiated.",
      telemetry: "Wind: 45 km/h | 1002 hPa",
    },
    {
      num: "2",
      time: "T-48H TO LANDFALL",
      stage: "Stage 2: Cyclone Alert",
      title: "Vortex & Curved Band Formation",
      color: "#F59E0B",
      gradient: "from-[#0F1B2F] via-[#050B14] to-[#F59E0B]/15",
      badgeClass: "bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/50",
      description:
        "Automated Dvorak Technique estimates T-3.0 to T-3.5. PINN model projects 120h cone of uncertainty across coastal corridors.",
      telemetry: "Wind: 85 km/h | 990 hPa",
    },
    {
      num: "3",
      time: "T-24H TO LANDFALL",
      stage: "Stage 3: Cyclone Warning",
      title: "Rapid Intensification & Eye Wall",
      color: "#F97316",
      gradient: "from-[#0F1B2F] via-[#050B14] to-[#F97316]/15",
      badgeClass: "bg-[#F97316]/15 text-[#F97316] border-[#F97316]/50",
      description:
        "Ocean heat flux triggers rapid pressure drop to 942 hPa. Grad-CAM visualizes concentrated convective eyewall rings. District administration alerted.",
      telemetry: "Wind: 140 km/h | 964 hPa",
    },
    {
      num: "4",
      time: "T-0H TO LANDFALL",
      stage: "Stage 4: Landfall Red Alert",
      title: "Coastline Impact & Storm Surge",
      color: "#DC2626",
      gradient: "from-[#0F1B2F] via-[#050B14] to-[#DC2626]/15",
      badgeClass: "bg-[#DC2626]/20 text-[#DC2626] border-[#DC2626]",
      description:
        "Doppler Weather Radar locks into eye touchdown. Automated NDMA 1078 sirens broadcast inundation zone evacuations.",
      telemetry: "Wind: 185 km/h | 942 hPa",
    },
  ];

  return (
    <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 font-jakarta">
      <div className="mb-14 text-left">
        <div className="inline-block mb-3">
          <ShinyBadge
            speed={2.5}
            delay={1}
            spread={90}
            direction="right"
            yoyo
            borderColor="rgba(0, 242, 254, 0.45)"
            borderShineColor="#ffffff"
            surfaceColor="rgba(0, 242, 254, 0.2)"
            surfaceShineColor="rgba(255, 255, 255, 0.7)"
          >
            <Compass className="w-3.5 h-3.5 text-[#00F2FE]" />
            <span className="text-xs font-jetbrains [font-feature-settings:'tnum'_on] font-bold tracking-wider text-[#00F2FE]">
              PREDICTIVE LIFECYCLE PROGRESSION
            </span>
          </ShinyBadge>
        </div>
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight uppercase font-rajdhani">
          <span className="heading-gradient-shadow-wrapper">
            <span className="heading-moving-gradient">
              From Genesis to Landfall Warning
            </span>
          </span>
        </h2>
        <p 
          className="mt-2 text-sm sm:text-base md:text-lg text-[#7DD3FC] font-jakarta font-medium leading-relaxed hero-subtitle-shadow max-w-2xl"
          style={{
            textShadow: "0 2px 4px #000000, 0 4px 12px rgba(0, 0, 0, 0.95), 0 8px 24px rgba(0, 0, 0, 0.9), 0 0 6px #000000"
          }}
        >
          The 4-stage IMD-aligned early detection timeline executing autonomous telemetry at every intensification milestone.
        </p>
      </div>

      {/* Serpentine Timeline Grid */}
      <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Connecting Gradient Line on Desktop */}
        <div className="hidden lg:block absolute top-1/2 left-8 right-8 h-[2px] bg-gradient-to-r from-[#10B981] via-[#F59E0B] to-[#DC2626] opacity-30 -translate-y-8 z-0 pointer-events-none" />

        {steps.map((step) => (
          <TiltedCard
            key={step.num}
            containerHeight="100%"
            containerWidth="100%"
            rotateAmplitude={12}
            scaleOnHover={1.055}
            showMobileWarning={false}
            showTooltip={false}
            className="h-full w-full"
          >
            <div
              className={`group relative overflow-hidden rounded-2xl bg-gradient-to-b ${step.gradient} backdrop-blur-xl border border-[#1E3252] p-7 flex flex-col justify-between transition-colors duration-300 h-full w-full`}
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Radial Accent Glow on Hover */}
              <div 
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-15 transition-opacity pointer-events-none"
                style={{
                  background: `radial-gradient(circle at top right, ${step.color}, transparent 70%)`,
                }}
              />

              {/* Massive Watermark Step Number in Background (Takes Alert Color on Hover) */}
              <div 
                className="pointer-events-none absolute -right-2 -bottom-6 font-rajdhani text-8xl sm:text-9xl font-black transition-all duration-500 select-none"
                style={{ transform: "translateZ(5px)" }}
              >
                {/* Default neutral faint watermark */}
                <span className="text-white/[0.04] group-hover:opacity-0 transition-opacity duration-500 block">
                  {step.num}
                </span>
                {/* Alert-colored glowing watermark on hover */}
                <span 
                  className="absolute inset-0 opacity-0 group-hover:opacity-45 transition-opacity duration-500 block"
                  style={{ color: step.color }}
                >
                  {step.num}
                </span>
              </div>

              {/* Top Section: Time, Alert Stage Pill, Title & Description */}
              <div className="relative z-10" style={{ transform: "translateZ(20px)" }}>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span 
                    className="text-[10px] font-jetbrains [font-feature-settings:'tnum'_on] font-bold uppercase tracking-wider text-[#8E9EB5]"
                    style={{ transform: "translateZ(25px)" }}
                  >
                    {step.time}
                  </span>
                  <span 
                    className={`px-2 py-0.5 rounded text-[10px] font-rajdhani font-bold uppercase border ${step.badgeClass}`}
                    style={{ transform: "translateZ(25px)" }}
                  >
                    {step.stage}
                  </span>
                </div>

                {/* Title */}
                <h3 
                  className="text-xl font-bold text-white font-rajdhani uppercase tracking-wide mb-3 group-hover:text-[#00F2FE] transition-colors"
                  style={{ transform: "translateZ(20px)" }}
                >
                  {step.title}
                </h3>

                {/* Description */}
                <p 
                  className="text-xs text-[#8E9EB5] font-jakarta font-normal leading-relaxed mb-6"
                  style={{ transform: "translateZ(15px)" }}
                >
                  {step.description}
                </p>
              </div>

              {/* Bottom Row: Real-Time Telemetry Marker */}
              <div 
                className="relative z-10 pt-3 border-t border-[#1E3252]/60 flex items-center text-[11px] font-jetbrains [font-feature-settings:'tnum'_on]"
                style={{ transform: "translateZ(15px)" }}
              >
                <span className="text-slate-400 font-bold">{step.telemetry}</span>
              </div>
            </div>
          </TiltedCard>
        ))}
      </div>
    </section>
  );
}
