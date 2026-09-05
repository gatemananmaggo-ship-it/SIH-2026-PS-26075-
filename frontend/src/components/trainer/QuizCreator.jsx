import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Award, 
  Plus, 
  Trash2, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  Save, 
  Sparkles,
  Layers,
  FileQuestion
} from 'lucide-react';

export const QuizCreator = ({ onCreated }) => {
  const { courses, currentUser, addAssessment } = useApp();

  const [courseId, setCourseId] = useState(courses[0]?.id || 'crs-01');
  const [title, setTitle] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(15);
  const [passingScore, setPassingScore] = useState(70);
  const [deadline, setDeadline] = useState('2026-10-30T23:59');
  
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const selectedCourse = courses.find(c => c.id === courseId);

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
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition"
          >
            <Save className="w-4 h-4" />
            <span>Publish Assessment</span>
          </button>
        </div>

        {/* Assessment Settings Form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Assessment Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Module 3: Dual-Pol Radar Data Quality & Solar Sunscan"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Target Course Curriculum
            </label>
            <select
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
            >
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Submission Deadline
            </label>
            <input
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Test Duration (Minutes)
            </label>
            <input
              type="number"
              min="5"
              max="180"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Passing Threshold (%)
            </label>
            <input
              type="number"
              min="50"
              max="100"
              value={passingScore}
              onChange={(e) => setPassingScore(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
            />
          </div>
        </div>
      </div>

      {/* Questions Builder Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <span>Question Bank ({questions.length} Questions)</span>
          </h3>

          <button
            type="button"
            onClick={handleAddQuestion}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Question</span>
          </button>
        </div>

        {questions.map((q, qIdx) => (
          <div
            key={q.id || qIdx}
            className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 relative"
          >
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                Question #{qIdx + 1}
              </span>

              {questions.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveQuestion(qIdx)}
                  className="text-slate-400 hover:text-red-500 transition"
                  title="Delete question"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Question Statement / Problem
              </label>
              <textarea
                rows={2}
                required
                placeholder="Enter scientific question prompt..."
                value={q.question}
                onChange={(e) => handleQuestionChange(qIdx, e.target.value)}
                className="w-full p-3 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
              ></textarea>
            </div>

            {/* 4 Options */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Answer Options (Select radio button for Correct Key)
              </label>

              {q.options.map((opt, optIdx) => (
                <div key={optIdx} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`correct_${qIdx}`}
                    checked={q.correctIndex === optIdx}
                    onChange={() => handleCorrectIndexChange(qIdx, optIdx)}
                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                    title="Mark as correct answer"
                  />
                  <span className="font-mono text-xs font-bold w-4 text-slate-500">
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <input
                    type="text"
                    required
                    placeholder={`Option ${String.fromCharCode(65 + optIdx)} text...`}
                    value={opt}
                    onChange={(e) => handleOptionChange(qIdx, optIdx, e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  />
                </div>
              ))}
            </div>

            {/* Explanation */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Scientific Explanation / Rationale (Shown upon completion)
              </label>
              <input
                type="text"
                placeholder="Why is this option correct according to meteorological/ocean principles?"
                value={q.explanation}
                onChange={(e) => handleExplanationChange(qIdx, e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
              />
            </div>

          </div>
        ))}
      </div>

      <div className="pt-2 text-right">
        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition inline-flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>Publish Assessment Questionnaire</span>
        </button>
      </div>

    </form>
  );
};
