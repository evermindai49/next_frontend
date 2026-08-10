import {
  SkillPathResponse,
  LessonContentResponse,
  ExerciseResponse,
  FeedbackResponse,
} from "@/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://my-fastapi-backend-iota.vercel.app";

async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Request failed with status ${response.status}`);
  }

  return response.json();
}

// Named Exports
export async function generateSkillPath(
  topic: string,
  difficulty = "Beginner",
  goals = ""
): Promise<SkillPathResponse> {
  return fetchAPI<SkillPathResponse>("/api/v1/generate-path", {
    method: "POST",
    body: JSON.stringify({ topic, difficulty, goals }),
  });
}

export async function generateLessonContent(
  topic: string,
  moduleTitle?: string,
  courseName?: string
): Promise<LessonContentResponse> {
  return fetchAPI<LessonContentResponse>("/api/v1/generate-lesson", {
    method: "POST",
    body: JSON.stringify({ topic, module_title: moduleTitle, course_name: courseName }),
  });
}

export async function generateExercise(topic: string): Promise<ExerciseResponse> {
  return fetchAPI<ExerciseResponse>("/api/v1/generate-exercise", {
    method: "POST",
    body: JSON.stringify({ topic }),
  });
}

export async function submitAnswer(
  exerciseTitle: string,
  userCode: string
): Promise<FeedbackResponse> {
  return fetchAPI<FeedbackResponse>("/api/v1/submit-answer", {
    method: "POST",
    body: JSON.stringify({ exercise_title: exerciseTitle, user_code: userCode }),
  });
}

// Grouped Default Export
export const ApiService = {
  generateSkillPath,
  generateLessonContent,
  generateExercise,
  submitAnswer,
};