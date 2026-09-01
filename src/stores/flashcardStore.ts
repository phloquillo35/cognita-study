import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Flashcard } from "@/types";
import { isDbAvailable } from "@/lib/sync";

interface FlashcardState {
  cards: Flashcard[];
  syncStatus: "idle" | "syncing" | "fallback" | "error";
  addCard: (
    card: Omit<Flashcard, "id" | "createdAt"> & { id?: string }
  ) => void;
  removeCard: (id: string) => void;
  updateCard: (id: string, updates: Partial<Flashcard>) => void;
  getDueCards: () => Flashcard[];
  getCardsBySubject: (subjectId: string) => Flashcard[];
  importCards: (cards: Flashcard[]) => void;
  fetchAll: () => Promise<void>;
  syncAdd: (card: Flashcard) => Promise<void>;
  syncUpdate: (id: string, updates: Partial<Flashcard>) => Promise<void>;
  syncRemove: (id: string) => Promise<void>;
}

export const useFlashcardStore = create<FlashcardState>()(
  persist(
    (set, get) => ({
      cards: [],
      syncStatus: "idle" as const,

      addCard: (card) => {
        const newCard: Flashcard = {
          ...card,
          id: card.id ?? crypto.randomUUID(),
          createdAt: new Date(),
        };
        set((state) => ({ cards: [...state.cards, newCard] }));
        // fire-and-forget sync to DB if available (non-blocking for tests)
        isDbAvailable().then((ok) => {
          if (ok) fetch("/api/flashcards", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newCard) }).catch(() => {});
        });
      },

      removeCard: (id) => {
        set((state) => ({ cards: state.cards.filter((c) => c.id !== id) }));
        isDbAvailable().then((ok) => { if (ok) fetch(`/api/flashcards/${id}`, { method: "DELETE" }).catch(() => {}); });
      },

      updateCard: (id, updates) => {
        set((state) => ({ cards: state.cards.map((c) => (c.id === id ? { ...c, ...updates } : c)) }));
        isDbAvailable().then((ok) => { if (ok) fetch(`/api/flashcards/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(updates) }).catch(() => {}); });
      },

      getDueCards: () => {
        const now = new Date();
        return get().cards.filter((c) => new Date(c.nextReview) <= now);
      },

      getCardsBySubject: (subjectId) =>
        get().cards.filter((c) => c.subjectId === subjectId),

      importCards: (cards) =>
        set((state) => {
          const existing = new Set(state.cards.map((c) => c.id));
          const merged = [...state.cards];
          for (const c of cards) {
            if (!existing.has(c.id)) merged.push(c);
          }
          return { cards: merged };
        }),

      fetchAll: async () => {
        if (!(await isDbAvailable())) { set({ syncStatus: "fallback" }); return; }
        set({ syncStatus: "syncing" });
        try {
          const res = await fetch("/api/flashcards", { cache: "no-store" });
          const json = await res.json();
          if (json.fallback) { set({ syncStatus: "fallback" }); return; }
          const remote: Flashcard[] = Array.isArray(json) ? json : json.data ?? [];
          const parsed = remote.map((c) => ({
            ...c,
            nextReview: new Date(c.nextReview as unknown as string),
            lastReviewed: c.lastReviewed ? new Date(c.lastReviewed as unknown as string) : undefined,
            createdAt: new Date(c.createdAt as unknown as string),
          })) as Flashcard[];
          const local = get().cards;
          const merged = [...parsed];
          const remoteIds = new Set(parsed.map((c) => c.id));
          for (const lc of local) if (!remoteIds.has(lc.id)) merged.push(lc);
          set({ cards: merged, syncStatus: "idle" });
        } catch {
          set({ syncStatus: "error" });
        }
      },

      syncAdd: async (card) => {
        if (!(await isDbAvailable())) return;
        try { await fetch("/api/flashcards", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(card) }); } catch {}
      },
      syncUpdate: async (id, updates) => {
        if (!(await isDbAvailable())) return;
        try { await fetch(`/api/flashcards/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(updates) }); } catch {}
      },
      syncRemove: async (id) => {
        if (!(await isDbAvailable())) return;
        try { await fetch(`/api/flashcards/${id}`, { method: "DELETE" }); } catch {}
      },
    }),
    {
      name: "cognita-flashcards",
    }
  )
);

export function selectDueCards(state: FlashcardState): Flashcard[] {
  const now = new Date();
  return state.cards.filter((c) => new Date(c.nextReview) <= now);
}

export function selectCardsBySubject(
  state: FlashcardState,
  subjectId: string
): Flashcard[] {
  return state.cards.filter((c) => c.subjectId === subjectId);
}
