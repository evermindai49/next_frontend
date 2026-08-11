"use client";

import { useState } from "react";
import { generateSkillPath } from "@/lib/api";
import type { SkillPathResponse } from "@/lib/types";
import CurriculumView from "@/components/CurriculumView";

export default function Home() {
  const [pathData, setPathData] = useState<SkillPathResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetchPath = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await generateSkillPath("FastAPI");
      console.log(`Title: ${data.title} | Topic: ${data.topic || "FastAPI"} | Difficulty: ${data.difficulty || "Beginner"}`);
      
      // Save data to state so UI re-renders
      setPathData(data);
    } catch (err: any) {
      console.error("Fetch failed:", err);
      setError(err.message || "Failed to load curriculum");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-8 max-w-4xl mx-auto text-black space-y-6">
      <h1 className="text-2xl font-bold">EduTech Learning Platform</h1>

      <button
        onClick={handleFetchPath}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Loading Path..." : "Load Learning Path"}
      </button>

      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Render curriculum component when pathData is available */}
      {pathData && (
        <CurriculumView 
          pathData={pathData} 
          modules={pathData.modules || []} 
        />
      )}
    </main>
  );
}