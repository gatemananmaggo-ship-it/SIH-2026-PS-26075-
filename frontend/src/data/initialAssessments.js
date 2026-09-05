export const INITIAL_ASSESSMENTS = [
  {
    id: "quiz-01",
    courseId: "crs-01",
    courseTitle: "Advanced Doppler Weather Radar (DWR) Operations & Nowcasting",
    title: "Comprehensive Assessment: Radar Polarimetry & Severe Storm Nowcasting",
    durationMinutes: 15,
    passingScore: 70, // percentage
    deadline: "2026-09-30T23:59:59",
    totalQuestions: 5,
    creatorId: "usr-trainer-01",
    creatorName: "Dr. Rajesh K. Verma",
    questions: [
      {
        id: "q1",
        question: "Which dual-polarization radar parameter is most effective for distinguishing large hail (> 2.5 cm) from heavy rain?",
        options: [
          "High Reflectivity (Z_H > 55 dBZ) accompanied by low Differential Reflectivity (Z_DR near 0 dB) and drop in Correlation Coefficient (Rho_HV < 0.95)",
          "Very high positive Differential Reflectivity (Z_DR > 5 dB) and high Rho_HV (> 0.99)",
          "Low Reflectivity (Z_H < 25 dBZ) with negative Specific Differential Phase (K_DP)",
          "Zero Doppler Velocity with high spectrum width only"
        ],
        correctIndex: 0,
        explanation: "Hail stones tumble as they fall, causing near-isotropic scattering (Z_DR ~ 0 dB), but with very high Z_H (> 55 dBZ) and reduced correlation coefficient (Rho_HV < 0.95) due to non-uniform hydrometeor mixture."
      },
      {
        id: "q2",
        question: "In Doppler radar velocity products, what characteristic signature indicates a mesocyclone associated with a severe supercell thunderstorm?",
        options: [
          "Uniform radial velocity away from the radar across all azimuths",
          "Couplet of inbound and outbound velocities in close proximity displaying strong cyclonic azimuthal shear",
          "A wide area of zero velocity across multiple elevation scans",
          "Alternating rings of positive and negative radial velocity"
        ],
        correctIndex: 1,
        explanation: "A mesocyclone is characterized by an adjacent velocity couplet (inbound next to outbound radial velocity) exhibiting tight azimuthal shear across multiple radar tilt angles."
      },
      {
        id: "q3",
        question: "What is the primary advantage of Specific Differential Phase (K_DP) over standard Reflectivity (Z_H) in quantitative precipitation estimation (QPE)?",
        options: [
          "K_DP is immune to radar receiver calibration errors and partial beam blockage/attenuation through heavy rain",
          "K_DP can measure light drizzle better than Z_H",
          "K_DP works effectively in clear air boundary layer tracking",
          "K_DP does not require polarimetric antennas"
        ],
        correctIndex: 0,
        explanation: "K_DP is a phase measurement rather than power measurement, making it completely independent of absolute radar calibration errors, partial beam blockage, and rain attenuation."
      },
      {
        id: "q4",
        question: "What Doppler radar phenomenon causes the velocity folding (Nyquist ambiguity) artifact?",
        options: [
          "Target radial velocity exceeding the maximum unambiguous velocity (V_max = PRF * lambda / 4)",
          "High ground clutter reflection near the radar tower",
          "Excessive radar pulse transmitter power",
          "Second-trip echoes beyond the maximum unambiguous range"
        ],
        correctIndex: 0,
        explanation: "When target velocity exceeds the maximum unambiguous velocity (V_max = PRF * lambda / 4), the Doppler phase shift exceeds +/- pi, causing velocity values to wrap around (alias/fold)."
      },
      {
        id: "q5",
        question: "What is the typical radar signature of a severe downburst / microburst near the surface?",
        options: [
          "Strong radial divergence couplet at the lowest elevation angle tilt",
          "High positive Differential Phase without reflectivity",
          "Strong radial convergence couplet at 10 km altitude",
          "Complete absence of Doppler spectrum width"
        ],
        correctIndex: 0,
        explanation: "A microburst is a strong downdraft that hits the ground and diverges horizontally, producing a distinctive divergence couplet (outbound velocity in opposite directions) at the lowest radar elevation angle."
      }
    ]
  },
  {
    id: "quiz-02",
    courseId: "crs-02",
    courseTitle: "Numerical Weather Prediction (NWP) & High-Resolution Ensemble Modeling",
    title: "Module Assessment: Variational Data Assimilation & NWP Dynamics",
    durationMinutes: 10,
    passingScore: 70,
    deadline: "2026-10-15T23:59:59",
    totalQuestions: 3,
    creatorId: "usr-trainer-01",
    creatorName: "Dr. Rajesh K. Verma",
    questions: [
      {
        id: "q201",
        question: "What is the primary difference between 3D-Var and 4D-Var Data Assimilation?",
        options: [
          "4D-Var incorporates the dynamic forecast model (tangent linear & adjoint) across a time window, whereas 3D-Var assumes all observations are valid at a single instantaneous time",
          "3D-Var uses satellite data while 4D-Var only uses surface barometers",
          "4D-Var is non-hydrostatic while 3D-Var is hydrostatic",
          "3D-Var requires larger supercomputing memory than 4D-Var"
        ],
        correctIndex: 0,
        explanation: "4D-Var extends 3D-Var by integrating the forecast model equations over an assimilation window, ensuring dynamically consistent trajectories for observations distributed in time."
      },
      {
        id: "q202",
        question: "Why is the Courant-Friedrichs-Lewy (CFL) condition crucial in explicit time-stepping schemes for atmospheric models?",
        options: [
          "It guarantees numerical stability by ensuring information does not propagate across more than one spatial grid cell per time step (c * dt / dx <= 1)",
          "It prevents moisture supersaturation in the boundary layer",
          "It determines the solar zenith angle accurately",
          "It scales the computing cores across MPI nodes"
        ],
        correctIndex: 0,
        explanation: "The CFL condition defines the maximum allowable time step (dt <= dx / c) for numerical stability in explicit finite difference equations."
      },
      {
        id: "q203",
        question: "What metric is most commonly evaluated to assess the spread and skill of an ensemble prediction system (EPS)?",
        options: [
          "Ensemble Spread vs. Root Mean Square Error (RMSE) of Ensemble Mean",
          "Single member maximum absolute error",
          "Radar reflectivity maximum index",
          "Surface air temperature alone"
        ],
        correctIndex: 0,
        explanation: "A reliable ensemble prediction system requires that the ensemble spread matches the RMSE of the ensemble mean over an evaluation period."
      }
    ]
  },
  {
    id: "quiz-03",
    courseId: "crs-03",
    courseTitle: "Operational Ocean State Forecasting & Coastal Hazard Warning",
    title: "Assessment: Coastal Wave Dynamics & Tsunami Travel Time",
    durationMinutes: 10,
    passingScore: 75,
    deadline: "2026-10-20T23:59:59",
    totalQuestions: 2,
    creatorId: "usr-trainer-02",
    creatorName: "Dr. P. V. Ramana",
    questions: [
      {
        id: "q301",
        question: "What mathematical approximation governs the propagation speed of Tsunami waves in the deep ocean?",
        options: [
          "Shallow water wave speed: c = sqrt(g * d), where d is ocean water depth",
          "Deep water wave speed: c = g * T / (2 * pi)",
          "Acoustic sound speed in seawater: c = 1500 m/s",
          "Wind friction velocity: c = u*"
        ],
        correctIndex: 0,
        explanation: "Because tsunami wavelengths are hundreds of kilometers long (far greater than ocean depth ~4 km), tsunamis behave as shallow-water waves everywhere in the open ocean with velocity c = sqrt(g * d)."
      },
      {
        id: "q302",
        question: "What causes the unique high-swell surge phenomenon known as 'Kallakkadal' along the southwest coast of India?",
        options: [
          "Distant southern ocean/Antarctic storms sending long-period swells (18-22s) across the Indian Ocean that pile up on the coast without local winds",
          "Local land-sea breeze circulation during winter months",
          "Submarine volcanic eruptions near Lakshadweep",
          "High tide combined with heavy monsoon river discharge only"
        ],
        correctIndex: 0,
        explanation: "Kallakkadal events are caused by intense southern Indian Ocean storm swells propagating over thousands of kilometers northward and arriving silently with sudden inundation."
      }
    ]
  }
];
