# 🔤 CYCLO-AI: Complete Typography & Text Types Specification (`TEXT_TYPES`)

**Project Topic:**  
> *"To develop an Artificial Intelligence (AI) / Machine Learning (ML) based system for identification, classification, and prediction of different tropical cyclone patterns using multi-source satellite data."*

**Design System Theme:** *Oceanic Cyber Abyss & Aerospace Mission Control (ISRO / IMD / NASA Aesthetic)*  
**Document Version:** `1.0.0 (SIH 2026 Production Specification)`

---

## 📑 Table of Contents
1. [Master Font Catalog & Classification](#-1-master-font-catalog--classification)
2. [The 5 Systematic Typography Systems](#-2-the-5-systematic-typography-systems)
3. [Page-by-Page & Component Typography Mapping](#-3-page-by-page--component-typography-mapping)
   - [3.1 Landing Page & 3D Hero (`/`)](#31-landing-page--3d-hero-)
   - [3.2 Live Geospatial Command Dashboard (`/dashboard`)](#32-live-geospatial-command-dashboard-dashboard)
   - [3.3 AI Satellite Analyzer & Pattern Studio (`/satellite-analyzer`)](#33-ai-satellite-analyzer--pattern-studio-satellite-analyzer)
   - [3.4 Trajectory & Intensity Prediction Center (`/forecast`)](#34-trajectory--intensity-prediction-center-forecast)
   - [3.5 Disaster Early Warning & Coastal Alert Hub (`/alerts`)](#35-disaster-early-warning--coastal-alert-hub-alerts)
   - [3.6 Model Performance & Scientific Archive (`/model-metrics`)](#36-model-performance--scientific-archive-model-metrics)
   - [3.7 Authentication & Role-Based Access (`/login`, `/register`)](#37-authentication--role-based-access-login-register)
   - [3.8 System Settings & Data Connectors (`/settings`)](#38-system-settings--data-connectors-settings)
4. [Technical Implementation & CSS Tokens](#-4-technical-implementation--css-tokens)
5. [Typographic Hierarchy & Engineering Best Practices](#-5-typographic-hierarchy--engineering-best-practices)

---

## 📚 1. Master Font Catalog & Classification

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                             CYCLO-AI MASTER FONT FAMILIES                                        │
├──────────────────────┬────────────────────────┬───────────────────┬──────────────────────────────────────────────┤
│ Font Family          │ Primary Category       │ Weights Used      │ Visual Character & Purpose                   │
├──────────────────────┼────────────────────────┼───────────────────┼──────────────────────────────────────────────┤
│ 1. Orbitron          │ Display / Futuristic   │ 700, 800, 900     │ Hero brand, orbital radar titles             │
│ 2. Rajdhani          │ Tech Sans-Serif        │ 500, 600, 700     │ HUD section labels, metric badges, caps      │
│ 3. Outfit            │ Geometric Neo-Grotesk  │ 600, 700, 800     │ Modern AI studio, sleek SaaS card headings   │
│ 4. Plus Jakarta Sans │ Modern Clean UI Sans   │ 400, 500, 600     │ Dashboard UI, body text, navbars             │
│ 5. JetBrains Mono    │ Monospace / Scientific │ 500, 700          │ Telemetry numbers, coordinates, gauges       │
│ 6. Space Grotesk     │ Scientific Display     │ 600, 700          │ Research module headers, XAI studio          │
│ 7. Inter             │ High-Density Sans      │ 400, 500, 600     │ Data tables, error metrics, benchmark tables │
│ 8. Chakra Petch      │ Tactical Angular Sans  │ 600, 700          │ IMD Stage 1-4 emergency alert banners        │
│ 9. Exo 2             │ Dynamic Velocity Sans  │ 500, 700          │ Evacuation text, tactical summaries          │
│ 10. Share Tech Mono  │ Tactical Terminal Mono │ 400               │ Warning CAP IDs, geo-fenced alert codes      │
│ 11. Syne             │ High-Concept Brand     │ 700, 800          │ High-impact presentation & keynote titles    │
│ 12. Unbounded        │ Ultra-Modern Display   │ 600, 700, 800, 900│ Eye-catching cyber display & hero titles     │
│ 13. DM Sans          │ Minimalist Sans        │ 400, 500          │ Secondary clean product text                 │
│ 14. Magilio          │ Chic Modern Display    │ 400, Regular      │ Curated chic serif, fluid high-contrast curves│
│ 15. Azonix           │ Futuristic Geometric   │ Bold, Regular     │ Modern cyber display, crossbar-less A         │
└──────────────────────┴────────────────────────┴───────────────────┴──────────────────────────────────────────────┘
```

---

## 🎨 2. The 5 Systematic Typography Systems

### System 1: 🚀 Aerospace Mission Control *(NASA / ISRO Satellite Radar)*
* **Role:** Gives an immediate orbital satellite telemetry and command-center feeling.
* **Header / Display:** `Orbitron (font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase)`
* **Labels & Badges:** `Rajdhani (font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase)`
* **Data & Gauges:** `JetBrains Mono (font-weight: 700; font-feature-settings: 'tnum' on)`

### System 2: 💎 Modern Cyber-AI SaaS *(Deep-Tech & Modern Product UI)*
* **Role:** Ultra-clean, modern, sleek, and high-contrast (similar to OpenAI, Linear, Vercel).
* **Headings:** `Outfit (font-weight: 700; letter-spacing: -0.02em)`
* **Body / Descriptions:** `Plus Jakarta Sans (font-weight: 400 / 500; line-height: 1.6)`
* **Badges:** `JetBrains Mono (font-weight: 600)`

### System 3: 🛰️ Deep Space & Scientific Research *(Computational Meteorology)*
* **Role:** Academic AI research platform, satellite data studio, and scientific precision.
* **Module Titles:** `Space Grotesk (font-weight: 700; letter-spacing: -0.02em)`
* **Research Body & Tables:** `Inter (font-weight: 400 / 500; line-height: 1.6)`
* **Model Checkpoints & Weights:** `JetBrains Mono (font-weight: 500)`

### System 4: ⚡ Tactical Early Warning & Velocity *(Disaster Hub & Alert Banners)*
* **Role:** Dynamic, urgent, and high-impact tactical weather operations.
* **Alert Titles:** `Chakra Petch (font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase)`
* **Evacuation Summaries:** `Exo 2 (font-weight: 500; line-height: 1.5)`
* **CAP Warning IDs / Geo-Codes:** `Share Tech Mono (font-weight: 400)`

### System 5: 🪐 Minimalist High-Concept Futuristic *(Keynote & Executive Deck)*
* **Role:** High-concept, ultra-bold, modern AI product aesthetic.
* **Hero Titles:** `Syne (font-weight: 800; letter-spacing: -0.03em)`
* **Body Text:** `DM Sans (font-weight: 400)`
* **Data Stats:** `JetBrains Mono (font-weight: 600)`

---

## 🗺️ 3. Page-by-Page & Component Typography Mapping

### 3.1 Landing Page & 3D Hero (`/`)
* **Logo & System Brand:** `Orbitron 800` (`letter-spacing: 0.06em`)
* **Top Navigation Links:** `Plus Jakarta Sans 600` (`font-size: 14px`)
* **Hero Main Heading (*"AI-POWERED TROPICAL CYCLONE INTELLIGENCE"*):** `Orbitron 800`
* **Hero Subtitle:** `Plus Jakarta Sans 400` (`font-size: 18px; color: rgba(255,255,255,0.75)`)
* **Live Storm Ticker Pill (*"🔴 Active Warning: Cyclone Mocha"*):** `Rajdhani 600`
* **Live Ticker Metrics ($km/h$, $hPa$):** `JetBrains Mono 700`
* **Technology Feature Cards (INSAT-3D Fusion, Physics PINN):** `Outfit 700` (Title) + `Plus Jakarta Sans 400` (Body)
* **Call-to-Action Buttons:** `Rajdhani 700` (`letter-spacing: 0.05em; text-transform: uppercase`)

---

### 3.2 Live Geospatial Command Dashboard (`/dashboard`)
* **Top Bar Storm Selector & Basin Filter:** `Rajdhani 600`
* **Dual Time Clock (UTC & IST):** `JetBrains Mono 700` (`font-feature-settings: 'tnum' on`)
* **Storm Category Badge (*"Very Severe Cyclonic Storm - Cat 3"*):** `Orbitron 700`
* **Telemetry HUD Section Headers (*"TELEMETRY HUD"*):** `Rajdhani 700` (`letter-spacing: 0.08em`)
* **Metric Labels (*"MAX SUSTAINED WINDS"*, *"CENTRAL PRESSURE"*, *"COORDINATES"*):** `Rajdhani 600`
* **Metric Real-time Values ($145\text{ km/h}$, $962\text{ hPa}$, $16.4^\circ\text{N}, 88.2^\circ\text{E}$):** `JetBrains Mono 700`
* **Map Layer Switcher Labels (TIR-1, VIS, WV, SST, Wind Streamlines):** `Plus Jakarta Sans 500`
* **Timeline Scrubber Time Markers ($00:00\text{ UTC}$, $+24\text{h}$):** `JetBrains Mono 600`

---

### 3.3 AI Satellite Analyzer & Pattern Studio (`/satellite-analyzer`)
* **Studio Section Header (*"Multi-Spectral AI Pattern Analyzer"*):** `Space Grotesk 700`
* **Sensor Band Selectors (TIR1, TIR2, MIR, VIS, WV):** `Rajdhani 600`
* **AI Model Selection Dropdown:** `Plus Jakarta Sans 500`
* **Identified Dvorak Pattern (*"Eye Pattern / Curved Band"*):** `Outfit 700`
* **Confidence & Intensity Metrics ($96.4\%$ Confidence, $T4.5$ / $CI 4.5$):** `JetBrains Mono 700`
* **Explainable AI (Grad-CAM) Attention Summary:** `Inter 400` (`line-height: 1.6`)
* **Feature Attribution Bullet Points:** `Inter 400`
* **Model Checkpoint Badge (`v2.4-convnext-vit`):** `JetBrains Mono 500`

---

### 3.4 Trajectory & Intensity Prediction Center (`/forecast`)
* **Forecast Horizon Tabs ($+6h, +12h, +24h, +48h, +72h, +120h$):** `Rajdhani 600`
* **Landfall Countdown Clock ($18\text{h} : 42\text{m} : 10\text{s}$):** `Orbitron 800`
* **Waypoint Coordinates & Forecast Time Stamps:** `JetBrains Mono 600`
* **Intensity Graph Axis Labels & Legends ($V_{max}\text{ knots}$, $P_c\text{ hPa}$):** `Inter 500`
* **NWP Comparison Matrix (AI vs. IMD GFS vs. ECMWF vs. WRF):** `Inter 400 / 500`
* **Rapid Intensification (RI) Probability Bar:** `JetBrains Mono 700`

---

### 3.5 Disaster Early Warning & Coastal Alert Hub (`/alerts`)
* **IMD 4-Stage Warning Titles:** `Chakra Petch 700` (`text-transform: uppercase`)
  - 🟡 **Stage 1 (Yellow):** *Pre-Cyclone Watch (72h)*
  - 🟠 **Stage 2 (Orange):** *Cyclone Alert (48h)*
  - 🔴 **Stage 3 (Red):** *Cyclone Warning (24h)*
  - 🟣 **Stage 4 (Purple):** *Post-Landfall Outlook*
* **Evacuation Summaries & High-Priority Instructions:** `Exo 2 500 / 700`
* **District Impact Data Table (Surge, Rainfall, Wind Gusts):** `Inter 400 / 600`
* **Common Alerting Protocol (CAP) SMS Preview & Geo-Codes:** `Share Tech Mono 400`
* **Official PDF Bulletin Header:** `Chakra Petch 700` + `Exo 2 400`

---

### 3.6 Model Performance & Scientific Archive (`/model-metrics`)
* **Benchmark Historical Storm Selector (*Amphan, Fani, Biparjoy, Mocha*):** `Space Grotesk 600`
* **Track Forecast Distance Error ($<65\text{ km}$ at 24h):** `JetBrains Mono 700`
* **Intensity MAE & RMSE Values ($<8.5\text{ knots}$):** `JetBrains Mono 700`
* **Confusion Matrix Classes & Precision-Recall Legends:** `Inter 500`
* **Dataset & Scientific Training Notes:** `Inter 400` (`line-height: 1.65`)

---

### 3.7 Authentication & Role-Based Access (`/login`, `/register`)
* **Auth Card Header (*"Sign In to CYCLO-AI Command Portal"*):** `Outfit 700`
* **Role Selectors (*Meteorologist / NDMA Official / Public*):** `Rajdhani 600`
* **Form Inputs & Labels:** `Plus Jakarta Sans 500`
* **Official Agency Badge Verification ID:** `JetBrains Mono 500`
* **Submit Action Buttons:** `Rajdhani 700`

---

### 3.8 System Settings & Data Connectors (`/settings`)
* **Settings Category Headers (*"Satellite API Connectors"*, *"AI Engine"*):** `Space Grotesk 600`
* **API Endpoints (`GET /api/v1/cyclone/active`):** `JetBrains Mono 600`
* **JSON Request / Response Code Blocks:** `JetBrains Mono 400`
* **Hardware GPU / VRAM & Latency Gauges ($24\text{ ms}$):** `JetBrains Mono 700`
* **Configuration Toggle Descriptions:** `Plus Jakarta Sans 400`

---

## 💻 4. Technical Implementation & CSS Tokens

### 4.1 Master Google Fonts Bundle Import
Add this single `<link>` to your `index.html` head or load via `next/font/google`:

```html
<!-- Master Google Fonts Bundle for CYCLO-AI -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:ital,wght@0,400;0,600;0,700;1,600&family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400&family=Exo+2:ital,wght@0,400;0,600;0,700;0,800;1,600&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:ital,wght@0,400;0,600;0,700;1,400&family=Orbitron:wght@500;700;800;900&family=Outfit:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Rajdhani:wght@500;600;700&family=Share+Tech+Mono&family=Space+Grotesk:wght@400;500;600;700&family=Syne:wght@600;700;800&display=swap" rel="stylesheet">
```

### 4.2 CSS Design Tokens (`:root`)

```css
:root {
  /* Master Hierarchy Defaults */
  --font-display: 'Orbitron', 'Space Grotesk', -apple-system, sans-serif;
  --font-heading: 'Rajdhani', 'Outfit', sans-serif;
  --font-body: 'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', 'Share Tech Mono', monospace;

  /* Individual Font Family Tokens */
  --font-orbitron: 'Orbitron', sans-serif;
  --font-rajdhani: 'Rajdhani', sans-serif;
  --font-outfit: 'Outfit', sans-serif;
  --font-jakarta: 'Plus Jakarta Sans', sans-serif;
  --font-space: 'Space Grotesk', sans-serif;
  --font-inter: 'Inter', sans-serif;
  --font-chakra: 'Chakra Petch', sans-serif;
  --font-exo: 'Exo 2', sans-serif;
  --font-syne: 'Syne', sans-serif;
  --font-unbounded: 'Unbounded', sans-serif;
  --font-magilio: 'Magilio', serif;
  --font-azonix: 'Azonix', sans-serif;
  --font-dm: 'DM Sans', sans-serif;
  --font-jetbrains: 'JetBrains Mono', monospace;
  --font-share-mono: 'Share Tech Mono', monospace;
}
```

### 4.3 Pre-built CSS Utility Classes

```css
/* System 1: Aerospace Command */
.font-sys-1-title {
  font-family: var(--font-orbitron);
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.font-sys-1-label {
  font-family: var(--font-rajdhani);
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.font-sys-1-telemetry {
  font-family: var(--font-jetbrains);
  font-weight: 700;
  font-feature-settings: 'tnum' on, 'zero' on;
}

/* System 2: Modern Cyber-AI SaaS */
.font-sys-2-heading {
  font-family: var(--font-outfit);
  font-weight: 700;
  letter-spacing: -0.02em;
}

.font-sys-2-body {
  font-family: var(--font-jakarta);
  font-weight: 400;
  line-height: 1.6;
}

/* System 3: Deep Space & Research */
.font-sys-3-heading {
  font-family: var(--font-space);
  font-weight: 700;
  letter-spacing: -0.03em;
}

.font-sys-3-body {
  font-family: var(--font-inter);
  font-weight: 400;
  line-height: 1.6;
}

/* System 4: Tactical Early Warning */
.font-sys-4-alert {
  font-family: var(--font-chakra);
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.font-sys-4-body {
  font-family: var(--font-exo);
  font-weight: 500;
}
```

---

## 📐 5. Typographic Hierarchy & Engineering Best Practices

1. **Tabular Numbers for Telemetry Data:**  
   Always apply `font-feature-settings: 'tnum' on, 'zero' on;` on `JetBrains Mono` when rendering numerical telemetry ($km/h$, $hPa$, coordinates, timers) to prevent layout jumping as digits update.
2. **Uppercase Letter Spacing:**  
   Whenever applying `text-transform: uppercase` on `Orbitron`, `Rajdhani`, or `Chakra Petch`, ensure `letter-spacing: 0.04em` to `0.08em` is added to avoid letter crowding.
3. **High-Density Table Legibility:**  
   Use `Inter` at `12px - 14px` with a `font-weight: 500` for table headers and `400` for row cells.
4. **Contrast & Hierarchy Ratios:**  
   Display titles should use primary high-contrast colors (`#FFFFFF` or neon cyan `#00F0FF`), while body descriptions should use `rgba(255, 255, 255, 0.72)`.
