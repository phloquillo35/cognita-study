// FSRS-6 (Free Spaced Repetition Scheduler) — parámetros por defecto de
// open-spaced-repetition/ts-fsrs. Implementación pura y testeable.
// Grades: 1 = Again (olvidé), 2 = Hard (difícil), 3 = Good (bien), 4 = Easy (fácil).

export type FSRSGrade = 1 | 2 | 3 | 4;

export const FSRS_W = [
  0.212, 1.2931, 2.3065, 8.2956, 6.4133, 0.8334, 3.0194, 0.001, 1.8722,
  0.1666, 0.796, 1.4835, 0.0614, 0.2629, 1.6483, 0.6014, 1.8729, 0.5425,
  0.0912, 0.0658, 0.1542,
];

const DECAY = FSRS_W[20]; // 0.1542
const FACTOR = Math.pow(0.9, -1 / DECAY) - 1; // ~0.98
export const REQUESTED_RETENTION = 0.9;

export function clamp(x: number, lo: number, hi: number): number {
  return Math.min(Math.max(x, lo), hi);
}

// R(t,S) = (1 + FACTOR * t/S)^(-DECAY)
export function retrievability(elapsedDays: number, stability: number): number {
  if (stability <= 0) return 0;
  return Math.pow(1 + (FACTOR * elapsedDays) / stability, -DECAY);
}

// Intervalo para alcanzar la retención deseada: t = (r^(-1/DECAY) - 1)/FACTOR * S
export function intervalForRetention(
  stability: number,
  retention: number = REQUESTED_RETENTION
): number {
  const t = (Math.pow(retention, -1 / DECAY) - 1) / FACTOR * stability;
  return Math.max(1, Math.round(t));
}

export function initStability(grade: FSRSGrade): number {
  return Math.max(FSRS_W[grade - 1], 0.1);
}

export function initDifficulty(grade: FSRSGrade): number {
  const d = FSRS_W[4] - Math.exp((grade - 1) * FSRS_W[5]) + 1;
  return clamp(d, 1, 10);
}

export function nextDifficulty(difficulty: number, grade: FSRSGrade): number {
  const delta = -FSRS_W[6] * (grade - 3);
  let next = difficulty + delta;
  // amortiguación lineal (w[7] ~ 0.001, efecto despreciable pero por fidelidad)
  next = FSRS_W[7] * initDifficulty(4) + (1 - FSRS_W[7]) * next;
  return clamp(next, 1, 10);
}

export function nextRecallStability(
  difficulty: number,
  stability: number,
  r: number,
  grade: FSRSGrade
): number {
  const hardBonus = grade === 2 ? FSRS_W[15] : 1;
  const easyBonus = grade === 4 ? FSRS_W[16] : 1;
  const term =
    Math.exp(FSRS_W[8]) *
    (11 - difficulty) *
    Math.pow(stability, -FSRS_W[9]) *
    (Math.exp(FSRS_W[10] * (1 - r)) - 1) *
    hardBonus *
    easyBonus;
  return stability * (1 + term);
}

export function nextForgetStability(
  difficulty: number,
  stability: number,
  r: number
): number {
  const s =
    FSRS_W[11] *
    Math.pow(difficulty, -FSRS_W[12]) *
    (Math.pow(stability + 1, FSRS_W[13]) - 1) *
    Math.exp(FSRS_W[14] * (1 - r));
  return clamp(s, 0.01, stability); // un lapse nunca aumenta la estabilidad
}

export interface FSRSState {
  stability: number;
  difficulty: number;
  reps: number;
}

export interface FSRSReview {
  state: FSRSState;
  interval: number;
  nextReview: Date;
}

export function reviewFSRS(
  prev: FSRSState | null,
  grade: FSRSGrade,
  elapsedDays: number
): FSRSReview {
  let stability: number;
  let difficulty: number;
  let reps: number;

  if (!prev) {
    stability = initStability(grade);
    difficulty = initDifficulty(grade);
    reps = 1;
  } else {
    const r = retrievability(elapsedDays, prev.stability);
    difficulty = nextDifficulty(prev.difficulty, grade);
    if (grade === 1) {
      stability = nextForgetStability(prev.difficulty, prev.stability, r);
      reps = 0;
    } else {
      stability = nextRecallStability(prev.difficulty, prev.stability, r, grade);
      reps = prev.reps + 1;
    }
  }

  const interval = intervalForRetention(stability);
  const nextReview = new Date(Date.now() + interval * 86400000);
  return { state: { stability, difficulty, reps }, interval, nextReview };
}
