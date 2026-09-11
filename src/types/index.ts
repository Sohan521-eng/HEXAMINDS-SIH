export * from "./cyclone";

export type UserRole = "meteorologist" | "disaster_official" | "public";

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  agency?: string;
  token?: string;
}

export interface SatelliteLayerOption {
  id: string;
  name: string;
  type: "infrared" | "water-vapor" | "visible" | "radar-composite" | "wind-vectors";
  opacity: number;
  visible: boolean;
}

