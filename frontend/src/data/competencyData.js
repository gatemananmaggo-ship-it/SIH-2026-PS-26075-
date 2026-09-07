export const COMPETENCY_TAXONOMY = [
  {
    domain: "Radar Meteorology",
    code: "RAD-01",
    subSkills: [
      "Dual-Polarization Hydrometeor Classification",
      "Doppler Velocity De-aliasing",
      "QPE & Rain Gauge Inversion",
      "Hardware Maintenance & Solar Sunscan",
      "Severe Squall Line Nowcasting"
    ],
    requiredExperienceYears: 5,
    criticality: "High (Aviation & Disaster Early Warning)"
  },
  {
    domain: "Numerical Weather Prediction (NWP)",
    code: "NWP-02",
    subSkills: [
      "4D-Var / EnKF Data Assimilation",
      "HPC Parallelization (MPI/OpenMP)",
      "WRF / Unified Model Physics Schemes",
      "Ensemble Spread vs Skill Diagnostics",
      "Tropical Convection Parameterization"
    ],
    requiredExperienceYears: 7,
    criticality: "Critical (National Monsoon Forecast)"
  },
  {
    domain: "Satellite Oceanography & Hazard Modeling",
    code: "OCN-03",
    subSkills: [
      "WAVEWATCH III Spectral Modeling",
      "ADCIRC Storm Surge & Inundation",
      "Tsunami Travel Time Calculation",
      "Swell Surge (Kallakkadal) Forecasting",
      "Satellite Altimeter Data Calibration"
    ],
    requiredExperienceYears: 6,
    criticality: "High (Coastal Resilience & Fishermen Safety)"
  },
  {
    domain: "Satellite Remote Sensing & Imagery",
    code: "SAT-04",
    subSkills: [
      "INSAT-3D/3DR Multispectral Channel Analysis",
      "Atmospheric Motion Vector (AMV) Derivation",
      "Cloud Top Brightness Temperature Tracking",
      "Rapid Scan Mode Deep Convection Monitoring"
    ],
    requiredExperienceYears: 4,
    criticality: "High (Real-time Tropical Cyclone Tracking)"
  },
  {
    domain: "Seismology & Solid Earth Geophysics",
    code: "SEIS-05",
    subSkills: [
      "SeisComP3 Real-time Phase Picking",
      "Earthquake Hypocenter Localization",
      "Broadband Seismometer Network Calibration",
      "Tsunami Warning Bulletin Generation"
    ],
    requiredExperienceYears: 5,
    criticality: "Critical (Disaster Management Authority)"
  }
];

export const MOCK_TRAINER_CANDIDATES = [];

export const REGIONAL_IMD_CENTERS = [
  { name: "RMC New Delhi (HQ)", trainees: 480, completionRate: 96, activeCourses: 18, color: "#0e8ce6" },
  { name: "RMC Pune (Training Division)", trainees: 620, completionRate: 98, activeCourses: 24, color: "#0284c7" },
  { name: "RMC Kolkata (Eastern Region)", trainees: 340, completionRate: 91, activeCourses: 14, color: "#10b981" },
  { name: "RMC Chennai (Southern Region)", trainees: 410, completionRate: 94, activeCourses: 16, color: "#f59e0b" },
  { name: "RMC Mumbai (Western Region)", trainees: 380, completionRate: 92, activeCourses: 15, color: "#8b5cf6" },
  { name: "RMC Guwahati (North-East)", trainees: 290, completionRate: 89, activeCourses: 12, color: "#ec4899" }
];
