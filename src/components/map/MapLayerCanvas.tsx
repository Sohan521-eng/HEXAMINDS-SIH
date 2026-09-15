"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { ShinyBadge } from "@/components/ui/ShinyBadge";
import { LayersButton } from "@/components/ui/LayersButton";
import { FullscreenButton } from "@/components/ui/FullscreenButton";
import Noise from "@/components/ui/Noise";
import ElasticSlider from "@/components/ui/ElasticSlider";
import { 
  Map as MapIcon, 
  Maximize2, 
  Minimize2,
  ZoomIn, 
  ZoomOut, 
  Ruler, 
  RotateCcw,
  SkipBack, 
  Play, 
  Pause, 
  SkipForward, 
  ChevronDown,
  Eye,
  Sliders,
  Check,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface LayerOption {
  id: string;
  name: string;
  sub: string;
  checked: boolean;
  color: string;
}

const DEFAULT_LAYERS: LayerOption[] = [
  { id: "tir1", name: "TIR-1 Infrared", sub: "10.8µm Cloud Temperature", checked: true, color: "#00F2FE" },
  { id: "wind", name: "Scatterometer Winds", sub: "OSCAT 25km Vector Fields", checked: false, color: "#10E7A2" },
  { id: "cone", name: "Forecast Cone", sub: "72h Uncertainty Cone", checked: true, color: "#3B82F6" },
  { id: "radar", name: "Doppler Reflectivity", sub: "IMD Coastal Radar Network", checked: false, color: "#FF5E36" },
  { id: "track", name: "Track Coordinates", sub: "Historical Best-Track Nodes", checked: true, color: "#F59E0B" },
];

const PANEL_VARIANTS = {
  hidden: { 
    opacity: 0, 
    scale: 0.91, 
    y: -10, 
    filter: "blur(6px)" 
  },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0, 
    filter: "blur(0px)",
    transition: {
      duration: 0.28,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      staggerChildren: 0.035,
      delayChildren: 0.03
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.93, 
    y: -8, 
    filter: "blur(4px)",
    transition: {
      duration: 0.18,
      ease: [0.4, 0, 1, 1] as [number, number, number, number]
    }
  }
};

const ITEM_VARIANTS = {
  hidden: { opacity: 0, x: 8 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.2, ease: "easeOut" as const }
  }
};

const TIMELINE_MARKERS = [
  { pos: 0, label: "-72h", lng: 92.5, lat: 9.8, wind: "55 km/h", pres: "1002 hPa", stage: "Deep Depression" },
  { pos: 25, label: "-48h", lng: 91.0, lat: 11.2, wind: "85 km/h", pres: "992 hPa", stage: "Cyclonic Storm" },
  { pos: 50, label: "-24h", lng: 89.8, lat: 12.8, wind: "120 km/h", pres: "978 hPa", stage: "Severe CS" },
  { pos: 75, label: "-12h", lng: 89.1, lat: 13.6, wind: "140 km/h", pres: "970 hPa", stage: "Very Severe CS" },
  { pos: 100, label: "LIVE (-0h)", lng: 88.512, lat: 14.234, wind: "155 km/h", pres: "964 hPa", stage: "Very Severe CS" },
];

const FORECAST_POINTS: [number, number][] = [
  [88.512, 14.234],
  [87.6, 15.6],
  [86.5, 17.2],
  [85.8, 18.3],
  [85.1, 19.4],
  [84.0, 21.2],
];

// Cone of uncertainty polygon boundary coordinates
const CONE_POLYGON_COORDS: [number, number][] = [
  [88.512, 14.234],
  [86.8, 16.2],
  [85.2, 18.0],
  [84.2, 19.6],
  [83.2, 21.5],
  [84.8, 22.0],
  [86.0, 20.2],
  [87.2, 18.4],
  [88.4, 16.5],
  [88.512, 14.234],
];

const DWR_STATIONS = [
  { name: "Chennai DWR", lng: 80.27, lat: 13.08, code: "CHN" },
  { name: "Machilipatnam DWR", lng: 81.13, lat: 16.18, code: "MPT" },
  { name: "Visakhapatnam DWR", lng: 83.30, lat: 17.68, code: "VSK" },
  { name: "Gopalpur DWR", lng: 84.90, lat: 19.26, code: "GPL" },
  { name: "Paradip DWR", lng: 86.70, lat: 20.26, code: "PRD" },
  { name: "Kolkata DWR", lng: 88.36, lat: 22.57, code: "KOL" },
];

function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function createCirclePolygon(centerLng: number, centerLat: number, radiusKm: number, points = 48): [number, number][] {
  const coords: [number, number][] = [];
  const kmPerDegLat = 110.574;
  const kmPerDegLng = 111.32 * Math.cos((centerLat * Math.PI) / 180);
  for (let i = 0; i <= points; i++) {
    const angle = (i * 2 * Math.PI) / points;
    const dx = radiusKm * Math.cos(angle);
    const dy = radiusKm * Math.sin(angle);
    coords.push([+(centerLng + dx / kmPerDegLng).toFixed(4), +(centerLat + dy / kmPerDegLat).toFixed(4)]);
  }
  return coords;
}

function createSpiralPolygon(
  centerLng: number, 
  centerLat: number, 
  startR: number, 
  endR: number, 
  startAngle: number, 
  sweepAngle: number, 
  width: number, 
  points = 36
): [number, number][] {
  const outerCoords: [number, number][] = [];
  const innerCoords: [number, number][] = [];
  const kmPerDegLat = 110.574;
  const kmPerDegLng = 111.32 * Math.cos((centerLat * Math.PI) / 180);

  for (let i = 0; i <= points; i++) {
    const frac = i / points;
    const angle = startAngle + frac * sweepAngle;
    const rOuter = (startR + frac * (endR - startR)) + width / 2;
    const rInner = Math.max(10, (startR + frac * (endR - startR)) - width / 2);
    
    const dxO = rOuter * Math.cos(angle);
    const dyO = rOuter * Math.sin(angle);
    outerCoords.push([+(centerLng + dxO / kmPerDegLng).toFixed(4), +(centerLat + dyO / kmPerDegLat).toFixed(4)]);

    const dxI = rInner * Math.cos(angle);
    const dyI = rInner * Math.sin(angle);
    innerCoords.push([+(centerLng + dxI / kmPerDegLng).toFixed(4), +(centerLat + dyI / kmPerDegLat).toFixed(4)]);
  }
  innerCoords.reverse();
  const ring = [...outerCoords, ...innerCoords];
  ring.push(ring[0]);
  return ring;
}

// MapLibre base raster tile configuration
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildBaseStyleConfig(): any {
  return {
    version: 8,
    sources: {
      "esri-satellite": {
        type: "raster",
        tiles: [
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        ],
        tileSize: 256,
        attribution: "© Esri, Earthstar Geographics"
      }
    },
    layers: [
      { 
        id: "sat-base", 
        type: "raster", 
        source: "esri-satellite" 
      }
    ]
  };
}

export function MapLayerCanvas() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const eyeMarkerRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const trackMarkersRef = useRef<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const radarMarkersRef = useRef<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const maplibreglRef = useRef<any>(null);

  // UI state
  const [mapReady, setMapReady] = useState(false);
  const [mapTick, setMapTick] = useState(0);
  const [isLayerStackOpen, setIsLayerStackOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const layerPanelRef = useRef<HTMLDivElement | null>(null);
  const layerButtonRef = useRef<HTMLDivElement | null>(null);

  // Close Layer Stack on outside click, and handle Escape key for layers & fullscreen
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (!isLayerStackOpen) return;
      const target = e.target as Node;
      if (
        layerPanelRef.current &&
        !layerPanelRef.current.contains(target) &&
        layerButtonRef.current &&
        !layerButtonRef.current.contains(target)
      ) {
        setIsLayerStackOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isLayerStackOpen) {
          setIsLayerStackOpen(false);
        } else if (isFullscreen) {
          setIsFullscreen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isLayerStackOpen, isFullscreen]);

  // Lock body scroll when in fullscreen mode
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFullscreen]);
  const [layers, setLayers] = useState<LayerOption[]>(DEFAULT_LAYERS);
  const [opacity, setOpacity] = useState(50);
  const [zoom, setZoom] = useState(5.8);
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number }>({ lat: 14.234, lng: 88.512 });
  const [rulerActive, setRulerActive] = useState(false);
  const [rulerTarget, setRulerTarget] = useState<{ lat: number; lng: number } | null>(null);
  const [rulerDistance, setRulerDistance] = useState<string | null>(null);

  const rulerActiveRef = useRef(rulerActive);
  rulerActiveRef.current = rulerActive;

  // Temporal Scrubber state
  const [timelineVal, setTimelineVal] = useState(100);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<"0.5x" | "1x" | "2x">("1x");

  // Interpolate cyclone coordinates from timeline percentage (0 to 100)
  const getInterpolatedCoords = useCallback((val: number): { lng: number; lat: number; wind: string; pres: string; stage: string } => {
    const clamped = Math.max(0, Math.min(100, val));
    for (let i = 0; i < TIMELINE_MARKERS.length - 1; i++) {
      const p1 = TIMELINE_MARKERS[i];
      const p2 = TIMELINE_MARKERS[i + 1];
      if (clamped >= p1.pos && clamped <= p2.pos) {
        const segFrac = (clamped - p1.pos) / (p2.pos - p1.pos);
        const lng = p1.lng + (p2.lng - p1.lng) * segFrac;
        const lat = p1.lat + (p2.lat - p1.lat) * segFrac;
        return {
          lng: +lng.toFixed(3),
          lat: +lat.toFixed(3),
          wind: segFrac > 0.5 ? p2.wind : p1.wind,
          pres: segFrac > 0.5 ? p2.pres : p1.pres,
          stage: segFrac > 0.5 ? p2.stage : p1.stage,
        };
      }
    }
    const last = TIMELINE_MARKERS[TIMELINE_MARKERS.length - 1];
    return { lng: last.lng, lat: last.lat, wind: last.wind, pres: last.pres, stage: last.stage };
  }, []);

  // Current storm eye position derived from timeline
  const activeStormPosition = useMemo(() => {
    return getInterpolatedCoords(timelineVal);
  }, [timelineVal, getInterpolatedCoords]);

  const activeStormPositionRef = useRef(activeStormPosition);
  activeStormPositionRef.current = activeStormPosition;

  // Project geographic coordinates [lng, lat] to container screen coordinates { x, y }
  const projectPoint = useCallback((lng: number, lat: number): { x: number; y: number } | null => {
    const map = mapInstanceRef.current;
    if (!map) return null;
    try {
      const p = map.project([lng, lat]);
      return { x: Math.round(p.x * 10) / 10, y: Math.round(p.y * 10) / 10 };
    } catch {
      return null;
    }
  }, []);

  // Helper to convert an array of [lng, lat] to an SVG polygon path string
  const coordsToSvgPath = useCallback((coords: [number, number][]): string => {
    if (!coords || coords.length === 0) return "";
    let d = "";
    coords.forEach((c, idx) => {
      const pt = projectPoint(c[0], c[1]);
      if (!pt) return;
      d += `${idx === 0 ? "M" : "L"} ${pt.x} ${pt.y} `;
    });
    return d.length > 0 ? `${d}Z` : "";
  }, [projectPoint]);

  // Helper to convert an array of [lng, lat] to an SVG open line string
  const coordsToSvgLine = useCallback((coords: [number, number][]): string => {
    if (!coords || coords.length === 0) return "";
    let d = "";
    coords.forEach((c, idx) => {
      const pt = projectPoint(c[0], c[1]);
      if (!pt) return;
      d += `${idx === 0 ? "M" : "L"} ${pt.x} ${pt.y} `;
    });
    return d;
  }, [projectPoint]);

  // Generate Projected TIR-1 Multi-Spectral Infrared Cloud Polygons
  const tir1Polygons = useMemo(() => {
    if (!mapReady && mapTick < 0) return [];
    const { lng, lat } = activeStormPosition;
    return [
      {
        name: "Outer Canopy (-35°C)",
        color: "#0284C7",
        opacity: 0.35,
        path: coordsToSvgPath(createSpiralPolygon(lng, lat, 180, 520, Math.PI * 0.1, Math.PI * 1.4, 110)),
      },
      {
        name: "Secondary Rainband (-50°C)",
        color: "#10E7A2",
        opacity: 0.45,
        path: coordsToSvgPath(createSpiralPolygon(lng, lat, 120, 420, Math.PI * 1.45, Math.PI * 1.55, 85)),
      },
      {
        name: "Primary Feeder Band (-65°C)",
        color: "#00F2FE",
        opacity: 0.55,
        path: coordsToSvgPath(createSpiralPolygon(lng, lat, 85, 360, Math.PI * 0.75, Math.PI * 1.7, 95)),
      },
      {
        name: "CDO Shield (-72°C)",
        color: "#00F2FE",
        opacity: 0.65,
        path: coordsToSvgPath(createCirclePolygon(lng, lat, 210, 48)),
      },
      {
        name: "Core Convection (-78°C)",
        color: "#00F2FE",
        opacity: 0.78,
        path: coordsToSvgPath(createCirclePolygon(lng, lat, 115, 36)),
      },
      {
        name: "Eyewall Cloud Top (-85°C)",
        color: "#D946EF",
        opacity: 0.90,
        path: coordsToSvgPath(createCirclePolygon(lng, lat, 52, 32)),
      },
    ];
  }, [mapReady, mapTick, activeStormPosition, coordsToSvgPath]);

  // Generate Projected Scatterometer Wind Vector Field
  const windVectorLines = useMemo(() => {
    if (!mapReady && mapTick < 0) return [];
    const { lng: centerLng, lat: centerLat } = activeStormPosition;
    const vectors: { p1: { x: number; y: number }; p2: { x: number; y: number }; color: string; speed: number }[] = [];
    const kmPerDegLat = 110.574;
    const kmPerDegLng = 111.32 * Math.cos((centerLat * Math.PI) / 180);

    for (let lat = 10.2; lat <= 19.5; lat += 1.05) {
      for (let lng = 82.5; lng <= 93.8; lng += 1.15) {
        const dLng = (lng - centerLng) * kmPerDegLng;
        const dLat = (lat - centerLat) * kmPerDegLat;
        const dist = Math.sqrt(dLng * dLng + dLat * dLat);
        if (dist < 38 || dist > 620) continue;

        const theta = Math.atan2(dLat, dLng);
        const windAngle = theta + Math.PI / 2 + 0.30;
        const speedKmh = Math.max(35, Math.min(155, Math.round((155 * 65) / Math.max(65, dist))));
        const lengthKm = 14 + (speedKmh / 155) * 22;

        const endLng = +(lng + (lengthKm * Math.cos(windAngle)) / kmPerDegLng).toFixed(4);
        const endLat = +(lat + (lengthKm * Math.sin(windAngle)) / kmPerDegLat).toFixed(4);

        let color = "#00F2FE";
        if (speedKmh >= 120) color = "#FF5E36";
        else if (speedKmh >= 85) color = "#F59E0B";
        else if (speedKmh >= 55) color = "#10E7A2";

        const p1 = projectPoint(+lng.toFixed(4), +lat.toFixed(4));
        const p2 = projectPoint(endLng, endLat);
        if (p1 && p2) {
          vectors.push({ p1, p2, color, speed: speedKmh });
        }
      }
    }
    return vectors;
  }, [mapReady, mapTick, activeStormPosition, projectPoint]);

  // Projected Forecast Cone Polygon Path
  const forecastConePath = useMemo(() => {
    if (!mapReady && mapTick < 0) return "";
    return coordsToSvgPath(CONE_POLYGON_COORDS);
  }, [mapReady, mapTick, coordsToSvgPath]);

  // Projected Historical Track Line Path
  const historicalTrackPath = useMemo(() => {
    if (!mapReady && mapTick < 0) return "";
    const coords: [number, number][] = TIMELINE_MARKERS.map((m) => [m.lng, m.lat]);
    return coordsToSvgLine(coords);
  }, [mapReady, mapTick, coordsToSvgLine]);

  // Projected Forecast Track Line Path
  const forecastTrackPath = useMemo(() => {
    if (!mapReady && mapTick < 0) return "";
    return coordsToSvgLine(FORECAST_POINTS);
  }, [mapReady, mapTick, coordsToSvgLine]);

  // Projected Ruler Measurement Line and Points
  const rulerLinePath = useMemo(() => {
    if (!rulerActive || !rulerTarget) return "";
    return coordsToSvgLine([
      [activeStormPosition.lng, activeStormPosition.lat],
      [rulerTarget.lng, rulerTarget.lat],
    ]);
  }, [rulerActive, rulerTarget, activeStormPosition, coordsToSvgLine, mapTick]);

  const rulerTargetPoint = useMemo(() => {
    if (!rulerActive || !rulerTarget) return null;
    return projectPoint(rulerTarget.lng, rulerTarget.lat);
  }, [rulerActive, rulerTarget, projectPoint, mapTick]);

  // Projected Radar Range Rings & Reflectivity Echoes
  const radarOverlays = useMemo(() => {
    if (!mapReady && mapTick < 0) return { rings: [], echoes: [] };

    // Range rings (100km and 250km)
    const rings: { path: string; radius: number; name: string }[] = [];
    DWR_STATIONS.forEach((st) => {
      const ring250Path = coordsToSvgPath(createCirclePolygon(st.lng, st.lat, 250, 40));
      const ring100Path = coordsToSvgPath(createCirclePolygon(st.lng, st.lat, 100, 32));
      if (ring250Path) rings.push({ path: ring250Path, radius: 250, name: st.name });
      if (ring100Path) rings.push({ path: ring100Path, radius: 100, name: st.name });
    });

    // Reflectivity Echoes
    const echoPolys = [
      { poly: createSpiralPolygon(88.512, 14.234, 250, 420, Math.PI * 0.32, 0.85, 60), color: "#22C55E" },
      { poly: createCirclePolygon(85.8, 17.5, 42, 28), color: "#EAB308" },
      { poly: createCirclePolygon(84.6, 18.8, 32, 24), color: "#22C55E" },
      { poly: createCirclePolygon(86.2, 19.6, 48, 30), color: "#EF4444" },
      { poly: createCirclePolygon(87.4, 20.8, 38, 26), color: "#EAB308" },
    ];

    const echoes = echoPolys.map(({ poly, color }) => ({
      path: coordsToSvgPath(poly),
      color,
    }));

    return { rings, echoes };
  }, [mapReady, mapTick, coordsToSvgPath]);

  // Helper: add eye marker + track nodes + radar station markers
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const addMarkersToMap = useCallback((map: any) => {
    const maplibregl = maplibreglRef.current;
    if (!maplibregl || !map) return;

    // Remove existing markers
    trackMarkersRef.current.forEach((m) => m.remove());
    trackMarkersRef.current = [];
    radarMarkersRef.current.forEach((m) => m.remove());
    radarMarkersRef.current = [];
    if (eyeMarkerRef.current) {
      eyeMarkerRef.current.remove();
      eyeMarkerRef.current = null;
    }

    // Cyclone Eye Marker (Spinning Hurricane symbol + live wind badge)
    const eyeEl = document.createElement("div");
    eyeEl.className = "cyclone-eye-marker cursor-pointer";
    eyeEl.innerHTML = `
      <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; inset: 0; border-radius: 9999px; background: rgba(255, 94, 54, 0.4); animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        <div style="position: absolute; inset: 3px; border-radius: 9999px; background: rgba(15, 27, 47, 0.95); border: 2px solid #FF5E36; box-shadow: 0 0 16px rgba(255, 94, 54, 0.8); display: flex; align-items: center; justify-content: center;">
          <span style="font-size: 22px; filter: drop-shadow(0 0 4px #FF5E36); transform-origin: center; display: inline-block;">🌀</span>
        </div>
        <div class="cyclone-wind-label" style="position: absolute; top: -30px; left: 50%; transform: translateX(-50%); white-space: nowrap; background: rgba(15, 27, 47, 0.95); color: #00F2FE; border: 1px solid rgba(0, 242, 254, 0.5); padding: 2px 8px; border-radius: 6px; font-family: monospace; font-size: 11px; font-weight: bold; box-shadow: 0 4px 12px rgba(0,0,0,0.6);">
          BOB-02 • 155 km/h
        </div>
      </div>
    `;
    const eyeMarker = new maplibregl.Marker({ element: eyeEl, anchor: "center" })
      .setLngLat([88.512, 14.234])
      .addTo(map);
    eyeMarkerRef.current = eyeMarker;

    // Historical track node markers
    TIMELINE_MARKERS.slice(0, 4).forEach((point) => {
      const nodeEl = document.createElement("div");
      nodeEl.className = "track-node-marker";
      nodeEl.innerHTML = `
        <div style="width: 12px; height: 12px; border-radius: 9999px; background: #F59E0B; border: 2px solid #FFFFFF; box-shadow: 0 0 6px rgba(0,0,0,0.4); cursor: pointer;" title="${point.label}: ${point.stage} (${point.wind})"></div>
      `;
      const marker = new maplibregl.Marker({ element: nodeEl, anchor: "center" })
        .setLngLat([point.lng, point.lat])
        .addTo(map);
      trackMarkersRef.current.push(marker);
    });

    // IMD Coastal Doppler Weather Radar (DWR) station markers
    DWR_STATIONS.forEach((st) => {
      const el = document.createElement("div");
      el.className = "radar-station-marker pointer-events-none";
      el.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; gap: 2px;">
          <div style="background: rgba(15, 27, 47, 0.92); border: 1.5px solid #FF5E36; color: #FFFFFF; font-family: monospace; font-size: 10px; font-weight: bold; padding: 1px 6px; border-radius: 4px; white-space: nowrap; box-shadow: 0 2px 8px rgba(0,0,0,0.8); display: flex; align-items: center; gap: 3px;">
            <span style="color: #FF5E36;">📡</span> ${st.name}
          </div>
          <div style="width: 8px; height: 8px; border-radius: 50%; background: #FF5E36; border: 1.5px solid #FFFFFF; box-shadow: 0 0 8px #FF5E36;"></div>
        </div>
      `;
      const marker = new maplibregl.Marker({ element: el, anchor: "bottom" })
        .setLngLat([st.lng, st.lat])
        .addTo(map);
      el.style.display = "none";
      radarMarkersRef.current.push(marker);
    });
  }, []);

  // Initialize MapLibre GL Map
  useEffect(() => {
    let isMounted = true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let map: any = null;

    async function initMapLibre() {
      if (!mapContainerRef.current) return;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const maplibreglMod: any = await import("maplibre-gl");
      const maplibregl = maplibreglMod.default || maplibreglMod;
      maplibreglRef.current = maplibregl;
      if (!isMounted) return;

      map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: buildBaseStyleConfig(),
        center: [88.512, 14.234],
        zoom: 5.8,
        minZoom: 3,
        maxZoom: 14,
        pitchWithRotate: false,
        attributionControl: false,
      });

      mapInstanceRef.current = map;

      // HTML DOM Markers (eye, track nodes, radar stations)
      addMarkersToMap(map);

      // Trigger mapReady state once map is mounted
      const notifyReady = () => {
        if (!isMounted) return;
        setMapReady(true);
        setMapTick((t) => t + 1);
      };

      map.on("load", notifyReady);
      map.on("render", () => {
        if (isMounted) setMapTick((t) => (t + 1) % 10000);
      });

      // Synchronize projected coordinates on every map movement
      map.on("move", () => {
        const center = map.getCenter();
        setCurrentCoords({ lat: +center.lat.toFixed(3), lng: +center.lng.toFixed(3) });
        setZoom(+map.getZoom().toFixed(1));
        setMapTick((t) => (t + 1) % 10000);
      });

      map.on("zoom", () => {
        setMapTick((t) => (t + 1) % 10000);
      });

      map.on("resize", () => {
        setMapTick((t) => (t + 1) % 10000);
      });

      // Map Click for Ruler Tool
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      map.on("click", (e: any) => {
        if (!rulerActiveRef.current) return;
        const clickLng = e.lngLat.lng;
        const clickLat = e.lngLat.lat;
        const eye = activeStormPositionRef.current;
        const dist = calculateDistanceKm(eye.lat, eye.lng, clickLat, clickLng);
        const nauticalMiles = dist * 0.539957;
        setRulerTarget({ lat: clickLat, lng: clickLng });
        setRulerDistance(`${dist.toFixed(1)} km (${nauticalMiles.toFixed(1)} NM)`);
        setMapTick((t) => (t + 1) % 10000);
      });

      // Immediate tick to render on initial frame
      setTimeout(() => {
        if (isMounted) {
          setMapReady(true);
          setMapTick((t) => t + 1);
        }
      }, 100);
    }

    initMapLibre();

    return () => {
      isMounted = false;
      trackMarkersRef.current.forEach((m) => m.remove());
      trackMarkersRef.current = [];
      radarMarkersRef.current.forEach((m) => m.remove());
      radarMarkersRef.current = [];
      if (eyeMarkerRef.current) {
        eyeMarkerRef.current.remove();
        eyeMarkerRef.current = null;
      }
      if (map) {
        map.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [addMarkersToMap]); // eslint-disable-line react-hooks/exhaustive-deps

  // Synchronize timeline scrubber with Eye Marker position and telemetry
  useEffect(() => {
    const current = activeStormPosition;
    if (eyeMarkerRef.current) {
      eyeMarkerRef.current.setLngLat([current.lng, current.lat]);
      const labelEl = eyeMarkerRef.current.getElement().querySelector(".cyclone-wind-label");
      if (labelEl) {
        labelEl.textContent = `BOB-02 • ${current.wind}`;
      }
    }
  }, [activeStormPosition]);

  // Synchronize HTML DOM marker visibility for Radar stations and Track nodes
  useEffect(() => {
    const isRadarActive = layers.find((l) => l.id === "radar")?.checked ?? false;
    const isTrackActive = layers.find((l) => l.id === "track")?.checked ?? true;
    const opFraction = opacity / 100;

    radarMarkersRef.current.forEach((m) => {
      if (m && m.getElement()) {
        m.getElement().style.display = isRadarActive ? "block" : "none";
        m.getElement().style.opacity = `${opFraction}`;
      }
    });

    trackMarkersRef.current.forEach((m) => {
      if (m && m.getElement()) {
        m.getElement().style.display = isTrackActive ? "block" : "none";
        m.getElement().style.opacity = `${opFraction}`;
      }
    });
  }, [layers, opacity]);

  // Timeline scrubber autoplay loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      const stepInterval = speed === "0.5x" ? 1200 : speed === "1x" ? 600 : 300;
      interval = setInterval(() => {
        setTimelineVal((prev) => {
          if (prev >= 100) return 0;
          return Math.min(100, prev + 5);
        });
      }, stepInterval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, speed]);

  // Window / Fullscreen resize trigger with automatic storm recentering
  useEffect(() => {
    const coords = activeStormPosition;
    // When maximized, center slightly north (lat + 1.2) to give balanced breathing room for forecast track
    const targetCenter: [number, number] = [coords.lng, isFullscreen ? coords.lat + 1.2 : coords.lat];
    const targetZoom = isFullscreen ? 5.5 : 5.4;

    const rafId = requestAnimationFrame(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.resize();
        mapInstanceRef.current.jumpTo({
          center: targetCenter,
          zoom: targetZoom,
        });
        setMapTick((t) => t + 1);
      }
    });

    const timer1 = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.resize();
        mapInstanceRef.current.flyTo({
          center: targetCenter,
          zoom: targetZoom,
          duration: 300,
          essential: true,
        });
        setMapTick((t) => t + 1);
      }
    }, 60);

    const timer2 = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.resize();
        setMapTick((t) => t + 1);
      }
    }, 250);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [isFullscreen, activeStormPosition]);

  // Direct toggle function for layers (instant React state update)
  const toggleLayer = (id: string) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === id ? { ...l, checked: !l.checked } : l))
    );
  };

  const handleOpacityChange = (val: number) => {
    setOpacity(val);
  };

  const cycleSpeed = () => {
    setSpeed((prev) => (prev === "0.5x" ? "1x" : prev === "1x" ? "2x" : "0.5x"));
  };

  const getTimeOffsetLabel = () => {
    if (timelineVal >= 98) return "LIVE (Current Scan)";
    const hoursAgo = Math.round((100 - timelineVal) * 0.72);
    return `T -${hoursAgo}h (${new Date(Date.now() - hoursAgo * 3600 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} UTC)`;
  };

  // Active layer check states
  const isTir1Active = layers.find((l) => l.id === "tir1")?.checked ?? true;
  const isWindActive = layers.find((l) => l.id === "wind")?.checked ?? false;
  const isConeActive = layers.find((l) => l.id === "cone")?.checked ?? true;
  const isRadarActive = layers.find((l) => l.id === "radar")?.checked ?? false;
  const isTrackActive = layers.find((l) => l.id === "track")?.checked ?? true;
  const globalOpacityFraction = Math.max(0.2, Math.min(1, opacity / 100));

  return (
    <Card 
      variant="glass" 
      className={`overflow-hidden w-full flex flex-col bg-[#0F1B2F]/95 ${
        isFullscreen 
          ? "fixed top-16 sm:top-20 inset-x-0 bottom-0 z-40 w-full h-[calc(100vh-4rem)] sm:h-[calc(100vh-5rem)] rounded-none border-0 shadow-2xl" 
          : "relative h-full min-h-[520px] rounded-xl border-2 border-[rgba(0,242,254,0.5)] shadow-[0_0_15px_rgba(0,242,254,0.12)]"
      }`}
    >
      {/* 1. Map Control Overlay Header */}
      <div className={`absolute left-3 right-3 z-30 flex items-center justify-between pointer-events-none transition-all duration-200 ${
        isFullscreen ? "top-3 sm:top-4 px-3 sm:px-6" : "top-3"
      }`}>
        <ShinyBadge
          className="pointer-events-auto shadow-[0_4px_14px_rgba(0,0,0,0.35),0_1px_3px_rgba(0,0,0,0.2),0_0_10px_rgba(0,242,254,0.15)]"
          roundedClassName="rounded-lg"
          speed={3}
          spread={80}
          borderColor="rgba(0, 242, 254, 0.4)"
          borderShineColor="#ffffff"
          surfaceColor="rgba(0, 242, 254, 0.15)"
          surfaceShineColor="rgba(255, 255, 255, 0.55)"
        >
          <MapIcon className="w-4 h-4 text-[#00F2FE]" />
          <span className="font-semibold text-white text-xs">Geospatial Satellite &amp; Radar View</span>
        </ShinyBadge>

        <div className="pointer-events-auto flex items-center gap-2">
          <div ref={layerButtonRef}>
            <LayersButton
              isOpen={isLayerStackOpen}
              onClick={() => setIsLayerStackOpen(!isLayerStackOpen)}
            />
          </div>

          {/* Fullscreen Toggle Button with identical GSAP expanding bubble and icon roll animation */}
          <FullscreenButton
            isFullscreen={isFullscreen}
            onClick={() => setIsFullscreen(!isFullscreen)}
          />
        </div>
      </div>

      {/* 2. Floating Multi-Spectral Layer Stack Panel with Smooth Framer Motion Animation */}
      <AnimatePresence>
        {isLayerStackOpen && (
          <motion.div
            ref={layerPanelRef}
            key="layer-stack-panel"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={PANEL_VARIANTS}
            className={`absolute z-40 w-72 bg-[#0F1B2F]/90 backdrop-blur-xl border border-[rgba(0,242,254,0.4)] rounded-xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.8),0_0_15px_rgba(0,242,254,0.1)] origin-top-right transform-gpu overflow-hidden ${
              isFullscreen ? "top-14 sm:top-16 right-3 sm:right-6" : "top-14 right-3"
            }`}
          >
            {/* React Bits Noise Background Overlay matching Parameter Cards */}
            <Noise
              patternSize={250}
              patternScaleX={2.5}
              patternScaleY={2.5}
              patternRefreshInterval={2}
              patternAlpha={10}
            />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3 border-b border-[#1E3252] pb-2">
                <h4 className="font-rajdhani text-xs font-bold uppercase tracking-wider text-[#00F2FE] flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" />
                  Overlay Layers
                </h4>
                <button
                  type="button"
                  onClick={() => setIsLayerStackOpen(false)}
                  className="text-[#8E9EB5] hover:text-[#00F2FE] transition-colors p-1 rounded-md hover:bg-[#1E3252]/60 cursor-pointer"
                  title="Close overlay layers"
                  aria-label="Close"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Layer Checkbox List */}
              <div className="flex flex-col space-y-1.5 mb-3.5">
                <span className="text-[10px] font-rajdhani font-bold uppercase tracking-wider text-[#8E9EB5] block">
                  Overlay Channels
                </span>
                {layers.map((layer) => (
                  <motion.button
                    key={layer.id}
                    variants={ITEM_VARIANTS}
                    type="button"
                    onClick={() => toggleLayer(layer.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg border cursor-pointer select-none text-left ${
                      layer.checked
                        ? "bg-[#00F2FE]/10 border-[#00F2FE]/40 text-white shadow-[0_0_10px_rgba(0,242,254,0.15)]"
                        : "bg-[#050B14]/40 border-transparent text-[#8E9EB5]"
                    }`}
                  >
                    <div className="flex items-center gap-2 pointer-events-none">
                      <div 
                        className={`w-4 h-4 rounded flex items-center justify-center transition-all ${
                          layer.checked ? "bg-[#00F2FE] text-[#050B14]" : "border border-[#8E9EB5]/40"
                        }`}
                      >
                        {layer.checked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-rajdhani text-xs font-bold uppercase">{layer.name}</span>
                        <span className="text-[9px] text-[#8E9EB5]">{layer.sub}</span>
                      </div>
                    </div>
                    <div 
                      className="w-2 h-2 rounded-full transition-all pointer-events-none" 
                      style={{ 
                        backgroundColor: layer.checked ? layer.color : "transparent",
                        boxShadow: layer.checked ? `0 0 8px ${layer.color}` : "none"
                      }}
                    />
                  </motion.button>
                ))}
              </div>

              {/* Opacity Control */}
              <motion.div variants={ITEM_VARIANTS} className="p-2 rounded-lg bg-[#050B14]/60 border border-[#1E3252]">
                <div className="flex items-center justify-between mb-1.5 text-xs">
                  <span className="font-rajdhani uppercase font-semibold text-[#8E9EB5] flex items-center gap-1">
                    <Sliders className="w-3 h-3 text-[#00F2FE]" />
                    Overlay Opacity
                  </span>
                  <span className="font-jetbrains font-bold text-[#00F2FE] text-[11px] tabular-nums">
                    {opacity}%
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={opacity}
                  onChange={(e) => handleOpacityChange(Number(e.target.value))}
                  className="w-full h-1.5 bg-[#1E3252] rounded-lg appearance-none cursor-pointer accent-[#00F2FE]"
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Live Interactive Map Viewport */}
      <div className="relative flex-1 w-full min-h-[440px] overflow-hidden bg-[#0F1B2F]">
        {/* Real MapLibre GL DOM Mount Target */}
        <div 
          ref={mapContainerRef} 
          className={`absolute inset-0 w-full h-full ${rulerActive ? "cursor-crosshair" : "cursor-grab"}`} 
        />

        {/* 100% Reliable Synchronized Geospatial SVG Overlay */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible"
          style={{ width: "100%", height: "100%" }}
        >
          <defs>
            {/* Atmospheric Thermal Infrared Glow Filter */}
            <filter id="tir1-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* LAYER 1: Forecast Cone of Uncertainty */}
          {isConeActive && forecastConePath && (
            <g id="svg-forecast-cone-group" className="transition-opacity duration-200">
              <path
                d={forecastConePath}
                fill="#00F2FE"
                fillOpacity={0.22 * globalOpacityFraction}
                stroke="#00F2FE"
                strokeWidth={1.8}
                strokeDasharray="5 4"
                strokeOpacity={0.85 * globalOpacityFraction}
              />
            </g>
          )}

          {/* LAYER 2: TIR-1 Multi-Spectral Thermal Infrared Cloud Structure */}
          {isTir1Active && (
            <g id="svg-tir1-group" filter="url(#tir1-glow)" className="transition-opacity duration-200">
              {tir1Polygons.map((poly, idx) => (
                poly.path ? (
                  <path
                    key={poly.name || idx}
                    d={poly.path}
                    fill={poly.color}
                    fillOpacity={poly.opacity * globalOpacityFraction}
                    stroke={poly.color}
                    strokeWidth={1.2}
                    strokeOpacity={(poly.opacity + 0.15) * globalOpacityFraction}
                  />
                ) : null
              ))}
            </g>
          )}

          {/* LAYER 3: Coastal Doppler Weather Radar (Rings & Echoes) */}
          {isRadarActive && (
            <g id="svg-radar-group" className="transition-opacity duration-200">
              {/* Surveillance Range Rings */}
              {radarOverlays.rings.map((ring, idx) => (
                <path
                  key={`ring-${idx}`}
                  d={ring.path}
                  fill="#00F2FE"
                  fillOpacity={0.04 * globalOpacityFraction}
                  stroke="#00F2FE"
                  strokeWidth={ring.radius === 100 ? 1.2 : 1.6}
                  strokeDasharray={ring.radius === 100 ? "3 3" : "6 4"}
                  strokeOpacity={0.65 * globalOpacityFraction}
                />
              ))}

              {/* Reflectivity Rainband Echoes */}
              {radarOverlays.echoes.map((echo, idx) => (
                <path
                  key={`echo-${idx}`}
                  d={echo.path}
                  fill={echo.color}
                  fillOpacity={0.65 * globalOpacityFraction}
                  stroke={echo.color}
                  strokeWidth={1}
                  strokeOpacity={0.8 * globalOpacityFraction}
                />
              ))}
            </g>
          )}

          {/* LAYER 4: Scatterometer Surface Wind Vectors */}
          {isWindActive && (
            <g id="svg-wind-group" className="transition-opacity duration-200">
              {windVectorLines.map((vec, idx) => (
                <g key={`wind-${idx}`}>
                  {/* Directional vector line */}
                  <line
                    x1={vec.p1.x}
                    y1={vec.p1.y}
                    x2={vec.p2.x}
                    y2={vec.p2.y}
                    stroke={vec.color}
                    strokeWidth={2}
                    strokeOpacity={0.85 * globalOpacityFraction}
                  />
                  {/* Arrowhead point */}
                  <circle
                    cx={vec.p2.x}
                    cy={vec.p2.y}
                    r={2.5}
                    fill={vec.color}
                    fillOpacity={0.95 * globalOpacityFraction}
                  />
                </g>
              ))}
            </g>
          )}

          {/* LAYER 5: Track Coordinates (Historical & Forecast Lines) */}
          {isTrackActive && (
            <g id="svg-track-group" className="transition-opacity duration-200">
              {/* Historical Path Line */}
              {historicalTrackPath && (
                <path
                  d={historicalTrackPath}
                  fill="none"
                  stroke="#FF5E36"
                  strokeWidth={3}
                  strokeOpacity={0.9 * globalOpacityFraction}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Forecast Ensemble Track Line */}
              {forecastTrackPath && (
                <path
                  d={forecastTrackPath}
                  fill="none"
                  stroke="#0284C7"
                  strokeWidth={2.5}
                  strokeDasharray="5 4"
                  strokeOpacity={0.95 * globalOpacityFraction}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
            </g>
          )}

          {/* LAYER 6: Interactive Orthodromic Distance Ruler Visual */}
          {rulerActive && rulerTarget && rulerLinePath && (
            <g id="svg-ruler-measurement-group">
              {/* Outer Cyan Glow Shadow Line */}
              <path
                d={rulerLinePath}
                fill="none"
                stroke="#00F2FE"
                strokeWidth={6}
                strokeOpacity={0.25}
                strokeLinecap="round"
              />
              {/* Animated Dashed Primary Line */}
              <path
                d={rulerLinePath}
                fill="none"
                stroke="#00F2FE"
                strokeWidth={2}
                strokeDasharray="6 4"
                strokeLinecap="round"
              />

              {/* Target Location Crosshair Reticle */}
              {rulerTargetPoint && (
                <g transform={`translate(${rulerTargetPoint.x}, ${rulerTargetPoint.y})`}>
                  {/* Radar Pulse Rings */}
                  <circle r={14} fill="none" stroke="#00F2FE" strokeWidth={1.5} strokeDasharray="3 2" opacity={0.8} />
                  <circle r={6} fill="#0F1B2F" stroke="#00F2FE" strokeWidth={2} />
                  <circle r={2} fill="#00F2FE" />
                  {/* Precision Reticle Lines */}
                  <line x1={-18} y1={0} x2={-8} y2={0} stroke="#00F2FE" strokeWidth={1.5} />
                  <line x1={8} y1={0} x2={18} y2={0} stroke="#00F2FE" strokeWidth={1.5} />
                  <line x1={0} y1={-18} x2={0} y2={-8} stroke="#00F2FE" strokeWidth={1.5} />
                  <line x1={0} y1={8} x2={0} y2={18} stroke="#00F2FE" strokeWidth={1.5} />

                  {/* Target Distance Pill Badge */}
                  {rulerDistance && (
                    <g transform="translate(0, -26)">
                      <rect
                        x={-60}
                        y={-12}
                        width={120}
                        height={24}
                        rx={6}
                        fill="rgba(15, 27, 47, 0.95)"
                        stroke="#00F2FE"
                        strokeWidth={1.5}
                      />
                      <text
                        x={0}
                        y={4}
                        textAnchor="middle"
                        fill="#00F2FE"
                        fontSize={10}
                        fontFamily="monospace"
                        fontWeight="bold"
                      >
                        {rulerDistance}
                      </text>
                    </g>
                  )}
                </g>
              )}

              {/* End of ruler target */}
            </g>
          )}
        </svg>

        {/* Floating Map Navigation & Measurement Toolbox (Bottom-Left Corner) */}
        <div className={`absolute z-20 pointer-events-auto flex items-center gap-1 p-1 rounded-lg bg-[#0F1B2F]/90 backdrop-blur-xl border border-[rgba(0,242,254,0.4)] shadow-[0_4px_16px_rgba(0,0,0,0.6),0_0_12px_rgba(0,242,254,0.15)] ${
          isFullscreen ? "bottom-4 left-5 sm:left-7" : "bottom-3 left-3"
        }`}>
          <button
            type="button"
            onClick={() => mapInstanceRef.current?.zoomIn()}
            title="Zoom In"
            className="h-7 w-7 rounded-md bg-[#050B14]/70 hover:bg-[#00F2FE]/20 border border-[#1E3252] hover:border-[#00F2FE] text-[#8E9EB5] hover:text-[#00F2FE] flex items-center justify-center transition cursor-pointer"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => mapInstanceRef.current?.zoomOut()}
            title="Zoom Out"
            className="h-7 w-7 rounded-md bg-[#050B14]/70 hover:bg-[#00F2FE]/20 border border-[#1E3252] hover:border-[#00F2FE] text-[#8E9EB5] hover:text-[#00F2FE] flex items-center justify-center transition cursor-pointer"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => {
              const next = !rulerActive;
              setRulerActive(next);
              if (!next) {
                setRulerDistance(null);
                setRulerTarget(null);
              }
            }}
            title={rulerActive ? "Deactivate Distance Ruler" : "Activate Distance Ruler (Measure Distance)"}
            className={`h-7 w-7 rounded-md border flex items-center justify-center transition cursor-pointer ${
              rulerActive
                ? "bg-[#00F2FE]/25 border-[#00F2FE] text-[#00F2FE] shadow-[0_0_12px_rgba(0,242,254,0.4)] ring-1 ring-[#00F2FE]"
                : "bg-[#050B14]/70 hover:bg-[#00F2FE]/20 border-[#1E3252] hover:border-[#00F2FE] text-[#8E9EB5] hover:text-white"
            }`}
          >
            <Ruler className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => {
              const coords = activeStormPosition;
              mapInstanceRef.current?.flyTo({
                center: [coords.lng, isFullscreen ? coords.lat + 1.2 : coords.lat],
                zoom: isFullscreen ? 5.5 : 5.4,
                pitch: 0,
                bearing: 0,
                duration: 400,
                essential: true,
              });
            }}
            title="Reset Viewport to Bay of Bengal"
            className="h-7 w-7 rounded-md bg-[#050B14]/70 hover:bg-[#00F2FE]/20 border border-[#1E3252] hover:border-[#00F2FE] text-[#8E9EB5] hover:text-[#00F2FE] flex items-center justify-center transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Ruler Distance Banner */}
        {rulerActive && (
          <div className="absolute top-14 left-3 sm:left-4 z-30 pointer-events-auto bg-[#0F1B2F]/95 backdrop-blur-xl border border-[#00F2FE] p-2 sm:p-2.5 px-3 sm:px-4 rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.8),0_0_15px_rgba(0,242,254,0.3)] text-xs font-mono text-white flex flex-wrap items-center gap-2.5">
            <span className="px-2 py-0.5 rounded bg-[#00F2FE]/20 text-[#00F2FE] font-bold tracking-wider font-rajdhani uppercase flex items-center gap-1 text-[11px]">
              <Ruler className="w-3.5 h-3.5" /> Distance Ruler
            </span>
            <span className="text-white font-jetbrains">
              {rulerDistance ? (
                <>
                  <span className="text-[#00F2FE] font-bold">{rulerDistance}</span> from Cyclone Eye
                </>
              ) : (
                <span className="text-[#8E9EB5]">Click anywhere on the map to measure distance to Cyclone Eye</span>
              )}
            </span>
            {rulerTarget && (
              <button
                type="button"
                onClick={() => {
                  setRulerTarget(null);
                  setRulerDistance(null);
                }}
                className="text-[10px] font-mono text-[#8E9EB5] hover:text-[#00F2FE] border border-[#1E3252] hover:border-[#00F2FE]/60 px-1.5 py-0.5 rounded cursor-pointer transition bg-[#050B14]/80"
                title="Clear current measurement"
              >
                Clear
              </button>
            )}
            <button 
              type="button"
              onClick={() => {
                setRulerActive(false);
                setRulerTarget(null);
                setRulerDistance(null);
              }}
              className="text-[#8E9EB5] hover:text-white text-xs font-bold cursor-pointer transition ml-auto"
              title="Deactivate Ruler"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* 4. Integrated 72-Hour Temporal Scrubber Footer */}
      <div className={`relative overflow-hidden z-20 bg-[#0F1B2F]/90 backdrop-blur-xl border-t border-[rgba(0,242,254,0.4)] shadow-[0_0_15px_rgba(0,242,254,0.1)] transition-all ${
        isFullscreen ? "px-6 sm:px-10 py-3.5" : "p-3.5"
      }`}>
        {/* React Bits Noise Background Overlay matching Above Parameter Cards */}
        <Noise
          patternSize={250}
          patternScaleX={2.5}
          patternScaleY={2.5}
          patternRefreshInterval={2}
          patternAlpha={10}
        />

        <div className="relative z-10">
          {/* Scrubber Controls Row */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="font-rajdhani text-xs font-bold uppercase tracking-wider text-[#00F2FE] flex items-center gap-1.5">
                ⏱️ 72-Hr Scrubber
              </span>
              <span className="text-[10px] font-mono text-[#00F2FE] bg-[#050B14]/80 px-2 py-0.5 rounded border border-[#00F2FE]/30">
                {getTimeOffsetLabel()}
              </span>
            </div>

            {/* Scrubber Control Buttons Capsule - Matching Toolbox Styling & Effects */}
            <div className="flex items-center gap-1 p-1 rounded-lg bg-[#0F1B2F]/90 backdrop-blur-xl border border-[rgba(0,242,254,0.4)] shadow-[0_4px_16px_rgba(0,0,0,0.6),0_0_12px_rgba(0,242,254,0.15)]">
              {/* Rewind */}
              <button
                type="button"
                onClick={() => setTimelineVal(0)}
                title="Rewind to -72h"
                className="h-7 w-7 rounded-md bg-[#050B14]/70 hover:bg-[#00F2FE]/20 border border-[#1E3252] hover:border-[#00F2FE] text-[#8E9EB5] hover:text-[#00F2FE] flex items-center justify-center transition cursor-pointer"
              >
                <SkipBack className="w-3.5 h-3.5" />
              </button>

              {/* Play / Pause */}
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                title={isPlaying ? "Pause Playback" : "Play Timeline Animation"}
                className={`h-7 px-2.5 rounded-md border flex items-center justify-center gap-1.5 font-rajdhani font-bold text-xs uppercase tracking-wider transition cursor-pointer ${
                  isPlaying
                    ? "bg-[#00F2FE]/25 border-[#00F2FE] text-[#00F2FE] shadow-[0_0_12px_rgba(0,242,254,0.4)] ring-1 ring-[#00F2FE]"
                    : "bg-[#050B14]/70 hover:bg-[#00F2FE]/20 border-[#1E3252] hover:border-[#00F2FE] text-[#8E9EB5] hover:text-[#00F2FE]"
                }`}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5 text-[#00F2FE]" /> : <Play className="w-3.5 h-3.5 text-[#00F2FE]" />}
                <span>{isPlaying ? "Pause" : "Play"}</span>
              </button>

              {/* Jump to Live */}
              <button
                type="button"
                onClick={() => {
                  setTimelineVal(100);
                  setIsPlaying(false);
                }}
                title="Jump to LIVE Scan"
                className="h-7 w-7 rounded-md bg-[#050B14]/70 hover:bg-[#00F2FE]/20 border border-[#1E3252] hover:border-[#00F2FE] text-[#8E9EB5] hover:text-[#00F2FE] flex items-center justify-center transition cursor-pointer"
              >
                <SkipForward className="w-3.5 h-3.5" />
              </button>

              {/* Speed Toggle */}
              <button
                type="button"
                onClick={cycleSpeed}
                title="Cycle Speed"
                className="h-7 px-2 rounded-md bg-[#050B14]/70 hover:bg-[#00F2FE]/20 border border-[#1E3252] hover:border-[#00F2FE] text-[#8E9EB5] hover:text-[#00F2FE] flex items-center gap-1 font-mono text-[11px] font-bold transition cursor-pointer"
              >
                <span className="text-[#00F2FE]">{speed}</span>
                <ChevronDown className="w-3 h-3 text-[#8E9EB5]" />
              </button>
            </div>
          </div>

          {/* Elastic 72-Hour Timeline Scrubber & Marker Ticks */}
          <div className="relative pt-0.5 pb-4">
            <ElasticSlider
              value={timelineVal}
              startingValue={0}
              maxValue={100}
              onChange={(newVal) => {
                setTimelineVal(newVal);
                if (isPlaying) setIsPlaying(false);
              }}
              className="w-full"
            />
            <div className="absolute left-0 right-0 -bottom-1 flex justify-between px-1 pointer-events-none">
              {TIMELINE_MARKERS.map((marker) => (
                <span
                  key={marker.label}
                  className={`font-jetbrains text-[9px] tabular-nums tracking-wider ${
                    marker.label.includes("LIVE")
                      ? "text-[#FF5E36] font-bold"
                      : "text-[#8E9EB5]"
                  }`}
                >
                  {marker.label}
                </span>
              ))}
            </div>
          </div>

          {/* Bottom Coordinates Status Strip */}
          <div className="pt-2 border-t border-[#1E3252]/60 flex items-center text-[11px] font-mono text-[#8E9EB5]">
            <span>📍 {currentCoords.lat.toFixed(3)}° N, {currentCoords.lng.toFixed(3)}° E | Zoom: {zoom.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
