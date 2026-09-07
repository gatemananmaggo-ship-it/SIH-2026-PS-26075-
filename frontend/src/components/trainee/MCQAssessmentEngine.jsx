import React, { useState, useEffect, useCallback } from 'react';
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
  MessageSquare,
  Loader2
} from 'lucide-react';

import { getTraineeQuizApi, submitQuizAttemptApi, generateCertificateApi } from '../../services/trainee';

export const MCQAssessmentEngine = () => {
  const { 
    assessments, 
    activeAssessmentId, 
    activeCourseId,
    setCurrentView, 
    submitQuizAnswers, 
    setActiveFeedbackCourse,
    courses,
    showToast,
    isDemoMode,
    isAuthenticated,
    setActiveCertificate
  } = useApp();

  const assessment = assessments.find(
    a => a.id === activeAssessmentId || a._id === activeAssessmentId
  );
  const targetAssessment = assessment || (assessments.length > 0 ? assessments[0] : null);
  const course = courses.find(
    c => (c.id === (activeCourseId || targetAssessment?.courseId) || c._id === (activeCourseId || targetAssessment?.courseId))
  );

  const [liveQuiz, setLiveQuiz] = useState(null);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [quizError, setQuizError] = useState(null);
  const [submittingQuiz, setSubmittingQuiz] = useState(false);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { qIndex: selectedOptionIndex }
  const [flaggedQuestions, setFlaggedQuestions] = useState({});
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [scoreReport, setScoreReport] = useState(null);
  const [generatingCert, setGeneratingCert] = useState(false);

  // Load Quiz from Backend
  const loadQuizData = useCallback(async () => {
    const cid = activeCourseId || assessment?.courseId || course?._id || course?.id;
    const qid = activeAssessmentId || assessment?._id || assessment?.id;

    if (!cid || !qid || isDemoMode || !isAuthenticated) return;

    try {
      setLoadingQuiz(true);
      setQuizError(null);
      const res = await getTraineeQuizApi(cid, qid);
      if (res && res.quiz) {
        setLiveQuiz(res.quiz);
      }
    } catch (err) {
      console.log('Could not load backend quiz:', err);
      setQuizError(err?.data?.message || err?.message || 'Assessment not found on server');
    } finally {
      setLoadingQuiz(false);
    }
  }, [activeCourseId, activeAssessmentId, course, assessment, isDemoMode, isAuthenticated]);

  useEffect(() => {
    loadQuizData();
  }, [loadQuizData]);

  // Questions to render (Backend or Local fallback)
  const activeQuiz = liveQuiz || assessment;
  const questions = activeQuiz?.questions || [];

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

  const handleSubmit = async () => {
    const cid = activeCourseId || assessment?.courseId || course?._id || course?.id;
    const qid = activeAssessmentId || assessment?._id || assessment?.id;

    if (!isDemoMode && isAuthenticated && cid && qid && liveQuiz) {
      try {
        setSubmittingQuiz(true);
        const answersPayload = Object.entries(selectedAnswers).map(([qIdx, optIdx]) => {
          const q = questions[Number(qIdx)];
          return {
            questionId: q?._id || q?.id,
            answer: q?.options?.[optIdx]
          };
        }).filter(a => a.questionId && a.answer !== undefined);

        const res = await submitQuizAttemptApi(cid, qid, answersPayload);
        if (res && res.Result) {
          const r = res.Result;
          setScoreReport({
            totalQuestions: questions.length,
            correctCount: Math.round((r.percentage / 100) * questions.length),
            percentage: r.percentage,
            passed: r.passed,
            passingScore: r.passingMarks || 70,
            obtainedMarks: r.obtainedMarks,
            totalMarks: r.totalMarks
          });
          setIsSubmitted(true);
          showToast(r.passed ? "Congratulations! Assessment passed." : "Assessment completed.", r.passed ? "success" : "info");
          return;
        }
      } catch (err) {
        showToast(err.data?.message || "Failed to submit attempt online. Evaluating locally...", "warning");
      } finally {
        setSubmittingQuiz(false);
      }
    }

    // Local / Demo Evaluation Fallback
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (q && selectedAnswers[idx] === q.correctIndex) {
        correctCount++;
      }
    });

    const percentage = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
    const passed = submitQuizAnswers(activeQuiz?.id || activeQuiz?._id, percentage, selectedAnswers);

    setScoreReport({
      totalQuestions: questions.length,
      correctCount,
      percentage,
      passed,
      passingScore: activeQuiz?.passingScore || activeQuiz?.passingMarks || 70
    });
    setIsSubmitted(true);
  };

  const handleClaimCertificate = async () => {
    const cid = activeCourseId || assessment?.courseId || course?._id || course?.id;
    if (!isDemoMode && isAuthenticated && cid) {
      try {
        setGeneratingCert(true);
        const res = await generateCertificateApi(cid);
        if (res && res.certificate) {
          setActiveCertificate({
            id: res.certificate.certificateNumber || `CERT-MOES-${Date.now()}`,
            courseTitle: course?.title || activeQuiz?.title || "MoES Certified Program",
            issueDate: new Date(res.certificate.createdAt || Date.now()).toISOString().split('T')[0],
            score: scoreReport?.percentage || 85,
            grade: (scoreReport?.percentage || 85) >= 90 ? "Distinction" : "First Class",
            verificationHash: res.certificate.certificateNumber || "VERIFIED-GOV-IN"
          });
          showToast("Official e-Certificate generated successfully!", "success");
          return;
        }
      } catch (err) {
        if (err.status === 409 && err.data?.certificate) {
          setActiveCertificate({
            id: err.data.certificate.certificateNumber,
            courseTitle: course?.title || activeQuiz?.title || "MoES Certified Program",
            issueDate: new Date().toISOString().split('T')[0],
            score: scoreReport?.percentage || 85,
            grade: "Pass",
            verificationHash: err.data.certificate.certificateNumber
          });
          showToast("Certificate retrieved!", "info");
          return;
        }
        showToast(err.data?.message || "Could not generate certificate", "warning");
      } finally {
        setGeneratingCert(false);
      }
    }

    // Demo mode certificate
    setActiveCertificate({
      id: `CERT-MOES-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      courseTitle: course?.title || activeQuiz?.title || "Advanced Radar Meteorology",
      issueDate: new Date().toISOString().split('T')[0],
      score: scoreReport?.percentage || 85,
      grade: "Distinction",
      verificationHash: "MOES-DEMO-CERT-2026"
    });
    showToast("Certificate opened!", "success");
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
    setTimeLeft(15 * 60);
    setIsSubmitted(false);
    setScoreReport(null);
  };

  if (loadingQuiz) {
    return (
      <div className="max-w-5xl mx-auto py-16 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-moes-600 mx-auto" />
        <p className="text-xs text-slate-500 mt-2">Loading assessment questions...</p>
      </div>
    );
  }

  if (!activeQuiz) {
    return (
      <div className="min-h-[400px] flex items-center justify-center p-4">
        <div className="text-center p-8 glass-card rounded-2xl border border-slate-200 dark:border-slate-800 max-w-md mx-auto space-y-3">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Assessment not found</h2>
          <p className="text-sm text-slate-500">
            {quizError || "This assessment is unavailable or could not be loaded."}
          </p>
          <div className="pt-2">
            <button
              onClick={() => setCurrentView('trainee')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-moes-600 hover:bg-moes-700 text-white shadow-sm transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Dashboard</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-[400px] flex items-center justify-center p-4">
        <div className="text-center p-8 glass-card rounded-2xl border border-slate-200 dark:border-slate-800 max-w-md mx-auto space-y-3">
          <HelpCircle className="w-12 h-12 text-slate-400 mx-auto" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">No Questions Available</h2>
          <p className="text-sm text-slate-500">
            This assessment currently has no published questions available for examination.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setCurrentView('trainee')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-moes-600 hover:bg-moes-700 text-white shadow-sm transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Dashboard</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

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
                {activeQuiz?.title || "MoES Competency Assessment"}
              </h1>
              <p className="text-xs text-slate-500">{course?.title || activeQuiz?.courseTitle || "MoES Capacity Curriculum"}</p>
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
                disabled={submittingQuiz}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition flex items-center gap-1.5"
              >
                {submittingQuiz ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                <span>Submit Test</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Results View */}
      {isSubmitted && scoreReport ? (
        <div className="space-y-6 animate-fadeIn">
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
              <p className="text-xs text-slate-500 mt-1">
                Score: {scoreReport.percentage}% • Required Passing: {scoreReport.passingScore}%
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              {scoreReport.passed ? (
                <button
                  onClick={handleClaimCertificate}
                  disabled={generatingCert}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md hover:from-amber-600 hover:to-amber-700 transition flex items-center gap-2"
                >
                  {generatingCert ? <Loader2 className="w-4 h-4 animate-spin" /> : <Award className="w-4 h-4" />}
                  <span>Claim & View e-Certificate</span>
                </button>
              ) : (
                <button
                  onClick={handleRetake}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-moes-600 text-white hover:bg-moes-700 transition flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Retake Assessment</span>
                </button>
              )}

              <button
                onClick={() => setCurrentView('trainee')}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Questions Interactive View */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            {currentQ && (
              <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-md space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-moes-600 dark:text-sky-400">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </span>
                  <button
                    onClick={toggleFlag}
                    className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg border transition ${
                      flaggedQuestions[currentQuestionIndex]
                        ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 border-amber-300'
                        : 'text-slate-500 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <Flag className="w-3.5 h-3.5" />
                    <span>{flaggedQuestions[currentQuestionIndex] ? 'Flagged' : 'Flag for Review'}</span>
                  </button>
                </div>

                <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-relaxed">
                  {currentQ.question}
                </h2>

                <div className="space-y-2.5 pt-2">
                  {currentQ.options?.map((opt, optIdx) => {
                    const isSelected = selectedAnswers[currentQuestionIndex] === optIdx;
                    return (
                      <div
                        key={optIdx}
                        onClick={() => handleSelectOption(optIdx)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center gap-3 text-xs ${
                          isSelected
                            ? 'border-moes-500 bg-moes-50/70 dark:bg-moes-950/40 text-moes-900 dark:text-sky-200 font-bold shadow-sm'
                            : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center font-bold text-[10px] ${
                          isSelected ? 'border-moes-600 bg-moes-600 text-white' : 'border-slate-300 text-slate-500'
                        }`}>
                          {String.fromCharCode(65 + optIdx)}
                        </div>
                        <span className="flex-1">{opt}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
                  <button
                    onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                    disabled={currentQuestionIndex === 0}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 disabled:opacity-40"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Previous</span>
                  </button>

                  <button
                    onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
                    disabled={currentQuestionIndex === questions.length - 1}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-moes-600 hover:bg-moes-700 disabled:opacity-40"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Question Palette */}
          <div className="lg:col-span-4 space-y-4">
            <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-md space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                Question Palette ({Object.keys(selectedAnswers).length}/{questions.length} Answered)
              </h3>
              <div className="grid grid-cols-5 gap-2">
                {questions.map((_, idx) => {
                  const isAnswered = selectedAnswers[idx] !== undefined;
                  const isCurrent = currentQuestionIndex === idx;
                  const isFlagged = flaggedQuestions[idx];

                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`h-8 rounded-lg text-xs font-bold transition flex items-center justify-center ${
                        isCurrent
                          ? 'ring-2 ring-moes-500 bg-moes-100 dark:bg-moes-900 text-moes-700 dark:text-sky-300'
                          : isAnswered
                          ? 'bg-emerald-600 text-white'
                          : isFlagged
                          ? 'bg-amber-500 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
