import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface StudySessionLog {
  date: string;
  minutes: number;
  exercises: number;
  correct: number;
}

interface StudySessionState {
  sessions: StudySessionLog[];
  logSession: (
    minutes: number,
    exercises: number,
    correct: number
  ) => void;
  getTotalExercises: () => number;
  getTotalCorrect: () => number;
  getTotalMinutes: () => number;
  getStreak: () => number;
  getTodaySessions: () => { minutes: number; exercises: number };
}

function dateKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export const useStudySessionStore = create<StudySessionState>()(
  persist(
    (set, get) => ({
      sessions: [],

      logSession: (minutes, exercises, correct) => {
        const today = dateKey(new Date());
        const minutesInt = Math.max(0, Math.round(minutes));
        const exercisesInt = Math.max(0, exercises);
        const correctInt = Math.max(0, Math.min(correct, exercisesInt));

        set((state) => {
          const existing = state.sessions.find((s) => s.date === today);
          if (existing) {
            return {
              sessions: state.sessions.map((s) =>
                s.date === today
                  ? {
                      ...s,
                      minutes: s.minutes + minutesInt,
                      exercises: s.exercises + exercisesInt,
                      correct: s.correct + correctInt,
                    }
                  : s
              ),
            };
          }
          return {
            sessions: [
              ...state.sessions,
              { date: today, minutes: minutesInt, exercises: exercisesInt, correct: correctInt },
            ],
          };
        });
      },

      getTotalExercises: () =>
        get().sessions.reduce((acc, s) => acc + s.exercises, 0),

      getTotalCorrect: () =>
        get().sessions.reduce((acc, s) => acc + s.correct, 0),

      getTotalMinutes: () =>
        get().sessions.reduce((acc, s) => acc + s.minutes, 0),

      getStreak: () => {
        const byKey = new Map(get().sessions.map((s) => [s.date, s]));
        let streak = 0;
        const cursor = new Date();
        cursor.setUTCHours(0, 0, 0, 0);

        while (byKey.has(dateKey(cursor))) {
          streak += 1;
          cursor.setUTCDate(cursor.getUTCDate() - 1);
        }

        return streak;
      },

      getTodaySessions: () => {
        const today = dateKey(new Date());
        const sessions = get().sessions.filter((s) => s.date === today);
        return {
          minutes: sessions.reduce((acc, s) => acc + s.minutes, 0),
          exercises: sessions.reduce((acc, s) => acc + s.exercises, 0),
        };
      },
    }),
    {
      name: "cognita-study-sessions",
    }
  )
);