import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { UserCheck, Star, Award, BookOpen, Save, Plus, Trash2, ShieldCheck, Building, MapPin, CheckCircle, AlertCircle } from 'lucide-react';
import { getTrainerProfileApi, updateTrainerProfileApi, createTrainerProfileApi } from '../../services/trainer';

export const TrainerProfile = () => {
  const { currentUser, isDemoMode } = useApp();
  
  const [name, setName] = useState(currentUser?.name || '');
  const [designation, setDesignation] = useState(currentUser?.designation || '');
  const [department, setDepartment] = useState(currentUser?.department || '');
  const [organization, setOrganization] = useState(currentUser?.organization || '');
  const [bio, setBio] = useState(currentUser?.bio || '');

  const [specializations, setSpecializations] = useState(currentUser?.specializations || [
    "Doppler Weather Radar (S/C/X-Band)",
    "Dual-Polarization Hydrometeor Classification",
    "Severe Weather Warning Protocols"
  ]);
  const [newSpec, setNewSpec] = useState('');
  

  const [publications, setPublications] = useState(currentUser?.publications || [
    "Verma, R. K. et al. (2023). 'Dual-pol Radar Algorithms for Extreme Rainfall Estimation in the Indian Subcontinent', J. Earth Sys. Sci.",
    "Verma, R. K. (2021). 'Operational Manual for IMD C-Band Polarimetric Radars', MoES Technical Bulletin."
  ]);
  const [newPub, setNewPub] = useState('');
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  const addSpec = () => {
    const spec = newSpec.trim();

    if (!spec) return;

    if (specializations.includes(spec)) {
      setNewSpec('');
      return;
    }

    setSpecializations(prev => [...prev, spec]);
    setNewSpec('');
  };

  const addPub = () => {
    const pub = newPub.trim();

    if (!pub) return;

    if (publications.includes(pub)) {
      setNewPub('');
      return;
    }

    setPublications(prev => [...prev, pub]);
    setNewPub('');
  };

  useEffect(() => {
    if (!isDemoMode) {
      loadProfile();
    }
  }, [isDemoMode]);

  const loadProfile = async () => {
    try {
      const res = await getTrainerProfileApi();
      if (res && res.profile) {
        if (res.profile.bio) setBio(res.profile.bio);
        if (res.profile.expertise && res.profile.expertise.length > 0) {
          setSpecializations(res.profile.expertise);
        } else if (res.profile.skills && res.profile.skills.length > 0) {
          setSpecializations(res.profile.skills);
        }
        if (res.profile.workExperience && res.profile.workExperience.length > 0) {
          const exp = res.profile.workExperience[0];
          if (exp.designation) setDesignation(exp.designation);
          if (exp.organization) setOrganization(exp.organization);
          if (exp.description) setDepartment(exp.description);
        }
      }
    } catch (err) {
      // 404 is normal if profile not yet created
      console.log("No existing trainer profile found in backend, will create on save");
    }
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    setStatusMsg(null);

    const payload = {
      bio,
      expertise: specializations,
      skills: specializations,
      workExperience: [
        {
          organization: organization || 'India Meteorological Department (IMD)',
          designation: designation || 'Meteorologist / Radar Faculty',
          description: department || 'Radar Meteorology Division'
        }
      ]
    };

    if (isDemoMode) {
      setTimeout(() => {
        setSaving(false);
        setStatusMsg({ type: 'success', text: 'Trainer profile updated (Demo Mode)' });
      }, 400);
      return;
    }

    try {
      try {
        await updateTrainerProfileApi(payload);
      } catch (updateErr) {
        if (updateErr.status === 404 || updateErr.message?.toLowerCase().includes('not found')) {
          await createTrainerProfileApi(payload);
        } else {
          throw updateErr;
        }
      }
      setStatusMsg({ type: 'success', text: 'Trainer profile saved successfully to backend!' });
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to save trainer profile' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header Profile Card */}
      <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={currentUser?.avatar}
              alt={currentUser?.name}
              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-indigo-500 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{currentUser?.name}</h2>
                <span className="bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Certified MoES Faculty
                </span>
              </div>
              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">{currentUser?.designation}</p>
              <p className="text-xs text-slate-500 mt-0.5">{currentUser?.department} • {currentUser?.organization}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 px-4 py-2 rounded-xl text-center">
              <span className="text-[10px] text-amber-800 dark:text-amber-300 uppercase font-bold block">Trainer Rating</span>
              <div className="flex items-center justify-center gap-1 text-base font-black text-amber-600 dark:text-amber-400 mt-0.5">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{currentUser?.rating || 4.9} / 5.0</span>
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Profile'}</span>
            </button>
          </div>
        </div>
      </div>

      {statusMsg && (
        <div className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 ${statusMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800' : 'bg-red-50 text-red-800 border border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800'}`}>
          {statusMsg.type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Core Details */}
        <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3">
            Trainer Identity & Institutional Role
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Designation</label>
              <input
                type="text"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Division</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Faculty Biography / Scientific Background</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none text-xs leading-relaxed"
            ></textarea>
          </div>
        </div>

        {/* Specializations & Publications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Specializations */}
          <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3">
              Domain Expertise & Specializations
            </h3>

            <div className="flex flex-wrap gap-2 min-h-[100px] content-start">
              {specializations.map((spec, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
                >
                  <span>{spec}</span>
                  <button
                    type="button"
                    onClick={() => setSpecializations(specializations.filter((_, i) => i !== idx))}
                    className="hover:text-red-500"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add specialization area"
                value={newSpec}
                onChange={(e) => setNewSpec(e.target.value)}
                className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
              <button
                type="button"
                onClick={addSpec}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Publications */}
          <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3">
              Key MoES Technical Publications
            </h3>

            <div className="space-y-2 max-h-[140px] overflow-y-auto">
              {publications.map((pub, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs flex items-start justify-between gap-2">
                  <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-snug">{pub}</p>
                  <button
                    type="button"
                    onClick={() => setPublications(publications.filter((_, i) => i !== idx))}
                    className="text-slate-400 hover:text-red-500 transition shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Citation / Paper details"
                value={newPub}
                onChange={(e) => setNewPub(e.target.value)}
                className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
              <button
                type="button"
                onClick={addPub}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 flex items-center gap-1"
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
