"use client";

import React, { useState } from "react";
import { generateSkillPath, generateLessonContent, generateExercise } from "@/api";
import { SkillPathResponse, LessonContentResponse, ExerciseResponse } from "@/types";

export default function HomePage() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [path, setPath] = useState<SkillPathResponse | null>(null);
  const [activeLesson, setActiveLesson] = useState<LessonContentResponse | null>(null);
  const [activeExercise, setActiveExercise] = useState<ExerciseResponse | null>(null);

  const handleGeneratePath = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setError(null);
    setActiveLesson(null);
    setActiveExercise(null);

    try {
      const data = await generateSkillPath({ topic });
      setPath(data);
    } catch (err: any) {
      setError(err.message || "Failed to connect to backend service.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectLesson = async (lessonTitle: string, moduleTitle: string) => {
    try {
      const [lessonData, exerciseData] = await Promise.all([
        generateLessonContent({ topic: lessonTitle, module_title: moduleTitle }),
        generateExercise({ topic: lessonTitle }),
      ]);
      setActiveLesson(lessonData);
      setActiveExercise(exerciseData);
    } catch (err: any) {
      setError("Failed to fetch lesson details.");
    }
  };

  return (
    <main style={{ maxWidth: "800px", margin: "40px auto", padding: "0 20px" }}>
      <header style={{ textAlign: "center", marginBottom: "32px" }}>
        <h1 style={{ fontSize: "2.25rem", color: "#0f172a", marginBottom: "8px" }}>Evermind AI</h1>
        <p style={{ color: "#64748b", margin: 0 }}>Automated Skill Path & Curriculum Generator</p>
      </header>

      <form onSubmit={handleGeneratePath} style={{ display: "flex", gap: "12px", marginBottom: "32px" }}>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter a skill (e.g. FastAPI Deployment, Next.js, Machine Learning)..."
          style={{
            flex: 1,
            padding: "12px 16px",
            fontSize: "1rem",
            border: "1px solid #cbd5e1",
            borderRadius: "6px",
            outline: "none",
          }}
        />
        <button
          type="submit"
          disabled={loading || !topic.trim()}
          style={{
            padding: "12px 24px",
            fontSize: "1rem",
            fontWeight: 600,
            backgroundColor: loading ? "#94a3b8" : "#2563eb",
            color: "#ffffff",
            border: "none",
            borderRadius: "6px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </form>

      {error && (
        <div style={{ padding: "12px 16px", backgroundColor: "#fef2f2", border: "1px solid #fecaca", color: "#991b1b", borderRadius: "6px", marginBottom: "24px" }}>
          {error}
        </div>
      )}

      {path && !activeLesson && (
        <section style={{ backgroundColor: "#ffffff", padding: "24px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
          <h2 style={{ marginTop: 0, color: "#1e293b" }}>{path.topic}</h2>
          <span style={{ display: "inline-block", padding: "4px 8px", backgroundColor: "#e0f2fe", color: "#0369a1", fontSize: "0.875rem", borderRadius: "4px", marginBottom: "20px" }}>
            Difficulty: {path.difficulty}
          </span>

          <h3>Curriculum Modules</h3>
          {path.modules?.map((mod) => (
            <div key={mod.id} style={{ border: "1px solid #f1f5f9", padding: "16px", borderRadius: "6px", marginBottom: "16px", backgroundColor: "#f8fafc" }}>
              <h4 style={{ margin: "0 0 6px 0", color: "#334155" }}>{mod.title}</h4>
              <p style={{ margin: "0 0 12px 0", color: "#64748b", fontSize: "0.95rem" }}>{mod.description}</p>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {mod.lessons?.map((les) => (
                  <button
                    key={les.id}
                    onClick={() => handleSelectLesson(les.title, mod.title)}
                    style={{
                      textAlign: "left",
                      padding: "10px 12px",
                      backgroundColor: "#ffffff",
                      border: "1px solid #cbd5e1",
                      borderRadius: "4px",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span><strong>Lesson:</strong> {les.title}</span>
                    <span style={{ color: "#64748b" }}>{les.duration}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      {activeLesson && (
        <section style={{ backgroundColor: "#ffffff", padding: "24px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
          <button
            onClick={() => setActiveLesson(null)}
            style={{ padding: "6px 12px", backgroundColor: "#f1f5f9", border: "none", borderRadius: "4px", cursor: "pointer", marginBottom: "20px" }}
          >
            ← Back to Modules
          </button>

          <h2 style={{ marginTop: 0 }}>{activeLesson.title}</h2>
          <div style={{ whiteSpace: "pre-wrap", color: "#334155", lineHeight: "1.6" }}>{activeLesson.content}</div>

          <h3>Key Takeaways</h3>
          <ul>
            {activeLesson.key_takeaways?.map((takeaway, idx) => (
              <li key={idx} style={{ marginBottom: "6px" }}>{takeaway}</li>
            ))}
          </ul>

          {activeExercise && (
            <div style={{ marginTop: "32px", padding: "16px", backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "6px" }}>
              <h4 style={{ margin: "0 0 8px 0", color: "#166534" }}>Knowledge Check</h4>
              <p style={{ fontWeight: 600, margin: "0 0 12px 0" }}>{activeExercise.question}</p>
              <ul>
                {activeExercise.options?.map((opt, i) => (
                  <li key={i}>{opt}</li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}
    </main>
  );
}