import { create } from "zustand";
import { persist } from "zustand/middleware";

function dayKey(d = new Date()): string {
  return d.toISOString().slice(0, 10);
}

function diffDays(a: string, b: string): number {
  const da = new Date(a + "T00:00:00").getTime();
  const db = new Date(b + "T00:00:00").getTime();
  return Math.round((db - da) / 86400000);
}

interface StreakState {
  currentStreak: number;
  longestStreak: number;
  totalFocusMinutes: number;
  totalReviews: number;
  lastActiveDate: string | null;
  registerActivity: () => void;
  addFocusMinutes: (minutes: number) => void;
  addReviews: (count: number) => void;
}

export const useStreakStore = create<StreakState>()(
  persist(
    (set, get) => ({
      currentStreak: 0,
      longestStreak: 0,
      totalFocusMinutes: 0,
      totalReviews: 0,
      lastActiveDate: null,

      registerActivity: () => {
        const today = dayKey();
        const last = get().lastActiveDate;
        if (last === today) return;
        let streak = 1;
        if (last) {
          const gap = diffDays(last, today);
          streak = gap === 1 ? get().currentStreak + 1 : 1;
        }
        set((s) => ({
          currentStreak: streak,
          longestStreak: Math.max(s.longestStreak, streak),
          lastActiveDate: today,
        }));
      },

      addFocusMinutes: (minutes) => {
        get().registerActivity();
        set((s) => ({ totalFocusMinutes: s.totalFocusMinutes + minutes }));
      },

      addReviews: (count) => {
        get().registerActivity();
        set((s) => ({ totalReviews: s.totalReviews + count }));
      },
    }),
    { name: "cognita-streak" }
  )
);
