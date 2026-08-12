"use client";

import React from "react";
import type { SkillPathResponse, Lesson } from "@/lib/types";
import { BookOpen, ChevronRight, Clock, Award } from "lucide-react";

export interface CurriculumViewProps {
  data: SkillPathResponse | null;
  onSelectLesson?: (lesson: Lesson) => void;
}

export default function CurriculumView({
  data,
  onSelectLesson,
}: CurriculumViewProps) {
  if (!data) return null;

  return (
    <div className="w-full space-y-8">
      {/* Overview Card */}
      <div className="rounded-2xl border border-slate-800 bg-[#172033]/80 p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
              Target Topic
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {data.topic || "Curriculum Overview"}
            </h2>
          </div>
          {data.difficulty && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <Award className="w-3.5 h-3.5" />
              {data.difficulty}
            </span>
          )}
        </div>

        {data.description && (
          <p className="text-sm sm:text-base text-slate-300">
            {data.description}
          </p>
        )}
      </div>

      {/* Modules List */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-400" />
          <span>Learning Modules</span>
        </h3>

        <div className="grid gap-6">
          {data.modules?.map((module, mIdx) => (
            <div
              key={module.id || mIdx}
              className="rounded-2xl border border-slate-800 bg-[#172033]/60 p-6 backdrop-blur-md shadow-lg space-y-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                    Module {mIdx + 1}
                  </span>
                  <h4 className="text-lg font-bold text-white">
                    {module.title}
                  </h4>
                  {module.description && (
                    <p className="text-xs text-slate-400 mt-1">
                      {module.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Lessons Grid */}
              <div className="divide-y divide-slate-800/60 border-t border-slate-800/60 pt-2">
                {module.lessons?.map((lesson, lIdx) => (
                  <div
                    key={lesson.id || lIdx}
                    onClick={() => onSelectLesson?.(lesson)}
                    className="group flex items-center justify-between py-3.5 px-2 rounded-xl hover:bg-slate-800/50 cursor-pointer transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 text-xs font-bold border border-indigo-500/20 group-hover:bg-indigo-500 group-hover:text-white transition">
                        {lIdx + 1}
                      </div>
                      <div>
                        <h5 className="text-sm font-semibold text-slate-200 group-hover:text-white transition">
                          {lesson.title}
                        </h5>
                        {lesson.duration && (
                          <span className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                            <Clock className="w-3 h-3" />
                            {lesson.duration}
                          </span>
                        )}
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}