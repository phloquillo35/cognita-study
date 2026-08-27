import { describe, it, expect } from "vitest";
import {
  calculateNextReview,
  getQualityLabel,
  isDue,
  type ReviewQuality,
} from "./spaced-repetition";

const baseCard = { interval: 0, easeFactor: 2.5, repetitions: 0 };

describe("calculateNextReview", () => {
  it("first successful review => interval 1 day", () => {
    const r = calculateNextReview(baseCard, 4);
    expect(r.repetitions).toBe(1);
    expect(r.interval).toBe(1);
  });

  it("second successful review => interval 6 days", () => {
    const afterFirst = calculateNextReview(baseCard, 4);
    const r = calculateNextReview(afterFirst, 4);
    expect(r.repetitions).toBe(2);
    expect(r.interval).toBe(6);
  });

  it("third successful review => interval scales by ease factor", () => {
    let card = calculateNextReview(baseCard, 5);
    card = calculateNextReview(card, 5);
    const r = calculateNextReview(card, 5);
    expect(r.repetitions).toBe(3);
    expect(r.interval).toBeGreaterThan(6);
  });

  it("quality < 3 resets repetitions and interval to 1", () => {
    const r = calculateNextReview({ interval: 30, easeFactor: 2.6, repetitions: 5 }, 1);
    expect(r.repetitions).toBe(0);
    expect(r.interval).toBe(1);
  });

  it("ease factor never drops below 1.3", () => {
    const r = calculateNextReview({ interval: 1, easeFactor: 1.3, repetitions: 1 }, 0);
    expect(r.easeFactor).toBeGreaterThanOrEqual(1.3);
  });

  it("nextReview is in the future for interval >= 1", () => {
    const r = calculateNextReview(baseCard, 4);
    expect(r.nextReview.getTime()).toBeGreaterThan(Date.now());
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
  it("returns true for past due date", () => {
    expect(isDue({ nextReview: new Date(Date.now() - 1000) })).toBe(true);
  });
  it("returns false for future due date", () => {
    expect(isDue({ nextReview: new Date(Date.now() + 86400000) })).toBe(false);
  });
});
