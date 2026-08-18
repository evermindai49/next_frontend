"use client";

import React, { useState, useEffect } from "react";
import type { ExerciseResponse, Lesson } from "@/lib/types";

export interface ExerciseModalProps {
  exercise?: ExerciseResponse | null;
  lesson?: Lesson | null;
  isOpen: boolean;
  onClose: () => void;
}

interface FeedbackState {
  is_correct: bool;
  score: number;
  feedback: string;
  suggestions?: string[];
}

const BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  "https://my-fastapi-backend-iota.vercel.app"
).replace(/\/$/, "");

export default function ExerciseModal({
  exercise,
  lesson,
  isOpen,
  onClose,
}: ExerciseModalProps) {
  const [userCode, setUserCode] = useState<string>("");
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [evaluation, setEvaluation] = useState<FeedbackState | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    if (exercise) {
      const starter =
        exercise.initial_code ||
        exercise.starter_code ||
        "# Write your solution here...\n";
      setUserCode(starter);
      setEvaluation(null);
      setErrorMessage("");
      setShowSolution(false);
    }
  }, [exercise]);

  if (!isOpen) return null;

  const title =
    exercise?.title ||
    exercise?.question ||
    lesson?.title ||
    "Exercise Checklist";

  const instructions =
    exercise?.instructions ||
    exercise?.description ||
    lesson?.description ||
    "Complete the exercise instructions below.";

  const initialCode =
    exercise?.initial_code ||
    exercise?.starter_code ||
    "# Write your solution here...\n";

  const handleSubmitCode = async () => {
    if (!userCode.trim()) {
      setErrorMessage("Please enter some code before submitting.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setEvaluation(null);

    const titleToSubmit = exercise?.title || exercise?.question || lesson?.title || "Exercise Check";

    try {
      const endpoint = `${BASE_URL}/api/v1/submit-answer`;
      console.log("Submitting to pipeline endpoint:", endpoint);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          exercise_title: titleToSubmit,
          user_code: userCode,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(
          errData.detail || `Server error (${response.status}): Evaluation service unavailable.`
        );
      }

      const feedbackData: FeedbackState = await response.json();
      setEvaluation(feedbackData);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to connect to the evaluation engine. Please try again.";
      console.error("Submission evaluation error:", err);
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
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
      <div
        className="relative z-10 w-full max-w-2xl rounded-2xl border-2 border-slate-600 bg-[#1e293b] p-6 shadow-2xl space-y-5 text-white max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: "#1e293b", color: "#ffffff", opacity: 1 }}
      >
        <div className="flex items-start justify-between border-b border-slate-700 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              {exercise ? "Submission Evaluation Pipeline" : "Lesson Preview"}
            </span>
            <h3 className="text-xl font-bold text-white mt-1">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-300 hover:bg-slate-700 hover:text-white transition"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4 text-sm">
          {/* Instructions Card */}
          <div
            className="rounded-xl border border-slate-700 bg-[#0f172a] p-5 space-y-3"
            style={{ backgroundColor: "#0f172a", color: "#f8fafc", opacity: 1 }}
          >
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300">
              Instructions
            </h4>
            <p className="text-slate-100 text-sm leading-relaxed">
              {instructions}
            </p>

            {exercise?.question && (
              <div className="mt-3 pt-3 border-t border-slate-700 text-slate-200 text-xs">
                <span className="font-semibold text-white">Question: </span>
                {exercise.question}
              </div>
            )}
          </div>

          {/* Interactive Code Editor */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Your Python Solution
              </label>
              <button
                type="button"
                onClick={() => setUserCode(initialCode)}
                className="text-[11px] text-slate-400 hover:text-indigo-300 underline"
              >
                Reset Code
              </button>
            </div>
            <textarea
              rows={8}
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              placeholder="# Write your code solution here..."
              className="w-full rounded-xl border border-slate-700 bg-[#0f172a] p-4 font-mono text-xs text-emerald-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              style={{ backgroundColor: "#0f172a" }}
            />
          </div>

          {/* Hints */}
          {exercise?.hints && exercise.hints.length > 0 && (
            <div className="text-xs text-amber-300/90 space-y-1 bg-amber-950/20 p-3 rounded-lg border border-amber-900/30">
              <span className="font-bold">💡 Hint:</span>
              <ul className="list-disc pl-4 space-y-0.5 text-amber-200/80">
                {exercise.hints.map((hint: string, hIdx: number) => (
                  <li key={hIdx}>{hint}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Actions & Triggers */}
          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmitCode}
              className="rounded-lg bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-indigo-500 disabled:opacity-50 flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin text-sm">🌀</span>
                  <span>Running Unit Tests...</span>
                </>
              ) : (
                <span>Submit Answer</span>
              )}
            </button>

            {exercise?.solution && (
              <button
                type="button"
                onClick={() => setShowSolution(!showSolution)}
                className="text-xs font-semibold text-slate-400 hover:text-indigo-300 transition"
              >
                {showSolution ? "Hide Model Solution" : "Reveal Model Solution"}
              </button>
            )}
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="rounded-lg border border-red-800/50 bg-red-950/30 p-3 text-xs text-red-300">
              ⚠️ {errorMessage}
            </div>
          )}

          {/* Evaluation Results Output */}
          {evaluation && (
            <div
              className={`rounded-xl border p-4 space-y-2 text-xs ${
                evaluation.is_correct
                  ? "border-emerald-700/50 bg-emerald-950/30 text-emerald-200"
                  : "border-amber-700/50 bg-amber-950/30 text-amber-200"
              }`}
            >
              <div className="flex items-center justify-between font-bold">
                <span>
                  {evaluation.is_correct ? "✅ Passed Automated Verification" : "❌ Execution Error"}
                </span>
                <span className="rounded bg-slate-800 px-2.5 py-1 text-white">
                  Score: {evaluation.score}/100
                </span>
              </div>
              <p className="leading-relaxed">{evaluation.feedback}</p>

              {evaluation.suggestions && evaluation.suggestions.length > 0 && (
                <div className="pt-2 border-t border-slate-700/50">
                  <span className="font-semibold block mb-1">
                    Suggestions:
                  </span>
                  <ul className="list-disc pl-4 space-y-0.5">
                    {evaluation.suggestions.map((sug: string, sIdx: number) => (
                      <li key={sIdx}>{sug}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Model Solution */}
          {showSolution && exercise?.solution && (
            <div className="space-y-1 pt-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-emerald-400">
                Model Solution
              </label>
              <pre
                className="rounded-xl border border-emerald-500/40 bg-[#062016] p-4 font-mono text-xs text-emerald-200 overflow-x-auto"
                style={{ backgroundColor: "#062016" }}
              >
                <code>{exercise.solution}</code>
              </pre>
            </div>
          )}
        </div>

        <div className="flex justify-end border-t border-slate-700 pt-4">
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-700 px-6 py-2.5 text-xs font-bold text-white transition hover:bg-slate-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}