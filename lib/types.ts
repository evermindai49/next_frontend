export interface Lesson {
  id?: string;
  title: string;
  description?: string; // Added optional description
  duration?: string;
  content?: string;
  type?: string;
}

export interface Module {
  id?: string;
  title: string;
  description?: string; // Added optional description
  lessons: Lesson[];
}

export interface SkillPathResponse {
  id?: string;
  topic: string;
  difficulty?: string;
  description?: string; // Added optional description
  modules: Module[];
}

export interface ExerciseResponse {
  id?: string;
  title?: string;
  instructions?: string;
  question?: string;
  initial_code?: string;
  starter_code?: string;
  solution?: string;
}

export interface FeedbackResponse {
  score: number;
  passed: boolean;
  feedback: string;
  recommended_areas?: string[];
}