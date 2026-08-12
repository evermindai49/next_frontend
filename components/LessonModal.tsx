"use client";

import React, { useState } from "react";
import type { Lesson, ExerciseResponse } from "@/lib/types";

export interface LessonModalProps {
  lesson: Lesson | null;
  isOpen: boolean;
  onClose: () => void;
  exercises?: ExerciseResponse[];
}

export default function LessonModal({
  lesson,
  isOpen,
  onClose,
  exercises = [],
}: LessonModalProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});

  if (!isOpen || !lesson) return null;

  const handleSelectOption = (exerciseIdx: number, optionIdx: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [exerciseIdx]: optionIdx,
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Window */}
      <div className="relative z-10 w-full max-w-3xl rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8 shadow-2xl space-y-6 text-slate-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
              Interactive Lesson
            </span>
            <h3 className="text-2xl font-bold text-white">{lesson.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Lesson Description/Content */}
        {lesson.description && (
          <div className="text-slate-300 text-sm leading-relaxed border-b border-slate-800/80 pb-4">
            {lesson.description}
          </div>
        )}

        {/* Exercises Section */}
        {exercises.length > 0 && (
          <div className="space-y-6">
            <h4 className="text-lg font-bold text-white">Lesson Exercises</h4>
            
            {exercises.map((ex: ExerciseResponse, exIdx: number) => (
              <div
                key={ex.id || exIdx}
                className="rounded-xl border border-slate-800 bg-slate-950/60 p-5 space-y-4"
              >
                <h5 className="font-semibold text-slate-100 text-base">
                  {exIdx + 1}. {ex.title || ex.question || "Exercise Check"}
                </h5>

                {ex.instructions && (
                  <p className="text-xs text-slate-400">{ex.instructions}</p>
                )}

                {/* Explicitly typed parameters for options mapping */}
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
                              ? "border-indigo-500 bg-indigo-500/10 text-indigo-300"
                              : "border-slate-800 bg-slate-900/50 text-slate-300 hover:border-slate-700"
                          }`}
                        >
                          <span>{opt}</span>
                          {isSelected && <span className="text-indigo-400">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end border-t border-slate-800 pt-4">
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-800 px-5 py-2.5 text-xs font-semibold text-slate-200 transition-all hover:bg-slate-700 hover:text-white"
          >
            Close Lesson
          </button>
        </div>
      </div>
    </div>
  );
}