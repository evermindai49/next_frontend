"use client";

import React, { useState, useEffect } from "react";
import type { ExerciseResponse, Lesson } from "@/lib/types";

// Extended interface matching the FastAPI submission & evaluation response schemas
export interface FeedbackResult {
  is_correct: boolean;
  score: number;
  feedback: string;
  suggestions?: string[];
}

export interface ExerciseModalProps {
  exercise?: ExerciseResponse | null;
  lesson?: Lesson | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (score: number) => void;
}

export default function ExerciseModal({
  exercise,
  lesson,
  isOpen,
  onClose,
  onSuccess,
}: ExerciseModalProps) {
  // Determine starting code and titles
  const title = exercise?.title || lesson?.title || "Exercise Session";
  const instructions =
    exercise?.instructions ||
    lesson?.description ||
    "Complete the coding exercise instructions below.";
  const defaultCode =
    exercise?.initial_code ||
    exercise?.starter_code ||
    "# Write your Python solution below\n";

  // Interactive Component State
  const [userCode, setUserCode] = useState<string>(defaultCode);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<FeedbackResult | null>(null);
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [activeHintIndex, setActiveHintIndex] = useState<number>(0);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync state when new exercise loads or modal toggles
  useEffect(() => {
    if (isOpen) {
      setUserCode(defaultCode);
      setFeedback(null);
      setErrorMessage(null);
      setShowSolution(false);
      setShowHint(false);
      setActiveHintIndex(0);
    }
  }, [isOpen, exercise, lesson, defaultCode]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);
    setFeedback(null);

    try {
      const response = await fetch("/api/v1/submit-answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          exercise_title: title,
          user_code: userCode,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const result: FeedbackResult = await response.json();
      setFeedback(result);

      if (result.is_correct && onSuccess) {
        onSuccess(result.score);
      }
    } catch (err: any) {
      setErrorMessage(
        err.message || "An unexpected error occurred during evaluation."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextHint = () => {
    if (exercise?.hints && activeHintIndex < exercise.hints.length - 1) {
      setActiveHintIndex((prev) => prev + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border-2 border-slate-600 bg-slate-900 p-6 text-white shadow-2xl space-y-5">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-700 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              {exercise ? "Interactive Exercise" : "Lesson Preview"}
            </span>
            <h3 className="mt-1 text-xl font-bold text-white">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="space-y-4 text-sm">
          {/* Instructions Card */}
          <div className="rounded-xl border border-slate-700 bg-slate-950 p-4 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300">
              Instructions
            </h4>
            <p className="text-slate-200 text-sm leading-relaxed">{instructions}</p>

            {exercise?.question && (
              <div className="mt-3 border-t border-slate-800 pt-3 text-slate-300">
                <span className="font-semibold text-white">Prompt: </span>
                {exercise.question}
              </div>
            )}
          </div>

          {/* Interactive Code Editor */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Solution Code
              </label>
              <button
                type="button"
                onClick={() => setUserCode(defaultCode)}
                className="text-xs text-slate-400 hover:text-slate-200 transition"
              >
                Reset Code
              </button>
            </div>
            <textarea
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              rows={8}
              spellCheck={false}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 font-mono text-xs text-emerald-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="# Write your solution here..."
            />
          </div>

          {/* Hints Panel */}
          {exercise?.hints && exercise.hints.length > 0 && (
            <div>
              {!showHint ? (
                <button
                  type="button"
                  onClick={() => setShowHint(true)}
                  className="text-xs text-indigo-400 hover:underline"
                >
                  Need a hint? ({exercise.hints.length} available)
                </button>
              ) : (
                <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-3 text-xs text-amber-200">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">
                      Hint {activeHintIndex + 1} of {exercise.hints.length}:
                    </span>
                    {activeHintIndex < exercise.hints.length - 1 && (
                      <button
                        type="button"
                        onClick={handleNextHint}
                        className="text-indigo-300 hover:underline"
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

          {/* Network / Client Errors */}
          {errorMessage && (
            <div className="rounded-xl border border-rose-500/50 bg-rose-950/30 p-3 text-xs text-rose-300">
              {errorMessage}
            </div>
          )}

          {/* Evaluation Results */}
          {feedback && (
            <div
              className={`rounded-xl border p-4 text-xs space-y-2 ${
                feedback.is_correct
                  ? "border-emerald-500/40 bg-emerald-950/30 text-emerald-200"
                  : "border-rose-500/40 bg-rose-950/30 text-rose-200"
              }`}
            >
              <div className="flex items-center justify-between font-bold text-sm">
                <span>{feedback.is_correct ? "✓ Passed" : "✕ Revision Required"}</span>
                <span>Score: {feedback.score}/100</span>
              </div>
              <p className="leading-relaxed">{feedback.feedback}</p>
              
              {feedback.suggestions && feedback.suggestions.length > 0 && (
                <ul className="list-disc pl-4 space-y-1 text-slate-300">
                  {feedback.suggestions.map((suggestion, idx) => (
                    <li key={idx}>{suggestion}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Expected Solution Reveal */}
          {exercise?.solution && (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowSolution(!showSolution)}
                className="text-xs text-emerald-400 hover:underline"
              >
                {showSolution ? "Hide Expected Solution" : "Show Expected Solution"}
              </button>
              {showSolution && (
                <pre className="mt-2 rounded-xl border border-emerald-500/40 bg-slate-950 p-4 font-mono text-xs text-emerald-300 overflow-x-auto">
                  <code>{exercise.solution}</code>
                </pre>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end space-x-3 border-t border-slate-700 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-800 px-5 py-2.5 text-xs font-bold text-slate-300 hover:bg-slate-700 hover:text-white transition"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-indigo-500 disabled:opacity-50 transition"
          >
            {isSubmitting ? "Evaluating..." : "Submit Solution"}
          </button>
        </div>

      </div>
    </div>
  );
}