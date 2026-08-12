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

  const title = exercise?.title || lesson?.title || "Exercise Details";
  const instructions =
    exercise?.instructions ||
    lesson?.description ||
    "Complete the exercise instructions below.";
  const initialCode = exercise?.initial_code || exercise?.starter_code;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4 text-slate-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between border-b border-slate-800 pb-3">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
              Exercise Preview
            </span>
            <h3 className="text-xl font-bold text-white">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4 text-sm">
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Instructions
            </h4>
            <p className="text-slate-200">{instructions}</p>

            {exercise?.question && (
              <div className="mt-2 pt-2 border-t border-slate-800/80 text-slate-300">
                <span className="font-semibold text-white">Question: </span>
                {exercise.question}
              </div>
            )}
          </div>

          {initialCode && (
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Initial Code
              </label>
              <pre className="rounded-xl border border-slate-800 bg-slate-950 p-3 font-mono text-xs text-slate-200 overflow-x-auto">
                <code>{initialCode}</code>
              </pre>
            </div>
          )}

          {exercise?.options && exercise.options.length > 0 && (
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Options
              </label>
              <ul className="space-y-1.5">
                {exercise.options.map((opt, idx) => (
                  <li
                    key={idx}
                    className="rounded-lg border border-slate-800 bg-slate-950/40 p-2.5 text-xs text-slate-300"
                  >
                    {opt}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {exercise?.solution && (
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-emerald-400">
                Expected Solution
              </label>
              <pre className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 font-mono text-xs text-emerald-300 overflow-x-auto">
                <code>{exercise.solution}</code>
              </pre>
            </div>
          )}
        </div>

        <div className="flex justify-end border-t border-slate-800 pt-3">
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-800 px-5 py-2 text-xs font-semibold text-slate-200 transition-all hover:bg-slate-700 hover:text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}