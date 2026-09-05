import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Star, MessageSquare, Send, CheckCircle2, ThumbsUp } from 'lucide-react';

export const FeedbackModal = () => {
  const { activeFeedbackCourse, setActiveFeedbackCourse, submitFeedback } = useApp();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [clarityScore, setClarityScore] = useState('Excellent');
  const [practicalScore, setPracticalScore] = useState('Highly Applicable');

  if (!activeFeedbackCourse) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    submitFeedback(activeFeedbackCourse.id, rating, comment);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-moes-700 to-navy-900 px-6 py-5 text-white relative">
          <button
            onClick={() => setActiveFeedbackCourse(null)}
            className="absolute top-4 right-4 text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare className="w-4 h-4 text-amber-300" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Course & Trainer Feedback</span>
          </div>
          <h2 className="text-lg font-bold line-clamp-1">
            {activeFeedbackCourse.title}
          </h2>
          <p className="text-xs text-sky-200 mt-0.5">
            Instructor: {activeFeedbackCourse.trainerName}
          </p>
        </div>

        {/* Feedback Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          {/* Overall 5-Star Rating */}
          <div className="text-center py-2 space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Overall Course Rating
            </label>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform transform hover:scale-125 focus:outline-none"
                >
                  <Star
                    className={`w-7 h-7 ${
                      (hoverRating || rating) >= star
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300 dark:text-slate-600'
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
              {rating === 5 ? '5 Stars - Outstanding Program' : `${rating} Stars`}
            </span>
          </div>

          {/* Categorical Questions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Technical Depth & Clarity
              </label>
              <select
                value={clarityScore}
                onChange={(e) => setClarityScore(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
              >
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Average">Average</option>
                <option value="Needs Improvement">Needs Improvement</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Operational Relevance
              </label>
              <select
                value={practicalScore}
                onChange={(e) => setPracticalScore(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
              >
                <option value="Highly Applicable">Highly Applicable to My MoES Work</option>
                <option value="Moderately Useful">Moderately Useful</option>
                <option value="Theoretical Only">Theoretical Only</option>
              </select>
            </div>
          </div>

          {/* Qualitative Review Text */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Detailed Comments / Suggestions for Faculty
            </label>
            <textarea
              rows={4}
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Describe what you learned, quality of presentations, radar case studies, and recommendations for future batches..."
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-moes-500 text-xs"
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-moes-600 hover:bg-moes-700 text-white shadow-md transition flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Submit Training Review</span>
          </button>

        </form>
      </div>
    </div>
  );
};
