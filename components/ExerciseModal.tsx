"use client";

import React from "react";
import type { ExerciseResponse } from "@/lib/types";

interface ExerciseModalProps {
  exercise: ExerciseResponse | null;
  onClose: () => void;
}

export default function ExerciseModal({ exercise, onClose }: ExerciseModalProps) {
  if (!exercise) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-xl w-full text-black space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">{exercise.title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">✕</button>
        </div>

        {exercise.question && (
          <p className="font-medium text-sm text-gray-800">{exercise.question}</p>
        )}

        <p className="text-sm text-gray-700">{exercise.instructions}</p>

        {exercise.initial_code && (
          <pre className="bg-gray-900 text-gray-100 p-3 rounded text-sm overflow-x-auto">
            {exercise.initial_code}
          </pre>
        )}

        {exercise.options && exercise.options.length > 0 && (
          <div className="space-y-2">
            {exercise.options.map((option: string, idx: number) => (
              <button key={idx} className="w-full text-left p-2 border rounded hover:bg-gray-50 text-sm">
                {option}
              </button>
            ))}
          </div>
        )}

        {exercise.solution && (
          <div className="border-t pt-3 mt-2">
            <h4 className="font-semibold text-xs text-gray-500 uppercase">Solution:</h4>
            <p className="text-sm text-gray-700 font-mono bg-gray-100 p-2 rounded mt-1">{exercise.solution}</p>
          </div>
        )}
      </div>
    </div>
  );
}