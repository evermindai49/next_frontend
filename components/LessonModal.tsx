"use client";

import React from "react";
import type { Lesson } from "@/lib/types";

interface LessonModalProps {
  lesson: Lesson | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function LessonModal({ lesson, isOpen, onClose }: LessonModalProps) {
  if (!isOpen || !lesson) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4 text-slate-100">
        <div className="flex items-start justify-between border-b border-slate-800 pb-3">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
              Lesson Overview
            </span>
            <h3 className="text-xl font-bold text-white">{lesson.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Lesson Details */}
        <div className="space-y-3 text-sm text-slate-300">
          {lesson.description && <p>{lesson.description}</p>}

          {lesson.duration && (
            <div className="inline-flex items-center gap-1.5 rounded-md bg-slate-800/80 px-2.5 py-1 text-xs text-slate-300">
              <span>⏱️ Duration:</span>
              <span className="font-semibold text-white">{lesson.duration}</span>
            </div>
          )}

          {lesson.content && (
            <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/50 p-4 font-mono text-xs text-slate-200">
              {lesson.content}
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-indigo-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}