"use client";

import { useState } from "react";
import { generateSkillPath } from "@/lib/api";
import type { SkillPathResponse } from "@/lib/types";
import CurriculumView from "@/components/CurriculumView";

export default function Home() {
  const [topicInput, setTopicInput] = useState("FastAPI"); // Default topic
  const [pathData, setPathData] = useState<SkillPathResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetchPath = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!topicInput.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // Pass the user's typed topic dynamically to the API
      const data = await generateSkillPath(topicInput.trim());
      setPathData(data);
    } catch (err: any) {
      console.error("Fetch failed:", err);
      setError(err.message || "Failed to load curriculum for this topic.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-8 max-w-4xl mx-auto text-black space-y-6">
      <h1 className="text-2xl font-bold">EduTech Learning Platform</h1>

      {/* Input Field and Button Form */}
      <form onSubmit={handleFetchPath} className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">
            Lesson or Topic Name
          </label>
          <input
            id="topic"
            type="text"
            value={topicInput}
            onChange={(e) => setTopicInput(e.target.value)}
            placeholder="e.g., Python Basics, Docker, React, FastAPI..."
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white"
            disabled={loading}
          />
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            disabled={loading || !topicInput.trim()}
            className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors h-[42px]"
          >
            {loading ? "Generating Path..." : "Load Learning Path"}
          </button>
        </div>
      </form>

      {/* Error Output */}
      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Dynamic Curriculum Output */}
      {pathData && (
        <CurriculumView
          pathData={pathData}
          modules={pathData.modules || []}
        />
      )}
    </main>
  );
}