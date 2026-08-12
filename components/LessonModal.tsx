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
      {/* Dark Overlay Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Solid Opaque Main Container */}
      <div 
        className="relative z-10 w-full max-w-3xl rounded-2xl border-2 border-slate-600 bg-[#1e293b] p-6 sm:p-8 shadow-2xl space-y-6 text-white max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: "#1e293b", color: "#ffffff", opacity: 1 }}
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

        {/* Lesson Description Container */}
        {lesson.description && (
          <div 
            className="rounded-xl border border-slate-700 bg-[#0f172a] p-5 text-slate-100 text-sm leading-relaxed"
            style={{ backgroundColor: "#0f172a", color: "#f8fafc" }}
          >
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
                className="rounded-xl border border-slate-700 bg-[#0f172a] p-5 space-y-4"
                style={{ backgroundColor: "#0f172a" }}
              >
                <h5 className="font-semibold text-white text-base">
                  {exIdx + 1}. {ex.title || ex.question || "Exercise Check"}
                </h5>

                {ex.instructions && (
                  <p className="text-xs text-slate-300">{ex.instructions}</p>
                )}

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
              </div>
            ))}
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