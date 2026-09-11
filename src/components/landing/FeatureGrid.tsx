"use client";

import React from "react";
import Link from "next/link";
import { 
  Layers, 
  Cpu, 
  Compass, 
  Eye, 
  ArrowRight, 
  Activity,
  ShieldAlert
} from "lucide-react";
import { ShinyBadge } from "@/components/ui/ShinyBadge";
import { TiltedCard } from "@/components/ui/TiltedCard";

export function FeatureGrid() {
  const features = [
    {
      cardNo: "01",
      title: "Multi-Source Satellite Fusion",
      category: "INGESTION & HARMONIZATION",
      description:
        "Ingests and aligns INSAT-3D/3DR (TIR-1, TIR-2, MIR, VIS, WV), Oceansat-3 scatterometer wind vectors, and NOAA GOES datasets into unified high-res tensors.",
      tags: ["INSAT-3DR TIR-1", "Oceansat-3 Winds", "MOSDAC API"],
      icon: Layers,
      href: "/satellite-analyzer#fusion",
      linkText: "Explore Fusion",
      accent: "#00F2FE",
      gradient: "from-[#0F1B2F] via-[#050B14] to-[#00F2FE]/15",
    },
    {
      cardNo: "02",
      title: "Deep Learning Pattern Studio",
      category: "COMPUTER VISION CLASSIFICATION",
      description:
        "Automated Dvorak Technique (ADT) and automated Eye/LLCC centroid localization across Curved Band, Eye, CDO, and Shear convective storm morphologies.",
      tags: ["Automated Dvorak", "ResNet-50", "YOLOv8-Eye"],
      icon: Cpu,
      href: "/satellite-analyzer#models",
      linkText: "View AI Models",
      accent: "#10E7A2",
      gradient: "from-[#0F1B2F] via-[#050B14] to-[#10E7A2]/15",
    },
    {
      cardNo: "03",
      title: "Physics-Informed Forecasting",
      category: "HYBRID PINN SIMULATION",
      description:
        "Physics-Informed Neural Networks enforcing Navier-Stokes conservation of momentum and thermodynamic equations for 120h trajectory and Rapid Intensification (RI).",
      tags: ["PINNs Navier-Stokes", "120h Track Cone", "RI Probability"],
      icon: Compass,
      href: "/forecast",
      linkText: "Inspect Forecasts",
      accent: "#6366F1",
      gradient: "from-[#0F1B2F] via-[#050B14] to-[#6366F1]/15",
    },
    {
      cardNo: "04",
      title: "Explainable AI (XAI / Grad-CAM)",
      category: "TRUSTED MISSION TELEMETRY",
      description:
        "Real-time Gradient-weighted Class Activation Mapping (Grad-CAM) generating thermal heatmaps showing exact cloud features and eyewall convection driving AI decisions.",
      tags: ["Grad-CAM Heatmaps", "Attention Weights", "IMD Verifiable"],
      icon: Eye,
      href: "/satellite-analyzer#xai",
      linkText: "Explore XAI",
      accent: "#FF5E36",
      gradient: "from-[#0F1B2F] via-[#050B14] to-[#FF5E36]/15",
    },
    {
      cardNo: "05",
      title: "Multi-Tier Warning Hub",
      category: "DISASTER RESPONSE AUTOMATION",
      description:
        "Instant Common Alerting Protocol (CAP) notifications, evacuation corridor route mapping, storm surge height calculation, and automated regional broadcast generation.",
      tags: ["IMD 4-Stage Protocol", "CAP XML Alerts", "Evacuation Corridors"],
      icon: ShieldAlert,
      href: "/alerts",
      linkText: "View Alert Engine",
      accent: "#DC2626",
      gradient: "from-[#0F1B2F] via-[#050B14] to-[#DC2626]/15",
    },
  ];

  return (
    <section 
      id="core-features-grid" 
      className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 font-jakarta"
    >
      {/* Section Header */}
      <div className="mb-12 text-left">
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
            <Activity className="w-3.5 h-3.5 text-[#00F2FE]" />
            <span className="text-xs font-jetbrains [font-feature-settings:'tnum'_on] font-bold tracking-wider text-[#00F2FE]">
              CORE MISSION CAPABILITIES
            </span>
          </ShinyBadge>
        </div>
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight uppercase font-rajdhani">
          <span className="heading-gradient-shadow-wrapper">
            <span className="heading-moving-gradient">
              Core AI Capabilities & Satellite Engines
            </span>
          </span>
        </h2>
        <p 
          className="mt-2 text-sm sm:text-base md:text-lg text-[#7DD3FC] font-jakarta font-medium leading-relaxed hero-subtitle-shadow max-w-2xl"
          style={{
            textShadow: "0 2px 4px #000000, 0 4px 12px rgba(0, 0, 0, 0.95), 0 8px 24px rgba(0, 0, 0, 0.9), 0 0 6px #000000"
          }}
        >
          Engineered for operational meteorology, rapid disaster alerting, and explainable computational climate physics.
        </p>
      </div>

      {/* 5-Card Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <TiltedCard
              key={feature.cardNo}
              containerHeight="100%"
              containerWidth="100%"
              rotateAmplitude={12}
              scaleOnHover={1.055}
              showMobileWarning={false}
              showTooltip={false}
              className="h-full w-full"
            >
              <div
                className={`group relative rounded-2xl bg-gradient-to-b ${feature.gradient} backdrop-blur-xl border border-[#1E3252] p-6 flex flex-col justify-between transition-colors duration-300 h-full w-full`}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Radial Accent Glow on Hover */}
                <div 
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-15 transition-opacity pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at top right, ${feature.accent}, transparent 70%)`,
                  }}
                />

                {/* Top Section */}
                <div className="relative z-10" style={{ transform: "translateZ(20px)" }}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-[#8E9EB5]/70 group-hover:text-[#00F2FE] transition-colors">
                      #{feature.cardNo}
                    </span>
                    <div 
                      className="w-10 h-10 rounded-xl bg-[#050B14] border border-[#1E3252] flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-lg"
                      style={{ color: feature.accent, transform: "translateZ(30px)" }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <p className="text-[10px] font-rajdhani tracking-widest uppercase text-[#8E9EB5] mb-1 font-bold">
                    {feature.category}
                  </p>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-[#00F2FE] transition-colors font-outfit tracking-tight">
                    {feature.title}
                  </h3>

                  <p className="text-xs text-[#8E9EB5] leading-relaxed mb-4 font-jakarta font-normal">
                    {feature.description}
                  </p>
                </div>

                {/* Bottom Section: Tags & Action Link */}
                <div className="relative z-10 pt-4 border-t border-[#1E3252]/60" style={{ transform: "translateZ(15px)" }}>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {feature.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-1.5 py-0.5 rounded bg-[#050B14]/80 border border-[#1E3252] text-[9px] font-jetbrains [font-feature-settings:'tnum'_on] text-slate-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={feature.href}
                    className="inline-flex items-center gap-1.5 text-xs font-rajdhani font-bold uppercase tracking-wider text-[#00F2FE] hover:text-white transition-colors group/link w-full justify-between"
                  >
                    <span className="relative">
                      {feature.linkText}
                      <span className="absolute left-0 -bottom-0.5 w-0 h-[1px] bg-[#00F2FE] group-hover/link:w-full transition-all duration-300" />
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/link:translate-x-1" />
                  </Link>
                </div>
              </div>
            </TiltedCard>
          );
        })}
      </div>
    </section>
  );
}
