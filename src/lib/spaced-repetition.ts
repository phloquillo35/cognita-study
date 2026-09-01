import type { Flashcard } from "@/types";
import {
  reviewFSRS,
  type FSRSGrade,
  type FSRSState,
} from "./fsrs";

export type ReviewQuality = 0 | 1 | 2 | 3 | 4 | 5;

export interface ReviewResult {
  nextReview: Date;
  interval: number;
  easeFactor: number;
  repetitions: number;
  stability: number;
  difficulty: number;
}

// Mapea la calidad SM-2 (0-5) a los grados FSRS (1-4).
function qualityToGrade(quality: ReviewQuality): FSRSGrade {
  if (quality <= 1) return 1;
  if (quality === 2) return 2;
  if (quality === 3) return 3;
  return 4;
}

export function calculateNextReview(
  card: Pick<
    Flashcard,
    "interval" | "easeFactor" | "repetitions" | "stability" | "difficulty" | "lastReviewed"
  >,
  quality: ReviewQuality
): ReviewResult {
  const grade = qualityToGrade(quality);
  const prev: FSRSState | null =
    card.stability != null && card.difficulty != null
      ? { stability: card.stability, difficulty: card.difficulty, reps: card.repetitions }
      : null;
  const elapsedDays = card.lastReviewed
    ? Math.max(
        0,
        (Date.now() - new Date(card.lastReviewed).getTime()) / 86400000
      )
    : 0;

  const review = reviewFSRS(prev, grade, elapsedDays);

  // Facilidad derivada de la dificultad para mantener compatibilidad de UI (1.5..3.0)
  const easeFactor = +(
    3.0 -
    ((review.state.difficulty - 1) / 9) * 1.5
  ).toFixed(2);

  return {
    nextReview: review.nextReview,
    interval: review.interval,
    easeFactor,
    repetitions: review.state.reps,
    stability: review.state.stability,
    difficulty: review.state.difficulty,
  };
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
