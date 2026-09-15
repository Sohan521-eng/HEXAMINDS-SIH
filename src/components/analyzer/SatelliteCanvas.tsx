"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Maximize2, 
  Minimize2, 
  ZoomIn, 
  ZoomOut, 
  Crop, 
  Crosshair, 
  RotateCcw, 
  Info, 
  Thermometer, 
  Move,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { SpectralBand, ColorCurve } from "./RadiometricStrip";
import { RadiometricSettings } from "./RadiometricAdjustmentsModal";
import Noise from "@/components/ui/Noise";

interface SatelliteCanvasProps {
  band: SpectralBand;
  curve: ColorCurve;
  radiometrics: RadiometricSettings;
  xaiBlend: number; // 0 - 100
  llccCoords: { lat: number; lon: number };
  eyeTemp: number;
  coldRingTemp: number;
  stormName: string;
  sourceName: string;
}

export function SatelliteCanvas({
  band,
  curve,
  radiometrics,
  xaiBlend,
  llccCoords,
  eyeTemp,
  coldRingTemp,
  stormName,
  sourceName,
}: SatelliteCanvasProps) {
  // Canvas Viewport Transforms
  const [zoom, setZoom] = useState(1.0);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);

  // ROI Tool State
  const [isCropping, setIsCropping] = useState(true);
  const [roiRect, setRoiRect] = useState({ x: -180, y: -180, width: 360, height: 360 });
  const [activeHandle, setActiveHandle] = useState<"move" | "nw" | "ne" | "sw" | "se" | null>(null);
  const dragOriginRef = useRef<{ mouseX: number; mouseY: number; rect: { x: number; y: number; width: number; height: number } } | null>(null);

  const [roiBounds, setRoiBounds] = useState({
    minLat: 14.8,
    maxLat: 18.2,
    minLon: 86.1,
    maxLon: 90.5,
  });

  // LLCC Popover
  const [showEyePopover, setShowEyePopover] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // ROI Interactive Drag & Resize
  useEffect(() => {
    if (!activeHandle) return;

    const handleMouseMoveWindow = (e: MouseEvent) => {
      if (!dragOriginRef.current) return;
      const { mouseX, mouseY, rect } = dragOriginRef.current;
      const dx = (e.clientX - mouseX) / zoom;
      const dy = (e.clientY - mouseY) / zoom;

      let newX = rect.x;
      let newY = rect.y;
      let newWidth = rect.width;
      let newHeight = rect.height;

      const MIN_SIZE = 90;
      const MAX_SIZE = 700;

      if (activeHandle === "move") {
        newX = rect.x + dx;
        newY = rect.y + dy;
      } else if (activeHandle === "nw") {
        newWidth = Math.min(MAX_SIZE, Math.max(MIN_SIZE, rect.width - dx));
        newHeight = Math.min(MAX_SIZE, Math.max(MIN_SIZE, rect.height - dy));
        newX = rect.x + (rect.width - newWidth);
        newY = rect.y + (rect.height - newHeight);
      } else if (activeHandle === "ne") {
        newWidth = Math.min(MAX_SIZE, Math.max(MIN_SIZE, rect.width + dx));
        newHeight = Math.min(MAX_SIZE, Math.max(MIN_SIZE, rect.height - dy));
        newX = rect.x;
        newY = rect.y + (rect.height - newHeight);
      } else if (activeHandle === "sw") {
        newWidth = Math.min(MAX_SIZE, Math.max(MIN_SIZE, rect.width - dx));
        newHeight = Math.min(MAX_SIZE, Math.max(MIN_SIZE, rect.height + dy));
        newX = rect.x + (rect.width - newWidth);
        newY = rect.y;
      } else if (activeHandle === "se") {
        newWidth = Math.min(MAX_SIZE, Math.max(MIN_SIZE, rect.width + dx));
        newHeight = Math.min(MAX_SIZE, Math.max(MIN_SIZE, rect.height + dy));
        newX = rect.x;
        newY = rect.y;
      }

      setRoiRect({ x: newX, y: newY, width: newWidth, height: newHeight });

      // Update real-world Geo coordinates dynamically
      const kmPerDeg = 111.32;
      const kmPerPx = 4.0 / kmPerDeg;
      const topLat = llccCoords.lat - newY * kmPerPx;
      const bottomLat = llccCoords.lat - (newY + newHeight) * kmPerPx;
      const leftLon = llccCoords.lon + newX * kmPerPx;
      const rightLon = llccCoords.lon + (newX + newWidth) * kmPerPx;

      setRoiBounds({
        minLat: parseFloat(Math.min(topLat, bottomLat).toFixed(1)),
        maxLat: parseFloat(Math.max(topLat, bottomLat).toFixed(1)),
        minLon: parseFloat(Math.min(leftLon, rightLon).toFixed(1)),
        maxLon: parseFloat(Math.max(leftLon, rightLon).toFixed(1)),
      });
    };

    const handleMouseUpWindow = () => {
      setActiveHandle(null);
      dragOriginRef.current = null;
    };

    window.addEventListener("mousemove", handleMouseMoveWindow);
    window.addEventListener("mouseup", handleMouseUpWindow);

    return () => {
      window.removeEventListener("mousemove", handleMouseMoveWindow);
      window.removeEventListener("mouseup", handleMouseUpWindow);
    };
  }, [activeHandle, zoom, llccCoords]);

  const handleStartHandle = (handle: "move" | "nw" | "ne" | "sw" | "se", e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setActiveHandle(handle);
    dragOriginRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      rect: { ...roiRect },
    };
  };

  // Zoom handlers
  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3.5));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.75));
  const handleReset = () => {
    setZoom(1.0);
    setPan({ x: 0, y: 0 });
    setShowEyePopover(false);
    setRoiRect({ x: -180, y: -180, width: 360, height: 360 });
    setRoiBounds({ minLat: 14.8, maxLat: 18.2, minLon: 86.1, maxLon: 90.5 });
  };
  const handleAutoCenter = () => {
    setPan({ x: 0, y: 0 });
    setZoom(1.25);
    setShowEyePopover(true);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Dragging / Panning on canvas
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button") || (e.target as HTMLElement).closest(".no-pan")) {
      return;
    }
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Multi-spectral visual characteristics mapped to each band and curve
  const v = (() => {
    switch (band) {
      case "VIS":
        return {
          oceanColor: "#020914",
          cloudOpacity: 0.95,
          noiseBaseFreq: "0.024",
          noiseScale: 24,
          noiseOctaves: 4,
          stopWarm: "#030812", // deep shadow in eye cavity
          stopCold: "#FFFFFF", // dazzling white optical cloud tops
          stopBand: "#E2E8F0", // bright silver feeder bands
          stopMid: "#94A3B8", // shadowed cloud layers
          stopOuter: "#334155",
          eyeFill: "#020712",
          cdoStroke: "#FFFFFF",
          spiral1Stroke: "#CBD5E1",
          spiral2Stroke: "#F1F5F9",
          gsdLabel: "GSD: 1.0 km (High-Res Optical Daylight)",
          legendTitle: "Optical Albedo:",
          legendGradient: "bg-gradient-to-r from-[#020914] via-[#475569] via-[#CBD5E1] to-[#FFFFFF]",
          legendMin: "0% (Ocean)",
          legendMax: "100% (Thick Cloud)",
          annotation1Label: "Cloud Albedo",
          annotation1Val: "89.2%",
          annotation1Color: "#00F2FE",
          annotation2Label: "Solar Zenith",
          annotation2Val: "24.6°",
          annotation2Color: "#F59E0B",
          channelTag: "0.65 µm • Visible Albedo",
        };

      case "WV":
        return {
          oceanColor: "#030611",
          cloudOpacity: 0.88,
          noiseBaseFreq: "0.008",
          noiseScale: 48,
          noiseOctaves: 3,
          stopWarm: "#1E0B2E", // dry air slot
          stopCold: "#00F2FE", // intense moisture plume
          stopBand: "#38BDF8", // upper vapor lanes
          stopMid: "#312E81", // deep tropospheric moisture
          stopOuter: "#0F172A",
          eyeFill: "#180927",
          cdoStroke: "#00F2FE",
          spiral1Stroke: "#38BDF8",
          spiral2Stroke: "#67E8F9",
          gsdLabel: "GSD: 8.0 km (Upper-Tropospheric Vapor)",
          legendTitle: "Water Vapor RH:",
          legendGradient: "bg-gradient-to-r from-[#1E0B2E] via-[#312E81] via-[#0284C7] to-[#00F2FE]",
          legendMin: "10% (Dry Slot)",
          legendMax: "100% (Saturated)",
          annotation1Label: "Upper Moisture",
          annotation1Val: "84.6%",
          annotation1Color: "#38BDF8",
          annotation2Label: "Vapor Temp",
          annotation2Val: "-58.4°C",
          annotation2Color: "#00F2FE",
          channelTag: "6.8 µm • Water Vapor Dynamics",
        };

      case "MIR":
        return {
          oceanColor: "#091D33",
          cloudOpacity: 0.90,
          noiseBaseFreq: "0.018",
          noiseScale: 38,
          noiseOctaves: 4,
          stopWarm: "#FF3B30", // intense 3.9µm hot eye radiance
          stopCold: "#0284C7", // cold convective cluster
          stopBand: "#F59E0B", // warm sea boundary
          stopMid: "#0E3B66",
          stopOuter: "#051324",
          eyeFill: "#FF453A",
          cdoStroke: "#00F2FE",
          spiral1Stroke: "#F59E0B",
          spiral2Stroke: "#38BDF8",
          gsdLabel: "GSD: 4.0 km (Shortwave Thermal Radiance)",
          legendTitle: "3.9µm Radiance:",
          legendGradient: "bg-gradient-to-r from-[#051324] via-[#0284C7] via-[#F59E0B] to-[#FF3B30]",
          legendMin: "220 K (-53°C)",
          legendMax: "315 K (+42°C)",
          annotation1Label: "SST Radiance",
          annotation1Val: "+29.4°C",
          annotation1Color: "#F59E0B",
          annotation2Label: "Hot Eye Radiance",
          annotation2Val: "+18.2°C",
          annotation2Color: "#FF3B30",
          channelTag: "3.9 µm • Mid-Infrared Radiance",
        };

      case "TIR-2":
        return {
          oceanColor: "#08182D",
          cloudOpacity: 0.84,
          noiseBaseFreq: "0.013",
          noiseScale: 32,
          noiseOctaves: 4,
          stopWarm: "#F59E0B",
          stopCold: "#10E7A2",
          stopBand: "#0284C7",
          stopMid: "#1E3A5F",
          stopOuter: "#061324",
          eyeFill: "#F59E0B",
          cdoStroke: "#10E7A2",
          spiral1Stroke: "#00F2FE",
          spiral2Stroke: "#D946EF",
          gsdLabel: "GSD: 4.0 km (Split-Window 12.0µm Diff)",
          legendTitle: "Split-Window 12µm:",
          legendGradient: "bg-gradient-to-r from-[#10E7A2] via-[#0284C7] via-[#D946EF] to-[#F59E0B]",
          legendMin: "-75°C",
          legendMax: "+28°C",
          annotation1Label: "Cold Ring (12µm)",
          annotation1Val: "-74.1°C",
          annotation1Color: "#10E7A2",
          annotation2Label: "Split Diff (ΔT)",
          annotation2Val: "-3.2°C",
          annotation2Color: "#00F2FE",
          channelTag: "12.0 µm • Split Window IR",
        };

      case "TIR-1":
      default: {
        const isDvorak = curve === "dvorak";
        const isRainbow = curve === "rainbow";
        return {
          oceanColor: "#061224",
          cloudOpacity: 0.86,
          noiseBaseFreq: "0.015",
          noiseScale: 35,
          noiseOctaves: 4,
          stopWarm: isDvorak ? "#FFD700" : isRainbow ? "#EF4444" : "#0F172A",
          stopCold: isDvorak ? "#800080" : isRainbow ? "#1E40AF" : "#F8FAFC",
          stopBand: isDvorak ? "#00F2FE" : isRainbow ? "#10E7A2" : "#94A3B8",
          stopMid: isDvorak ? "#0B233D" : isRainbow ? "#0284C7" : "#334155",
          stopOuter: "#050B14",
          eyeFill: isDvorak ? "#FFD700" : isRainbow ? "#EF4444" : "#0F172A",
          cdoStroke: isDvorak ? "#800080" : isRainbow ? "#1E40AF" : "#FFFFFF",
          spiral1Stroke: isDvorak ? "#00F2FE" : isRainbow ? "#10E7A2" : "#94A3B8",
          spiral2Stroke: isDvorak ? "#D946EF" : isRainbow ? "#00F2FE" : "#CBD5E1",
          gsdLabel: "GSD: 4.0 km (WMO Dvorak Standard IR)",
          legendTitle: "Brightness Temp:",
          legendGradient: isDvorak 
            ? "bg-gradient-to-r from-[#800080] via-[#00F2FE] via-[#0B233D] to-[#FFD700]" 
            : isRainbow 
            ? "bg-gradient-to-r from-[#1E40AF] via-[#00F2FE] via-[#FFD700] to-[#EF4444]" 
            : "bg-gradient-to-r from-[#FFFFFF] via-[#94A3B8] to-[#0F172A]",
          legendMin: "-80°C",
          legendMax: "+30°C",
          annotation1Label: "Cold Ring",
          annotation1Val: `${coldRingTemp}°C`,
          annotation1Color: "#D946EF",
          annotation2Label: "Warm Eye",
          annotation2Val: `+${eyeTemp}°C`,
          annotation2Color: "#FF5E36",
          channelTag: "10.8 µm • Thermal IR Eyewall",
        };
      }
    }
  })();

  return (
    <div
      ref={containerRef}
      className={`relative bg-[#050B14] border border-[rgba(0,242,254,0.4)] rounded-2xl overflow-hidden shadow-[0_0_15px_rgba(0,242,254,0.1),0_12px_40px_rgba(0,0,0,0.85)] select-none transition-all ${
        isFullscreen ? "fixed inset-4 z-50 rounded-2xl shadow-2xl" : "h-[500px]"
      }`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ cursor: isDragging ? "grabbing" : "grab" }}
    >
      {/* Background Coordinate Grid Lines */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,rgba(0,242,254,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,242,254,0.08)_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,rgba(0,242,254,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,242,254,0.18)_1px,transparent_1px)] bg-[size:160px_160px]" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(5,11,20,0.6)_100%)]" />

      {/* Satellite Metadata Header Watermark */}
      <div className="absolute top-3 left-4 z-20 pointer-events-none flex items-center">
        <span 
          className="text-xs font-rajdhani font-bold uppercase tracking-wider"
          style={{ color: "#00F2FE", textShadow: "2px 3px 8px rgba(0,0,0,0.95)" }}
        >
          {stormName}
        </span>
      </div>

      {/* Top-Right Telemetry Pills */}
      <div className="absolute top-3 right-4 z-20 pointer-events-none flex items-center gap-2 text-[10px] font-mono">
        <div className="px-2.5 py-1 rounded-lg bg-[#0F1B2F]/90 backdrop-blur-xl border border-[rgba(0,242,254,0.4)] shadow-[0_4px_16px_rgba(0,0,0,0.6),0_0_12px_rgba(0,242,254,0.15)] text-slate-300">
          Zoom: <span className="text-[#00F2FE] font-bold">{(zoom * 100).toFixed(0)}%</span>
        </div>
        <div className="px-2.5 py-1 rounded-lg bg-[#0F1B2F]/90 backdrop-blur-xl border border-[rgba(0,242,254,0.4)] shadow-[0_4px_16px_rgba(0,0,0,0.6),0_0_12px_rgba(0,242,254,0.15)] text-slate-300">
          XAI Blend: <span className="text-[#10E7A2] font-bold">{xaiBlend}%</span>
        </div>
      </div>

      {/* MAIN RASTER VIEWPORT (GPU TRANSFORMED) */}
      <div
        className="w-full h-full flex items-center justify-center relative transition-transform duration-75 origin-center"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          filter: `contrast(${radiometrics.contrast}%) brightness(${radiometrics.brightness}%)`,
        }}
      >
        {/* SVG Multi-Spectral Cyclone Simulation */}
        <svg
          viewBox="0 0 800 600"
          className="w-[800px] h-[600px] shrink-0 pointer-events-none transition-all duration-300"
        >
          <defs>
            {/* Multi-spectral gradient filters */}
            <radialGradient id="cycloneEyeRamp" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={v.stopWarm} stopOpacity="0.95" />
              <stop offset="14%" stopColor={v.stopWarm} stopOpacity="0.8" />
              <stop offset="28%" stopColor={v.stopCold} stopOpacity="0.9" />
              <stop offset="55%" stopColor={v.stopBand} stopOpacity="0.75" />
              <stop offset="85%" stopColor={v.stopMid} stopOpacity="0.5" />
              <stop offset="100%" stopColor={v.stopOuter} stopOpacity="0" />
            </radialGradient>

            {/* Grad-CAM Attention Heatmap Gradient */}
            <radialGradient id="gradCamAttention" cx="50%" cy="50%" r="45%">
              <stop offset="0%" stopColor="#FF0055" stopOpacity="0.9" />
              <stop offset="25%" stopColor="#FF7A00" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#FFDD00" stopOpacity="0.65" />
              <stop offset="75%" stopColor="#00F2FE" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>

            {/* Procedural Spiral Feeder Bands */}
            <filter id="spiralTurbulence">
              <feTurbulence type="fractalNoise" baseFrequency={v.noiseBaseFreq} numOctaves={v.noiseOctaves} result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale={v.noiseScale} />
            </filter>
          </defs>



          {/* Outer Cloud Mass with Spiral Feeder Arms */}
          <g filter="url(#spiralTurbulence)" opacity={v.cloudOpacity} className="transition-all duration-300">
            <path
              d="M 400 300 m -220 0 a 220 220 0 1 0 440 0 a 220 220 0 1 0 -440 0"
              fill="url(#cycloneEyeRamp)"
            />
            {/* Spiral Arm 1 */}
            <path
              d="M 400 300 Q 560 210 650 340 Q 550 490 380 470 Q 230 440 210 320 Q 220 210 320 180 Q 430 160 480 230"
              stroke={v.spiral1Stroke}
              strokeWidth="48"
              fill="none"
              strokeLinecap="round"
              opacity="0.75"
            />
            {/* Spiral Arm 2 (Inner Eyewall Ring) */}
            <path
              d="M 400 300 Q 470 230 520 280 Q 510 370 420 380 Q 330 360 330 290 Q 350 240 400 240"
              stroke={v.spiral2Stroke}
              strokeWidth="56"
              fill="none"
              strokeLinecap="round"
              opacity="0.85"
            />
          </g>

          {/* Central Dense Overcast (CDO) Cold Core Ring */}
          <circle
            cx="400"
            cy="300"
            r="82"
            fill="none"
            stroke={v.cdoStroke}
            strokeWidth="32"
            opacity="0.9"
            className="transition-colors duration-300"
          />

          {/* Warm / Shadow Eye Core */}
          <circle
            cx="400"
            cy="300"
            r="24"
            fill={v.eyeFill}
            opacity="0.95"
            className="transition-colors duration-300"
          />

          {/* GRAD-CAM ATTENTION LAYER (Alpha blended via xaiBlend slider) */}
          <g opacity={xaiBlend / 100} className="transition-opacity duration-150">
            <circle
              cx="400"
              cy="300"
              r="170"
              fill="url(#gradCamAttention)"
              style={{ mixBlendMode: "screen" }}
            />
            {/* Peak Neural Gradient Points */}
            <circle cx="410" cy="285" r="32" fill="#FF0055" opacity="0.65" filter="blur(8px)" />
            <circle cx="375" cy="325" r="28" fill="#FF5E36" opacity="0.6" filter="blur(6px)" />
            <circle cx="435" cy="330" r="22" fill="#FFDD00" opacity="0.5" filter="blur(4px)" />
          </g>

          {/* Range Distance Ring Guides */}
          <circle cx="400" cy="300" r="100" stroke="#00F2FE" strokeDasharray="3 4" strokeWidth="0.8" fill="none" opacity="0.4" />
          <circle cx="400" cy="300" r="200" stroke="#00F2FE" strokeDasharray="4 6" strokeWidth="0.8" fill="none" opacity="0.3" />
          <text x="505" y="296" fill="#00F2FE" fontSize="9" fontFamily="monospace" opacity="0.6">100 km</text>
          <text x="605" y="296" fill="#00F2FE" fontSize="9" fontFamily="monospace" opacity="0.5">200 km</text>
        </svg>

        {/* INTERACTIVE ROI BOUNDING BOX */}
        {isCropping && (
          <div 
            className="absolute border-2 border-dashed border-[#00F2FE] rounded-lg no-pan select-none pointer-events-auto transition-[border-color,box-shadow] duration-150"
            style={{
              width: `${roiRect.width}px`,
              height: `${roiRect.height}px`,
              left: `calc(50% + ${roiRect.x}px)`,
              top: `calc(50% + ${roiRect.y}px)`,
              cursor: activeHandle === "move" ? "grabbing" : "grab",
              backgroundColor: activeHandle ? "rgba(0, 242, 254, 0.06)" : "transparent",
            }}
            onMouseDown={(e) => handleStartHandle("move", e)}
            title="Click and drag to move ROI bounding box"
          >
            {/* Corner Draggable & Resizable Pins */}
            {/* Top-Left */}
            <span 
              onMouseDown={(e) => handleStartHandle("nw", e)}
              className="absolute -top-2 -left-2 w-4 h-4 bg-[#00F2FE] rounded-sm shadow-[0_0_10px_#00F2FE] cursor-nwse-resize pointer-events-auto hover:scale-125 transition-transform active:scale-95"
              title="Drag to resize ROI (Top-Left)"
            />
            {/* Top-Right */}
            <span 
              onMouseDown={(e) => handleStartHandle("ne", e)}
              className="absolute -top-2 -right-2 w-4 h-4 bg-[#00F2FE] rounded-sm shadow-[0_0_10px_#00F2FE] cursor-nesw-resize pointer-events-auto hover:scale-125 transition-transform active:scale-95"
              title="Drag to resize ROI (Top-Right)"
            />
            {/* Bottom-Left */}
            <span 
              onMouseDown={(e) => handleStartHandle("sw", e)}
              className="absolute -bottom-2 -left-2 w-4 h-4 bg-[#00F2FE] rounded-sm shadow-[0_0_10px_#00F2FE] cursor-nesw-resize pointer-events-auto hover:scale-125 transition-transform active:scale-95"
              title="Drag to resize ROI (Bottom-Left)"
            />
            {/* Bottom-Right */}
            <span 
              onMouseDown={(e) => handleStartHandle("se", e)}
              className="absolute -bottom-2 -right-2 w-4 h-4 bg-[#00F2FE] rounded-sm shadow-[0_0_10px_#00F2FE] cursor-nwse-resize pointer-events-auto hover:scale-125 transition-transform active:scale-95"
              title="Drag to resize ROI (Bottom-Right)"
            />

            {/* Bounding Box Coordinates Label */}
            <div className="absolute -top-7 left-0 px-2 py-0.5 rounded bg-[#050B14]/90 border border-[#00F2FE]/50 text-[10px] font-mono text-[#00F2FE] font-bold flex items-center gap-1 shadow-md whitespace-nowrap pointer-events-none">
              <span>ROI: [{roiBounds.minLat}°N - {roiBounds.maxLat}°N | {roiBounds.minLon}°E - {roiBounds.maxLon}°E]</span>
            </div>

            {/* Cloud Ring Cold Temp / Primary Metric Annotation */}
            <div className="absolute top-5 right-6 text-[10px] font-mono text-[#E2E8F0] bg-[#0F1B2F]/90 backdrop-blur-xl px-2.5 py-1 rounded-lg border border-[rgba(0,242,254,0.4)] shadow-[0_4px_16px_rgba(0,0,0,0.6),0_0_12px_rgba(0,242,254,0.15)] pointer-events-none">
              {v.annotation1Label}: <span style={{ color: v.annotation1Color }} className="font-bold">{v.annotation1Val}</span>
            </div>

            {/* Warm Eye / Secondary Metric Annotation */}
            <div className="absolute bottom-6 left-6 text-[10px] font-mono text-[#E2E8F0] bg-[#0F1B2F]/90 backdrop-blur-xl px-2.5 py-1 rounded-lg border border-[rgba(0,242,254,0.4)] shadow-[0_4px_16px_rgba(0,0,0,0.6),0_0_12px_rgba(0,242,254,0.15)] pointer-events-none">
              {v.annotation2Label}: <span style={{ color: v.annotation2Color }} className="font-bold">{v.annotation2Val}</span>
            </div>
          </div>
        )}

        {/* SUB-PIXEL LLCC CENTROID PIN (⊕) */}
        <div
          className="absolute flex items-center justify-center cursor-pointer pointer-events-auto group z-30"
          style={{
            left: "calc(50% - 14px)",
            top: "calc(50% - 14px)",
            width: "28px",
            height: "28px",
          }}
          onClick={(e) => {
            e.stopPropagation();
            setShowEyePopover(!showEyePopover);
          }}
          title="Click to inspect LLCC Sub-Pixel Centroid"
        >
          {/* Pulsing Radar Aura */}
          <span className="absolute w-10 h-10 rounded-full bg-[#FF5E36]/30 animate-ping pointer-events-none" />
          <span className="absolute w-6 h-6 rounded-full border border-[#00F2FE] animate-pulse pointer-events-none" />
          
          {/* High-Precision Crosshair Marker */}
          <div className="w-5 h-5 rounded-full bg-[#FF5E36] border-2 border-white flex items-center justify-center shadow-[0_0_12px_#FF5E36] text-white">
            <span className="text-[10px] font-bold leading-none font-mono">⊕</span>
          </div>

          {/* Mini Pin Coordinates Tag */}
          <div className="absolute top-7 left-1/2 -translate-x-1/2 whitespace-nowrap px-1.5 py-0.5 rounded bg-[#050B14]/90 border border-[#FF5E36]/60 text-[9px] font-mono text-white pointer-events-none shadow-lg">
            {llccCoords.lat.toFixed(3)}°N, {llccCoords.lon.toFixed(3)}°E
          </div>
        </div>

        {/* LLCC DETAILED TELEMETRY POPOVER */}
        {showEyePopover && (
          <div
            className="absolute z-40 bg-[#0F1B2F]/95 backdrop-blur-xl border border-[#00F2FE] rounded-xl p-3 shadow-[0_10px_32px_rgba(0,0,0,0.9)] text-xs font-mono text-white w-64 pointer-events-auto no-pan animate-in fade-in zoom-in-95 duration-150 overflow-hidden"
            style={{
              left: "calc(50% + 22px)",
              top: "calc(50% - 80px)",
            }}
          >
            {/* Background Tactile Film-Grain Noise */}
            <Noise
              patternSize={250}
              patternScaleX={1.2}
              patternScaleY={1.2}
              patternRefreshInterval={2}
              patternAlpha={14}
            />

            <div className="relative z-10">
              <div className="flex items-center justify-between pb-1.5 border-b border-[#1E3252] mb-2">
                <span className="font-rajdhani font-bold text-xs uppercase text-[#00F2FE] flex items-center gap-1">
                  <Crosshair className="w-3.5 h-3.5" />
                  <span>LLCC Centroid Telemetry</span>
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowEyePopover(false);
                  }}
                  className="text-slate-400 hover:text-white p-0.5 rounded cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">Position:</span>
                  <span className="text-white font-bold">{llccCoords.lat}°N, {llccCoords.lon}°E</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Eye Core Temp:</span>
                  <span className="text-[#FF5E36] font-bold">+{eyeTemp}°C</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Cold Ring Min:</span>
                  <span className="text-[#D946EF] font-bold">{coldRingTemp}°C</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Eyewall ΔT:</span>
                  <span className="text-[#10E7A2] font-bold">{(eyeTemp - coldRingTemp).toFixed(1)}°C</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Eye Diameter:</span>
                  <span className="text-[#00F2FE] font-bold">38.2 km (20.6 NM)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Sub-Pixel Conf:</span>
                  <span className="text-[#10E7A2] font-bold">99.2% (ConvNeXt)</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM-LEFT CANVAS CONTROLS TOOLBAR */}
      <div className={`absolute z-30 pointer-events-auto flex items-center gap-1 p-1 rounded-lg bg-[#0F1B2F]/90 backdrop-blur-xl border border-[rgba(0,242,254,0.4)] shadow-[0_4px_16px_rgba(0,0,0,0.6),0_0_12px_rgba(0,242,254,0.15)] ${
        isFullscreen ? "bottom-4 left-4" : "bottom-3 left-3"
      }`}>


        {/* Zoom In */}
        <button
          type="button"
          onClick={handleZoomIn}
          title="Zoom In (+25%)"
          className="h-7 w-7 rounded-md bg-[#050B14]/70 hover:bg-[#00F2FE]/20 border border-[#1E3252] hover:border-[#00F2FE] text-[#8E9EB5] hover:text-[#00F2FE] flex items-center justify-center transition cursor-pointer"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>

        {/* Zoom Out */}
        <button
          type="button"
          onClick={handleZoomOut}
          title="Zoom Out (-25%)"
          className="h-7 w-7 rounded-md bg-[#050B14]/70 hover:bg-[#00F2FE]/20 border border-[#1E3252] hover:border-[#00F2FE] text-[#8E9EB5] hover:text-[#00F2FE] flex items-center justify-center transition cursor-pointer"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>

        {/* Crop ROI Toggle */}
        <button
          type="button"
          onClick={() => setIsCropping(!isCropping)}
          title={isCropping ? "Hide ROI Bounding Box" : "Show ROI Bounding Box"}
          className={`h-7 px-2 rounded-md border flex items-center justify-center gap-1 transition cursor-pointer text-xs font-mono font-bold ${
            isCropping
              ? "bg-[#00F2FE]/20 border-[#00F2FE]/50 text-[#00F2FE]"
              : "bg-[#050B14]/70 hover:bg-[#00F2FE]/20 border-[#1E3252] hover:border-[#00F2FE] text-[#8E9EB5] hover:text-[#00F2FE]"
          }`}
        >
          <Crop className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">ROI</span>
        </button>

        {/* Auto-Center on Eye */}
        <button
          type="button"
          onClick={handleAutoCenter}
          title="Auto-Center on Detected Eye Centroid"
          className="h-7 w-7 rounded-md bg-[#050B14]/70 hover:bg-[#00F2FE]/20 border border-[#1E3252] hover:border-[#00F2FE] text-[#8E9EB5] hover:text-[#00F2FE] flex items-center justify-center transition cursor-pointer"
        >
          <Crosshair className="w-3.5 h-3.5" />
        </button>


      </div>

      {/* BOTTOM-RIGHT QUICK TEMPERATURE LEGEND */}
      <div className="absolute bottom-3 right-3 z-30 hidden sm:flex items-center gap-2 bg-[#0F1B2F]/90 backdrop-blur-xl px-2.5 py-1.5 rounded-lg border border-[rgba(0,242,254,0.4)] shadow-[0_4px_16px_rgba(0,0,0,0.6),0_0_12px_rgba(0,242,254,0.15)] text-[10px] font-mono">
        <span className="text-[#8E9EB5]">{v.legendTitle}</span>
        <div className={`w-28 h-2 rounded transition-all duration-300 ${v.legendGradient}`} />
        <span className="text-white">{v.legendMin}</span>
        <span className="text-[#8E9EB5]">to</span>
        <span className="text-white">{v.legendMax}</span>
      </div>
    </div>
  );
}
