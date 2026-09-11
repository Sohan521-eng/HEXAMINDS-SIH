# 🌪️ CYCLO-AI: 3D Interactive Hero Section Technical Specification

**Target Location:** Landing Page (`/`) Hero Section  
**Engine:** Three.js / WebGL / Custom GLSL Shaders  
**Target Performance:** 60+ FPS (Desktop & Mobile)

---

## 📑 Table of Contents
1. [Visual Concept & Thematic Core](#1-visual-concept--thematic-core)
2. [Interactive & "Movable" User Controls](#2-interactive--movable-user-controls)
3. [Shader & Particle Architecture (60+ FPS Optimization)](#3-shader--particle-architecture-60-fps-optimization)
4. [Glassmorphic HUD Overlay Specification](#4-glassmorphic-hud-overlay-specification)
5. [Implementation Strategy for Three.js](#5-implementation-strategy-for-threejs)

---

## 1. Visual Concept & Thematic Core

```
                    [Orbital Satellite (INSAT-3D)]
                                  │
                          (Scanning Laser Cone)
                                  ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        3D Photorealistic Earth                         │
│                                                                        │
│                🌀 Cyclone Vortex (Eye + Spiral Bands)                  │
│                     ─── Atmospheric Particle Streamlines ───           │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

* **3D Earth Globe:** Centered over the North Indian Ocean basin (Bay of Bengal / Arabian Sea).
* **Procedural Cyclone Vortex:** A dynamically swirling storm with a defined clear eye wall and logarithmic spiral rainbands.
* **Atmospheric Wind Streamlines:** Thousands of GPU-accelerated wind particles swirling into the low-pressure center to demonstrate cyclonic inflow and upper-level anticyclonic outflow.
* **Orbital Satellite Scanning Beam:** An animated satellite (INSAT-3D/GOES) in an orbital trajectory, projecting a glowing pulse/cone down onto the cyclone eye to visualize real-time AI imagery ingestion.

---

## 2. Interactive & "Movable" User Controls

* **Inertial 360° Drag & Orbit:** Users and evaluators can click-and-drag (or swipe on touchscreens) to rotate and inspect the Earth and storm system from any angle.
* **Cursor Parallax & Depth:** Subtle floating camera repositioning following mouse movement on the screen.
* **Interactive Hotspots:** Clickable glowing markers on the storm center (Eye) and outer bands displaying instant AI telemetry (*Central Pressure: 942 hPa*, *T-Number: T5.5*, *Vmax: 185 km/h*).
* **Zoom Constraint:** Bounded scroll-wheel / pinch zoom to ensure the globe remains visually balanced within the viewport.

---

## 3. Shader & Particle Architecture (60+ FPS Optimization)

* **GPU-Instanced Particles:** All wind particles are computed on the GPU using custom **GLSL Vertex and Fragment Shaders** via an instanced buffer geometry, avoiding CPU bottlenecks.
* **Rayleigh Atmospheric Glow:** Atmospheric rim lighting rendered via a lightweight custom Fresnel shader instead of expensive post-processing bloom.
* **Procedural Mathematical Noise:** Logarithmic spiral formulas and Simplex/Curl noise create the cloud dynamics without needing heavy 3D asset downloads.
* **Adaptive Level of Detail (LOD):** Automatically scales particle counts (e.g., 5,000 on mobile $\rightarrow$ 25,000 on desktop) based on device capabilities.

---

## 4. Glassmorphic HUD Overlay Specification

Floating translucent badges positioned around the 3D viewport using the master color tokens (`#0F1B2F` base with `#00F2FE` cyan borders):

```
┌───────────────────────────────────────┐
│ 🛰️ SATELLITE STREAM: ACTIVE          │
│ Sensor: INSAT-3DR TIR-1 (10.8 µm)     │
│ Refresh: Real-time Live Feed          │
└───────────────────────────────────────┘
                     ┌───────────────────────────────────────┐
                     │ 🌀 AI PATTERN: CURVED SPIRAL BAND     │
                     │ Confidence: 97.2% | Dvorak: T-4.5     │
                     │ Status: Rapid Intensification (RI)    │
                     └───────────────────────────────────────┘
```

* **Hero Typography Overlay:** High-contrast headline (*"AI-Powered Intelligence for Tropical Cyclone Identification & Prediction"*) with glassmorphic CTA buttons (*"Launch Command Dashboard"* and *"Analyze Satellite Feed"*).

---

## 5. Implementation Strategy for Three.js

* **Directory:** `/src/components/hero/`
  * `GlobeCanvas.js` — Core Three.js Scene, Camera, WebGLRenderer, OrbitControls setup.
  * `AtmosphereShader.js` — GLSL Vertex and Fragment shaders for Rayleigh scattering.
  * `CycloneParticles.js` — GPU particle system for cyclonic streamlines.
  * `SatelliteOrbit.js` — Orbital path geometry and animated scanner cone.
  * `HeroHUD.js` — Glassmorphic floating HTML/CSS overlay badges.

---
*Maintained as the official 3D Hero specification for CYCLO-AI (SIH 2026).*
