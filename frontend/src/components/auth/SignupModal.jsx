import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, UserPlus, Shield, GraduationCap, UserCheck, CheckCircle2, AlertTriangle, Building, Briefcase, Mail, User } from 'lucide-react';

export const SignupModal = () => {
  const { authModal, setAuthModal, registerUser } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'trainee',
    organization: 'India Meteorological Department (IMD)',
    department: 'Radar & Nowcasting Division',
    designation: 'Meteorologist Grade-II',
    location: 'RMC Pune',
    degree: 'M.Sc. in Atmospheric Sciences',
    primarySkill: 'Doppler Radar & Data Inversion',
    interests: 'Nowcasting, Severe Storms'
  });

  if (!authModal.isOpen || authModal.mode !== 'signup') return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    registerUser({
      name: formData.name,
      email: formData.email,
      role: formData.role,
      organization: formData.organization,
      department: formData.department,
      designation: formData.designation,
      location: formData.location,
      qualifications: [{ degree: formData.degree, institute: "MoES Institute / University", year: "2024" }],
      skills: [{ name: formData.primarySkill, level: 75, category: "Core" }],
      interests: formData.interests.split(',').map(s => s.trim())
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-moes-700 via-moes-800 to-navy-900 px-6 py-5 text-white relative">
          <button
            onClick={() => setAuthModal({ isOpen: false, mode: 'signup' })}
            className="absolute top-4 right-4 text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <UserPlus className="w-4 h-4 text-amber-300" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">MoES Official Registration</span>
          </div>
          <h2 className="text-xl font-bold">Register on CAPACITY CONNECT</h2>
          <p className="text-xs text-sky-200 mt-1">
            Submit your capacity profile. New registrations undergo Admin verification.
          </p>
        </div>

        {/* Info Banner about Approval */}
        <div className="bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-900/50 px-6 py-2.5 flex items-start gap-2 text-[11px] text-amber-900 dark:text-amber-300">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            <strong>Admin Approval Required:</strong> As per MoES security policies, new Trainee and Trainer accounts require validation by the Training Cell Administrator before full enrollment.
          </span>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {/* Role Choice */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Select Registration Role
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
                formData.role === 'trainee'
                  ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 font-bold'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}>
                <input
                  type="radio"
                  name="signup_role"
                  value="trainee"
                  checked={formData.role === 'trainee'}
                  onChange={() => setFormData({ ...formData, role: 'trainee' })}
                  className="sr-only"
                />
                <GraduationCap className="w-5 h-5 text-blue-500 shrink-0" />
                <div>
                  <p className="text-xs">Trainee / Scientist</p>
                  <p className="text-[10px] font-normal text-slate-500">Access courses, take MCQs, earn certs</p>
                </div>
              </label>

              <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
                formData.role === 'trainer'
                  ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 font-bold'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}>
                <input
                  type="radio"
                  name="signup_role"
                  value="trainer"
                  checked={formData.role === 'trainer'}
                  onChange={() => setFormData({ ...formData, role: 'trainer' })}
                  className="sr-only"
                />
                <UserCheck className="w-5 h-5 text-indigo-500 shrink-0" />
                <div>
                  <p className="text-xs">Trainer / Faculty</p>
                  <p className="text-[10px] font-normal text-slate-500">Create quizzes, upload materials, grade</p>
                </div>
              </label>
            </div>
          </div>

          {/* Full Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Name (with Honorific)
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Dr. Rajesh K. Patel"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-moes-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Official Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@imd.gov.in"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-moes-500"
                />
              </div>
            </div>
          </div>

          {/* Organization & Department */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                MoES Organization
              </label>
              <select
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-moes-500"
              >
                <option value="India Meteorological Department (IMD)">India Meteorological Department (IMD)</option>
                <option value="INCOIS Hyderabad">INCOIS Hyderabad</option>
                <option value="NCMRWF Noida">NCMRWF Noida</option>
                <option value="IITM Pune">IITM Pune</option>
                <option value="National Institute of Ocean Technology (NIOT)">NIOT Chennai</option>
                <option value="National Centre for Seismology (NCS)">NCS New Delhi</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Designation / Position
              </label>
              <input
                type="text"
                required
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                placeholder="e.g. Scientist 'C' / Meteorologist"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-moes-500"
              >
              </input>
            </div>
          </div>

          {/* Qualifications & Skills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Highest Qualification
              </label>
              <input
                type="text"
                required
                value={formData.degree}
                onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                placeholder="e.g. Ph.D. in Meteorology"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-moes-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Primary Expertise / Skill
              </label>
              <input
                type="text"
                required
                value={formData.primarySkill}
                onChange={(e) => setFormData({ ...formData, primarySkill: e.target.value })}
                placeholder="e.g. Radar Polarimetry, NWP"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-moes-500"
              />
            </div>
          </div>

          {/* Interests */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Key Technical Interests (comma separated)
            </label>
            <input
              type="text"
              value={formData.interests}
              onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
              placeholder="e.g. Cyclone Tracking, Doppler Radar, AI Weather Models"
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-moes-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-moes-600 hover:bg-moes-700 text-white shadow-md transition flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>Submit Registration for Admin Approval</span>
          </button>

          {/* Switch to Login */}
          <div className="text-center pt-2 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500">
            <span>Already have an approved account? </span>
            <button
              type="button"
              onClick={() => setAuthModal({ isOpen: true, mode: 'login' })}
              className="text-moes-600 dark:text-sky-400 font-bold hover:underline"
            >
              Sign In
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
