import type { Flashcard } from "@/types";

export type ReviewQuality = 0 | 1 | 2 | 3 | 4 | 5;

export interface ReviewResult {
  nextReview: Date;
  interval: number;
  easeFactor: number;
  repetitions: number;
}

export interface FlashcardData {
  id: string;
  subjectId: string;
  front: string;
  back: string;
  frontLatex?: string;
  backLatex?: string;
  interval: number;
  easeFactor: number;
  repetitions: number;
  nextReview: Date;
  lastReviewed?: Date;
  reviewCount: number;
  correctCount: number;
  createdAt: Date;
}

export function calculateNextReview(
  card: Pick<Flashcard, "interval" | "easeFactor" | "repetitions">,
  quality: ReviewQuality
): ReviewResult {
  let { interval, easeFactor, repetitions } = card;

  easeFactor =
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (easeFactor < 1.3) easeFactor = 1.3;

  if (quality < 3) {
    repetitions = 0;
    interval = 1;
  } else {
    repetitions = repetitions + 1;
    if (repetitions === 1) {
      interval = 1;
    } else if (repetitions === 2) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
  }

  const now = new Date();
  const nextReview = new Date(now.getTime() + interval * 24 * 60 * 60 * 1000);

  return { nextReview, interval, easeFactor, repetitions };
}

export function getQualityLabel(quality: ReviewQuality): string {
  const labels: Record<ReviewQuality, string> = {
    0: "Olvidé",
    1: "Incorrecto",
    2: "Difícil",
    3: "Bien",
    4: "Fácil",
    5: "Perfecto",
  };
  return labels[quality];
}

export function getQualityColor(quality: ReviewQuality): string {
  const colors: Record<ReviewQuality, string> = {
    0: "destructive",
    1: "destructive",
    2: "warning",
    3: "primary",
    4: "success",
    5: "success",
  };
  return colors[quality];
}

export function isDue(card: Pick<Flashcard, "nextReview">): boolean {
  return new Date(card.nextReview) <= new Date();
}
