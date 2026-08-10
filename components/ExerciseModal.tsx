"use client";

import React, { useState } from "react";
import { ExerciseResponse } from "@/lib/types";

interface ExerciseModalProps {
  exercise: ExerciseResponse;
  onClose: () => void;
}

export function ExerciseModal({ exercise }: ExerciseModalProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const isCorrect = selectedOption === exercise.solution;

  return (
    <div
      style={{
        marginTop: "24px",
        padding: "20px",
        backgroundColor: "#f8fafc",
        border: "1px solid #cbd5e1",
        borderRadius: "8px",
      }}
    >
      <h3 style={{ margin: "0 0 12px 0", color: "#1e293b", fontSize: "1.1rem" }}>
        Practice Exercise
      </h3>
      <p style={{ margin: "0 0 16px 0", color: "#334155", fontWeight: 500 }}>
        {exercise.question}
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
        {exercise.options?.map((option, idx) => {
          const isSelected = selectedOption === option;
          return (
            <button
              key={idx}
              onClick={() => {
                if (!submitted) setSelectedOption(option);
              }}
              style={{
                padding: "10px 14px",
                textAlign: "left",
                borderRadius: "6px",
                border: isSelected ? "2px solid #2563eb" : "1px solid #cbd5e1",
                backgroundColor: isSelected ? "#eff6ff" : "#ffffff",
                cursor: submitted ? "default" : "pointer",
                color: "#1e293b",
                fontWeight: isSelected ? 600 : 400,
              }}
            >
              {option}
            </button>
          );
        })}
      </div>

      {!submitted ? (
        <button
          onClick={() => setSubmitted(true)}
          disabled={!selectedOption}
          style={{
            padding: "8px 16px",
            backgroundColor: selectedOption ? "#2563eb" : "#94a3b8",
            color: "#ffffff",
            border: "none",
            borderRadius: "6px",
            fontWeight: 600,
            cursor: selectedOption ? "pointer" : "not-allowed",
          }}
        >
          Check Answer
        </button>
      ) : (
        <div
          style={{
            padding: "12px",
            borderRadius: "6px",
            backgroundColor: isCorrect ? "#dcfce7" : "#fee2e2",
            border: `1px solid ${isCorrect ? "#86efac" : "#fca5a5"}`,
            color: isCorrect ? "#166534" : "#991b1b",
          }}
        >
          {isCorrect ? (
            <p style={{ margin: 0, fontWeight: 600 }}>Correct answer!</p>
          ) : (
            <p style={{ margin: 0 }}>
              <strong>Incorrect.</strong> Correct answer: <em>{exercise.solution}</em>
            </p>
          )}
        </div>
      )}
    </div>
  );
}