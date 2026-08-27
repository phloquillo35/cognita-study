import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Flashcard } from "@/types";

interface FlashcardState {
  cards: Flashcard[];
  addCard: (
    card: Omit<Flashcard, "id" | "createdAt"> & { id?: string }
  ) => void;
  removeCard: (id: string) => void;
  updateCard: (id: string, updates: Partial<Flashcard>) => void;
  getDueCards: () => Flashcard[];
  getCardsBySubject: (subjectId: string) => Flashcard[];
  importCards: (cards: Flashcard[]) => void;
}

export const useFlashcardStore = create<FlashcardState>()(
  persist(
    (set, get) => ({
      cards: [],

      addCard: (card) => {
        const newCard: Flashcard = {
          ...card,
          id: card.id ?? crypto.randomUUID(),
          createdAt: new Date(),
        };
        set((state) => ({ cards: [...state.cards, newCard] }));
      },

      removeCard: (id) =>
        set((state) => ({
          cards: state.cards.filter((c) => c.id !== id),
        })),

      updateCard: (id, updates) =>
        set((state) => ({
          cards: state.cards.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        })),

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
