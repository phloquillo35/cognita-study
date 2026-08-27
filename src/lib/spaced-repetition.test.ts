import { describe, it, expect } from "vitest";
import {
  calculateNextReview,
  getQualityLabel,
  isDue,
  type ReviewQuality,
} from "./spaced-repetition";
import {
  reviewFSRS,
  retrievability,
  intervalForRetention,
  initStability,
  initDifficulty,
  type FSRSGrade,
} from "./fsrs";

describe("FSRS core", () => {
  it("interval equals stability at requested retention (0.9)", () => {
    expect(intervalForRetention(100)).toBe(100);
    expect(intervalForRetention(250)).toBe(250);
  });

  it("retrievability is 0.9 when elapsed == stability", () => {
    expect(retrievability(100, 100)).toBeCloseTo(0.9, 2);
  });

  it("retrievability decays with elapsed time and grows with stability", () => {
    expect(retrievability(0, 100)).toBeCloseTo(1, 5);
    expect(retrievability(200, 100)).toBeLessThan(0.9);
    expect(retrievability(100, 200)).toBeGreaterThan(0.9);
  });

  it("init values stay in valid ranges", () => {
    for (const g of [1, 2, 3, 4] as FSRSGrade[]) {
      expect(initStability(g)).toBeGreaterThan(0);
      expect(initDifficulty(g)).toBeGreaterThanOrEqual(1);
      expect(initDifficulty(g)).toBeLessThanOrEqual(10);
    }
  });
});

describe("reviewFSRS", () => {
  it("first Good review yields interval ~ stability", () => {
    const r = reviewFSRS(null, 3, 0);
    expect(r.interval).toBeGreaterThan(0);
    expect(r.state.difficulty).toBeGreaterThanOrEqual(1);
    expect(r.state.difficulty).toBeLessThanOrEqual(10);
    expect(r.state.reps).toBe(1);
  });

  it("stable successful reviews increase stability/interval", () => {
    let r = reviewFSRS(null, 3, 0);
    for (let i = 0; i < 5; i++) {
      const next = reviewFSRS(r.state, 3, r.interval);
      expect(next.interval).toBeGreaterThanOrEqual(r.interval);
      r = next;
    }
    expect(r.interval).toBeGreaterThan(7); // madura tras varias revisiones
  });

  it("Easy grades produce longer intervals than Good", () => {
    const good = reviewFSRS(null, 3, 0);
    const easy = reviewFSRS(null, 4, 0);
    expect(easy.interval).toBeGreaterThanOrEqual(good.interval);
  });

  it("a lapse (Again) reduces stability and resets reps", () => {
    const matured = (() => {
      let r = reviewFSRS(null, 3, 0);
      for (let i = 0; i < 4; i++) r = reviewFSRS(r.state, 3, r.interval);
      return r;
    })();
    const lapsed = reviewFSRS(matured.state, 1, matured.interval);
    expect(lapsed.state.stability).toBeLessThanOrEqual(matured.state.stability);
    expect(lapsed.state.reps).toBe(0);
  });

  it("difficulty stays within [1,10] after many hard reviews", () => {
    let r = reviewFSRS(null, 2, 0);
    for (let i = 0; i < 10; i++) r = reviewFSRS(r.state, 2, r.interval);
    expect(r.state.difficulty).toBeGreaterThanOrEqual(1);
    expect(r.state.difficulty).toBeLessThanOrEqual(10);
  });
});

describe("calculateNextReview (SM-2 compat wrapper)", () => {
  const baseCard = {
    interval: 0,
    easeFactor: 2.5,
    repetitions: 0,
  };

  it("produces a valid first review", () => {
    const r = calculateNextReview(baseCard, 4);
    expect(r.interval).toBeGreaterThan(0);
    expect(r.stability).toBeGreaterThan(0);
    expect(r.difficulty).toBeGreaterThanOrEqual(1);
    expect(r.difficulty).toBeLessThanOrEqual(10);
    expect(r.nextReview.getTime()).toBeGreaterThan(Date.now());
    expect(r.repetitions).toBe(1);
  });

  it("persists stability across reviews (FSRS state)", () => {
    const r1 = calculateNextReview(baseCard, 4);
    const r2 = calculateNextReview(
      { ...baseCard, ...r1, lastReviewed: new Date() },
      4
    );
    expect(r2.stability).toBeGreaterThanOrEqual(r1.stability);
    expect(r2.repetitions).toBe(2);
  });

  it("a failing grade resets repetitions", () => {
    const afterGood = calculateNextReview(baseCard, 4);
    const failed = calculateNextReview(
      { ...baseCard, ...afterGood, lastReviewed: new Date() },
      0
    );
    expect(failed.repetitions).toBe(0);
  });

  it("accepts all quality grades without throwing", () => {
    for (const q of [0, 1, 2, 3, 4, 5] as ReviewQuality[]) {
      expect(() => calculateNextReview(baseCard, q)).not.toThrow();
    }
  });
});

describe("getQualityLabel", () => {
  it("maps grades to labels", () => {
    expect(getQualityLabel(0)).toBe("Olvidé");
    expect(getQualityLabel(3)).toBe("Bien");
    expect(getQualityLabel(5)).toBe("Perfecto");
  });
});

describe("isDue", () => {
  it("true for past due date", () => {
    expect(isDue({ nextReview: new Date(Date.now() - 1000) })).toBe(true);
  });
  it("false for future due date", () => {
    expect(isDue({ nextReview: new Date(Date.now() + 86400000) })).toBe(false);
  });
});
