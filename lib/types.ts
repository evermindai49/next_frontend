export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AdminAnalytics {
  totalUsers: number;
  totalPaths: number;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface SkillPathRequest {
  topic: str;
  difficulty?: string;
}

export interface SkillPathResponse {
  id: string;
  topic: string;
  difficulty: string;
  modules: Module[];
}

export interface LessonContentResponse {
  id: string;
  title: string;
  content: string;
  key_takeaways: string[];
}

export interface ExerciseResponse {
  id: string;
  question: string;
  options: string[];
  solution: string;
}