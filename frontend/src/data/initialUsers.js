export const INITIAL_USERS = [
  {
    id: "usr-trainee-01",
    name: "Dr. Ananya Sharma",
    email: "ananya.sharma@imd.gov.in",
    role: "trainee",
    status: "approved",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    designation: "Meteorologist Grade-I",
    department: "Radar & Satellite Meteorology Division",
    organization: "India Meteorological Department (IMD)",
    location: "Regional Meteorological Centre (RMC), New Delhi",
    joinedDate: "2024-02-15",
    qualifications: [
      { degree: "Ph.D. in Atmospheric Sciences", institute: "IIT Delhi", year: "2022" },
      { degree: "M.Sc. in Meteorology", institute: "Andhra University", year: "2018" },
      { degree: "B.Sc. in Physics (Hons)", institute: "Delhi University", year: "2016" }
    ],
    experience: [
      { role: "Meteorologist Gr-I", org: "IMD Mausam Bhavan, New Delhi", duration: "2022 - Present", description: "Operational analysis of Doppler Weather Radar (DWR) data and short-range severe thunderstorm nowcasting." },
      { role: "Junior Research Fellow", org: "National Centre for Medium Range Weather Forecasting (NCMRWF)", duration: "2019 - 2022", description: "Data assimilation of satellite radiances into coupled numerical models." }
    ],
    interests: [
      "Severe Thunderstorm Nowcasting",
      "Doppler Radar Reflectivity Inversion",
      "AI/ML for Monsoon Precipitation Forecasting",
      "INSAT-3DR Rapid Scan Product Analysis"
    ],
    skills: [
      { name: "Doppler Radar Data Analysis", level: 90, category: "Radar" },
      { name: "Python for Atmospheric Science", level: 85, category: "Computational" },
      { name: "WRF Model Configuration", level: 75, category: "NWP" },
      { name: "Satellite Imagery Interpretation", level: 88, category: "Remote Sensing" },
      { name: "GIS & QGIS Meteorological Mapping", level: 70, category: "Geo-spatial" },
      { name: "Seismic Early Warning Systems", level: 50, category: "Geophysics" }
    ],
    enrolledCourses: ["crs-01", "crs-02", "crs-04"],
    completedCourses: ["crs-01"],
    certificates: [
      {
        id: "CERT-MOES-2024-8842",
        courseId: "crs-01",
        courseTitle: "Advanced Doppler Weather Radar Operations & Severe Storm Nowcasting",
        issueDate: "2024-06-18",
        score: 94,
        grade: "Distinction",
        trainerName: "Dr. Rajesh K. Verma",
        verificationHash: "a8f9c73e91b24d08"
      }
    ],
    feedbacksSubmitted: [
      {
        courseId: "crs-01",
        rating: 5,
        review: "Superb hands-on sessions on Dual-Polarization radar data interpretation. The practical examples of squall line detection were invaluable.",
        date: "2024-06-19"
      }
    ]
  },
  {
    id: "usr-trainer-01",
    name: "Dr. Rajesh K. Verma",
    email: "rajesh.verma@imd.gov.in",
    role: "trainer",
    status: "approved",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    designation: "Scientist 'F' & Head, Radar Meteorology Division",
    department: "Radar & Upper Air Instrumentation",
    organization: "India Meteorological Department (IMD)",
    location: "IMD HQ, Mausam Bhavan, New Delhi",
    joinedDate: "2023-08-10",
    rating: 4.9,
    totalStudentsTrained: 480,
    specializations: [
      "Doppler Weather Radar (S/C/X-Band)",
      "Dual-Polarization Hydrometeor Classification",
      "Severe Weather Warning Protocols",
      "Mesoscale Convective Systems"
    ],
    bio: "Over 22 years of pioneering experience in Doppler Weather Radar networks across India. Key contributor to the Indian Radar Network expansion under the MoES Modernization Program and WMO Severe Weather Forecast Programme.",
    publications: [
      "Verma, R. K. et al. (2023). 'Dual-pol Radar Algorithms for Extreme Rainfall Estimation in the Indian Subcontinent', J. Earth Sys. Sci.",
      "Verma, R. K. (2021). 'Operational Manual for IMD C-Band Polarimetric Radars', MoES Technical Bulletin."
    ],
    assignedCourses: ["crs-01", "crs-05"]
  },
  {
    id: "usr-trainer-02",
    name: "Dr. P. V. Ramana",
    email: "pv.ramana@incois.gov.in",
    role: "trainer",
    status: "approved",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    designation: "Scientist 'G', Ocean Modeling Division",
    department: "Operational Oceanography",
    organization: "Indian National Centre for Ocean Information Services (INCOIS)",
    location: "Hyderabad",
    joinedDate: "2023-11-01",
    rating: 4.8,
    totalStudentsTrained: 340,
    specializations: [
      "Ocean State Forecasting (OSF)",
      "Tsunami Early Warning Dynamics",
      "Storm Surge Modeling (ADCIRC)",
      "Satellite Altimetry"
    ],
    bio: "Pioneered coastal hazard forecasting systems at INCOIS. Lead architect for real-time storm surge prediction during Bay of Bengal tropical cyclones.",
    publications: [
      "Ramana, P. V. et al. (2022). 'Next-Gen Storm Surge Simulation along East Coast of India', Ocean Dynamics."
    ],
    assignedCourses: ["crs-03"]
  },
  {
    id: "usr-admin-01",
    name: "Shri Arvind Saxena",
    email: "arvind.saxena@moes.gov.in",
    role: "admin",
    status: "approved",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    designation: "Director (Capacity Building & Human Resource)",
    department: "Capacity Building Commission & Training Cell",
    organization: "Ministry of Earth Sciences (MoES)",
    location: "Prithvi Bhavan, New Delhi",
    joinedDate: "2023-01-01"
  },
  // Pending Approval Users
  {
    id: "usr-pending-01",
    name: "Siddharth Mukherjee",
    email: "siddharth.m@ncmrwf.gov.in",
    role: "trainee",
    status: "pending",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    designation: "Scientific Officer",
    department: "Numerical Weather Prediction Group",
    organization: "National Centre for Medium Range Weather Forecasting (NCMRWF)",
    location: "Noida, UP",
    joinedDate: "2026-08-20",
    qualifications: [{ degree: "M.Tech in Atmospheric Science", institute: "IIT Kharagpur", year: "2024" }],
    skills: [{ name: "Fortran NWP Coding", level: 80, category: "NWP" }],
    interests: ["Data Assimilation", "High-Resolution Ensemble Prediction"]
  },
  {
    id: "usr-pending-02",
    name: "Dr. K. Jayashree",
    email: "jayashree.k@niot.res.in",
    role: "trainer",
    status: "pending",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    designation: "Principal Scientist",
    department: "Deep Sea Mining & Ocean Technology",
    organization: "National Institute of Ocean Technology (NIOT)",
    location: "Chennai",
    joinedDate: "2026-08-22",
    specializations: ["Submersible Technologies", "Ocean Acoustics", "Marine Robotics"]
  }
];
