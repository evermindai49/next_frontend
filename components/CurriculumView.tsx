"use client";

import React from "react";
import type { SkillPathResponse, Lesson } from "@/lib/types";

interface CurriculumViewProps {
  pathData: SkillPathResponse;
  modules: any[];
  onSelectLesson?: (lesson: Lesson) => void;
}

export default function CurriculumView({
  modules,
  onSelectLesson,
}: CurriculumViewProps) {
  return (
    <div className="space-y-4">
      {modules.map((mod, modIdx) => (
        <div
          key={mod.id || modIdx}
          className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md"
        >
          <h3 className="text-base font-semibold text-white mb-3">
            Module {modIdx + 1}: {mod.title}
          </h3>

          <div className="space-y-2">
            {mod.lessons?.map((lesson: Lesson, lessonIdx: number) => (
              <div
                key={lesson.id || lessonIdx}
                onClick={() => onSelectLesson?.(lesson)}
                className="flex items-center justify-between rounded-lg border border-slate-800/80 bg-slate-950/60 p-3 text-sm text-slate-200 cursor-pointer transition-all hover:border-indigo-500/50 hover:bg-slate-800/50 hover:text-white"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-xs text-indigo-400">
                    {lessonIdx + 1}
                  </span>
                  <span>{lesson.title}</span>
                </div>
                <span className="text-xs text-indigo-400 opacity-0 transition-opacity group-hover:opacity-100 sm:opacity-100">
                  View →
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}