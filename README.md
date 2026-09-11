<p align="center">
  <img src="public/logo.png" alt="CYTORN Logo" width="120" />
</p>

<h1 align="center">🌪️ CYTORN (TCAPS)</h1>
<h3 align="center">Tropical Cyclone AI Prediction & Monitoring System</h3>

<p align="center">
  <b>Smart India Hackathon (SIH 2026)</b> • <i>Team Hexa-Minds</i><br />
  In collaboration with Ministry of Earth Sciences (MoES) / IMD / ISRO
</p>

<p align="center">
  <a href="https://github.com/Sohan521-eng/HEXAMINDS-SIH">
    <img src="https://img.shields.io/badge/GitHub-HEXAMINDS--SIH-00F2FE?style=for-the-badge&logo=github&logoColor=black" alt="GitHub Repository" />
  </a>
  <img src="https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TailwindCSS-v4-38BDF8?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Status-Operational-10E7A2?style=for-the-badge" alt="Operational" />
</p>

---

## 📌 Problem Statement
> *"To develop an Artificial Intelligence (AI) / Machine Learning (ML) based system for identification, classification, and prediction of different tropical cyclone patterns using multi-source satellite data."*

**CYTORN** synthesizes geostationary satellite telemetry (INSAT-3D/3DR, Oceansat-3 scatterometer winds, and NOAA GOES datasets) with deep learning architectures to automate cyclone intensity classification, rapid intensification prediction, 120-hour track forecasting, and human-interpretable Explainable AI (Grad-CAM).

---

## 🚀 Key Features

- **Multi-Source Remote Sensing Studio**: Interactive multi-spectral channel viewer (TIR-1, TIR-2, MIR, VIS, WV) with automated Dvorak curved-band fitting and Grad-CAM feature attribution heatmaps.
- **Physics-Informed Neural Networks (PINNs)**: 120-hour cyclogenesis trajectory cone forecasting constrained by Navier-Stokes hydrodynamic equations.
- **Mission Control Command Dashboard**: Real-time geospatial mapping canvas powered by MapLibre GL and Deck.gl with cyclone eye-wall parameter telemetry.
- **WMO / IMD 4-Stage Warning Hub**: Automated multi-tier disaster alerting (Cyclone Watch, Alert, Warning, Post-Landfall Outlook).
- **Interactive XAI Assistant**: Context-aware natural language meteorological assistant powered by physics-informed explainability.
- **Glassmorphic Cyber Abyss Design System**: 60-30-10 color balance adhering to `COLOR_THEME.md` with WebGL/OGL procedural graphics and GSAP physics.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/) + React 19 + TypeScript
- **Styling**: Tailwind CSS v4 + Vanilla CSS Design Tokens
- **Animations & Physics**: GSAP 3.15 + Framer Motion 13 + OGL WebGL Shaders
- **Mapping & GIS**: MapLibre GL + Deck.gl + React Map GL
- **Data Visualization**: Three.js + React Three Fiber + Recharts
- **State Management**: Zustand 5

---

## ⚡ Quick Start

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Sohan521-eng/HEXAMINDS-SIH.git
   cd HEXAMINDS-SIH
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Launch the development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📂 Repository & Links

- **GitHub Repository**: [https://github.com/Sohan521-eng/HEXAMINDS-SIH](https://github.com/Sohan521-eng/HEXAMINDS-SIH)
- **Frontend Architecture Report**: [`CYTORN_FRONTEND_REPORT.md`](./CYTORN_FRONTEND_REPORT.md)
- **Color Theme Specification**: [`COLOR_THEME.md`](./COLOR_THEME.md)
- **Typography Catalog**: [`TEXT_TYPES.md`](./TEXT_TYPES.md)

---

<p align="center">
  <sub>© 2026 CYTORN Platform • Developed with 💙 by <b>Hexa-Minds</b> for Smart India Hackathon 2026</sub>
</p>
