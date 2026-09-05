import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Radio, 
  Layers, 
  Clock, 
  Star, 
  Users, 
  BookOpen, 
  PlayCircle, 
  Award, 
  CheckCircle2, 
  ChevronRight, 
  Filter,
  FileText
} from 'lucide-react';

export const DomainCatalogue = ({ searchQuery = '' }) => {
  const { courses, enrollCourse, openCoursePlayer, currentUser, currentRole } = useApp();
  const [selectedDomain, setSelectedDomain] = useState('All');

  const domains = [
    'All',
    'Radar Meteorology',
    'Atmospheric Modeling',
    'Oceanography',
    'Satellite Remote Sensing',
    'Seismology & Solid Earth'
  ];

  const filteredCourses = courses.filter(course => {
    const matchesDomain = selectedDomain === 'All' || course.domain === selectedDomain;
    const matchesSearch = 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.trainerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDomain && matchesSearch;
  });

  return (
    <section id="courses-section" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-moes-100 dark:bg-moes-950/60 text-moes-700 dark:text-sky-400 text-xs font-bold uppercase tracking-wider mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Specialized MoES / IMD Curriculum</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Capacity Building Course Catalogue
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Interactive, self-paced and cohort-based technical training for atmospheric scientists, weather forecasters, and ocean engineers.
          </p>
        </div>

        {/* Domain Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {domains.map(dom => (
            <button
              key={dom}
              onClick={() => setSelectedDomain(dom)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedDomain === dom
                  ? 'bg-moes-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {dom}
            </button>
          ))}
        </div>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-16 glass-card rounded-2xl">
          <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-200">No courses match your filter</h3>
          <p className="text-xs text-slate-500 mt-1">Try resetting the domain category or clearing your search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => {
            const isEnrolled = currentUser?.enrolledCourses?.includes(course.id);
            const isCompleted = currentUser?.completedCourses?.includes(course.id);

            return (
              <div
                key={course.id}
                className="group glass-card rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between border border-slate-200 dark:border-slate-800"
              >
                {/* Thumbnail & Badges */}
                <div className="relative aspect-video overflow-hidden bg-slate-900">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                  
                  {/* Domain Tag */}
                  <div className="absolute top-3 left-3">
                    <span className="bg-moes-900/90 text-sky-300 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border border-moes-500/40">
                      {course.domain}
                    </span>
                  </div>

                  {/* Level Tag */}
                  <div className="absolute top-3 right-3">
                    <span className="bg-slate-900/80 text-amber-300 backdrop-blur-md text-[10px] font-bold px-2 py-0.5 rounded border border-amber-500/30">
                      {course.level}
                    </span>
                  </div>

                  {/* Rating & Duration */}
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] text-white">
                    <span className="flex items-center gap-1 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <strong>{course.rating}</strong> ({course.totalRatings || 24})
                    </span>
                    <span className="flex items-center gap-1 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded">
                      <Clock className="w-3 h-3 text-sky-300" />
                      <span>{course.duration}</span>
                    </span>
                  </div>
                </div>

                {/* Course Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-moes-600 dark:group-hover:text-sky-400 transition">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>
                  </div>

                  {/* Trainer & Module Count */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-moes-100 dark:bg-moes-900 flex items-center justify-center font-bold text-[10px] text-moes-700 dark:text-sky-300">
                        {course.trainerName.split(' ')[1]?.[0] || 'T'}
                      </div>
                      <span className="truncate max-w-[130px] font-medium">{course.trainerName}</span>
                    </div>

                    <span className="flex items-center gap-1 font-medium text-slate-500">
                      <FileText className="w-3.5 h-3.5" />
                      <span>{course.modules?.length || 4} Modules</span>
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2">
                    {isCompleted ? (
                      <button
                        onClick={() => openCoursePlayer(course.id)}
                        className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                        <span>Completed • Review Course</span>
                      </button>
                    ) : isEnrolled ? (
                      <button
                        onClick={() => openCoursePlayer(course.id)}
                        className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-moes-600 hover:bg-moes-700 text-white transition flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <PlayCircle className="w-4 h-4 text-sky-200" />
                        <span>Continue Learning Player</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => enrollCourse(course.id)}
                        className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-900 hover:bg-moes-700 dark:bg-slate-800 dark:hover:bg-moes-600 text-white transition flex items-center justify-center gap-1.5 shadow-sm border border-slate-700"
                      >
                        <span>Enroll & Access Modules</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

    </section>
  );
};
