import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Clock, 
  Award, 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  HelpCircle, 
  Flag, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw,
  Sparkles,
  Printer,
  MessageSquare
} from 'lucide-react';

export const MCQAssessmentEngine = () => {
  const { 
    assessments, 
    activeAssessmentId, 
    setCurrentView, 
    submitQuizAnswers, 
    setActiveFeedbackCourse,
    courses,
    showToast
  } = useApp();

  const assessment = assessments.find(a => a.id === activeAssessmentId) || assessments[0];
  const course = courses.find(c => c.id === assessment?.courseId);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { qIndex: selectedOptionIndex }
  const [flaggedQuestions, setFlaggedQuestions] = useState({}); // { qIndex: true/false }
  const [timeLeft, setTimeLeft] = useState((assessment?.durationMinutes || 15) * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [scoreReport, setScoreReport] = useState(null);

  // Timer countdown
  useEffect(() => {
    if (isSubmitted) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSubmitted]);

  const questions = assessment?.questions || [];
  const currentQ = questions[currentQuestionIndex];

  const handleSelectOption = (optIndex) => {
    if (isSubmitted) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: optIndex
    });
  };

  const toggleFlag = () => {
    setFlaggedQuestions({
      ...flaggedQuestions,
      [currentQuestionIndex]: !flaggedQuestions[currentQuestionIndex]
    });
  };

  const handleSubmit = () => {
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        correctCount++;
      }
    });

    const percentage = Math.round((correctCount / questions.length) * 100);
    const passed = submitQuizAnswers(assessment.id, percentage, selectedAnswers);

    setScoreReport({
      totalQuestions: questions.length,
      correctCount,
      percentage,
      passed,
      passingScore: assessment.passingScore || 70
    });
    setIsSubmitted(true);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setFlaggedQuestions({});
    setCurrentQuestionIndex(0);
    setTimeLeft((assessment?.durationMinutes || 15) * 60);
    setIsSubmitted(false);
    setScoreReport(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fadeIn">
      
      {/* Assessment Header */}
      <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('trainee')}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-moes-600 dark:text-sky-400 bg-moes-50 dark:bg-moes-950 px-2 py-0.5 rounded border border-moes-200 dark:border-moes-800">
                Subject-Wise MCQ Assessment
              </span>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-1">
                {assessment.title}
              </h1>
              <p className="text-xs text-slate-500">{assessment.courseTitle}</p>
            </div>
          </div>

          {!isSubmitted && (
            <div className="flex items-center gap-3">
              {/* Live Timer */}
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-sm font-bold shadow-inner ${
                timeLeft < 180 
                  ? 'bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/40 animate-pulse'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700'
              }`}>
                <Clock className="w-4 h-4 text-amber-500" />
                <span>{formatTime(timeLeft)}</span>
              </div>

              <button
                onClick={handleSubmit}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition"
              >
                Submit Test
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Results View */}
      {isSubmitted && scoreReport ? (
        <div className="space-y-6 animate-fadeIn">
          {/* Result Card */}
          <div className={`rounded-2xl p-8 border shadow-xl text-center space-y-4 ${
            scoreReport.passed
              ? 'bg-gradient-to-b from-emerald-500/10 via-emerald-500/5 to-transparent border-emerald-500/40'
              : 'bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent border-amber-500/40'
          }`}>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white dark:bg-slate-900 shadow-md">
              {scoreReport.passed ? (
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              ) : (
                <AlertCircle className="w-10 h-10 text-amber-500" />
              )}
            </div>

            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                {scoreReport.passed ? "Assessment Passed with Distinction!" : "Assessment Threshold Not Met"}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                {scoreReport.passed
                  ? "Congratulations! Your competency score qualifies for the MoES Certified Digital Credential."
                  : `You scored ${scoreReport.percentage}%. The minimum passing benchmark is ${scoreReport.passingScore}%.`}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 py-2">
              <div className="glass-card px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500">Your Score:</span>{' '}
                <strong className="text-lg font-black text-slate-900 dark:text-white">{scoreReport.percentage}%</strong>
              </div>
              <div className="glass-card px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500">Correct Answers:</span>{' '}
                <strong className="text-lg font-black text-emerald-600">{scoreReport.correctCount} / {scoreReport.totalQuestions}</strong>
              </div>
              <div className="glass-card px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500">Passing Benchmark:</span>{' '}
                <strong className="text-lg font-black text-moes-600 dark:text-sky-400">{scoreReport.passingScore}%</strong>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={handleRetake}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 transition"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retake Assessment</span>
              </button>

              {course && (
                <button
                  onClick={() => setActiveFeedbackCourse(course)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white shadow-sm transition"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Provide Training Feedback</span>
                </button>
              )}

              <button
                onClick={() => setCurrentView('trainee')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-moes-600 hover:bg-moes-700 text-white shadow-md transition"
              >
                <span>Go to Trainee Hub</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Detailed Question Review Breakdown */}
          <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-6">
            <h3 className="font-bold text-base text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-moes-500" />
              <span>Detailed Question Review & Scientific Rationale</span>
            </h3>

            <div className="space-y-6">
              {questions.map((q, qIndex) => {
                const userAns = selectedAnswers[qIndex];
                const isCorrect = userAns === q.correctIndex;

                return (
                  <div
                    key={q.id || qIndex}
                    className={`p-5 rounded-2xl border text-xs space-y-3 ${
                      isCorrect
                        ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-900/60'
                        : 'bg-red-50/40 dark:bg-red-950/20 border-red-300 dark:border-red-900/60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2">
                        <span className="font-bold font-mono px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0">
                          Q{qIndex + 1}
                        </span>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                          {q.question}
                        </h4>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 ${
                        isCorrect ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                      }`}>
                        {isCorrect ? 'Correct (+1)' : 'Incorrect (0)'}
                      </span>
                    </div>

                    {/* Options List */}
                    <div className="space-y-1.5 pl-6">
                      {q.options.map((opt, optIndex) => {
                        const isChosen = userAns === optIndex;
                        const isAnswerKey = q.correctIndex === optIndex;

                        return (
                          <div
                            key={optIndex}
                            className={`p-2.5 rounded-xl border flex items-center justify-between ${
                              isAnswerKey
                                ? 'bg-emerald-100 dark:bg-emerald-900/40 border-emerald-500 font-semibold text-emerald-950 dark:text-emerald-200'
                                : isChosen && !isCorrect
                                ? 'bg-red-100 dark:bg-red-900/40 border-red-500 font-semibold text-red-950 dark:text-red-200'
                                : 'bg-white/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <span>{opt}</span>
                            {isAnswerKey && (
                              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 ml-2">
                                (Correct Key)
                              </span>
                            )}
                            {isChosen && !isCorrect && (
                              <span className="text-[10px] font-bold text-red-600 dark:text-red-300 ml-2">
                                (Your Answer)
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Scientific Rationale Explanation */}
                    {q.explanation && (
                      <div className="mt-3 p-3 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900/50 text-sky-900 dark:text-sky-200">
                        <p className="font-bold text-[11px] text-moes-700 dark:text-sky-300 mb-0.5">
                          Scientific Explanation:
                        </p>
                        <p className="text-[11px] leading-relaxed">{q.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Live Quiz Taking Mode */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Question Card */}
          <div className="lg:col-span-8 space-y-6">
            <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-lg space-y-6">
              
              {/* Question Header */}
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <span className="font-bold text-xs text-moes-600 dark:text-sky-400">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>

                <button
                  onClick={toggleFlag}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    flaggedQuestions[currentQuestionIndex]
                      ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300'
                      : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>{flaggedQuestions[currentQuestionIndex] ? 'Flagged for Review' : 'Flag Question'}</span>
                </button>
              </div>

              {/* Question Prompt */}
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
                {currentQ?.question}
              </h3>

              {/* Options */}
              <div className="space-y-3 pt-2">
                {currentQ?.options?.map((option, optIdx) => {
                  const isSelected = selectedAnswers[currentQuestionIndex] === optIdx;

                  return (
                    <div
                      key={optIdx}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`p-4 rounded-xl border cursor-pointer transition flex items-start gap-3 text-xs sm:text-sm ${
                        isSelected
                          ? 'border-moes-500 bg-moes-50/80 dark:bg-moes-950/60 text-moes-900 dark:text-sky-200 font-semibold shadow-sm ring-1 ring-moes-400'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center font-mono text-xs shrink-0 mt-0.5 ${
                        isSelected
                          ? 'border-moes-600 bg-moes-600 text-white font-bold'
                          : 'border-slate-400 text-slate-500'
                      }`}>
                        {String.fromCharCode(65 + optIdx)}
                      </div>
                      <span className="leading-snug">{option}</span>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Navigation */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-800">
                <button
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                  className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                {currentQuestionIndex === questions.length - 1 ? (
                  <button
                    onClick={handleSubmit}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Submit Assessment</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                    className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold bg-moes-600 hover:bg-moes-700 text-white shadow-sm transition"
                  >
                    <span>Next Question</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>

            </div>
          </div>

          {/* Right Column: Question Navigator Palette */}
          <div className="lg:col-span-4 space-y-4">
            <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Question Navigator Palette
              </h4>

              <div className="grid grid-cols-5 gap-2">
                {questions.map((_, idx) => {
                  const isCurrent = currentQuestionIndex === idx;
                  const isAnswered = selectedAnswers[idx] !== undefined;
                  const isFlagged = flaggedQuestions[idx];

                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`h-10 rounded-xl font-mono text-xs font-bold flex flex-col items-center justify-center relative transition ${
                        isCurrent
                          ? 'ring-2 ring-moes-500 shadow'
                          : ''
                      } ${
                        isAnswered
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      <span>{idx + 1}</span>
                      {isFlagged && (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 absolute top-1 right-1"></span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2 text-[11px] text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-emerald-600"></span>
                  <span>Answered ({Object.keys(selectedAnswers).length})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-slate-200 dark:bg-slate-700"></span>
                  <span>Unanswered ({questions.length - Object.keys(selectedAnswers).length})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span>Flagged for review ({Object.values(flaggedQuestions).filter(Boolean).length})</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleSubmit}
                  className="w-full py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition shadow"
                >
                  Finish & Submit
                </button>
              </div>

            </div>
          </div>

        </div>
      )}

    </div>
  );
};
