"use client";

import React from "react";
import { useRouter } from "next/navigation";
import type { SkillPathResponse, Module, Lesson } from "@/lib/types";
import { BookOpen, Clock, ChevronRight } from "lucide-react";

export interface CurriculumViewProps {
  data: SkillPathResponse | null;
  onSelectLesson?: (lesson: Lesson) => void;
}

export default function CurriculumView({ data }: CurriculumViewProps) {
  const router = useRouter();

  if (!data) return null;

  return (
    <div className="w-full space-y-8">
      {/* Header Info Banner */}
      <div
        className="w-full rounded-2xl border-2 border-slate-600 bg-[#1e293b] p-6 sm:p-8 shadow-xl space-y-3 text-white"
        style={{ backgroundColor: "#1e293b", opacity: 1 }}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950 border border-indigo-500/50 text-indigo-300 text-xs font-bold">
          <span>{data.difficulty || "Intermediate"} Path</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          {data.topic}
        </h2>
        {data.description && (
          <p className="text-slate-200 text-sm sm:text-base leading-relaxed max-w-3xl">
            {data.description}
          </p>
        )}
      </div>

      {/* Modules List */}
      <div className="space-y-6">
        {data.modules?.map((module: Module, modIdx: number) => (
          <div
            key={module.id || modIdx}
            className="w-full rounded-2xl border-2 border-slate-700 bg-[#1e293b] p-6 shadow-2xl space-y-4"
            style={{ backgroundColor: "#1e293b", opacity: 1 }}
          >
            <div className="border-b border-slate-700 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                Module {modIdx + 1}
              </span>
              <h3 className="text-xl font-bold text-white mt-1">
                {module.title}
              </h3>
            </div>

            {/* Lessons Grid */}
            <div className="grid gap-3">
              {module.lessons?.map((lesson: Lesson, lesIdx: number) => (
                <div
                  key={lesson.id || lesIdx}
                  onClick={() =>
                    router.push(`/lesson/${lesson.id || lesIdx + 1}`)
                  }
                  className="group flex items-center justify-between p-4 rounded-xl border border-slate-700 bg-[#0f172a] hover:border-indigo-400 hover:bg-[#111c35] transition duration-150 cursor-pointer"
                  style={{ backgroundColor: "#0f172a", opacity: 1 }}
                >
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-950 border border-indigo-500/40 text-indigo-300 group-hover:bg-indigo-600 group-hover:text-white transition">
                      <BookOpen className="h-4 w-4" />
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition">
                        {lesson.title}
                      </h4>
                      {lesson.duration && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-0.5">
                          <Clock className="h-3 w-3 text-slate-400" />
                          <span>{lesson.duration}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-semibold text-indigo-300 group-hover:text-white transition">
                    <span>Open Full Workspace</span>
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}