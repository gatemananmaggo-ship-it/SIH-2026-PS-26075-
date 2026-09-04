import '../models/course.dart';
import '../models/assessment.dart';
import '../models/trainee_user.dart';
import '../models/misc.dart';

/// Static seed data ported 1:1 from the web app's
/// `src/data/initialCourses.js`, `initialAssessments.js`,
/// `initialAnnouncements.js` and `initialUsers.js`.
class MockData {
  MockData._();

  // ---------------------------------------------------------------
  // Trainee (the signed-in demo user — Dr. Ananya Sharma)
  // ---------------------------------------------------------------
  static TraineeUser buildDefaultTrainee() {
    return TraineeUser(
      id: 'usr-trainee-01',
      name: 'Dr. Ananya Sharma',
      email: 'ananya.sharma@imd.gov.in',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
      designation: 'Meteorologist Grade-I',
      department: 'Radar & Satellite Meteorology Division',
      organization: 'India Meteorological Department (IMD)',
      location: 'Regional Meteorological Centre (RMC), New Delhi',
      joinedDate: '2024-02-15',
      qualifications: [
        Qualification(degree: 'Ph.D. in Atmospheric Sciences', institute: 'IIT Delhi', year: '2022'),
        Qualification(degree: 'M.Sc. in Meteorology', institute: 'Andhra University', year: '2018'),
        Qualification(degree: 'B.Sc. in Physics (Hons)', institute: 'Delhi University', year: '2016'),
      ],
      experience: [
        WorkExperience(
          role: 'Meteorologist Gr-I',
          org: 'IMD Mausam Bhavan, New Delhi',
          duration: '2022 - Present',
          description: 'Operational analysis of Doppler Weather Radar (DWR) data and short-range severe thunderstorm nowcasting.',
        ),
        WorkExperience(
          role: 'Junior Research Fellow',
          org: 'National Centre for Medium Range Weather Forecasting (NCMRWF)',
          duration: '2019 - 2022',
          description: 'Data assimilation of satellite radiances into coupled numerical models.',
        ),
      ],
      interests: [
        'Severe Thunderstorm Nowcasting',
        'Doppler Radar Reflectivity Inversion',
        'AI/ML for Monsoon Precipitation Forecasting',
        'INSAT-3DR Rapid Scan Product Analysis',
      ],
      skills: [
        SkillItem(name: 'Doppler Radar Data Analysis', level: 90, category: 'Radar'),
        SkillItem(name: 'Python for Atmospheric Science', level: 85, category: 'Computational'),
        SkillItem(name: 'WRF Model Configuration', level: 75, category: 'NWP'),
        SkillItem(name: 'Satellite Imagery Interpretation', level: 88, category: 'Remote Sensing'),
        SkillItem(name: 'GIS & QGIS Meteorological Mapping', level: 70, category: 'Geo-spatial'),
        SkillItem(name: 'Seismic Early Warning Systems', level: 50, category: 'Geophysics'),
      ],
      enrolledCourses: ['crs-01', 'crs-02', 'crs-04'],
      completedCourses: ['crs-01'],
      certificates: [
        const TraineeCertificate(
          id: 'CERT-MOES-2024-8842',
          courseId: 'crs-01',
          courseTitle: 'Advanced Doppler Weather Radar Operations & Severe Storm Nowcasting',
          issueDate: '2024-06-18',
          score: 94,
          grade: 'Distinction',
          trainerName: 'Dr. Rajesh K. Verma',
          verificationHash: 'a8f9c73e91b24d08',
        ),
      ],
      feedbacksSubmitted: [
        const SubmittedFeedback(
          courseId: 'crs-01',
          rating: 5,
          review: 'Superb hands-on sessions on Dual-Polarization radar data interpretation. The practical examples of squall line detection were invaluable.',
          date: '2024-06-19',
        ),
      ],
    );
  }

  // ---------------------------------------------------------------
  // Faculty / trainers shown on the Home tab
  // ---------------------------------------------------------------
  static const List<Faculty> faculty = [
    Faculty(
      id: 'usr-trainer-01',
      name: 'Dr. Rajesh K. Verma',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      designation: "Scientist 'F' & Head, Radar Meteorology Division",
      organization: 'India Meteorological Department (IMD)',
      rating: 4.9,
      bio: 'Over 22 years of pioneering experience in Doppler Weather Radar networks across India. Key contributor to the Indian Radar Network expansion under the MoES Modernization Program.',
      specializations: [
        'Doppler Weather Radar (S/C/X-Band)',
        'Dual-Polarization Hydrometeor Classification',
        'Severe Weather Warning Protocols',
      ],
    ),
    Faculty(
      id: 'usr-trainer-02',
      name: 'Dr. P. V. Ramana',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
      designation: "Scientist 'G', Ocean Modeling Division",
      organization: 'Indian National Centre for Ocean Information Services (INCOIS)',
      rating: 4.8,
      bio: 'Pioneered coastal hazard forecasting systems at INCOIS. Lead architect for real-time storm surge prediction during Bay of Bengal tropical cyclones.',
      specializations: [
        'Ocean State Forecasting (OSF)',
        'Tsunami Early Warning Dynamics',
        'Storm Surge Modeling (ADCIRC)',
      ],
    ),
  ];

  // ---------------------------------------------------------------
  // Courses
  // ---------------------------------------------------------------
  static List<Course> buildCourses() {
    return [
      Course(
        id: 'crs-01',
        title: 'Advanced Doppler Weather Radar (DWR) Operations & Nowcasting',
        domain: 'Radar Meteorology',
        department: 'India Meteorological Department (IMD)',
        trainerId: 'usr-trainer-01',
        trainerName: 'Dr. Rajesh K. Verma',
        trainerRole: "Scientist 'F' & Head, Radar Meteorology",
        level: 'Advanced',
        duration: '4 Weeks (32 Hours)',
        enrolledCount: 142,
        rating: 4.9,
        totalRatings: 38,
        thumbnail: 'https://images.unsplash.com/photo-1590055531615-f16d36ffe8ec?w=600&auto=format&fit=crop&q=80',
        description: 'Comprehensive operational training on dual-polarization Doppler weather radars (S, C, and X-Band), hydrometeor classification, severe squall line detection, and real-time short range convective nowcasting for aviation and disaster warning.',
        prerequisites: const ['Basic Physics / Thermodynamics', 'Introduction to Atmospheric Radar'],
        featured: true,
        assessmentId: 'quiz-01',
        modules: [
          CourseModule(
            id: 'mod-01',
            title: 'Module 1: Principles of Radar Polarimetry & Signal Processing',
            duration: '45 mins',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            summary: 'Fundamental equations of polarimetric radar: Differential Reflectivity (ZDR), Differential Phase (PhiDP), and Correlation Coefficient (RhoHV).',
            completed: true,
            resources: const [
              ModuleResource(name: 'Polarimetry_Fundamentals_Manual.pdf', size: '3.8 MB', type: 'pdf'),
              ModuleResource(name: 'Radar_Pulse_Equation_Notes.pptx', size: '5.2 MB', type: 'pptx'),
              ModuleResource(name: 'DWR_Sample_Volume_Scan.nc', size: '14.1 MB', type: 'dataset'),
            ],
          ),
          CourseModule(
            id: 'mod-02',
            title: 'Module 2: Hydrometeor Classification (HCA) & Heavy Rain Estimation',
            duration: '55 mins',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            summary: 'Applying fuzzy logic algorithms to identify hail, graupel, biological scatterers, and supercooled liquid water in severe storms.',
            completed: true,
            resources: const [
              ModuleResource(name: 'HCA_Fuzzy_Membership_Functions.pdf', size: '2.4 MB', type: 'pdf'),
              ModuleResource(name: 'Quantitative_Precipitation_Estimation_QPE.pdf', size: '4.1 MB', type: 'pdf'),
            ],
          ),
          CourseModule(
            id: 'mod-03',
            title: 'Module 3: Nowcasting Severe Thunderstorms & Microbursts',
            duration: '60 mins',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            summary: 'Velocity azimuth display (VAD), divergence signatures, hook echoes, and Bow Echo storm tracking for terminal aerodrome forecasts (TAF).',
            completed: true,
            resources: const [
              ModuleResource(name: 'Aviation_Nowcasting_Standard_Operating_Procedure.pdf', size: '1.9 MB', type: 'pdf'),
              ModuleResource(name: 'Severe_Storm_Case_Study_Kolkata_Squall.pptx', size: '8.5 MB', type: 'pptx'),
            ],
          ),
          CourseModule(
            id: 'mod-04',
            title: 'Module 4: Operational Radar Calibration & Hardware Diagnostics',
            duration: '40 mins',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            summary: 'Solar sunscan calibration, receiver sensitivity checks, Klystron/Magnetron transmitter monitoring, and antenna pedestal maintenance.',
            completed: false,
            resources: const [
              ModuleResource(name: 'Radar_Maintenance_Checklist_IMD.pdf', size: '3.1 MB', type: 'pdf'),
            ],
          ),
        ],
        feedbacks: const [
          CourseFeedback(
            userName: 'Dr. Ananya Sharma',
            userAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
            rating: 5,
            date: '2024-06-19',
            comment: 'Superb hands-on sessions on Dual-Polarization radar data interpretation. The practical examples of squall line detection were invaluable.',
          ),
          CourseFeedback(
            userName: 'M. K. Nair',
            userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
            rating: 5,
            date: '2024-06-10',
            comment: 'Excellent clarification on fuzzy logic membership functions for hail identification.',
          ),
        ],
      ),
      Course(
        id: 'crs-02',
        title: 'Numerical Weather Prediction (NWP) & High-Resolution Ensemble Modeling',
        domain: 'Atmospheric Modeling',
        department: 'National Centre for Medium Range Weather Forecasting (NCMRWF)',
        trainerId: 'usr-trainer-01',
        trainerName: 'Dr. Rajesh K. Verma',
        trainerRole: "Scientist 'F', IMD / NCMRWF Guest Faculty",
        level: 'Intermediate',
        duration: '6 Weeks (48 Hours)',
        enrolledCount: 189,
        rating: 4.8,
        totalRatings: 42,
        thumbnail: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=600&auto=format&fit=crop&q=80',
        description: 'In-depth training on global and regional NWP systems (GFS, Unified Model, WRF). Focuses on high-performance computing (HPC), 4D-Var data assimilation, and probabilistic ensemble forecasting of Indian summer monsoon spells.',
        prerequisites: const ['Dynamic Meteorology', 'Fortran/Python Programming', 'Linux/HPC basics'],
        featured: true,
        assessmentId: 'quiz-02',
        modules: [
          CourseModule(
            id: 'mod-201',
            title: 'Module 1: Atmospheric Dynamics & Governing Equations',
            duration: '50 mins',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
            summary: 'Hydrostatic vs. non-hydrostatic primitives, coordinate transformations, and numerical discretization schemes.',
            completed: true,
            resources: const [ModuleResource(name: 'NWP_Equations_Overview.pdf', size: '4.2 MB', type: 'pdf')],
          ),
          CourseModule(
            id: 'mod-202',
            title: 'Module 2: Variational Data Assimilation (3D-Var / 4D-Var / EnKF)',
            duration: '65 mins',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
            summary: 'Assimilating satellite sounders, radiosondes, Doppler radial winds, and surface observations into initial conditions.',
            completed: false,
            resources: const [ModuleResource(name: 'Data_Assimilation_Techniques_NCMRWF.pdf', size: '6.5 MB', type: 'pdf')],
          ),
          CourseModule(
            id: 'mod-203',
            title: 'Module 3: Parametrization of Convection, Radiation & Boundary Layer',
            duration: '55 mins',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
            summary: 'Physical parameterization schemes tailored for tropical monsoon convection over the Indian subcontinent.',
            completed: false,
            resources: const [ModuleResource(name: 'Convective_Schemes_Tropic.pdf', size: '3.2 MB', type: 'pdf')],
          ),
        ],
      ),
      Course(
        id: 'crs-03',
        title: 'Operational Ocean State Forecasting & Coastal Hazard Warning',
        domain: 'Oceanography',
        department: 'Indian National Centre for Ocean Information Services (INCOIS)',
        trainerId: 'usr-trainer-02',
        trainerName: 'Dr. P. V. Ramana',
        trainerRole: "Scientist 'G', INCOIS",
        level: 'Intermediate',
        duration: '3 Weeks (24 Hours)',
        enrolledCount: 115,
        rating: 4.85,
        totalRatings: 29,
        thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
        description: 'Operational methodologies for forecasting wave heights, swell surges (Kallakkadal), storm surges during cyclones, high sea alerts for fishermen, and coastal inundation risk mapping.',
        prerequisites: const ['Basic Fluid Dynamics', 'Physical Oceanography'],
        featured: true,
        assessmentId: 'quiz-03',
        modules: [
          CourseModule(
            id: 'mod-301',
            title: 'Module 1: Wave Modeling (WAVEWATCH III & SWAN)',
            duration: '50 mins',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
            summary: 'Setup, spectral wave dynamics, wind forcing, and shallow water coastal wave transformation.',
            completed: false,
            resources: const [ModuleResource(name: 'WW3_Model_Setup_Guide.pdf', size: '5.1 MB', type: 'pdf')],
          ),
          CourseModule(
            id: 'mod-302',
            title: 'Module 2: Storm Surge & Inundation Modeling for Tropical Cyclones',
            duration: '60 mins',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
            summary: 'Coupling hydrodynamic 2D/3D tide-surge models with IMD cyclone wind radii.',
            completed: false,
            resources: const [ModuleResource(name: 'ADCIRC_StormSurge_Manual.pdf', size: '7.8 MB', type: 'pdf')],
          ),
        ],
      ),
      Course(
        id: 'crs-04',
        title: 'INSAT-3D/3DR Satellite Meteorology & Deep Convection Tracking',
        domain: 'Satellite Remote Sensing',
        department: 'India Meteorological Department (IMD)',
        trainerId: 'usr-trainer-01',
        trainerName: 'Dr. Rajesh K. Verma',
        trainerRole: "Scientist 'F', IMD",
        level: 'All Levels',
        duration: '4 Weeks (30 Hours)',
        enrolledCount: 220,
        rating: 4.7,
        totalRatings: 54,
        thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
        description: 'Multispectral satellite image interpretation using INSAT-3D, 3DR, and 3DS imagers and sounders. Extracting atmospheric motion vectors, cloud top brightness temperatures, and convective overshooting tops.',
        prerequisites: const ['Introduction to Remote Sensing'],
        featured: false,
        assessmentId: 'quiz-04',
        modules: [
          CourseModule(
            id: 'mod-401',
            title: 'Module 1: Payloads & Channels of INSAT-3D/3DR/3DS',
            duration: '40 mins',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
            summary: 'Visible, Short Wave Infrared (SWIR), Mid Infrared (MIR), Thermal Infrared (TIR1/TIR2), and Water Vapor (WV) channels.',
            completed: true,
            resources: const [ModuleResource(name: 'INSAT_Payload_Specs.pdf', size: '3.5 MB', type: 'pdf')],
          ),
        ],
      ),
      Course(
        id: 'crs-05',
        title: 'Seismological Network Operations & Tsunami Early Warning Protocol',
        domain: 'Seismology & Solid Earth',
        department: 'National Centre for Seismology (NCS) / MoES',
        trainerId: 'usr-trainer-02',
        trainerName: 'Dr. P. V. Ramana',
        trainerRole: "Scientist 'G', INCOIS / NCS Coordinator",
        level: 'Advanced',
        duration: '5 Weeks (40 Hours)',
        enrolledCount: 96,
        rating: 4.95,
        totalRatings: 21,
        thumbnail: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=600&auto=format&fit=crop&q=80',
        description: 'Real-time broadband seismograph network data telemetry, hypocenter determination, seismic moment estimation, and rapid tsunami bulletin generation under Indian Ocean Tsunami Warning System (IOTWMS).',
        prerequisites: const ['Geophysics / Seismology Fundamentals'],
        featured: false,
        assessmentId: 'quiz-05',
        modules: [
          CourseModule(
            id: 'mod-501',
            title: 'Module 1: Real-time Earthquake Localization & P-wave Triggering',
            duration: '45 mins',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
            summary: 'SeisComP3 operations, automated phase picking, travel-time tables, and moment tensor inversions.',
            completed: false,
            resources: const [ModuleResource(name: 'SeisComP_Operational_Guide.pdf', size: '6.0 MB', type: 'pdf')],
          ),
        ],
      ),
    ];
  }

  // ---------------------------------------------------------------
  // Assessments
  // ---------------------------------------------------------------
  static List<Assessment> buildAssessments() {
    return [
      Assessment(
        id: 'quiz-01',
        courseId: 'crs-01',
        courseTitle: 'Advanced Doppler Weather Radar (DWR) Operations & Nowcasting',
        title: 'Comprehensive Assessment: Radar Polarimetry & Severe Storm Nowcasting',
        durationMinutes: 15,
        passingScore: 70,
        deadline: '2026-09-30T23:59:59',
        totalQuestions: 5,
        creatorId: 'usr-trainer-01',
        creatorName: 'Dr. Rajesh K. Verma',
        questions: const [
          QuizQuestion(
            id: 'q1',
            question: 'Which dual-polarization radar parameter is most effective for distinguishing large hail (> 2.5 cm) from heavy rain?',
            options: [
              'High Reflectivity (Z_H > 55 dBZ) accompanied by low Differential Reflectivity (Z_DR near 0 dB) and drop in Correlation Coefficient (Rho_HV < 0.95)',
              'Very high positive Differential Reflectivity (Z_DR > 5 dB) and high Rho_HV (> 0.99)',
              'Low Reflectivity (Z_H < 25 dBZ) with negative Specific Differential Phase (K_DP)',
              'Zero Doppler Velocity with high spectrum width only',
            ],
            correctIndex: 0,
            explanation: 'Hail stones tumble as they fall, causing near-isotropic scattering (Z_DR ~ 0 dB), but with very high Z_H (> 55 dBZ) and reduced correlation coefficient (Rho_HV < 0.95) due to non-uniform hydrometeor mixture.',
          ),
          QuizQuestion(
            id: 'q2',
            question: 'In Doppler radar velocity products, what characteristic signature indicates a mesocyclone associated with a severe supercell thunderstorm?',
            options: [
              'Uniform radial velocity away from the radar across all azimuths',
              'Couplet of inbound and outbound velocities in close proximity displaying strong cyclonic azimuthal shear',
              'A wide area of zero velocity across multiple elevation scans',
              'Alternating rings of positive and negative radial velocity',
            ],
            correctIndex: 1,
            explanation: 'A mesocyclone is characterized by an adjacent velocity couplet (inbound next to outbound radial velocity) exhibiting tight azimuthal shear across multiple radar tilt angles.',
          ),
          QuizQuestion(
            id: 'q3',
            question: 'What is the primary advantage of Specific Differential Phase (K_DP) over standard Reflectivity (Z_H) in quantitative precipitation estimation (QPE)?',
            options: [
              'K_DP is immune to radar receiver calibration errors and partial beam blockage/attenuation through heavy rain',
              'K_DP can measure light drizzle better than Z_H',
              'K_DP works effectively in clear air boundary layer tracking',
              'K_DP does not require polarimetric antennas',
            ],
            correctIndex: 0,
            explanation: 'K_DP is a phase measurement rather than power measurement, making it completely independent of absolute radar calibration errors, partial beam blockage, and rain attenuation.',
          ),
          QuizQuestion(
            id: 'q4',
            question: 'What Doppler radar phenomenon causes the velocity folding (Nyquist ambiguity) artifact?',
            options: [
              'Target radial velocity exceeding the maximum unambiguous velocity (V_max = PRF * lambda / 4)',
              'High ground clutter reflection near the radar tower',
              'Excessive radar pulse transmitter power',
              'Second-trip echoes beyond the maximum unambiguous range',
            ],
            correctIndex: 0,
            explanation: 'When target velocity exceeds the maximum unambiguous velocity (V_max = PRF * lambda / 4), the Doppler phase shift exceeds +/- pi, causing velocity values to wrap around (alias/fold).',
          ),
          QuizQuestion(
            id: 'q5',
            question: 'What is the typical radar signature of a severe downburst / microburst near the surface?',
            options: [
              'Strong radial divergence couplet at the lowest elevation angle tilt',
              'High positive Differential Phase without reflectivity',
              'Strong radial convergence couplet at 10 km altitude',
              'Complete absence of Doppler spectrum width',
            ],
            correctIndex: 0,
            explanation: 'A microburst is a strong downdraft that hits the ground and diverges horizontally, producing a distinctive divergence couplet (outbound velocity in opposite directions) at the lowest radar elevation angle.',
          ),
        ],
      ),
      Assessment(
        id: 'quiz-02',
        courseId: 'crs-02',
        courseTitle: 'Numerical Weather Prediction (NWP) & High-Resolution Ensemble Modeling',
        title: 'Module Assessment: Variational Data Assimilation & NWP Dynamics',
        durationMinutes: 10,
        passingScore: 70,
        deadline: '2026-10-15T23:59:59',
        totalQuestions: 3,
        creatorId: 'usr-trainer-01',
        creatorName: 'Dr. Rajesh K. Verma',
        questions: const [
          QuizQuestion(
            id: 'q201',
            question: 'What is the primary difference between 3D-Var and 4D-Var Data Assimilation?',
            options: [
              '4D-Var incorporates the dynamic forecast model (tangent linear & adjoint) across a time window, whereas 3D-Var assumes all observations are valid at a single instantaneous time',
              '3D-Var uses satellite data while 4D-Var only uses surface barometers',
              '4D-Var is non-hydrostatic while 3D-Var is hydrostatic',
              '3D-Var requires larger supercomputing memory than 4D-Var',
            ],
            correctIndex: 0,
            explanation: '4D-Var extends 3D-Var by integrating the forecast model equations over an assimilation window, ensuring dynamically consistent trajectories for observations distributed in time.',
          ),
          QuizQuestion(
            id: 'q202',
            question: 'Why is the Courant-Friedrichs-Lewy (CFL) condition crucial in explicit time-stepping schemes for atmospheric models?',
            options: [
              'It guarantees numerical stability by ensuring information does not propagate across more than one spatial grid cell per time step (c * dt / dx <= 1)',
              'It prevents moisture supersaturation in the boundary layer',
              'It determines the solar zenith angle accurately',
              'It scales the computing cores across MPI nodes',
            ],
            correctIndex: 0,
            explanation: 'The CFL condition defines the maximum allowable time step (dt <= dx / c) for numerical stability in explicit finite difference equations.',
          ),
          QuizQuestion(
            id: 'q203',
            question: 'What metric is most commonly evaluated to assess the spread and skill of an ensemble prediction system (EPS)?',
            options: [
              'Ensemble Spread vs. Root Mean Square Error (RMSE) of Ensemble Mean',
              'Single member maximum absolute error',
              'Radar reflectivity maximum index',
              'Surface air temperature alone',
            ],
            correctIndex: 0,
            explanation: 'A reliable ensemble prediction system requires that the ensemble spread matches the RMSE of the ensemble mean over an evaluation period.',
          ),
        ],
      ),
      Assessment(
        id: 'quiz-03',
        courseId: 'crs-03',
        courseTitle: 'Operational Ocean State Forecasting & Coastal Hazard Warning',
        title: 'Assessment: Coastal Wave Dynamics & Tsunami Travel Time',
        durationMinutes: 10,
        passingScore: 75,
        deadline: '2026-10-20T23:59:59',
        totalQuestions: 2,
        creatorId: 'usr-trainer-02',
        creatorName: 'Dr. P. V. Ramana',
        questions: const [
          QuizQuestion(
            id: 'q301',
            question: 'What mathematical approximation governs the propagation speed of Tsunami waves in the deep ocean?',
            options: [
              'Shallow water wave speed: c = sqrt(g * d), where d is ocean water depth',
              'Deep water wave speed: c = g * T / (2 * pi)',
              'Acoustic sound speed in seawater: c = 1500 m/s',
              'Wind friction velocity: c = u*',
            ],
            correctIndex: 0,
            explanation: 'Because tsunami wavelengths are hundreds of kilometers long (far greater than ocean depth ~4 km), tsunamis behave as shallow-water waves everywhere in the open ocean with velocity c = sqrt(g * d).',
          ),
          QuizQuestion(
            id: 'q302',
            question: "What causes the unique high-swell surge phenomenon known as 'Kallakkadal' along the southwest coast of India?",
            options: [
              'Distant southern ocean/Antarctic storms sending long-period swells (18-22s) across the Indian Ocean that pile up on the coast without local winds',
              'Local land-sea breeze circulation during winter months',
              'Submarine volcanic eruptions near Lakshadweep',
              'High tide combined with heavy monsoon river discharge only',
            ],
            correctIndex: 0,
            explanation: 'Kallakkadal events are caused by intense southern Indian Ocean storm swells propagating over thousands of kilometers northward and arriving silently with sudden inundation.',
          ),
        ],
      ),
    ];
  }

  // ---------------------------------------------------------------
  // Announcements
  // ---------------------------------------------------------------
  static const List<Announcement> announcements = [
    Announcement(
      id: 'ann-01',
      title: 'MoES Mission Mausam: Specialized Radar & Nowcasting Capacity Workshop 2026',
      category: 'Urgent Circular',
      date: '2026-08-24',
      urgent: true,
      publishedBy: 'Admin Office, MoES',
      summary: 'Nominations invited from all IMD Regional Centres (Delhi, Kolkata, Mumbai, Chennai, Guwahati, Nagpur) for the mandatory 3-week dual-polarimetric radar operation certification under Mission Mausam.',
      linkText: 'View Circular & Guidelines',
      targetRole: 'all',
    ),
    Announcement(
      id: 'ann-02',
      title: 'MoES & IMD Complete Upgradation of 15 New X-Band Radars in Western Himalayan Region',
      category: 'Achievement',
      date: '2026-08-22',
      urgent: false,
      publishedBy: 'Press Information Bureau / MoES',
      summary: 'Enhanced cloudburst and localized flash-flood nowcasting coverage operationalized in Uttarakhand and Himachal Pradesh. Related training modules are now live in Capacity Connect.',
      linkText: 'Read Press Release',
      targetRole: 'all',
    ),
    Announcement(
      id: 'ann-03',
      title: 'Launch of AI/ML Monsoon Quantitative Precipitation Forecasting Sandbox',
      category: 'New Course',
      date: '2026-08-18',
      urgent: false,
      publishedBy: 'NCMRWF & IMD Training Division',
      summary: 'New self-paced curriculum on applying Deep Learning physics-informed neural networks (PINNs) to downscaled ensemble weather forecasts is now open for enrollment.',
      linkText: 'Enroll Now',
      targetRole: 'trainee',
    ),
    Announcement(
      id: 'ann-04',
      title: 'Annual Trainer Competency Audit & Curriculum Revision Cycle (Q3 2026)',
      category: 'Trainer Advisory',
      date: '2026-08-15',
      urgent: false,
      publishedBy: 'Capacity Building Commission (CBC) Desk',
      summary: 'All registered faculty members are requested to review subject-wise MCQ question banks and ensure alignment with WMO-No. 1083 competency standards.',
      linkText: 'Review Assessment Guidelines',
      targetRole: 'trainer',
    ),
  ];

  // ---------------------------------------------------------------
  // Trainer-shared knowledge library
  // ---------------------------------------------------------------
  static List<TrainerMaterial> buildTrainerMaterials() {
    return [
      TrainerMaterial(
        id: 'mat-01',
        trainerId: 'usr-trainer-01',
        trainerName: 'Dr. Rajesh K. Verma',
        title: 'Dual-Pol Radar Doppler Spectrum Analysis Handbook (2026 Edition)',
        domain: 'Radar Meteorology',
        fileType: 'PDF',
        fileSize: '12.4 MB',
        uploadDate: '2026-08-10',
        downloads: 142,
        accessRole: 'All Trainees',
        description: 'Complete reference handbook containing case studies of severe squall lines over Gangetic plains.',
      ),
      TrainerMaterial(
        id: 'mat-02',
        trainerId: 'usr-trainer-01',
        trainerName: 'Dr. Rajesh K. Verma',
        title: 'Sample NetCDF Volume Scan: Kolkata Supercell Thunderstorm (May 2024)',
        domain: 'Radar Meteorology',
        fileType: 'NetCDF',
        fileSize: '48.2 MB',
        uploadDate: '2026-08-14',
        downloads: 89,
        accessRole: 'Enrolled Trainees',
        description: 'Full polarimetric radar volumetric scan data (Z_H, Z_DR, K_DP, Rho_HV) for laboratory assignment.',
      ),
      TrainerMaterial(
        id: 'mat-03',
        trainerId: 'usr-trainer-02',
        trainerName: 'Dr. P. V. Ramana',
        title: 'ADCIRC Storm Surge Grid Generation & Boundary Conditions',
        domain: 'Oceanography',
        fileType: 'PPTX',
        fileSize: '18.7 MB',
        uploadDate: '2026-08-18',
        downloads: 64,
        accessRole: 'All Trainees',
        description: 'Lecture presentation slides detailing unstructured mesh generation for the Bay of Bengal coastline.',
      ),
    ];
  }
}
