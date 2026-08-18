"use client";

import React, { useState, useEffect } from "react";
import type { Lesson, ExerciseResponse } from "@/lib/types";

export interface LessonModalProps {
  lesson: Lesson | null;
  isOpen: boolean;
  onClose: () => void;
  exercises?: ExerciseResponse[];
}

interface FeedbackState {
  is_correct: boolean;
  score: number;
  feedback: string;
  suggestions: string[];
}

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://vigilant-amazement-production-02e7.up.railway.app";

export default function LessonModal({
  lesson,
  isOpen,
  onClose,
  exercises = [],
}: LessonModalProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [userCodes, setUserCodes] = useState<Record<number, string>>({});
  const [submittingIdx, setSubmittingIdx] = useState<number | null>(null);
  const [evaluations, setEvaluations] = useState<Record<number, FeedbackState>>({});
  const [errorMessages, setErrorMessages] = useState<Record<number, string>>({});

  useEffect(() => {
    if (exercises.length > 0) {
      const initialCodes: Record<number, string> = {};
      exercises.forEach((ex, idx) => {
        const starter =
          ex.initial_code || ex.starter_code || "# Write your solution here...\n";
        initialCodes[idx] = starter;
      });
      setUserCodes(initialCodes);
    }
  }, [exercises]);

  if (!isOpen || !lesson) return null;

  const handleSelectOption = (exerciseIdx: number, optionIdx: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [exerciseIdx]: optionIdx,
    }));
  };

  const handleCodeChange = (exerciseIdx: number, val: string) => {
    setUserCodes((prev) => ({
      ...prev,
      [exerciseIdx]: val,
    }));
  };

  const handleSubmitCode = async (exerciseIdx: number, exercise: ExerciseResponse) => {
    setSubmittingIdx(exerciseIdx);
    setErrorMessages((prev) => ({ ...prev, [exerciseIdx]: "" }));

    const codeToSubmit = userCodes[exerciseIdx] || exercise.initial_code || "";
    const titleToSubmit = exercise.title || exercise.question || lesson.title;

    try {
      const response = await fetch(`${BASE_URL}/api/v1/submit-answer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          exercise_title: titleToSubmit,
          user_code: codeToSubmit,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || `Server returned status ${response.status}`);
      }

      const feedbackData: FeedbackState = await response.json();
      setEvaluations((prev) => ({
        ...prev,
        [exerciseIdx]: feedbackData,
      }));
    } catch (err: any) {
      setErrorMessages((prev) => ({
        ...prev,
        [exerciseIdx]: err.message || "Failed to evaluate submission. Please try again.",
      }));
    } finally {
      setSubmittingIdx(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Main Dialog Container */}
      <div
        className="relative z-10 w-full max-w-3xl rounded-2xl border-2 border-slate-600 bg-[#1e293b] p-6 sm:p-8 shadow-2xl space-y-6 text-white max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: "#1e293b", color: "#ffffff" }}
      >
        <div className="flex items-start justify-between border-b border-slate-700 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Interactive Lesson Preview
            </span>
            <h3 className="text-2xl font-bold text-white mt-1">{lesson.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Lesson Description */}
        {lesson.description && (
          <div
            className="rounded-xl border border-slate-700 bg-[#0f172a] p-5 text-slate-100 text-sm leading-relaxed"
            style={{ backgroundColor: "#0f172a", color: "#f8fafc" }}
          >
            {lesson.description}
          </div>
        )}

        {/* Lesson Content Body */}
        {lesson.content && (
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 text-slate-200 text-xs leading-relaxed space-y-2">
            <h5 className="font-bold text-indigo-300 uppercase tracking-wide text-[10px]">
              Lesson Notes
            </h5>
            <p className="whitespace-pre-line">{lesson.content}</p>
          </div>
        )}

        {/* Exercises List */}
        {exercises.length > 0 && (
          <div className="space-y-6">
            <h4 className="text-lg font-bold text-white">Lesson Exercises</h4>

            {exercises.map((ex: ExerciseResponse, exIdx: number) => {
              const feedback = evaluations[exIdx];
              const errorMsg = errorMessages[exIdx];
              const isSubmitting = submittingIdx === exIdx;

              return (
                <div
                  key={ex.id || exIdx}
                  className="rounded-xl border border-slate-700 bg-[#0f172a] p-5 space-y-4"
                  style={{ backgroundColor: "#0f172a" }}
                >
                  <h5 className="font-semibold text-white text-base">
                    {exIdx + 1}. {ex.title || ex.question || "Exercise Check"}
                  </h5>

                  {ex.instructions && (
                    <p className="text-xs text-slate-300 leading-relaxed">{ex.instructions}</p>
                  )}

                  {/* Multiple Choice Options */}
                  {ex.options && ex.options.length > 0 && (
                    <div className="grid gap-2 pt-2">
                      {ex.options.map((opt: string, idx: number) => {
                        const isSelected = selectedAnswers[exIdx] === idx;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleSelectOption(exIdx, idx)}
                            className={`flex items-center justify-between px-4 py-3 rounded-lg border text-xs font-medium transition text-left ${
                              isSelected
                                ? "border-indigo-500 bg-indigo-600 text-white"
                                : "border-slate-700 bg-[#1e293b] text-slate-200 hover:border-slate-500"
                            }`}
                          >
                            <span>{opt}</span>
                            {isSelected && <span className="text-white font-bold">✓</span>}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Code Editor */}
                  <div className="space-y-2 pt-2">
                    <label className="text-xs font-semibold text-slate-400">
                      Your Code Solution:
                    </label>
                    <textarea
                      rows={6}
                      value={userCodes[exIdx] || ""}
                      onChange={(e) => handleCodeChange(exIdx, e.target.value)}
                      placeholder="# Write your python code solution here..."
                      className="w-full rounded-lg border border-slate-700 bg-[#1e293b] p-3 text-xs font-mono text-emerald-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Hints */}
                  {ex.hints && ex.hints.length > 0 && (
                    <div className="text-xs text-amber-300/80 space-y-1 bg-amber-950/20 p-3 rounded-lg border border-amber-900/30">
                      <span className="font-bold">💡 Hint:</span>
                      <ul className="list-disc pl-4 space-y-0.5">
                        {ex.hints.map((hint, hIdx) => (
                          <li key={hIdx}>{hint}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => handleSubmitCode(exIdx, ex)}
                      className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-indigo-500 disabled:opacity-50"
                    >
                      {isSubmitting ? "Evaluating Code..." : "Submit Answer"}
                    </button>
                  </div>

                  {/* Error Notification */}
                  {errorMsg && (
                    <div className="rounded-lg border border-red-800/50 bg-red-950/30 p-3 text-xs text-red-300">
                      ⚠️ {errorMsg}
                    </div>
                  )}

                  {/* Evaluation Output */}
                  {feedback && (
                    <div
                      className={`rounded-xl border p-4 space-y-2 text-xs ${
                        feedback.is_correct
                          ? "border-emerald-700/50 bg-emerald-950/30 text-emerald-200"
                          : "border-amber-700/50 bg-amber-950/30 text-amber-200"
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold">
                        <span>{feedback.is_correct ? "✅ Passed" : "❌ Needs Work"}</span>
                        <span className="rounded bg-slate-800 px-2 py-1 text-white">
                          Score: {feedback.score}/100
                        </span>
                      </div>
                      <p className="leading-relaxed">{feedback.feedback}</p>

                      {feedback.suggestions && feedback.suggestions.length > 0 && (
                        <div className="pt-2 border-t border-slate-700/50">
                          <span className="font-semibold block mb-1">Suggestions:</span>
                          <ul className="list-disc pl-4 space-y-0.5">
                            {feedback.suggestions.map((sug, sIdx) => (
                              <li key={sIdx}>{sug}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="flex justify-end border-t border-slate-700 pt-4">
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-700 px-6 py-2.5 text-xs font-bold text-white transition hover:bg-slate-600"
          >
            Close Lesson
          </button>
        </div>
      </div>
    </div>
  );
}