import { create } from "zustand";
import { persist } from "zustand/middleware";
import { isDbAvailable } from "@/lib/sync";

function dayKey(d = new Date()): string {
  return d.toISOString().slice(0, 10);
}

function diffDays(a: string, b: string): number {
  const da = new Date(a + "T00:00:00").getTime();
  const db = new Date(b + "T00:00:00").getTime();
  return Math.round((db - da) / 86400000);
}

interface DailyActivity {
  reviews: number;
  minutes: number;
}

interface StreakState {
  currentStreak: number;
  longestStreak: number;
  totalFocusMinutes: number;
  totalReviews: number;
  lastActiveDate: string | null;
  daily: Record<string, DailyActivity>;
  syncStatus: "idle" | "syncing" | "fallback" | "error";
  registerActivity: () => void;
  addFocusMinutes: (minutes: number) => void;
  addReviews: (count: number) => void;
  fetchAll: () => Promise<void>;
  syncToDb: () => Promise<void>;
}

function ensureToday(state: {
  daily: Record<string, DailyActivity>;
}): Record<string, DailyActivity> {
  const today = dayKey();
  if (state.daily[today]) return state.daily;
  return { ...state.daily, [today]: { reviews: 0, minutes: 0 } };
}

export function lastNDays(n: number): { key: string; label: string }[] {
  const out: { key: string; label: string }[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    out.push({ key, label: d.toLocaleDateString("es", { weekday: "short" }) });
  }
  return out;
}

export const useStreakStore = create<StreakState>()(
  persist(
    (set, get) => ({
      currentStreak: 0,
      longestStreak: 0,
      totalFocusMinutes: 0,
      totalReviews: 0,
      lastActiveDate: null,
      daily: {},
      syncStatus: "idle" as const,

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
          daily: ensureToday(s),
          currentStreak: streak,
          longestStreak: Math.max(s.longestStreak, streak),
          lastActiveDate: today,
        }));
        get().syncToDb();
      },

      addFocusMinutes: (minutes) => {
        get().registerActivity();
        set((s) => {
          const daily = ensureToday(s);
          const today = dayKey();
          return {
            daily: {
              ...daily,
              [today]: {
                reviews: daily[today].reviews,
                minutes: daily[today].minutes + minutes,
              },
            },
            totalFocusMinutes: s.totalFocusMinutes + minutes,
          };
        });
        get().syncToDb();
      },

      addReviews: (count) => {
        get().registerActivity();
        set((s) => {
          const daily = ensureToday(s);
          const today = dayKey();
          return {
            daily: {
              ...daily,
              [today]: {
                reviews: daily[today].reviews + count,
                minutes: daily[today].minutes,
              },
            },
            totalReviews: s.totalReviews + count,
          };
        });
        get().syncToDb();
      },

      fetchAll: async () => {
        if (!(await isDbAvailable())) { set({ syncStatus: "fallback" }); return; }
        set({ syncStatus: "syncing" });
        try {
          const res = await fetch("/api/streak", { cache: "no-store" });
          const json = await res.json();
          if (json.fallback) { set({ syncStatus: "fallback" }); return; }
          const remote = json as StreakState;
          if (remote && typeof remote.currentStreak === "number") {
            set({
              currentStreak: remote.currentStreak,
              longestStreak: remote.longestStreak,
              totalFocusMinutes: remote.totalFocusMinutes,
              totalReviews: remote.totalReviews,
              lastActiveDate: remote.lastActiveDate,
              daily: (remote.daily as Record<string, DailyActivity>) ?? {},
              syncStatus: "idle",
            });
          } else set({ syncStatus: "idle" });
        } catch { set({ syncStatus: "error" }); }
      },

      syncToDb: async () => {
        if (!(await isDbAvailable())) return;
        const s = get();
        try {
          await fetch("/api/streak", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ currentStreak: s.currentStreak, longestStreak: s.longestStreak, totalFocusMinutes: s.totalFocusMinutes, totalReviews: s.totalReviews, lastActiveDate: s.lastActiveDate, daily: s.daily }) });
        } catch {}
      },
    }),
    { name: "cognita-streak" }
  )
);
