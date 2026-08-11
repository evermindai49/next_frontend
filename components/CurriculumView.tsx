// components/CurriculumView.tsx

"use client";

import React from "react";
import type { SkillPathResponse, ModuleItem, LessonItem } from "@/lib/types";

interface CurriculumViewProps {
  pathData?: SkillPathResponse;
  modules: ModuleItem[];
  onSelectLesson?: (lesson: LessonItem) => void;
}

export default function CurriculumView({ pathData, modules, onSelectLesson }: CurriculumViewProps) {
  return (
    <div className="space-y-4 text-black">
      {pathData && (
        <div className="bg-gray-100 p-4 rounded mb-4">
          <h2 className="text-xl font-bold">{pathData.title}</h2>
          {pathData.topic && <p className="text-sm text-gray-700">Topic: {pathData.topic}</p>}
          {pathData.difficulty && <p className="text-sm text-gray-700">Difficulty: {pathData.difficulty}</p>}
        </div>
      )}

      {modules.map((module: ModuleItem, modIndex: number) => (
        <div key={module.id || modIndex} className="border p-4 rounded bg-white shadow-sm">
          <h3 className="text-lg font-bold">{module.title}</h3>
          <p className="text-sm text-gray-600 mb-3">{module.description}</p>
          <div className="space-y-2">
            {module.lessons.map((lesson: LessonItem, lesIndex: number) => (
              <div
                key={lesson.id || lesson.lesson_id || lesIndex}
                onClick={() => onSelectLesson?.(lesson)}
                className="flex justify-between items-center p-2 bg-gray-50 hover:bg-gray-100 rounded cursor-pointer border"
              >
                <span className="font-medium text-sm">{lesson.title}</span>
                <span className="text-xs bg-gray-200 px-2 py-1 rounded">{lesson.duration}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}