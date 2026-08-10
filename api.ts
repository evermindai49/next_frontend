import {
  SkillPathRequest,
  SkillPathResponse,
  LessonContentResponse,
  ExerciseResponse,
  User,
  AdminAnalytics
} from "./types";

const RAW_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://my-fastapi-backend-iota.vercel.app";
const API_BASE_URL = RAW_BASE_URL.replace(/\/$/, "");

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorMsg = `HTTP Error ${res.status}: ${res.statusText}`;
    try {
      const data = await res.json();
      if (typeof data.detail === "string") {
        errorMsg = data.detail;
      } else if (Array.isArray(data.detail)) {
        errorMsg = data.detail.map((err: any) => err.msg).join(", ");
      }
    } catch {
      // Fallback
    }
    throw new Error(errorMsg);
  }
  return res.json();
}

export async function generateSkillPath(data: SkillPathRequest): Promise<SkillPathResponse> {
  const res = await fetch(`${API_BASE_URL}/generate-path`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse<SkillPathResponse>(res);
}

export async function generateLessonContent(data: { topic: string; module_title?: string }): Promise<LessonContentResponse> {
  const res = await fetch(`${API_BASE_URL}/generate-lesson`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse<LessonContentResponse>(res);
}

export async function generateExercise(data: { topic: string }): Promise<ExerciseResponse> {
  const res = await fetch(`${API_BASE_URL}/generate-exercise`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse<ExerciseResponse>(res);
}

export async function getUsersList(): Promise<User[]> {
  const res = await fetch(`${API_BASE_URL}/admin/users`);
  return handleResponse<User[]>(res);
}

export async function getAdminAnalytics(): Promise<AdminAnalytics> {
  const res = await fetch(`${API_BASE_URL}/admin/analytics`);
  return handleResponse<AdminAnalytics>(res);
}