"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Wind, Gauge, Droplets, Thermometer, CloudRain, Compass } from "lucide-react";
import Noise from "@/components/ui/Noise";

export function RealTimeParameters() {
  const parameters = [
    {
      label: "Max Wind Speed",
      value: "155 km/h",
      change: "+12 km/h in 3h",
      icon: Wind,
      color: "text-[var(--color-ai-cyan)]",
    },
    {
      label: "Central Pressure",
      value: "964 hPa",
      change: "-6 hPa rapid drop",
      icon: Gauge,
      color: "text-[var(--color-solar-coral)]",
    },
    {
      label: "Sea Surface Temp",
      value: "30.4 °C",
      change: "Above threshold (28°C)",
      icon: Thermometer,
      color: "text-[var(--alert-stage-2-alert)]",
    },
    {
      label: "Vertical Wind Shear",
      value: "8.5 kts",
      change: "Favorable (<10 kts)",
      icon: Compass,
      color: "text-[var(--alert-stage-1-watch)]",
    },
    {
      label: "Relative Humidity",
      value: "86%",
      change: "Mid-troposphere saturated",
      icon: Droplets,
      color: "text-[var(--ir-cloud-low)]",
    },
    {
      label: "Estimated Rainfall",
      value: "220 mm/24h",
      change: "Extreme core band",
      icon: CloudRain,
      color: "text-[var(--ir-cloud-deep)]",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {parameters.map((item) => {
        const Icon = item.icon;
        return (
          <Card
            key={item.label}
            variant="glass"
            className="relative overflow-hidden p-3 bg-[#0F1B2F]/90 border border-[rgba(0,242,254,0.4)] shadow-[0_0_15px_rgba(0,242,254,0.1)] cursor-default"
          >
            {/* React Bits Noise Background Overlay */}
            <Noise
              patternSize={250}
              patternScaleX={2.5}
              patternScaleY={2.5}
              patternRefreshInterval={2}
              patternAlpha={10}
            />

            {/* Foreground Content */}
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-semibold font-rajdhani tracking-wider uppercase text-[var(--text-muted)]">
                  {item.label}
                </span>
                <Icon className={`w-4 h-4 ${item.color}`} />
              </div>
              <div className="text-base font-bold font-jetbrains [font-feature-settings:'tnum'_on] text-white tracking-tight">
                {item.value}
              </div>
              <div className="text-[10px] font-jetbrains text-[var(--text-muted)] mt-1 truncate">
                {item.change}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
