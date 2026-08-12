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

export interface ExerciseResponse {
  id?: string;
  title?: string;
  instructions?: string;
  question?: string;
  question_type?: string;
  options?: string[]; // Added options array
  correct_option_index?: number;
  initial_code?: string;
  starter_code?: string;
  solution?: string;
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