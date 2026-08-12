export interface Lesson {
  id?: string;
  title: string;
  description?: string;
  duration?: string;
  content?: string;
  completed?: boolean;
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