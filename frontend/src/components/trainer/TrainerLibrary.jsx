import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FolderDown, 
  Upload, 
  Trash2, 
  FileText, 
  FileCode, 
  Video, 
  Presentation, 
  Layers, 
  Plus, 
  CheckCircle2, 
  Download, 
  Lock, 
  Globe 
} from 'lucide-react';

export const TrainerLibrary = () => {
  const { trainerMaterials, uploadTrainerMaterial, deleteTrainerMaterial, currentUser, showToast } = useApp();
  const [showUploadModal, setShowUploadModal] = useState(false);

  const [title, setTitle] = useState('');
  const [domain, setDomain] = useState('Radar Meteorology');
  const [fileType, setFileType] = useState('PDF');
  const [fileSize, setFileSize] = useState('8.4 MB');
  const [accessRole, setAccessRole] = useState('All Trainees');
  const [description, setDescription] = useState('');

  const handleUpload = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    uploadTrainerMaterial({
      id: `mat-${Date.now()}`,
      trainerId: currentUser?.id || "usr-trainer-01",
      trainerName: currentUser?.name || "Dr. Rajesh K. Verma",
      title: title.trim(),
      domain,
      fileType,
      fileSize: fileSize || "10.0 MB",
      uploadDate: new Date().toISOString().split('T')[0],
      downloads: 0,
      accessRole,
      description: description.trim()
    });

    setTitle('');
    setDescription('');
    setShowUploadModal(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider mb-1.5">
              <FolderDown className="w-3.5 h-3.5" />
              <span>MoES Trainer Shared Repository</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Trainer Resource Library & Datasets
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Upload recorded lecture links, PPT presentations, radar calibration manuals, and sample meteorological datasets.
            </p>
          </div>

          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition"
          >
            <Upload className="w-4 h-4" />
            <span>Upload New Material</span>
          </button>
        </div>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {trainerMaterials.map(mat => {
          const isMyUpload = mat.trainerId === currentUser?.id || mat.trainerName === currentUser?.name;

          return (
            <div
              key={mat.id}
              className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4 hover:border-indigo-400/60 transition group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                    {mat.fileType} • {mat.fileSize}
                  </span>
                  <span className="text-[10px] text-slate-400">{mat.uploadDate}</span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2 leading-snug">
                  {mat.title}
                </h3>

                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {mat.description}
                </p>

                <div className="pt-2 text-[11px] text-slate-500 flex items-center justify-between">
                  <span>Domain: <strong>{mat.domain}</strong></span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <Globe className="w-3 h-3" />
                    <span>{mat.accessRole}</span>
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">
                  {mat.downloads} Downloads
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => showToast(`Downloading: ${mat.title}`, "success")}
                    className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                    title="Download Preview"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>

                  {isMyUpload && (
                    <button
                      onClick={() => deleteTrainerMaterial(mat.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition"
                      title="Delete Material"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Upload Modal Dialog */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Upload className="w-4 h-4 text-indigo-500" />
                <span>Upload to Trainer Shared Repository</span>
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Resource Title / Document Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dual-Pol Hydrometeor Classification Look-up Tables"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Domain Category
                  </label>
                  <select
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  >
                    <option value="Radar Meteorology">Radar Meteorology</option>
                    <option value="Atmospheric Modeling">Atmospheric Modeling</option>
                    <option value="Oceanography">Oceanography</option>
                    <option value="Satellite Remote Sensing">Satellite Remote Sensing</option>
                    <option value="Seismology">Seismology</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Resource Type
                  </label>
                  <select
                    value={fileType}
                    onChange={(e) => setFileType(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  >
                    <option value="PDF">PDF Handbook / Manual</option>
                    <option value="PPTX">PPTX Slide Presentation</option>
                    <option value="NetCDF">NetCDF / Radar Raw Data</option>
                    <option value="Video MP4">Recorded Video Lecture Link</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    File Size
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 14.5 MB"
                    value={fileSize}
                    onChange={(e) => setFileSize(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Access Permission
                  </label>
                  <select
                    value={accessRole}
                    onChange={(e) => setAccessRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  >
                    <option value="All Trainees">All Trainees (Open Library)</option>
                    <option value="Enrolled Trainees">Enrolled Trainees Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Brief Summary / Usage Notes
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Outline what practical exercise or lecture this document supports..."
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                ></textarea>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
                >
                  Confirm & Upload
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
