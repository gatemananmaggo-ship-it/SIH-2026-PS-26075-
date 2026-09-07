import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  User, 
  GraduationCap, 
  Briefcase, 
  Sparkles, 
  Award, 
  Plus, 
  Trash2, 
  Save, 
  Building, 
  MapPin, 
  CheckCircle2, 
  Tag, 
  ShieldCheck 
} from 'lucide-react';

import { 
  getTraineeProfileApi, 
  updateTraineeProfileApi 
} from '../../services/trainee';

export const TraineeProfile = () => {
  const { currentUser, updateTraineeProfile, setActiveCertificate, showToast, isDemoMode, isAuthenticated } = useApp();

  const [name, setName] = useState(currentUser?.name || '');
  const [designation, setDesignation] = useState(currentUser?.designation || '');
  const [department, setDepartment] = useState(currentUser?.department || '');
  const [organization, setOrganization] = useState(currentUser?.organization || '');
  const [location, setLocation] = useState(currentUser?.location || '');

  const [saving, setSaving] = useState(false);
  const [hasServerProfile, setHasServerProfile] = useState(false);

  // Qualifications list
  const [qualifications, setQualifications] = useState(currentUser?.qualifications || []);
  const [newDegree, setNewDegree] = useState('');
  const [newInstitute, setNewInstitute] = useState('');
  const [newYear, setNewYear] = useState('');

  // Experience list
  const [experience, setExperience] = useState(currentUser?.experience || []);
  const [newExpRole, setNewExpRole] = useState('');
  const [newExpOrg, setNewExpOrg] = useState('');
  const [newExpDuration, setNewExpDuration] = useState('');
  const [newExpDesc, setNewExpDesc] = useState('');

  // Interests list
  const [interests, setInterests] = useState(currentUser?.interests || []);
  const [newInterest, setNewInterest] = useState('');

  // Skills list
  const [skills, setSkills] = useState(currentUser?.skills || []);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState(80);
  const [newSkillCategory, setNewSkillCategory] = useState('Atmospheric');

  // Load from backend on mount
  useEffect(() => {
    const fetchProfile = async () => {
      if (isDemoMode || !isAuthenticated) return;
      try {
        const res = await getTraineeProfileApi();
        if (res && res.profile) {
          setHasServerProfile(true);
          const p = res.profile;
          if (p.designation) setDesignation(p.designation);
          if (p.department) setDepartment(p.department);
          if (p.organization) setOrganization(p.organization);
          if (p.regionalCenter) setLocation(p.regionalCenter);
          if (p.userId?.name) setName(p.userId.name);
          if (p.qualifications?.length) {
            setQualifications(p.qualifications.map(q => ({
              degree: q.degree || '',
              institute: q.institution || q.institute || '',
              year: q.year ? String(q.year) : '2024'
            })));
          }
          if (p.workExperience?.length) {
            setExperience(p.workExperience.map(w => ({
              role: w.designation || w.role || '',
              org: w.organization || w.org || '',
              duration: w.startDate ? `${new Date(w.startDate).getFullYear()} - ${w.endDate ? new Date(w.endDate).getFullYear() : 'Present'}` : (w.duration || '2023 - Present'),
              description: w.description || ''
            })));
          }
          if (p.interests?.length) setInterests(p.interests);
          if (p.skills?.length) {
            setSkills(p.skills.map(s => typeof s === 'string' ? { name: s, level: 80, category: 'Core' } : s));
          }
        }
      } catch (err) {
        if (err.status === 404) {
          setHasServerProfile(false);
        }
      }
    };
    fetchProfile();
  }, [isDemoMode, isAuthenticated]);

  const handleSaveProfile = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!isDemoMode && isAuthenticated) {
      try {
        setSaving(true);
        const payload = {
          qualifications: qualifications.map(q => ({
            degree: q.degree || 'B.Tech / M.Sc',
            institution: q.institute || q.institution || 'MoES Institute',
            year: parseInt(q.year, 10) || new Date().getFullYear()
          })),
          workExperience: experience.map(exp => ({
            organization: exp.org || exp.organization || 'MoES',
            designation: exp.role || exp.designation || 'Scientific Officer',
            description: exp.description || ''
          })),
          interests,
          skills: skills.map(s => typeof s === 'string' ? s : s.name),
          designation,
          department,
          organization,
          regionalCenter: location,
          certificates: []
        };

        await updateTraineeProfileApi(payload);
        setHasServerProfile(true);
        showToast("Profile synced to server successfully!", "success");
      } catch (err) {
        showToast(err.data?.message || "Saved locally", "info");
      } finally {
        setSaving(false);
      }
    }

    updateTraineeProfile({
      name,
      designation,
      department,
      organization,
      location,
      qualifications,
      experience,
      interests,
      skills
    });
  };

  const addQualification = () => {
    if (!newDegree || !newInstitute) return;
    setQualifications([...qualifications, { degree: newDegree, institute: newInstitute, year: newYear || '2024' }]);
    setNewDegree('');
    setNewInstitute('');
    setNewYear('');
  };

  const removeQualification = (index) => {
    setQualifications(qualifications.filter((_, i) => i !== index));
  };

  const addExperience = () => {
    if (!newExpRole || !newExpOrg) return;
    setExperience([...experience, { role: newExpRole, org: newExpOrg, duration: newExpDuration || '2023 - Present', description: newExpDesc }]);
    setNewExpRole('');
    setNewExpOrg('');
    setNewExpDuration('');
    setNewExpDesc('');
  };

  const removeExperience = (index) => {
    setExperience(experience.filter((_, i) => i !== index));
  };

  const addInterest = () => {
    if (!newInterest.trim() || interests.includes(newInterest.trim())) return;
    setInterests([...interests, newInterest.trim()]);
    setNewInterest('');
  };

  const removeInterest = (tag) => {
    setInterests(interests.filter(t => t !== tag));
  };

  const addSkill = () => {
    if (!newSkillName.trim()) return;
    setSkills([...skills, { name: newSkillName.trim(), level: Number(newSkillLevel), category: newSkillCategory }]);
    setNewSkillName('');
  };

  const removeSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Top Banner Card */}
      <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          
          <div className="flex items-center gap-4">
            <img
              src={currentUser?.avatar}
              alt={currentUser?.name}
              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-moes-500 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{currentUser?.name}</h2>
                <span className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Approved Trainee
                </span>
              </div>
              <p className="text-xs text-moes-600 dark:text-sky-400 font-semibold">{currentUser?.designation}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
                <Building className="w-3.5 h-3.5" />
                <span>{currentUser?.department} • {currentUser?.organization}</span>
              </p>
              <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3" />
                <span>{currentUser?.location}</span>
              </p>
            </div>
          </div>

          <button
            onClick={handleSaveProfile}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-moes-600 hover:bg-moes-700 text-white shadow-md transition"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile Updates</span>
          </button>

        </div>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-8">
        
        {/* Section 1: Basic Information */}
        <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm border-b border-slate-200 dark:border-slate-800 pb-3">
            <User className="w-4 h-4 text-moes-500" />
            <span>Official Identity & Designation</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-moes-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Designation</label>
              <input
                type="text"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-moes-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Department / Division</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-moes-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">MoES Organization</label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-moes-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Regional Center / Station</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-moes-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Qualifications & Academic Record */}
        <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
              <GraduationCap className="w-4 h-4 text-moes-500" />
              <span>Academic Qualifications</span>
            </div>
          </div>

          <div className="space-y-3">
            {qualifications.map((q, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">{q.degree}</h4>
                  <p className="text-slate-500 dark:text-slate-400">{q.institute} • Class of {q.year}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeQualification(idx)}
                  className="p-1.5 text-slate-400 hover:text-red-500 rounded transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Add Qualification Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-2">
            <input
              type="text"
              placeholder="Degree (e.g. M.Tech NWP)"
              value={newDegree}
              onChange={(e) => setNewDegree(e.target.value)}
              className="px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
            <input
              type="text"
              placeholder="Institution (e.g. IIT Kharagpur)"
              value={newInstitute}
              onChange={(e) => setNewInstitute(e.target.value)}
              className="px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
            <input
              type="text"
              placeholder="Year (e.g. 2024)"
              value={newYear}
              onChange={(e) => setNewYear(e.target.value)}
              className="px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
            <button
              type="button"
              onClick={addQualification}
              className="px-3 py-2 rounded-lg bg-moes-600 text-white text-xs font-bold hover:bg-moes-700 transition flex items-center justify-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Qualification</span>
            </button>
          </div>
        </div>

        {/* Section 3: Work Experience & MoES Postings */}
        <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm border-b border-slate-200 dark:border-slate-800 pb-3">
            <Briefcase className="w-4 h-4 text-moes-500" />
            <span>Operational Work Experience & Postings</span>
          </div>

          <div className="space-y-3">
            {experience.map((exp, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 dark:text-white">{exp.role} <span className="text-moes-600 dark:text-sky-400 font-normal">@ {exp.org}</span></h4>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-500">{exp.duration}</span>
                    <button
                      type="button"
                      onClick={() => removeExperience(idx)}
                      className="p-1 text-slate-400 hover:text-red-500 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>

          {/* Add Experience */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
            <input
              type="text"
              placeholder="Role / Title"
              value={newExpRole}
              onChange={(e) => setNewExpRole(e.target.value)}
              className="px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
            <input
              type="text"
              placeholder="Organization / Station"
              value={newExpOrg}
              onChange={(e) => setNewExpOrg(e.target.value)}
              className="px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
            <input
              type="text"
              placeholder="Duration (e.g. 2022 - 2024)"
              value={newExpDuration}
              onChange={(e) => setNewExpDuration(e.target.value)}
              className="px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Key responsibilities / operational highlights"
              value={newExpDesc}
              onChange={(e) => setNewExpDesc(e.target.value)}
              className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
            <button
              type="button"
              onClick={addExperience}
              className="px-4 py-2 rounded-lg bg-moes-600 text-white text-xs font-bold hover:bg-moes-700 transition shrink-0 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Experience</span>
            </button>
          </div>
        </div>

        {/* Section 4: Skills Matrix & Technical Interests */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Skills Matrix */}
          <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm border-b border-slate-200 dark:border-slate-800 pb-3">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Competency & Skills Proficiency Matrix</span>
            </div>

            <div className="space-y-3">
              {skills.map((skill, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-slate-800 dark:text-slate-200">{skill.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-moes-600 dark:text-sky-400 font-bold">{skill.level}%</span>
                      <button
                        type="button"
                        onClick={() => removeSkill(idx)}
                        className="text-slate-400 hover:text-red-500 transition"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-moes-500 to-sky-400 rounded-full transition-all duration-500"
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Skill */}
            <div className="pt-2 flex flex-wrap gap-2">
              <input
                type="text"
                placeholder="Skill name"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                className="flex-1 min-w-[140px] px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
              <input
                type="number"
                min="10"
                max="100"
                value={newSkillLevel}
                onChange={(e) => setNewSkillLevel(e.target.value)}
                className="w-16 px-2 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
              <button
                type="button"
                onClick={addSkill}
                className="px-3 py-2 rounded-lg bg-moes-600 text-white text-xs font-bold hover:bg-moes-700 transition flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Skill</span>
              </button>
            </div>
          </div>

          {/* Interests */}
          <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm border-b border-slate-200 dark:border-slate-800 pb-3">
              <Tag className="w-4 h-4 text-sky-500" />
              <span>Scientific & Research Interests</span>
            </div>

            <div className="flex flex-wrap gap-2 min-h-[120px] content-start">
              {interests.map((int, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-moes-50 dark:bg-moes-950/60 text-moes-700 dark:text-sky-300 border border-moes-200 dark:border-moes-800"
                >
                  <span>{int}</span>
                  <button
                    type="button"
                    onClick={() => removeInterest(int)}
                    className="hover:text-red-500 transition"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            {/* Add Interest */}
            <div className="pt-2 flex gap-2">
              <input
                type="text"
                placeholder="Add research / operational interest"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
              <button
                type="button"
                onClick={addInterest}
                className="px-4 py-2 rounded-lg bg-moes-600 text-white text-xs font-bold hover:bg-moes-700 transition flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>

        </div>

      </form>
    </div>
  );
};
