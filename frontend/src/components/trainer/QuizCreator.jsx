import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Award, 
  Plus, 
  Trash2, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Save, 
  Sparkles, 
  FileQuestion,
  Loader2
} from 'lucide-react';

import { createQuizApi, publishQuizApi, getMyCoursesApi } from '../../services/trainer';

export const QuizCreator = ({ onCreated }) => {
  const { courses, currentUser, addAssessment, showToast, isDemoMode, isAuthenticated } = useApp();

  const [trainerCourses, setTrainerCourses] = useState([]);
  const [courseId, setCourseId] = useState('');
  const [title, setTitle] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(15);
  const [passingScore, setPassingScore] = useState(70);
  const [deadline, setDeadline] = useState('2026-10-30T23:59');
  const [saving, setSaving] = useState(false);

  // Load courses
  useEffect(() => {
    const loadCourses = async () => {
      if (isDemoMode || !isAuthenticated) {
        setTrainerCourses(courses);
        if (courses[0]) setCourseId(courses[0].id);
        return;
      }

      try {
        const res = await getMyCoursesApi({ limit: 50 });
        if (res && res.courses && res.courses.length > 0) {
          setTrainerCourses(res.courses);
          setCourseId(res.courses[0]._id);
        } else {
          setTrainerCourses(courses);
          if (courses[0]) setCourseId(courses[0].id);
        }
      } catch {
        setTrainerCourses(courses);
        if (courses[0]) setCourseId(courses[0].id);
      }
    };
    loadCourses();
  }, [courses, isDemoMode, isAuthenticated]);

  const [questions, setQuestions] = useState([
    {
      id: `q-${Date.now()}-1`,
      question: 'Which Doppler radar spectral parameter measures the degree of correlation between horizontally and vertically polarized pulses?',
      options: [
        'Correlation Coefficient (Rho_HV)',
        'Differential Reflectivity (Z_DR)',
        'Specific Differential Phase (K_DP)',
        'Doppler Velocity Spectrum Width'
      ],
      correctIndex: 0,
      explanation: 'Rho_HV measures how similarly the target hydrometeors behave in both horizontal and vertical polarization channels.'
    }
  ]);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: `q-${Date.now()}-${questions.length + 1}`,
        question: '',
        options: ['', '', '', ''],
        correctIndex: 0,
        explanation: ''
      }
    ]);
  };

  const handleRemoveQuestion = (index) => {
    if (questions.length <= 1) return;
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleQuestionChange = (index, value) => {
    const updated = [...questions];
    updated[index].question = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  const handleCorrectIndexChange = (qIndex, correctIndex) => {
    const updated = [...questions];
    updated[qIndex].correctIndex = correctIndex;
    setQuestions(updated);
  };

  const handleExplanationChange = (qIndex, value) => {
    const updated = [...questions];
    updated[qIndex].explanation = value;
    setQuestions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !courseId) {
      showToast("Please provide assessment title and select a course.", "warning");
      return;
    }

    // Validate that questions have text and options
    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].question.trim()) {
        showToast(`Question ${i + 1} cannot be empty.`, "warning");
        return;
      }
      const validOpts = questions[i].options.filter(o => o.trim());
      if (validOpts.length < 2) {
        showToast(`Question ${i + 1} must have at least 2 options.`, "warning");
        return;
      }
    }

    if (!isDemoMode && isAuthenticated) {
      try {
        setSaving(true);
        const backendQuestions = questions.map(q => ({
          question: q.question.trim(),
          options: q.options.map(o => o.trim()).filter(Boolean),
          correctAnswer: q.options[q.correctIndex]?.trim() || q.options[0]?.trim(),
          marks: 1
        }));

        const res = await createQuizApi(courseId, {
          title: title.trim(),
          description: `Official MoES Competency Assessment for ${title.trim()}`,
          passingMarks: Number(passingScore) || 70,
          questions: backendQuestions
        });

        if (res && res.quiz) {
          // Publish quiz
          await publishQuizApi(courseId, res.quiz._id);
          showToast("Quiz created and published successfully to trainees!", "success");
          if (onCreated) onCreated();
          return;
        }
      } catch (err) {
        showToast(err.data?.message || "Failed to create quiz on server. Saving locally...", "warning");
      } finally {
        setSaving(false);
      }
    }

    // Demo Mode Fallback
    const selectedCourse = trainerCourses.find(c => (c.id === courseId || c._id === courseId));
    const newAssessment = {
      id: `quiz-${Date.now()}`,
      courseId,
      courseTitle: selectedCourse?.title || "Specialized MoES Curriculum",
      title: title.trim(),
      durationMinutes: Number(durationMinutes),
      passingScore: Number(passingScore),
      deadline,
      totalQuestions: questions.length,
      creatorId: currentUser?.id || "usr-trainer-01",
      creatorName: currentUser?.name || "Dr. Rajesh K. Verma",
      questions
    };

    addAssessment(newAssessment);
    if (onCreated) onCreated();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fadeIn">
      
      {/* Header Info */}
      <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <FileQuestion className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Create Subject-Wise MCQ Questionnaire
              </h2>
              <p className="text-xs text-slate-500">
                Design timed assessments with automated grading, passing criteria, and deadlines.
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Publish Assessment</span>
          </button>
        </div>

        {/* Assessment Settings Form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Assessment Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Polarimetric Radar Interpretation & Nowcasting Test"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Associated Course *
            </label>
            <select
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none font-medium"
            >
              {trainerCourses.map(c => (
                <option key={c._id || c.id} value={c._id || c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Duration (min)
              </label>
              <input
                type="number"
                min="5"
                max="120"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Pass Mark (%)
              </label>
              <input
                type="number"
                min="50"
                max="90"
                value={passingScore}
                onChange={(e) => setPassingScore(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none font-bold text-amber-600"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <span>MCQ Question Bank ({questions.length} Items)</span>
          </h3>

          <button
            type="button"
            onClick={handleAddQuestion}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 hover:bg-indigo-100 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Question</span>
          </button>
        </div>

        {questions.map((q, qIndex) => (
          <div
            key={q.id || qIndex}
            className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
          >
            <div className="flex items-start justify-between gap-4">
              <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                {qIndex + 1}
              </span>

              <div className="flex-1">
                <input
                  type="text"
                  required
                  value={q.question}
                  onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                  placeholder="Enter assessment question prompt..."
                  className="w-full px-3 py-2 text-xs sm:text-sm font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {questions.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveQuestion(qIndex)}
                  className="text-slate-400 hover:text-red-500 p-1 rounded-lg transition"
                  title="Remove Question"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* 4 Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {q.options.map((opt, optIndex) => (
                <div key={optIndex} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`correct-${qIndex}`}
                    checked={q.correctIndex === optIndex}
                    onChange={() => handleCorrectIndexChange(qIndex, optIndex)}
                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 shrink-0 cursor-pointer"
                    title="Mark as Correct Answer"
                  />
                  <input
                    type="text"
                    required
                    value={opt}
                    onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
                    placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                    className={`flex-1 px-3 py-1.5 text-xs rounded-xl border outline-none transition ${
                      q.correctIndex === optIndex
                        ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 font-semibold text-emerald-900 dark:text-emerald-300'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white'
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

    </form>
  );
};
