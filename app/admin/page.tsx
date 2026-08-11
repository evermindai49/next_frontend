"use client";

import { useState } from "react";
// Import named function and type directly matching root structure
import { generateExercise, submitAnswer } from "../../api";
import type { ExerciseResponse, FeedbackResponse } from "../../types";

export default function AdminPage() {
  const [topic, setTopic] = useState("");
  const [exercise, setExercise] = useState<ExerciseResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateExercise = async () => {
    if (!topic) return;
    setLoading(true);
    setError(null);
    try {
      const data = await generateExercise(topic);
      setExercise(data);
    } catch (err: any) {
      setError(err.message || "Failed to generate exercise");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      
      <div className="flex gap-2">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter topic for exercise generation..."
          className="border p-2 rounded w-full text-black"
        />
        <button
          onClick={handleGenerateExercise}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate Exercise"}
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {exercise && (
        <div className="border p-4 rounded bg-gray-50 text-black space-y-2">
          <h2 className="text-xl font-semibold">{exercise.title}</h2>
          <p>{exercise.instructions}</p>
          <pre className="bg-gray-800 text-white p-3 rounded overflow-x-auto">
            {exercise.initial_code}
          </pre>
        </div>
      )}
    </div>
  );
}