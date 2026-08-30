import { create } from "zustand";
import { persist } from "zustand/middleware";
import { startOfDay, addDays, differenceInDays } from "date-fns";
import { isDbAvailable } from "@/lib/sync";

export interface TopicPlan {
  topicId: string;
  scheduledDate: Date;
  completed: boolean;
  score?: number;
}

export interface SubjectPlan {
  subjectId: string;
  targetDate: Date;
  dailyMinutes: number;
  topics: TopicPlan[];
  completed: boolean;
}

interface StudyPlanState {
  studyPlans: SubjectPlan[];
  syncStatus: "idle" | "syncing" | "fallback" | "error";
  addPlan: (
    plan: Omit<SubjectPlan, "completed"> & { completed?: boolean }
  ) => void;
  removePlan: (subjectId: string) => void;
  updatePlan: (subjectId: string, updates: Partial<SubjectPlan>) => void;
  toggleTopicComplete: (subjectId: string, topicId: string) => void;
  setTargetDate: (subjectId: string, targetDate: Date) => void;
  getPlansBySubject: (subjectId: string) => SubjectPlan | undefined;
  getUpcomingTopics: () => TopicPlan[];
  getOverallProgress: () => { total: number; completed: number; percentage: number };
  fetchAll: () => Promise<void>;
}

function startOfDayLocal(date: Date): Date {
  return startOfDay(date);
}

function distributeTopics(
  topicIds: string[],
  startDate: Date,
  targetDate: Date,
  dailyMinutes: number,
  topicDurations: Record<string, number>
): TopicPlan[] {
  const result: TopicPlan[] = [];
  let currentDate = startOfDayLocal(startDate);
  let minutesUsedToday = 0;
  let topicIndex = 0;

  while (topicIndex < topicIds.length) {
    if (differenceInDays(currentDate, targetDate) > 0) break;

    const topicId = topicIds[topicIndex];
    const duration = topicDurations[topicId] ?? 60;

    if (minutesUsedToday + duration > dailyMinutes && minutesUsedToday > 0) {
      currentDate = addDays(currentDate, 1);
      minutesUsedToday = 0;
      continue;
    }

    result.push({
      topicId,
      scheduledDate: currentDate,
      completed: false,
    });

    minutesUsedToday += duration;
    topicIndex++;

    if (topicIndex < topicIds.length && minutesUsedToday >= dailyMinutes) {
      currentDate = addDays(currentDate, 1);
      minutesUsedToday = 0;
    }
  }

  while (topicIndex < topicIds.length) {
    result.push({
      topicId: topicIds[topicIndex],
      scheduledDate: currentDate,
      completed: false,
    });
    topicIndex++;
  }

  return result;
}

export const useStudyPlanStore = create<StudyPlanState>()(
  persist(
    (set, get) => ({
      studyPlans: [],
      syncStatus: "idle" as const,

      addPlan: (plan) => {
        const existing = get().studyPlans.find(
          (p) => p.subjectId === plan.subjectId
        );
        if (existing) return;
        const newPlan = { ...plan, completed: plan.completed ?? false };
        set((state) => ({ studyPlans: [...state.studyPlans, newPlan] }));
        isDbAvailable().then((ok)=>{ if(ok) fetch("/api/study-plans",{ method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ subjectId: plan.subjectId, targetDate: plan.targetDate, dailyMinutes: plan.dailyMinutes, topics: plan.topics, completed: newPlan.completed }) }).catch(()=>{}); });
      },

      removePlan: (subjectId) => {
        set((state) => ({ studyPlans: state.studyPlans.filter((p) => p.subjectId !== subjectId) }));
        isDbAvailable().then(async(ok)=>{ if(!ok) return; try{ const r=await fetch(`/api/study-plans?subjectId=${subjectId}`); const j=await r.json(); const id=j[0]?.id; if(id) fetch(`/api/study-plans/${id}`,{method:"DELETE"}).catch(()=>{});}catch{} });
      },

      updatePlan: (subjectId, updates) =>
        set((state) => ({
          studyPlans: state.studyPlans.map((p) =>
            p.subjectId === subjectId ? { ...p, ...updates } : p
          ),
        })),

      toggleTopicComplete: (subjectId, topicId) =>
        set((state) => ({
          studyPlans: state.studyPlans.map((p) => {
            if (p.subjectId !== subjectId) return p;
            const updatedTopics = p.topics.map((t) =>
              t.topicId === topicId ? { ...t, completed: !t.completed } : t
            );
            const allDone = updatedTopics.every((t) => t.completed);
            return { ...p, topics: updatedTopics, completed: allDone };
          }),
        })),

      setTargetDate: (subjectId, targetDate) =>
        set((state) => ({
          studyPlans: state.studyPlans.map((p) =>
            p.subjectId === subjectId ? { ...p, targetDate } : p
          ),
        })),

      getPlansBySubject: (subjectId) =>
        get().studyPlans.find((p) => p.subjectId === subjectId),

      getUpcomingTopics: () => {
        const today = startOfDayLocal(new Date());
        const cutoff = addDays(today, 7);
        const upcoming: TopicPlan[] = [];

        for (const plan of get().studyPlans) {
          for (const topic of plan.topics) {
            const d = startOfDayLocal(new Date(topic.scheduledDate));
            if (d <= cutoff && !topic.completed) {
              upcoming.push(topic);
            }
          }
        }

        return upcoming.sort(
          (a, b) =>
            new Date(a.scheduledDate).getTime() -
            new Date(b.scheduledDate).getTime()
        );
      },

      getOverallProgress: () => {
        let total = 0;
        let completed = 0;
        for (const plan of get().studyPlans) {
          total += plan.topics.length;
          completed += plan.topics.filter((t) => t.completed).length;
        }
        return { total, completed, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
      },

      fetchAll: async () => {
        const { isDbAvailable: check } = await import("@/lib/sync");
        if (!(await check())) { set({ syncStatus: "fallback" }); return; }
        set({ syncStatus: "syncing" });
        try {
          const res = await fetch("/api/study-plans", { cache: "no-store" });
          const json = await res.json();
          if (json.fallback) { set({ syncStatus: "fallback" }); return; }
          const remote = Array.isArray(json) ? json : json.data ?? [];
          const parsed: SubjectPlan[] = remote.map((p: Record<string,unknown>)=>({ subjectId: p.subjectId as string, targetDate: new Date(p.targetDate as string), dailyMinutes: p.dailyMinutes as number, completed: p.completed as boolean, topics: ((p.topics as unknown as TopicPlan[]) ?? []).map((t)=>({ ...t, scheduledDate: new Date(t.scheduledDate)})) }));
          const local = get().studyPlans;
          const merged=[...parsed]; const ids=new Set(parsed.map(p=>p.subjectId)); for(const lc of local) if(!ids.has(lc.subjectId)) merged.push(lc);
          set({ studyPlans: merged, syncStatus: "idle" });
        } catch { set({ syncStatus: "error" }); }
      },
    }),
    {
      name: "cognita-study-plans",
      partialize: (state) => ({
        studyPlans: state.studyPlans.map((p) => ({
          ...p,
          targetDate: p.targetDate instanceof Date ? p.targetDate.toISOString() : p.targetDate,
          topics: p.topics.map((t) => ({
            ...t,
            scheduledDate:
              t.scheduledDate instanceof Date
                ? t.scheduledDate.toISOString()
                : t.scheduledDate,
          })),
        })),
      }),
      merge: (persisted, current) => {
        const data = persisted as {
          studyPlans?: {
            subjectId: string;
            targetDate: string;
            dailyMinutes: number;
            topics: {
              topicId: string;
              scheduledDate: string;
              completed: boolean;
              score?: number;
            }[];
            completed: boolean;
          }[];
        };
        return {
          ...current,
          studyPlans: (data?.studyPlans ?? []).map((p) => ({
            ...p,
            targetDate: new Date(p.targetDate),
            topics: p.topics.map((t) => ({
              ...t,
              scheduledDate: new Date(t.scheduledDate),
            })),
          })),
        };
      },
    }
  )
);

export function createSmartPlan(
  subjectId: string,
  topicIds: string[],
  topicDurations: Record<string, number>,
  targetDate: Date,
  dailyMinutes: number
): Omit<SubjectPlan, "completed"> {
  const startDate = startOfDayLocal(new Date());
  const topics = distributeTopics(
    topicIds,
    startDate,
    targetDate,
    dailyMinutes,
    topicDurations
  );
  return { subjectId, targetDate, dailyMinutes, topics };
}

export function selectUpcomingTopics(state: StudyPlanState): TopicPlan[] {
  return state.getUpcomingTopics();
}

export function selectOverallProgress(
  state: StudyPlanState
): { total: number; completed: number; percentage: number } {
  return state.getOverallProgress();
}
