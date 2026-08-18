export interface Lesson {
  id?: string;
  title: string;
  description?: string;
  duration?: string;
  content?: string;
  type?: string;
}

export interface Module {
  id?: string;
  title: string;
  description?: string;
  lessons: Lesson[];
}

export interface SkillPathResponse {
  id?: string;
  topic: string;
  difficulty?: string;
  description?: string;
  modules: Module[];
}

// lib/types.ts (or wherever ExerciseResponse is declared)

// lib/types.ts

export interface ExerciseResponse {
  id?: string | number;
  title?: string;
  description?: string;
  question?: string;
  instructions?: string;
  initial_code?: string;
  starter_code?: string;
  solution?: string;
  options?: string[];
  hints?: string[];
  test_cases?: Array<{
    input?: string;
    expected_output?: string;
  }>;
}

// Added missing LessonContentResponse interface expected by lib/api.ts
export interface LessonContentResponse {
  id?: string;
  title: string;
  content: string;
  exercises?: ExerciseResponse[];
}

export interface FeedbackResponse {
  score: number;
  passed: boolean;
  feedback: string;
  recommended_areas?: string[];
}