// ./lib/api.ts

// 1. CRITICAL FIX: Use 'import type' for type-only imports so SWC ignores them during JS transpilation
import type {
  SkillPathResponse,
  LessonContentResponse,
  ExerciseResponse,
  FeedbackResponse,
} from "./types";

// Re-export type definitions cleanly so consumers can safely import types directly from api.ts
export type {
  SkillPathResponse,
  LessonContentResponse,
  ExerciseResponse,
  FeedbackResponse,
};

// Ensure no trailing slash on the base URL to prevent doubled slashes in requests
const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "https://my-fastapi-backend-iota.vercel.app"
).replace(/\/$/, "");

/**
 * Generic wrapper for API requests with standardized headers & error handling.
 */
async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));

    // Extract FastAPI detailed error message if present
    let errorMessage = `Request failed with status ${response.status}`;
    if (errorData.detail) {
      errorMessage =
        typeof errorData.detail === "string"
          ? errorData.detail
          : JSON.stringify(errorData.detail);
    }

    throw new Error(errorMessage);
  }

  return response.json();
}

// --- Direct Named Exports ---

/**
 * Retrieves a full skill path curriculum by topic, difficulty, and learning goals.
 */
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

/**
 * Generates on-demand content for a specific lesson title or topic.
 */
export async function generateLessonContent(
  topic: string,
  moduleTitle?: string,
  courseName?: string
): Promise<LessonContentResponse> {
  return fetchAPI<LessonContentResponse>("/api/v1/generate-lesson", {
    method: "POST",
    body: JSON.stringify({
      topic,
      module_title: moduleTitle,
      course_name: courseName,
    }),
  });
}

/**
 * Retrieves lesson details and exercises directly by lesson ID.
 */
export async function getLessonById(lessonId: string): Promise<LessonContentResponse> {
  return fetchAPI<LessonContentResponse>(
    `/api/v1/lesson/${encodeURIComponent(lessonId)}`,
    {
      method: "GET",
    }
  );
}

/**
 * Generates a standalone coding exercise for a given topic.
 */
export async function generateExercise(topic: string): Promise<ExerciseResponse> {
  return fetchAPI<ExerciseResponse>("/api/v1/generate-exercise", {
    method: "POST",
    body: JSON.stringify({ topic }),
  });
}

/**
 * Submits student code for automated evaluation and feedback.
 */
export async function submitAnswer(
  exerciseTitle: string,
  userCode: string
): Promise<FeedbackResponse> {
  return fetchAPI<FeedbackResponse>("/api/v1/submit-answer", {
    method: "POST",
    body: JSON.stringify({
      exercise_title: exerciseTitle,
      user_code: userCode,
    }),
  });
}

// --- Object Group Export ---
export const ApiService = {
  generateSkillPath,
  generateLessonContent,
  getLessonById,
  generateExercise,
  submitAnswer,
};

export default ApiService;