"use client";

import React from "react";
import { LessonContentResponse } from "@/types";

interface LessonModalProps {
  lesson: LessonContentResponse;
  onClose: () => void;
}

export function LessonModal({ lesson, onClose }: LessonModalProps) {
  return (
    <article style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <header style={{ borderBottom: "1px solid #e2e8f0", paddingBottom: "12px" }}>
        <h2 style={{ margin: 0, color: "#0f172a", fontSize: "1.5rem" }}>
          {lesson.title}
        </h2>
      </header>

      <div
        style={{
          fontSize: "1rem",
          lineHeight: "1.6",
          color: "#334155",
          whiteSpace: "pre-wrap",
        }}
      >
        {lesson.content}
      </div>

      {lesson.key_takeaways && lesson.key_takeaways.length > 0 && (
        <div
          style={{
            backgroundColor: "#f0f9ff",
            border: "1px solid #bae6fd",
            padding: "16px",
            borderRadius: "6px",
            marginTop: "12px",
          }}
        >
          <h4 style={{ margin: "0 0 8px 0", color: "#0369a1" }}>Key Takeaways</h4>
          <ul style={{ margin: 0, paddingLeft: "20px", color: "#0c4a6e" }}>
            {lesson.key_takeaways.map((item, index) => (
              <li key={index} style={{ marginBottom: "4px" }}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}