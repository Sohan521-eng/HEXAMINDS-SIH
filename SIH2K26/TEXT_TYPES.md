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
│ 12. DM Sans          │ Minimalist Sans        │ 400, 500          │ Secondary clean product text                 │
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

## 💻 4. Technical Implementation & CSS Tokens

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
  --font-dm: 'DM Sans', sans-serif;
  --font-jetbrains: 'JetBrains Mono', monospace;
  --font-share-mono: 'Share Tech Mono', monospace;
}
```
