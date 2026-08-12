"use client";

import React from "react";
import type { ExerciseResponse, Lesson } from "@/lib/types";

export interface ExerciseModalProps {
  exercise?: ExerciseResponse | null;
  lesson?: Lesson | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ExerciseModal({
  exercise,
  lesson,
  isOpen,
  onClose,
}: ExerciseModalProps) {
  if (!isOpen) return null;

  const title = exercise?.title || lesson?.title || "Lesson Preview";

  const instructions =
    exercise?.instructions ||
    lesson?.description ||
    "Complete the exercise instructions below.";

  const initialCode = exercise?.initial_code || exercise?.starter_code;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Solid Opaque Modal Box */}
      <div 
        className="relative z-10 w-full max-w-2xl rounded-2xl border-2 border-slate-600 bg-[#1e293b] p-6 shadow-2xl space-y-5 text-white max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: "#1e293b", color: "#ffffff", opacity: 1 }}
      >
        <div className="flex items-start justify-between border-b border-slate-700 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              {exercise ? "Exercise Submission" : "Lesson Preview"}
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
          {/* Solid Opaque Inner Card */}
          <div 
            className="rounded-xl border border-slate-700 bg-[#0f172a] p-5 space-y-3"
            style={{ backgroundColor: "#0f172a", color: "#f8fafc", opacity: 1 }}
          >
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300">
              Description / Instructions
            </h4>
            <p className="text-slate-100 text-base leading-relaxed">{instructions}</p>

            {exercise?.question && (
              <div className="mt-3 pt-3 border-t border-slate-700 text-slate-200">
                <span className="font-semibold text-white">Question: </span>
                {exercise.question}
              </div>
            )}
          </div>

          {initialCode && (
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Initial Code
              </label>
              <pre 
                className="rounded-xl border border-slate-700 bg-[#0f172a] p-4 font-mono text-xs text-slate-100 overflow-x-auto"
                style={{ backgroundColor: "#0f172a", color: "#f8fafc" }}
              >
                <code>{initialCode}</code>
              </pre>
            </div>
          )}

          {exercise?.solution && (
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-emerald-400">
                Expected Solution
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
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}