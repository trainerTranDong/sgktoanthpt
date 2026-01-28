export interface LessonContent {
  theory: string;
  example: string;
  solution: string;
}

export interface Exercise {
  id: string;
  question: string;
  options: string[]; // Enforce options for interactive quiz
  correctOptionIndex: number; // Index of the correct answer (0-3)
  explanation: string;
}

export interface Lesson {
  id: string;
  title: string;
  content: LessonContent;
  exercises: Exercise[];
}

export interface Chapter {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isError?: boolean;
}

// Tracking user progress
export interface UserProgress {
  completedLessons: string[]; // List of Lesson IDs
  lessonScores: Record<string, number>; // LessonID -> Percentage (0-100)
}