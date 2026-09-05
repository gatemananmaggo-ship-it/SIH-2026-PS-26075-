export const INITIAL_COURSES = [
  {
    id: "crs-01",
    title: "Advanced Doppler Weather Radar (DWR) Operations & Nowcasting",
    domain: "Radar Meteorology",
    department: "India Meteorological Department (IMD)",
    trainerId: "usr-trainer-01",
    trainerName: "Dr. Rajesh K. Verma",
    trainerRole: "Scientist 'F' & Head, Radar Meteorology",
    level: "Advanced",
    duration: "4 Weeks (32 Hours)",
    enrolledCount: 142,
    rating: 4.9,
    totalRatings: 38,
    thumbnail: "https://images.unsplash.com/photo-1590055531615-f16d36ffe8ec?w=600&auto=format&fit=crop&q=80",
    description: "Comprehensive operational training on dual-polarization Doppler weather radars (S, C, and X-Band), hydrometeor classification, severe squall line detection, and real-time short range convective nowcasting for aviation and disaster warning.",
    prerequisites: ["Basic Physics / Thermodynamics", "Introduction to Atmospheric Radar"],
    featured: true,
    modules: [
      {
        id: "mod-01",
        title: "Module 1: Principles of Radar Polarimetry & Signal Processing",
        duration: "45 mins",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        summary: "Fundamental equations of polarimetric radar: Differential Reflectivity (ZDR), Differential Phase (PhiDP), and Correlation Coefficient (RhoHV).",
        completed: true,
        resources: [
          { name: "Polarimetry_Fundamentals_Manual.pdf", size: "3.8 MB", type: "pdf" },
          { name: "Radar_Pulse_Equation_Notes.pptx", size: "5.2 MB", type: "pptx" },
          { name: "DWR_Sample_Volume_Scan.nc", size: "14.1 MB", type: "dataset" }
        ]
      },
      {
        id: "mod-02",
        title: "Module 2: Hydrometeor Classification (HCA) & Heavy Rain Estimation",
        duration: "55 mins",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        summary: "Applying fuzzy logic algorithms to identify hail, graupel, biological scatterers, and supercooled liquid water in severe storms.",
        completed: true,
        resources: [
          { name: "HCA_Fuzzy_Membership_Functions.pdf", size: "2.4 MB", type: "pdf" },
          { name: "Quantitative_Precipitation_Estimation_QPE.pdf", size: "4.1 MB", type: "pdf" }
        ]
      },
      {
        id: "mod-03",
        title: "Module 3: Nowcasting Severe Thunderstorms & Microbursts",
        duration: "60 mins",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        summary: "Velocity azimuth display (VAD), divergence signatures, hook echoes, and Bow Echo storm tracking for terminal aerodrome forecasts (TAF).",
        completed: true,
        resources: [
          { name: "Aviation_Nowcasting_Standard_Operating_Procedure.pdf", size: "1.9 MB", type: "pdf" },
          { name: "Severe_Storm_Case_Study_Kolkata_Squall.pptx", size: "8.5 MB", type: "pptx" }
        ]
      },
      {
        id: "mod-04",
        title: "Module 4: Operational Radar Calibration & Hardware Diagnostics",
        duration: "40 mins",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        summary: "Solar sunscan calibration, receiver sensitivity checks, Klystron/Magnetron transmitter monitoring, and antenna pedestal maintenance.",
        completed: false,
        resources: [
          { name: "Radar_Maintenance_Checklist_IMD.pdf", size: "3.1 MB", type: "pdf" }
        ]
      }
    ],
    assessmentId: "quiz-01",
    feedbacks: [
      {
        userName: "Dr. Ananya Sharma",
        userAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
        rating: 5,
        date: "2024-06-19",
        comment: "Superb hands-on sessions on Dual-Polarization radar data interpretation. The practical examples of squall line detection were invaluable."
      },
      {
        userName: "M. K. Nair",
        userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
        rating: 5,
        date: "2024-06-10",
        comment: "Excellent clarification on fuzzy logic membership functions for hail identification."
      }
    ]
  },
  {
    id: "crs-02",
    title: "Numerical Weather Prediction (NWP) & High-Resolution Ensemble Modeling",
    domain: "Atmospheric Modeling",
    department: "National Centre for Medium Range Weather Forecasting (NCMRWF)",
    trainerId: "usr-trainer-01",
    trainerName: "Dr. Rajesh K. Verma",
    trainerRole: "Scientist 'F', IMD / NCMRWF Guest Faculty",
    level: "Intermediate",
    duration: "6 Weeks (48 Hours)",
    enrolledCount: 189,
    rating: 4.8,
    totalRatings: 42,
    thumbnail: "https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=600&auto=format&fit=crop&q=80",
    description: "In-depth training on global and regional NWP systems (GFS, Unified Model, WRF). Focuses on high-performance computing (HPC), 4D-Var data assimilation, and probabilistic ensemble forecasting of Indian summer monsoon spells.",
    prerequisites: ["Dynamic Meteorology", "Fortran/Python Programming", "Linux/HPC basics"],
    featured: true,
    modules: [
      {
        id: "mod-201",
        title: "Module 1: Atmospheric Dynamics & Governing Equations",
        duration: "50 mins",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        summary: "Hydrostatic vs. non-hydrostatic primitives, coordinate transformations, and numerical discretization schemes.",
        completed: true,
        resources: [{ name: "NWP_Equations_Overview.pdf", size: "4.2 MB", type: "pdf" }]
      },
      {
        id: "mod-202",
        title: "Module 2: Variational Data Assimilation (3D-Var / 4D-Var / EnKF)",
        duration: "65 mins",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4",
        summary: "Assimilating satellite sounders, radiosondes, Doppler radial winds, and surface observations into initial conditions.",
        completed: false,
        resources: [{ name: "Data_Assimilation_Techniques_NCMRWF.pdf", size: "6.5 MB", type: "pdf" }]
      },
      {
        id: "mod-203",
        title: "Module 3: Parametrization of Convection, Radiation & Boundary Layer",
        duration: "55 mins",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        summary: "Physical parameterization schemes tailored for tropical monsoon convection over the Indian subcontinent.",
        completed: false,
        resources: [{ name: "Convective_Schemes_Tropic.pdf", size: "3.2 MB", type: "pdf" }]
      }
    ],
    assessmentId: "quiz-02",
    feedbacks: []
  },
  {
    id: "crs-03",
    title: "Operational Ocean State Forecasting & Coastal Hazard Warning",
    domain: "Oceanography",
    department: "Indian National Centre for Ocean Information Services (INCOIS)",
    trainerId: "usr-trainer-02",
    trainerName: "Dr. P. V. Ramana",
    trainerRole: "Scientist 'G', INCOIS",
    level: "Intermediate",
    duration: "3 Weeks (24 Hours)",
    enrolledCount: 115,
    rating: 4.85,
    totalRatings: 29,
    thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80",
    description: "Operational methodologies for forecasting wave heights, swell surges (Kallakkadal), storm surges during cyclones, high sea alerts for fishermen, and coastal inundation risk mapping.",
    prerequisites: ["Basic Fluid Dynamics", "Physical Oceanography"],
    featured: true,
    modules: [
      {
        id: "mod-301",
        title: "Module 1: Wave Modeling (WAVEWATCH III & SWAN)",
        duration: "50 mins",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
        summary: "Setup, spectral wave dynamics, wind forcing, and shallow water coastal wave transformation.",
        completed: false,
        resources: [{ name: "WW3_Model_Setup_Guide.pdf", size: "5.1 MB", type: "pdf" }]
      },
      {
        id: "mod-302",
        title: "Module 2: Storm Surge & Inundation Modeling for Tropical Cyclones",
        duration: "60 mins",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4",
        summary: "Coupling hydrodynamic 2D/3D tide-surge models with IMD cyclone wind radii.",
        completed: false,
        resources: [{ name: "ADCIRC_StormSurge_Manual.pdf", size: "7.8 MB", type: "pdf" }]
      }
    ],
    assessmentId: "quiz-03",
    feedbacks: []
  },
  {
    id: "crs-04",
    title: "INSAT-3D/3DR Satellite Meteorology & Deep Convection Tracking",
    domain: "Satellite Remote Sensing",
    department: "India Meteorological Department (IMD)",
    trainerId: "usr-trainer-01",
    trainerName: "Dr. Rajesh K. Verma",
    trainerRole: "Scientist 'F', IMD",
    level: "All Levels",
    duration: "4 Weeks (30 Hours)",
    enrolledCount: 220,
    rating: 4.7,
    totalRatings: 54,
    thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80",
    description: "Multispectral satellite image interpretation using INSAT-3D, 3DR, and 3DS imagers and sounders. Extracting atmospheric motion vectors, cloud top brightness temperatures, and convective overshooting tops.",
    prerequisites: ["Introduction to Remote Sensing"],
    featured: false,
    modules: [
      {
        id: "mod-401",
        title: "Module 1: Payloads & Channels of INSAT-3D/3DR/3DS",
        duration: "40 mins",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
        summary: "Visible, Short Wave Infrared (SWIR), Mid Infrared (MIR), Thermal Infrared (TIR1/TIR2), and Water Vapor (WV) channels.",
        completed: true,
        resources: [{ name: "INSAT_Payload_Specs.pdf", size: "3.5 MB", type: "pdf" }]
      }
    ],
    assessmentId: "quiz-04",
    feedbacks: []
  },
  {
    id: "crs-05",
    title: "Seismological Network Operations & Tsunami Early Warning Protocol",
    domain: "Seismology & Solid Earth",
    department: "National Centre for Seismology (NCS) / MoES",
    trainerId: "usr-trainer-02",
    trainerName: "Dr. P. V. Ramana",
    trainerRole: "Scientist 'G', INCOIS / NCS Coordinator",
    level: "Advanced",
    duration: "5 Weeks (40 Hours)",
    enrolledCount: 96,
    rating: 4.95,
    totalRatings: 21,
    thumbnail: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=600&auto=format&fit=crop&q=80",
    description: "Real-time broadband seismograph network data telemetry, hypocenter determination, seismic moment estimation, and rapid tsunami bulletin generation under Indian Ocean Tsunami Warning System (IOTWMS).",
    prerequisites: ["Geophysics / Seismology Fundamentals"],
    featured: false,
    modules: [
      {
        id: "mod-501",
        title: "Module 1: Real-time Earthquake Localization & P-wave Triggering",
        duration: "45 mins",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
        summary: "SeisComP3 operations, automated phase picking, travel-time tables, and moment tensor inversions.",
        completed: false,
        resources: [{ name: "SeisComP_Operational_Guide.pdf", size: "6.0 MB", type: "pdf" }]
      }
    ],
    assessmentId: "quiz-05",
    feedbacks: []
  }
];
