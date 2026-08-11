// lib/types.ts

// lib/types.ts

// lib/types.ts

export interface LessonItem {
  id?: string;
  lesson_id: string;
  title: string;
  duration: string;
}

export interface ModuleItem {
  id?: string;
  title: string;
  description: string;
  lessons: LessonItem[];
}

// lib/types.ts

export interface SkillPathResponse {
  title: string;
  description: string;
  topic?: string;
  subject?: string;
  category?: string;
  technology?: string;
  course_name?: string;
  difficulty?: string;
  level?: string;
  modules: ModuleItem[];
}

export interface LessonContentResponse {
  title: string;
  content: string;
  key_takeaways: string[];
}

export interface ExerciseResponse {
  title: string;
  instructions: string;
  initial_code: string;
  hints: string[];
  options?: string[];
  question?: string;
  solution?: string;
}

export interface FeedbackResponse {
  is_correct: boolean;
  score: number;
  feedback: string;
  suggestions: string[];
}