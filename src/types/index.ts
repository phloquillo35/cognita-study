export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  university: string;
  career: string;
  currentLevel: number;
  createdAt: Date;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  level: number;
  career: string;
  credits: number;
  hoursPerWeek: number;
  totalHours: number;
  recoveryNote: number;
  description: string;
  topics: Topic[];
  prerequisites: string[];
  category: SubjectCategory;
  difficulty: number;
  studyHoursPerWeek: number;
  keyConcepts: string[];
}

export type SubjectCategory =
  | "math"
  | "physics"
  | "cs"
  | "engineering"
  | "general";

export interface Topic {
  id: string;
  subjectId: string;
  name: string;
  description: string;
  difficulty: number;
  estimatedMinutes: number;
}

export interface Exercise {
  id: string;
  topicId: string;
  subjectId: string;
  type: ExerciseType;
  difficulty: number;
  question: string;
  questionLatex?: string;
  answer: string;
  answerLatex?: string;
  solution?: string;
  solutionLatex?: string;
  hints: string[];
}

export type ExerciseType =
  | "multiple_choice"
  | "open_ended"
  | "true_false"
  | "fill_blank"
  | "step_by_step";

export interface StudySession {
  id: string;
  userId: string;
  subjectId: string;
  topicId?: string;
  startedAt: Date;
  endedAt?: Date;
  duration: number;
  exercisesCompleted: number;
  correctAnswers: number;
  type: SessionType;
}

export type SessionType = "practice" | "tutoring" | "review" | "exam_prep";

export interface UserProgress {
  userId: string;
  subjectId: string;
  topicId: string;
  masteryLevel: number;
  lastPracticed: Date;
  streak: number;
  totalExercises: number;
  correctAnswers: number;
  averageTime: number;
  nextReview: Date;
}

export interface StudyPlan {
  id: string;
  userId: string;
  subjectId: string;
  targetDate: Date;
  dailyMinutes: number;
  topics: StudyPlanTopic[];
  createdAt: Date;
}

export interface StudyPlanTopic {
  topicId: string;
  scheduledDate: Date;
  completed: boolean;
  score?: number;
}

export interface Note {
  id: string;
  userId?: string;
  subjectId: string;
  title: string;
  content: string;
  contentLatex?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  subjectId?: string;
  topicId?: string;
}

export interface Flashcard {
  id: string;
  userId?: string;
  subjectId: string;
  front: string;
  back: string;
  frontLatex?: string;
  backLatex?: string;
  difficulty: number;
  nextReview: Date;
  reviewCount: number;
  correctCount: number;
  interval: number;
  easeFactor: number;
  repetitions: number;
  lastReviewed?: Date;
  createdAt: Date;
}
