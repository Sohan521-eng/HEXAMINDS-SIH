/**
 * CYTORN / TCAPS 5-Palette Design System Tokens & Programmatic Color Constants
 * Reference: SIH2K26/COLOR_THEME.md
 */

export const PALETTES = {
  // 🌌 Palette 1: Oceanic Cyber Abyss (Master Command Theme)
  abyss: {
    base: "#050B14",
    surface: "#0F1B2F",
    elevated: "#16253D",
    border: "#1E3252",
    cyan: "#00F2FE",
    coral: "#FF5E36",
    mint: "#10E7A2",
    textPrimary: "#FFFFFF",
    textMuted: "#8E9EB5",
  },

  // 🛰️ Palette 2: Multi-Spectral Thermal IR (Remote Sensing & Pattern Studio)
  thermalIR: {
    deepVoid: "#0B0E17",
    coldSlate: "#1C2237",
    atmosphericCyan: "#22D3EE",
    eyewallMagenta: "#D946EF",
    coreRed: "#EF4444",
  },

  // 🏛️ Palette 3: Institutional Oceanic Precision (Gov Reports & Light Mode)
  institutional: {
    pristineMist: "#F8FAFC",
    pureWhite: "#FFFFFF",
    maritimeNavy: "#0A2540",
    pacificAzure: "#0284C7",
    hazardAmber: "#EA580C",
  },

  // ⚠️ Palette 4: WMO / IMD 4-Stage Alert Ecosystem (Early Warning Hub)
  imdAlerts: {
    charcoalBase: "#0F141C",
    stage1Watch: "#10B981",    // 72h Advisory (Green)
    stage2Alert: "#F59E0B",    // 48h Precautionary (Amber)
    stage3Warning: "#F97316",  // 24h Threat Action (Orange)
    stage4Landfall: "#DC2626", // <12h Evacuation/Emergency (Red)
  },

  // 🧠 Palette 5: Neural AI Fusion (Explainable AI & ViT Models)
  neuralAI: {
    void: "#070A12",
    surface: "#13192B",
    attentionIndigo: "#6366F1",
    detectionMint: "#00FFA3",
    divergenceRose: "#FB7185",
  },
} as const;

export type IMDAlertStage = 1 | 2 | 3 | 4;

/**
 * Returns color tokens for the corresponding IMD 4-stage alert tier
 */
export function getIMDAlertColor(stage: IMDAlertStage) {
  switch (stage) {
    case 1:
      return { name: "Pre-Cyclone Watch", color: PALETTES.imdAlerts.stage1Watch, bgClass: "bg-emerald-500/10", borderClass: "border-emerald-500/30", textClass: "text-emerald-400" };
    case 2:
      return { name: "Cyclone Alert", color: PALETTES.imdAlerts.stage2Alert, bgClass: "bg-amber-500/10", borderClass: "border-amber-500/30", textClass: "text-amber-400" };
    case 3:
      return { name: "Cyclone Warning", color: PALETTES.imdAlerts.stage3Warning, bgClass: "bg-orange-500/10", borderClass: "border-orange-500/30", textClass: "text-orange-400" };
    case 4:
      return { name: "Landfall Red Alert", color: PALETTES.imdAlerts.stage4Landfall, bgClass: "bg-rose-600/15", borderClass: "border-rose-500/40", textClass: "text-rose-400 animate-pulse" };
  }
}
