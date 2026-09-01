import { describe, it, expect, beforeEach } from "vitest";

class MockStorage {
  private store: Record<string, string> = {};
  getItem(k: string) {
    return this.store[k] ?? null;
  }
  setItem(k: string, v: string) {
    this.store[k] = v;
  }
  removeItem(k: string) {
    delete this.store[k];
  }
}
// @ts-expect-error assigning to global for test
globalThis.localStorage = new MockStorage();

const { useStreakStore } = await import("./streakStore");

describe("streakStore", () => {
  beforeEach(() => {
    useStreakStore.setState({
      currentStreak: 0,
      longestStreak: 0,
      totalFocusMinutes: 0,
      totalReviews: 0,
      lastActiveDate: null,
    });
  });

  it("registers activity and starts a streak at 1", () => {
    useStreakStore.getState().registerActivity();
    const s = useStreakStore.getState();
    expect(s.currentStreak).toBe(1);
    expect(s.lastActiveDate).not.toBeNull();
  });

  it("does not increment streak twice on the same day", () => {
    const st = useStreakStore.getState();
    st.registerActivity();
    st.registerActivity();
    expect(useStreakStore.getState().currentStreak).toBe(1);
  });

  it("accumulates focus minutes and tracks longest streak", () => {
    useStreakStore.getState().addFocusMinutes(25);
    useStreakStore.getState().addFocusMinutes(10);
    const s = useStreakStore.getState();
    expect(s.totalFocusMinutes).toBe(35);
    expect(s.longestStreak).toBe(Math.max(s.longestStreak, s.currentStreak));
  });

  it("accumulates reviews", () => {
    useStreakStore.getState().addReviews(3);
    useStreakStore.getState().addReviews(2);
    expect(useStreakStore.getState().totalReviews).toBe(5);
  });
});
