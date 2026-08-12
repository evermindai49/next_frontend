export interface Lesson {
  id?: string;
  title: string;
  description?: string;
  duration?: string;
  content?: string;
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
  summary?: string;
  modules: Module[];
}

export interface LessonContentResponse {
  title: string;
  content: string;
  key_takeaways?: string[];
}

export interface ExerciseResponse {
  title: string;
  instructions: string;
  question?: string;
  starter_code?: string;
  initial_code?: string;
  options?: string[];
  solution?: string;
}

export interface FeedbackResponse {
  score: number;
  passed: boolean;
  feedback: string;
  recommended_areas?: string[];
}