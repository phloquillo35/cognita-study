import { describe, it, expect } from "vitest";
import {
  initStability,
  initDifficulty,
  nextDifficulty,
  retrievability,
  intervalForRetention,
  nextRecallStability,
  nextForgetStability,
  type FSRSGrade,
} from "./fsrs";

describe("FSRS init", () => {
  it("initStability increases with grade", () => {
    const s1 = initStability(1);
    const s2 = initStability(2);
    const s3 = initStability(3);
    const s4 = initStability(4);
    expect(s1).toBeLessThan(s2);
    expect(s2).toBeLessThan(s3);
    expect(s3).toBeLessThan(s4);
    expect(s1).toBeGreaterThan(0);
  });

  it("initDifficulty in [1,10] for all grades", () => {
    for (const g of [1, 2, 3, 4] as FSRSGrade[]) {
      const d = initDifficulty(g);
      expect(d).toBeGreaterThanOrEqual(1);
      expect(d).toBeLessThanOrEqual(10);
    }
  });
});

describe("FSRS difficulty transition", () => {
  it("clamps difficulty within [1,10]", () => {
    let d = 1;
    for (let i = 0; i < 20; i++) d = nextDifficulty(d, 1); // many failures
    expect(d).toBeGreaterThanOrEqual(1);
    expect(d).toBeLessThanOrEqual(10);
    let d2 = 10;
    for (let i = 0; i < 20; i++) d2 = nextDifficulty(d2, 4); // many easy
    expect(d2).toBeGreaterThanOrEqual(1);
    expect(d2).toBeLessThanOrEqual(10);
  });
});

describe("FSRS stability transition", () => {
  it("recall increases stability, forget decreases it", () => {
    const base = 5;
    const difficulty = 5;
    const r = 0.9;
    const up = nextRecallStability(difficulty, base, r, 3);
    const down = nextForgetStability(difficulty, base, r);
    expect(up).toBeGreaterThan(base);
    expect(down).toBeLessThanOrEqual(base);
  });
});

describe("FSRS retrievability invariants", () => {
  it("R is 1 at t=0 regardless of stability", () => {
    expect(retrievability(0, 1)).toBeCloseTo(1, 5);
    expect(retrievability(0, 100)).toBeCloseTo(1, 5);
  });
  it("R is requested retention at t=interval", () => {
    for (const s of [1, 5, 30, 100]) {
      expect(retrievability(s, s)).toBeCloseTo(0.9, 2);
    }
  });
  it("intervalForRetention equals stability for R=0.9", () => {
    expect(intervalForRetention(50)).toBe(50);
  });
});
