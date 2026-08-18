import React, { useState, useEffect } from 'react';

// ------------------------------------------------------------------------------
// TypeScript Interfaces
// ------------------------------------------------------------------------------
export interface Exercise {
  id?: string;
  title: string;
  instructions?: string;
  initial_code: string;
  hints?: string[];
  options?: string[];
  solution?: string;
}

export interface FeedbackResponse {
  is_correct: boolean;
  score: number;
  feedback: string;
  suggestions?: string[];
}

export interface ExerciseModalProps {
  isOpen: boolean; // ✅ Fixed TS2304 error: changed `bool` to `boolean`
  exercise: Exercise | null;
  onClose: () => void;
  onSuccess?: (score: number) => void;
  isCompleted?: boolean; // ✅ Fixed TS2304 error
}

// ------------------------------------------------------------------------------
// Component Implementation
// ------------------------------------------------------------------------------
export const ExerciseModal: React.FC<ExerciseModalProps> = ({
  isOpen,
  exercise,
  onClose,
  onSuccess,
  isCompleted = false,
}) => {
  const [userCode, setUserCode] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<FeedbackResponse | null>(null);
  const [activeHintIndex, setActiveHintIndex] = useState<number>(0);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync state whenever the selected exercise or modal visibility changes
  useEffect(() => {
    if (exercise) {
      setUserCode(exercise.initial_code || '');
      setFeedback(null);
      setErrorMessage(null);
      setShowHint(false);
      setActiveHintIndex(0);
    }
  }, [exercise, isOpen]);

  if (!isOpen || !exercise) return null;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);
    setFeedback(null);

    try {
      const response = await fetch('/api/v1/submit-answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          exercise_title: exercise.title,
          user_code: userCode,
        }),
      });

      if (!response.ok) {
        throw new Error(`Evaluation request failed with status: ${response.status}`);
      }

      const result: FeedbackResponse = await response.json();
      setFeedback(result);

      if (result.is_correct && onSuccess) {
        onSuccess(result.score);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred during evaluation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextHint = () => {
    if (exercise.hints && activeHintIndex < exercise.hints.length - 1) {
      setActiveHintIndex((prev) => prev + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl rounded-xl border border-gray-700 bg-gray-900 p-6 text-gray-100 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-800 pb-4">
          <div>
            <h2 className="text-xl font-bold text-white">{exercise.title}</h2>
            {isCompleted && (
              <span className="mt-1 inline-block rounded-full bg-green-900/50 px-2.5 py-0.5 text-xs font-semibold text-green-400 border border-green-700">
                Completed
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
            aria-label="Close Modal"
          >
            ✕
          </button>
        </div>

        {/* Instructions */}
        {exercise.instructions && (
          <div className="my-4 rounded-lg bg-gray-800/60 p-3 text-sm text-gray-300 border border-gray-700/50">
            <p className="font-medium text-gray-200">Instructions:</p>
            <p className="mt-1">{exercise.instructions}</p>
          </div>
        )}

        {/* Code Editor Input */}
        <div className="my-4">
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">
            Python Solution Editor
          </label>
          <textarea
            value={userCode}
            onChange={(e) => setUserCode(e.target.value)}
            rows={8}
            className="w-full rounded-lg border border-gray-700 bg-gray-950 p-3 font-mono text-sm text-green-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="# Write your Python solution here..."
          />
        </div>

        {/* Hints Section */}
        {exercise.hints && exercise.hints.length > 0 && (
          <div className="my-3">
            {!showHint ? (
              <button
                type="button"
                onClick={() => setShowHint(true)}
                className="text-xs text-blue-400 underline hover:text-blue-300"
              >
                Need a hint?
              </button>
            ) : (
              <div className="rounded-lg border border-amber-500/30 bg-amber-950/20 p-3 text-xs text-amber-200">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">
                    Hint {activeHintIndex + 1} of {exercise.hints.length}:
                  </span>
                  {activeHintIndex < exercise.hints.length - 1 && (
                    <button
                      onClick={handleNextHint}
                      className="text-blue-400 hover:underline"
                    >
                      Next Hint →
                    </button>
                  )}
                </div>
                <p className="mt-1">{exercise.hints[activeHintIndex]}</p>
              </div>
            )}
          </div>
        )}

        {/* Error Output */}
        {errorMessage && (
          <div className="my-3 rounded-lg border border-red-500/50 bg-red-950/30 p-3 text-xs text-red-300">
            {errorMessage}
          </div>
        )}

        {/* Feedback Evaluation Display */}
        {feedback && (
          <div
            className={`my-4 rounded-lg border p-4 text-sm ${
              feedback.is_correct
                ? 'border-green-500/40 bg-green-950/30 text-green-200'
                : 'border-red-500/40 bg-red-950/30 text-red-200'
            }`}
          >
            <div className="flex items-center justify-between font-bold">
              <span>{feedback.is_correct ? ' Correct!' : ' Needs Revision'}</span>
              <span className="text-xs">Score: {feedback.score}/100</span>
            </div>
            <p className="mt-2 text-xs leading-relaxed">{feedback.feedback}</p>
            {feedback.suggestions && feedback.suggestions.length > 0 && (
              <ul className="mt-2 list-disc pl-4 text-xs space-y-1">
                {feedback.suggestions.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-end space-x-3 border-t border-gray-800 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-xs font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="rounded-lg bg-blue-600 px-5 py-2 text-xs font-semibold text-white hover:bg-blue-500 disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? 'Evaluating...' : 'Submit Answer'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExerciseModal;