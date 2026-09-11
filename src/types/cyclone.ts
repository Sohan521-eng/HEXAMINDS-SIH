/**
 * Type definitions for Cyclone tracking, meteorological parameters, and forecasting.
 */

export type CycloneCategory =
  | "Depression"
  | "Deep Depression"
  | "Cyclonic Storm"
  | "Severe Cyclonic Storm"
  | "Very Severe Cyclonic Storm"
  | "Extremely Severe Cyclonic Storm"
  | "Super Cyclonic Storm"
  | "Category 1"
  | "Category 2"
  | "Category 3"
  | "Category 4"
  | "Category 5";

export interface GeoCoordinate {
  latitude: number;
  longitude: number;
}

export interface TrackPoint extends GeoCoordinate {
  timestamp: string;
  windSpeedKts: number;
  centralPressureHpa: number;
  category: CycloneCategory;
  confidenceScore?: number;
}

export interface ForecastTrack {
  cycloneId: string;
  modelName: string;
  generatedAt: string;
  points: TrackPoint[];
  uncertaintyCone?: {
    radiusKm: number;
    center: GeoCoordinate;
  }[];
}

export interface WeatherParams {
  seaSurfaceTemperatureCelsius: number;
  centralPressureHpa: number;
  maximumSustainedWindKmh: number;
  windGustsKmh: number;
  verticalWindShearKts: number;
  relativeHumidityPercent: number;
  cloudTopTemperatureCelsius: number;
}

export interface CycloneData {
  id: string;
  name: string;
  basin: "North Indian Ocean" | "Bay of Bengal" | "Arabian Sea" | string;
  currentCategory: CycloneCategory;
  aiConfidenceScore: number; // 0 - 100%
  currentCoordinates: GeoCoordinate;
  currentParameters: WeatherParams;
  historicalTrack: TrackPoint[];
  predictedTracks: ForecastTrack[];
  lastUpdated: string;
  status: "Active" | "Dissipated" | "Monitoring";
}
