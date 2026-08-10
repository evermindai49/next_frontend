"use client";

import React from "react";
import { SkillPathResponse } from "@/types";

interface CurriculumViewProps {
  path: SkillPathResponse;
  onSelectLesson: (lessonTitle: string, moduleTitle: string) => void;
}

export function CurriculumView({ path, onSelectLesson }: CurriculumViewProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <header
        style={{
          backgroundColor: "#ffffff",
          padding: "24px",
          borderRadius: "8px",
          border: "1px solid #e2e8f0",
        }}
      >
        <span
          style={{
            fontSize: "0.85rem",
            fontWeight: 600,
            color: "#2563eb",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {path.difficulty || "Beginner"} Level
        </span>
        <h2 style={{ fontSize: "1.75rem", margin: "8px 0 0 0", color: "#0f172a" }}>
          {path.topic}
        </h2>
      </header>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {path.modules?.map((module, modIndex) => (
          <section
            key={module.id || modIndex}
            style={{
              backgroundColor: "#ffffff",
              padding: "20px",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
            }}
          >
            <h3 style={{ margin: "0 0 6px 0", color: "#1e293b", fontSize: "1.2rem" }}>
              Module {modIndex + 1}: {module.title}
            </h3>
            <p style={{ margin: "0 0 16px 0", color: "#64748b", fontSize: "0.95rem" }}>
              {module.description}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {module.lessons?.map((lesson) => (
                <button
                  key={lesson.id}
                  onClick={() => onSelectLesson(lesson.title, module.title)}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 16px",
                    backgroundColor: "#f8fafc",
                    border: "1px solid #cbd5e1",
                    borderRadius: "6px",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "border-color 0.15s ease",
                  }}
                >
                  <span style={{ fontWeight: 500, color: "#334155" }}>
                    {lesson.title}
                  </span>
                  <span style={{ fontSize: "0.85rem", color: "#64748b" }}>
                    {lesson.duration}
                  </span>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}