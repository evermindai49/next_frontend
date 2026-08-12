"use client";

import React from "react";
import type { Lesson, ExerciseResponse } from "@/lib/types";

export interface ExerciseModalProps {
  lesson?: Lesson | null;
  exercise?: ExerciseResponse | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ExerciseModal({
  lesson,
  exercise,
  isOpen,
  onClose,
}: ExerciseModalProps) {
  if (!isOpen) return null;

  const title = exercise?.title || lesson?.title || "Exercise Details";
  const instructions =
    exercise?.instructions ||
    lesson?.description ||
    "Complete the exercise instructions below.";

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
          </div>
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