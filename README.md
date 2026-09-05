 **SIH 2026 — Problem Statement SIH26070**
 Team: **Hexa-Minds**

## 1. Project Overview

Cyclone-X is an AI/ML decision-support platform for tropical cyclone identification, classification and prediction using multi-source satellite and meteorological data.

**Core pipeline:** Observe → Analyse → Predict → Validate → Warn → Protect

The system combines satellite imagery, historical cyclone tracks and atmospheric/environmental data with computer vision, temporal deep learning, uncertainty estimation, explainable AI and a user-facing application.

## 2. Objectives

### Core
- Detect tropical cyclones from satellite imagery.
- Identify cyclone center/structure where feasible.
- Classify cyclone stage/category.
- Predict track for 24/48/72 hours.
- Predict intensity evolution for 24/48/72 hours.
- Detect potential Rapid Intensification (RI).
- Estimate confidence/uncertainty.
- Explain predictions with XAI.
- Provide interactive maps and early-warning information.

### Advanced
- Multi-source satellite + atmospheric/oceanic fusion.
- Historical backtesting.
- Risk visualization.
- Optional evacuation/resource-planning research modules.
- Continuous model improvement.

This is an **AI-assisted decision-support/research prototype**, not a replacement for official meteorological agencies.

## 3. End-to-End Methodology


MULTI-SOURCE DATA
HURSAT | IBTrACS | ERA5 | INSAT | Optional GPM/ASCAT
        ↓
DATA PREPROCESSING & QUALITY CONTROL
Cleaning | Geospatial Alignment | Temporal Alignment | Resampling | Normalization
        ↓
FEATURE ENGINEERING & MULTIMODAL FUSION
Spatial | Temporal | Atmospheric | Oceanic | Satellite Features
        ↓
AI / ML MODELING
CNN / ViT | ConvLSTM | Transformer | Multimodal Fusion
        ↓
CYCLONE ANALYSIS
Detection | Classification | Track | Intensity | RI
        ↓
VALIDATION & TRUST
Metrics | Historical Backtesting | Confidence | XAI
        ↓
BACKEND
FastAPI | MongoDB | Redis
        ↓
FLUTTER APPLICATION
Maps | Forecasts | Alerts | Risk | Explainability
        ↓
DECISION SUPPORT & EARLY WARNING
        ↺
New data → Retraining → Improvement


## 4. Dataset Strategy

Do not download every possible dataset at the beginning.

### Core datasets

**1. IBTrACS** — historical cyclone tracks, intensity, time, location and storm metadata.  
Official: https://www.ncei.noaa.gov/products/international-best-track-archive  
Direct data directory: https://www.ncei.noaa.gov/data/international-best-track-archive-for-climate-stewardship-ibtracs/v04r01/

**2. HURSAT-B1** — historical tropical cyclone satellite imagery for detection, classification and structure analysis.  
Official: https://www.ncei.noaa.gov/products/hurricane-satellite-data

**Important:** NetCDF is a **file format**, not a dataset. HURSAT is the dataset collection and its files are distributed in NetCDF format.

**3. ERA5** — hourly atmospheric/reanalysis context such as SST, wind, pressure, humidity and related variables.  
Official: https://cds.climate.copernicus.eu/datasets/reanalysis-era5-single-levels

### Additional sources after the core pipeline works

- INSAT-3D/3DR: https://www.mosdac.gov.in/insat-3dr
- IMD/RSMC New Delhi: https://rsmcnewdelhi.imd.gov.in/
- GPM rainfall
- ASCAT/SCATSAT winds
- Sentinel-1/2 for post-event damage assessment
- Other microwave products
- NWP guidance such as GFS/WRF where accessible and appropriate

## 5. Dataset Construction

We will construct synchronized samples instead of training on random files.

IBTrACS
Storm ID + Time + Lat/Lon + Wind + Pressure
                  │
          ┌───────┴────────┐
          ↓                ↓
       HURSAT             ERA5
    Satellite image     Environment
          └───────┬────────┘
                  ↓
        Synchronized sample
                  ↓
             ML dataset


A dataset index should contain fields such as:
storm_id
timestamp
latitude
longitude
satellite_image_path
wind_speed
pressure
cyclone_stage
sst
environmental_features
basin
lead_time


The exact fields depend on the selected source data.

### Synchronization rules

1. Build a storm catalog from IBTrACS.
2. Start with roughly 10–30 storms for the proof of concept.
3. Match HURSAT observations by time and location.
4. Match ERA5 observations to the same time/location.
5. Perform quality control.
6. Create `data/index/dataset_index.csv`.
7. Visualize 20–50 valid synchronized samples before model training.

## 6. Repository Structure

cyclone-x/
├── README.md
├── LICENSE
├── .gitignore
├── .env.example
├── requirements.txt
├── docker-compose.yml
│
├── data/
│   ├── raw/
│   │   ├── ibtracs/
│   │   ├── hursat/
│   │   └── era5/
│   ├── interim/
│   │   ├── synchronized/
│   │   └── quality_checked/
│   ├── processed/
│   │   ├── images/
│   │   ├── sequences/
│   │   └── features/
│   └── index/
│       ├── storm_catalog.csv
│       └── dataset_index.csv
│
├── notebooks/
├── src/
│   ├── data/
│   │   ├── download/
│   │   ├── readers/
│   │   ├── preprocessing/
│   │   ├── synchronization/
│   │   └── quality_control/
│   ├── features/
│   ├── models/
│   │   ├── detection/
│   │   ├── classification/
│   │   ├── track/
│   │   ├── intensity/
│   │   ├── rapid_intensification/
│   │   └── fusion/
│   ├── evaluation/
│   ├── explainability/
│   └── utils/
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── api/
│   │   ├── models/
│   │   ├── services/
│   │   └── database/
│   └── tests/
│
├── flutter_app/
├── configs/
├── models/
│   ├── checkpoints/
│   └── exported/
├── scripts/
│   ├── download_data.py
│   ├── build_dataset.py
│   ├── train.py
│   ├── evaluate.py
│   └── inference.py
├── docs/
└── tests/


Do not commit large raw satellite datasets to GitHub. Commit code, metadata, indexes, configuration and documentation; use appropriate storage for large data.

## 7. AI/ML Development

### Stage 1 — Detection
Start with a measurable baseline.

Possible approaches:
- CNN classifier
- YOLO/object detection
- U-Net/segmentation

Goal:
Satellite image → Cyclone present? → Yes / No


### Stage 2 — Classification
Possible models:
- ResNet
- EfficientNet
- ConvNeXt
- ViT

Output cyclone stage/category according to the chosen official labeling system.

### Stage 3 — Track prediction
Input:
- Past satellite frames
- Past positions
- Environmental context

Models:
- ConvLSTM
- 3D CNN
- Transformer
- Spatio-temporal Transformer

Output:
- 24h position
- 48h position
- 72h position

### Stage 4 — Intensity prediction
Possible baseline:
- XGBoost
- LightGBM
- MLP

Advanced:
- LSTM
- Transformer
- Multimodal temporal model

Possible inputs:
- Satellite features
- Current intensity
- SST
- Wind/environmental context
- Humidity and related variables

### Stage 5 — Multimodal fusion

```text
Satellite → Vision Encoder ─┐
Environment → Feature Encoder ├→ Fusion Model → Prediction
Track → Temporal Encoder ────┘
```

Start with simple feature fusion before attempting complex attention architectures.

### Stage 6 — Rapid Intensification
Estimate the probability of rapid strengthening using recent intensity trend, satellite structure and environmental features.

Example output:

RI Risk: HIGH
Probability: XX%
Confidence: XX%


Do not claim operational accuracy without proper validation.

## 8. Validation

**Critical rule: split by storm, not by random image.**

Training storms
      ↓
Validation storms
      ↓
Unseen test storms

### Metrics

Detection:
- Precision, Recall, F1, mAP/IoU where appropriate

Classification:
- Accuracy, Precision, Recall, F1, Confusion Matrix

Track:
- MAE
- Haversine/position error
- 24/48/72h track error

Intensity:
- MAE
- RMSE
- Bias

Probabilistic outputs:
- Calibration
- Reliability
- Brier score where appropriate

## 9. Explainable AI & Uncertainty

Possible XAI:
- Grad-CAM
- Attention visualization
- SHAP
- Feature importance

Example:

Prediction: Very Severe Cyclonic Storm
Confidence: 91%
Important visual region: Cyclone eye/eyewall
Important environmental features: SST + wind shear + humidity

Possible uncertainty outputs:
- Confidence score
- Prediction interval
- Ensemble spread
- Track uncertainty cone

## 10. Historical Backtesting

Run the system on historical storms that were not used for training.

Historical storm
      ↓
AI prediction
      ↓
Compare with reference/best-track
      ↓
Calculate error
      ↓
Store results

Dashboard comparison should include:
- Actual track
- Predicted track
- Forecast error
- Actual intensity
- Predicted intensity
- Confidence
- XAI

## 11. Backend

### FastAPI

Suggested API areas:

GET  /health
GET  /cyclones
GET  /cyclones/{id}
GET  /forecast/{id}
GET  /track/{id}
GET  /risk/{id}
GET  /alerts
POST /predict
GET  /explain/{id}

Endpoint names can change during implementation.

### MongoDB

Use MongoDB for persistent application data:

cyclones
predictions
tracks
alerts
risk_maps
model_runs
users

MongoDB is for application persistence, not model training.

### Redis

Use Redis for fast-changing/cache data:

- Latest cyclone prediction
- Latest position
- Active alerts
- Frequently requested forecast data
- Short-lived API cache

Concept:

AI → FastAPI → Redis → Flutter
          └→ MongoDB

MongoDB remains the persistent store.

## 12. Flutter Application

Main screens:

### Dashboard
- Active cyclones
- Current position
- Intensity
- Risk level
- Alerts

### Cyclone Details
- Satellite image
- Location
- Category
- Intensity
- Track

### Forecast
- 24h / 48h / 72h

### Risk Map
- Predicted track
- Uncertainty cone
- Rainfall/storm-surge risk where supported

### Explainability
- Grad-CAM/attention map
- Feature importance
- Confidence

### Alerts
- RI warning
- High-risk region
- Forecast update

## 13. Deployment

### Local development

Local Machine
├── Python AI
├── FastAPI
├── MongoDB
├── Redis
└── Flutter

### Cloud/demo deployment

Cloud/GPU Server
├── AI Inference Service
├── FastAPI
├── MongoDB
├── Redis
└── Monitoring
        ↓
   Flutter Client

Use Docker for reproducible deployment.

Possible deployment targets:
- AWS
- Google Cloud
- Other suitable GPU/cloud infrastructure

Do not containerize everything before the local pipeline works.

## 14. Docker

Possible services:

ai-service
backend
mongodb
redis
flutter-web

Development:

docker compose up --build

## 15. Technology Stack

| Layer | Technology |
|---|---|
| Language | Python |
| ML | PyTorch |
| Data | xarray, netCDF4, pandas, NumPy |
| Geospatial | GeoPandas, Rasterio |
| Satellite processing | Satpy/GDAL where required |
| Models | CNN, ViT, ConvLSTM, Transformer |
| Classical ML | XGBoost / LightGBM |
| XAI | Grad-CAM, SHAP |
| Backend | FastAPI |
| Database | MongoDB |
| Cache | Redis |
| App | Flutter |
| Containerization | Docker |
| Cloud | AWS/GCP or equivalent |
| Version Control | Git/GitHub |

## 16. Git Workflow

Use feature branches.

git clone <repository-url>
cd cyclone-x

git checkout -b feature/dataset-pipeline

git status
git add .
git commit -m "Add dataset synchronization pipeline"
git push -u origin feature/dataset-pipeline

Suggested branches:

main
develop
feature/data-pipeline
feature/detection
feature/classification
feature/track-prediction
feature/intensity
feature/ri
feature/xai
feature/backend
feature/flutter
feature/deployment

Suggested commit style:

feat: add IBTrACS loader
feat: add HURSAT reader
feat: synchronize satellite and track data
feat: add cyclone classification baseline
feat: add track prediction model
feat: add RI prediction module
feat: add FastAPI prediction endpoint
feat: add MongoDB persistence
feat: add Redis prediction cache
feat: add Flutter cyclone map
fix: correct timestamp alignment
fix: handle missing satellite frames
docs: update dataset workflow

## 17. Environment Setup


python -m venv .venv

Windows:

.venv\Scripts ctivate

Linux/macOS:

source .venv/bin/activate

Install:


pip install -r requirements.txt

Run backend during development:

uvicorn backend.app.main:app --reload

## 18. Environment Variables

Create .env locally:

MONGODB_URI=mongodb://localhost:27017
MONGODB_DATABASE=cyclonex
REDIS_URL=redis://localhost:6379
API_HOST=0.0.0.0
API_PORT=8000
MODEL_PATH=models/exported/model.pt

Never commit real credentials. Commit only .env.example.

## 19. Experiment Tracking

Record:

Experiment ID
Dataset version
Storm split
Model
Input variables
Hyperparameters
Training date
Metrics
Checkpoint
Notes

Example:

EXP-001
Model: EfficientNet
Data: HURSAT + IBTrACS
Storms: 20
Split: by storm
Metric: F1 = ...
Notes: baseline

## 20. 8-Week Roadmap

### Week 1 — Data Foundation
IBTrACS + HURSAT + ERA5 synchronization, QC and visualization.

**Deliverable:** first synchronized dataset.

### Week 2 — Detection + Classification
Baseline CNN, detection, stage/category classification and metrics.

**Deliverable:** cyclone recognition model.

### Week 3 — Intensity
Intensity labels, feature extraction and baseline/temporal experiments.

**Deliverable:** intensity baseline.

### Week 4 — Track
Sequence construction, ConvLSTM/temporal baseline and 24/48/72h prediction.

**Deliverable:** predicted track.

### Week 5 — Multimodal Fusion
Satellite + ERA5 + historical track fusion.

**Deliverable:** multi-source model.

### Week 6 — Trust Layer
Confidence, uncertainty, Grad-CAM/SHAP and historical backtesting.

**Deliverable:** explainable prediction system.

### Week 7 — Product
FastAPI, MongoDB, Redis, Flutter, maps and alerts.

**Deliverable:** end-to-end prototype.

### Week 8 — Deployment & Demo
Docker, cloud/GPU deployment, optimization, UI polish and SIH demo.

**Deliverable:** deployable prototype.

## 21. Team Responsibilities

Suggested division:

| Role | Responsibility |
|---|---|
| Data Engineer | IBTrACS, HURSAT, ERA5, synchronization, preprocessing, QC |
| Computer Vision | Detection, classification, center/eye/structure analysis |
| Prediction/ML | Track, intensity, temporal models, multimodal fusion |
| Product Engineer | FastAPI, MongoDB, Redis, Flutter, maps |
| AI/Research | RI, uncertainty, XAI, advanced experiments |

One person can cover multiple roles in a small team.

## 22. MVP vs Advanced

### MUST HAVE

IBTrACS
 ↓
HURSAT
 ↓
Preprocessing
 ↓
Detection
 ↓
Classification
 ↓
Track + Intensity baseline
 ↓
Dashboard

### SHOULD HAVE

- ERA5 fusion
- Confidence
- XAI
- Rapid Intensification
- Historical backtesting

### OPTIONAL / FUTURE

- Storm surge
- GPM rainfall risk
- Evacuation optimization
- Relief logistics
- Post-event damage assessment
- Edge/offline inference
- SMS/USSD fallback
- Cyclone digital twin

**Do not sacrifice the MVP to implement every advanced feature.**

## 23. Safety & Scientific Integrity

1. Never claim operational forecasting capability without validation.
2. Never claim 100% accuracy.
3. Never claim superiority over official agencies without rigorous evidence.
4. Distinguish historical backtesting from real-time forecasting.
5. Never commit API keys or credentials.
6. Do not commit huge raw datasets to Git.
7. Prevent data leakage by splitting by storm.
8. Record model and dataset versions.
9. Present the system as AI-assisted decision support.
10. Use official reference/best-track data for evaluation where appropriate.

## 24. Immediate First Milestone

**Do not start with Flutter, MongoDB, Redis, YOLO, Transformer or the final dashboard.**

First prove:

IBTrACS
   +
HURSAT
   +
ERA5
   ↓
SYNCHRONIZED DATASET
   ↓
20–50 VALID VISUALIZED SAMPLES

Only after this works should the first baseline model be trained.

## 25. Future Advanced Modules

### Multi-Hazard Risk

Cyclone Track + Intensity
        +
Rainfall
        +
Storm Surge
        ↓
Combined Risk Map

### Evacuation/Relief Research

Use predicted track + population + road/safe-zone information with graph search or optimization to investigate evacuation/resource planning.

### Post-Event Damage

Before Image + After Image
          ↓
     Change Detection
          ↓
     Damage Heatmap
          ↓
     Relief Prioritization
          ↓
     Model/Workflow Feedback

### Edge/Offline Resilience

Later research may include quantized models, local caching and low-connectivity alert mechanisms.

## 26. Final Product Vision

🛰️ Earth Observation
        ↓
🧠 Multimodal AI
        ↓
🌪️ Cyclone Intelligence
        ↓
📈 Track + Intensity
        ↓
⚡ Rapid Intensification
        ↓
🎯 Confidence + Uncertainty
        ↓
🔍 Explainable AI
        ↓
🗺️ Risk + Early Warning
        ↓
📱 Flutter Decision Support

### Engineering principle

> **Build the simplest scientifically valid system first. Measure it. Understand its failures. Then add complexity.**

Development order:

**Data → Baseline → Evaluation → Fusion → Advanced AI → Backend → App → Deployment**

## 27. References

- NOAA/NCEI IBTrACS: https://www.ncei.noaa.gov/products/international-best-track-archive
- NOAA/NCEI HURSAT: https://www.ncei.noaa.gov/products/hurricane-satellite-data
- NOAA/NCEI ADT-HURSAT: https://www.ncei.noaa.gov/products/advanced-dvorak-technique-hurricane-satellite
- Copernicus/ECMWF ERA5: https://cds.climate.copernicus.eu/datasets/reanalysis-era5-single-levels
- ISRO/MOSDAC INSAT-3DR: https://www.mosdac.gov.in/insat-3dr
- IMD/RSMC New Delhi: https://rsmcnewdelhi.imd.gov.in/

---

# 🌪️ CYCLONE-X

**OBSERVE • ANALYSE • PREDICT • WARN • PROTECT**

**Hexa-Minds | SIH 2026 | SIH26070**
