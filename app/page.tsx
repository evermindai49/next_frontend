"use client";

import { useState } from "react";
import { generateSkillPath, generateExercise } from "@/lib/api";
import type { SkillPathResponse, ExerciseResponse, ModuleItem, LessonItem } from "@/lib/types";

export default function Home() {
  const [pathData, setPathData] = useState<SkillPathResponse | null>(null);
  const [exerciseData, setExerciseData] = useState<ExerciseResponse | null>(null);

  const handleFetchPath = async () => {
    const data = await generateSkillPath("FastAPI");
    setPathData(data);

    // Safely accessing properties using updated SkillPathResponse schema
    console.log(data.title, data.topic, data.difficulty);

    data.modules.forEach((mod: ModuleItem, modIdx: number) => {
      const moduleId = mod.id || `mod-${modIdx}`;
      mod.lessons.forEach((les: LessonItem, lesIdx: number) => {
        const lessonId = les.id || les.lesson_id || `les-${lesIdx}`;
      });
    });
  };

  return (
    <main className="p-8 max-w-4xl mx-auto text-black space-y-6">
      <h1 className="text-2xl font-bold">EduTech Learning Platform</h1>
      <button onClick={handleFetchPath} className="bg-blue-600 text-white px-4 py-2 rounded">
        Load Learning Path
      </button>

      {/* Render Exercise Data safely without undefined scope error */}
      {exerciseData && (
        <div className="border p-4 rounded bg-gray-50 space-y-2">
          <h3 className="font-bold">{exerciseData.title}</h3>
          {exerciseData.question && <p>{exerciseData.question}</p>}
          {exerciseData.options?.map((opt: string, i: number) => (
            <div key={i} className="p-2 border rounded">{opt}</div>
          ))}
        </div>
      )}
    </main>
  );
}