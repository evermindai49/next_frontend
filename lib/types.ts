export interface LessonItem {
  lesson_id: string;
  title: string;
  duration: string;
}

export interface ModuleItem {
  title: string;
  description: string;
  lessons: LessonItem[];
}

export interface SkillPathResponse {
  title: string;
  description: string;
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
}

export interface FeedbackResponse {
  is_correct: boolean;
  score: number;
  feedback: string;
  suggestions: string[];
}