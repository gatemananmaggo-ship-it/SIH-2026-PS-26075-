import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FolderDown, 
  Upload, 
  Trash2, 
  FileText, 
  Layers, 
  Plus, 
  CheckCircle2, 
  Download, 
  Globe, 
  Search,
  Filter,
  BookOpen,
  Video,
  Clock,
  Send,
  Eye,
  ChevronDown,
  ChevronUp,
  Loader2,
  Sparkles
} from 'lucide-react';

import { 
  getTrainerLibraryApi, 
  createCourseApi, 
  publishCourseApi, 
  deleteCourseApi,
  createLessonApi,
  deleteLessonApi 
} from '../../services/trainer';
import { Pagination } from '../common/Pagination';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { EmptyState } from '../common/EmptyState';

export const TrainerLibrary = () => {
  const { currentUser, showToast, isDemoMode, isAuthenticated } = useApp();

  // Library state (Course + Lessons structure directly from backend)
  const [library, setLibrary] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1, limit: 6 });

  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState('');

  // Expanded course cards to view embedded lessons
  const [expandedCourseId, setExpandedCourseId] = useState(null);

  // Modals
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [selectedCourseForLesson, setSelectedCourseForLesson] = useState(null);

  // New Course Form
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    category: 'Radar Meteorology',
    level: 'beginner',
    duration: 10,
    thumbnail: 'https://images.unsplash.com/photo-1590055531615-f16d36ffe8ec?w=600&auto=format&fit=crop&q=80'
  });

  // New Lesson Form
  const [lessonForm, setLessonForm] = useState({
    title: '',
    description: '',
    content: '',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    order: 1,
    duration: 30
  });

  const [actionLoading, setActionLoading] = useState(false);

  // Fetch Trainer Library
  const loadLibrary = useCallback(async (targetPage = 1, filters = {}) => {
    if (isDemoMode || !isAuthenticated) return;
    try {
      setLoading(true);
      const params = {
        page: targetPage,
        limit: 6,
        search: filters.search !== undefined ? filters.search : search,
        category: filters.category !== undefined ? filters.category : category,
        level: filters.level !== undefined ? filters.level : level
      };

      const res = await getTrainerLibraryApi(params);
      if (res) {
        setLibrary(res.library || []);
        setPage(res.page || targetPage);
        setMeta({
          total: res.total || res.totalCourses || 0,
          totalPages: res.totalPages || 1,
          limit: res.limit || 6
        });
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  }, [search, category, level, isDemoMode, isAuthenticated]);

  useEffect(() => {
    loadLibrary(1);
  }, [loadLibrary]);

  // Handle Filter Changes (resets page to 1)
  const handleSearchChange = (val) => {
    setSearch(val);
    setPage(1);
    loadLibrary(1, { search: val });
  };

  const handleCategoryChange = (val) => {
    setCategory(val);
    setPage(1);
    loadLibrary(1, { category: val });
  };

  const handleLevelChange = (val) => {
    setLevel(val);
    setPage(1);
    loadLibrary(1, { level: val });
  };

  // Create Course
  const handleCreateCourse = async (e) => {
    e.preventDefault();
    if (!courseForm.title.trim()) return;

    try {
      setActionLoading(true);
      await createCourseApi({
        title: courseForm.title.trim(),
        description: courseForm.description.trim(),
        category: courseForm.category,
        level: courseForm.level,
        duration: Number(courseForm.duration) || 10,
        thumbnail: courseForm.thumbnail
      });

      showToast("Course created successfully in Draft mode!", "success");
      setShowCourseModal(false);
      setCourseForm({
        title: '',
        description: '',
        category: 'Radar Meteorology',
        level: 'beginner',
        duration: 10,
        thumbnail: 'https://images.unsplash.com/photo-1590055531615-f16d36ffe8ec?w=600&auto=format&fit=crop&q=80'
      });
      loadLibrary(1);
    } catch (err) {
      showToast(err.data?.message || "Failed to create course", "warning");
    } finally {
      setActionLoading(false);
    }
  };

  // Publish Course
  const handlePublishCourse = async (courseId) => {
    try {
      await publishCourseApi(courseId);
      showToast("Course published successfully! Trainees can now view and enroll.", "success");
      loadLibrary(page);
    } catch (err) {
      showToast(err.data?.message || "Could not publish course", "warning");
    }
  };

  // Delete Course
  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await deleteCourseApi(courseId);
      showToast("Course removed from library", "info");
      loadLibrary(page);
    } catch (err) {
      showToast(err.data?.message || "Failed to delete course", "warning");
    }
  };

  // Add Lesson
  const handleAddLesson = async (e) => {
    e.preventDefault();
    if (!selectedCourseForLesson || !lessonForm.title.trim()) return;

    try {
      setActionLoading(true);
      await createLessonApi(selectedCourseForLesson._id, {
        title: lessonForm.title.trim(),
        description: lessonForm.description.trim(),
        content: lessonForm.content.trim(),
        videoUrl: lessonForm.videoUrl.trim(),
        order: Number(lessonForm.order) || 1,
        duration: Number(lessonForm.duration) || 30
      });

      showToast(`Lesson added to "${selectedCourseForLesson.title}"!`, "success");
      setShowLessonModal(false);
      setLessonForm({
        title: '',
        description: '',
        content: '',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        order: 1,
        duration: 30
      });
      loadLibrary(page);
    } catch (err) {
      showToast(err.data?.message || "Failed to create lesson", "warning");
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Lesson
  const handleDeleteLesson = async (courseId, lessonId) => {
    try {
      await deleteLessonApi(courseId, lessonId);
      showToast("Lesson deleted", "info");
      loadLibrary(page);
    } catch (err) {
      showToast(err.data?.message || "Failed to delete lesson", "warning");
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider mb-1.5">
              <FolderDown className="w-3.5 h-3.5" />
              <span>Trainer Library & Curriculum Manager</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Course Library & Structured Lessons
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage your authored courses and embedded syllabus lessons. Directly backed by live MongoDB records.
            </p>
          </div>

          <button
            onClick={() => setShowCourseModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Course</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-card rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search by course title or description..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Category Filter */}
        <div className="w-full md:w-48">
          <select
            value={category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none font-medium"
          >
            <option value="">All Categories</option>
            <option value="Radar Meteorology">Radar Meteorology</option>
            <option value="Atmospheric Modeling">Atmospheric Modeling</option>
            <option value="Oceanography">Oceanography</option>
            <option value="Satellite Remote Sensing">Satellite Remote Sensing</option>
            <option value="Seismology">Seismology</option>
          </select>
        </div>

        {/* Level Filter */}
        <div className="w-full md:w-36">
          <select
            value={level}
            onChange={(e) => handleLevelChange(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none font-medium"
          >
            <option value="">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* Course List & Embedded Lessons */}
      {loading ? (
        <LoadingSpinner text="Fetching trainer library..." />
      ) : library.length > 0 ? (
        <div className="space-y-4">
          {library.map(({ course, lessons = [] }) => {
            const isExpanded = expandedCourseId === course._id;
            const isPublished = course.status === 'published';

            return (
              <div
                key={course._id}
                className="glass-card rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition hover:border-indigo-300 dark:hover:border-indigo-700"
              >
                {/* Course Header Bar */}
                <div className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <img
                      src={course.thumbnail || "https://images.unsplash.com/photo-1590055531615-f16d36ffe8ec?w=600&auto=format&fit=crop&q=80"}
                      alt={course.title}
                      className="w-20 h-14 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          isPublished
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                        }`}>
                          {course.status || "Draft"}
                        </span>
                        <span className="text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded">
                          {course.category}
                        </span>
                        <span className="text-[10px] text-slate-400 capitalize">
                          {course.level} Level • {course.duration || 10} Hours
                        </span>
                      </div>
                      <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white mt-1">
                        {course.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                        {course.description}
                      </p>
                    </div>
                  </div>

                  {/* Course Action Buttons */}
                  <div className="flex items-center gap-2 flex-wrap self-end md:self-center">
                    {!isPublished && (
                      <button
                        onClick={() => handlePublishCourse(course._id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition"
                        title="Publish course for trainees"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Publish</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setSelectedCourseForLesson(course);
                        setShowLessonModal(true);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 hover:bg-indigo-100 transition"
                      title="Add Lesson to Course"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Lesson</span>
                    </button>

                    <button
                      onClick={() => setExpandedCourseId(isExpanded ? null : course._id)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition"
                    >
                      <span>{lessons.length} Lessons</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={() => handleDeleteCourse(course._id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition"
                      title="Delete Course"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Embedded Lessons List (Directly consumed from backend without refetch) */}
                {isExpanded && (
                  <div className="bg-slate-50/70 dark:bg-slate-900/60 p-5 border-t border-slate-200 dark:border-slate-800 space-y-3 animate-fadeIn">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                      <span>Curriculum Syllabus Lessons ({lessons.length})</span>
                      <button
                        onClick={() => {
                          setSelectedCourseForLesson(course);
                          setShowLessonModal(true);
                        }}
                        className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 text-[11px]"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Another Lesson</span>
                      </button>
                    </div>

                    {lessons.length === 0 ? (
                      <p className="text-xs text-slate-400 italic py-2">
                        No lessons added yet. Click &quot;Add Lesson&quot; to build your syllabus.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {lessons.map(lesson => (
                          <div
                            key={lesson._id}
                            className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-start justify-between gap-3 text-xs shadow-sm"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="w-5 h-5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-[10px] flex items-center justify-center shrink-0">
                                  {lesson.order || 1}
                                </span>
                                <h4 className="font-bold text-slate-900 dark:text-white line-clamp-1">
                                  {lesson.title}
                                </h4>
                              </div>
                              <p className="text-[11px] text-slate-500 line-clamp-1">
                                {lesson.description || lesson.content || "Course module unit"}
                              </p>
                              <div className="text-[10px] text-slate-400 flex items-center gap-2">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{lesson.duration || 30} mins</span>
                                </span>
                                {lesson.videoUrl && (
                                  <span className="flex items-center gap-1 text-sky-500">
                                    <Video className="w-3 h-3" />
                                    <span>Video Stream</span>
                                  </span>
                                )}
                              </div>
                            </div>

                            <button
                              onClick={() => handleDeleteLesson(course._id, lesson._id)}
                              className="text-slate-400 hover:text-red-500 p-1 transition"
                              title="Delete Lesson"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Pagination */}
          <Pagination
            page={page}
            totalPages={meta.totalPages}
            total={meta.total}
            limit={meta.limit}
            itemName="courses"
            onPageChange={(p) => loadLibrary(p)}
          />
        </div>
      ) : (
        <EmptyState
          icon={BookOpen}
          title="No Courses in Trainer Library"
          description="Create your first training course to start publishing lessons and scheduling cohorts."
          actionLabel="Create First Course"
          onAction={() => setShowCourseModal(true)}
        />
      )}

      {/* Modal: Create Course */}
      {showCourseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Create New Training Course
            </h3>
            <form onSubmit={handleCreateCourse} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Course Title *</label>
                <input
                  type="text"
                  required
                  value={courseForm.title}
                  onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                  placeholder="e.g. Polarimetric Radar Nowcasting Masterclass"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Category *</label>
                  <select
                    value={courseForm.category}
                    onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                  >
                    <option value="Radar Meteorology">Radar Meteorology</option>
                    <option value="Atmospheric Modeling">Atmospheric Modeling</option>
                    <option value="Oceanography">Oceanography</option>
                    <option value="Satellite Remote Sensing">Satellite Remote Sensing</option>
                    <option value="Seismology">Seismology</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Target Level *</label>
                  <select
                    value={courseForm.level}
                    onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Course Description *</label>
                <textarea
                  rows={3}
                  required
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                  placeholder="Detailed outline of topics covered, prerequisites, and learning objectives..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Duration (Hours) *</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={courseForm.duration}
                    onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Thumbnail URL</label>
                  <input
                    type="text"
                    value={courseForm.thumbnail}
                    onChange={(e) => setCourseForm({ ...courseForm, thumbnail: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCourseModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5"
                >
                  {actionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                  <span>Create Course</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Lesson */}
      {showLessonModal && selectedCourseForLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Add Lesson to &quot;{selectedCourseForLesson.title}&quot;
              </h3>
              <p className="text-xs text-slate-500">Insert curriculum modules directly into course syllabus.</p>
            </div>

            <form onSubmit={handleAddLesson} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Lesson Title *</label>
                <input
                  type="text"
                  required
                  value={lessonForm.title}
                  onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                  placeholder="e.g. Module 1: Radar Polarimetry Principles"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Lesson Order # *</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={lessonForm.order}
                    onChange={(e) => setLessonForm({ ...lessonForm, order: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Duration (Minutes) *</label>
                  <input
                    type="number"
                    min={5}
                    required
                    value={lessonForm.duration}
                    onChange={(e) => setLessonForm({ ...lessonForm, duration: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Lesson Summary / Description</label>
                <textarea
                  rows={2}
                  value={lessonForm.description}
                  onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })}
                  placeholder="Brief summary of equations and concepts covered..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                ></textarea>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Video URL (MP4 / Stream)</label>
                <input
                  type="text"
                  value={lessonForm.videoUrl}
                  onChange={(e) => setLessonForm({ ...lessonForm, videoUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowLessonModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5"
                >
                  {actionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                  <span>Save Lesson</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
