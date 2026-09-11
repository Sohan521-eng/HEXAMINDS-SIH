import { create } from "zustand";
import { CycloneData, SatelliteLayerOption } from "@/types";

interface DashboardState {
  // Active selection
  activeCycloneId: string | null;
  selectedTimestamp: string | null;
  
  // Data cache
  cyclones: CycloneData[];
  isLoading: boolean;
  error: string | null;

  // Geospatial Map settings
  satelliteLayers: SatelliteLayerOption[];
  activeBasin: string;
  showPredictionCone: boolean;
  playbackSpeed: number;
  isPlaying: boolean;

  // Actions
  setActiveCycloneId: (id: string | null) => void;
  setSelectedTimestamp: (timestamp: string | null) => void;
  setCyclones: (cyclones: CycloneData[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  toggleLayerVisibility: (layerId: string) => void;
  setLayerOpacity: (layerId: string, opacity: number) => void;
  setShowPredictionCone: (show: boolean) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setPlaybackSpeed: (speed: number) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  // Default values
  activeCycloneId: null,
  selectedTimestamp: null,
  cyclones: [],
  isLoading: false,
  error: null,
  activeBasin: "North Indian Ocean",
  showPredictionCone: true,
  playbackSpeed: 1,
  isPlaying: false,
  satelliteLayers: [
    { id: "ir", name: "INSAT-3D Infrared (TIR-1)", type: "infrared", opacity: 0.8, visible: true },
    { id: "wv", name: "Water Vapor Channel", type: "water-vapor", opacity: 0.6, visible: false },
    { id: "vis", name: "Visible Optical", type: "visible", opacity: 0.7, visible: false },
    { id: "radar", name: "Doppler Weather Radar Composite", type: "radar-composite", opacity: 0.85, visible: true },
  ],

  // Action implementations
  setActiveCycloneId: (id) => set({ activeCycloneId: id }),
  setSelectedTimestamp: (timestamp) => set({ selectedTimestamp: timestamp }),
  setCyclones: (cyclones) => set({ cyclones }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  toggleLayerVisibility: (layerId) =>
    set((state) => ({
      satelliteLayers: state.satelliteLayers.map((layer) =>
        layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
      ),
    })),
  setLayerOpacity: (layerId, opacity) =>
    set((state) => ({
      satelliteLayers: state.satelliteLayers.map((layer) =>
        layer.id === layerId ? { ...layer, opacity } : layer
      ),
    })),
  setShowPredictionCone: (show) => set({ showPredictionCone: show }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),
}));
