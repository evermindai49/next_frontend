"use client";

import { useState } from "react";
import { generateSkillPath, generateExercise } from "@/lib/api";
import type { SkillPathResponse, ExerciseResponse, ModuleItem, LessonItem } from "@/lib/types";

export default function Home() {
  const [pathData, setPathData] = useState<SkillPathResponse | null>(null);
  const [exerciseData, setExerciseData] = useState<ExerciseResponse | null>(null);

  // app/page.tsx

  // app/page.tsx

  // app/page.tsx

  const handleFetchPath = async () => {
    const requestedTopic = "FastAPI";

    try {
      const data = await generateSkillPath(requestedTopic);

      // Check backend payload keys, or fall back to the requested topic variable
      const topic = 
        data.topic || 
        data.subject || 
        data.category || 
        data.technology || 
        data.course_name || 
        requestedTopic;

      const difficulty = data.difficulty || data.level || "Beginner";

      console.log(`Title: ${data.title} | Topic: ${topic} | Difficulty: ${difficulty}`);

      setPathData(data);
    } catch (err: any) {
      console.error("Fetch failed:", err);
    }
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