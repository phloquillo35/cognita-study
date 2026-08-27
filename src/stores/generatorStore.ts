import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  GeneratedFlashcard,
  GeneratedQuiz,
} from "@/lib/generate";

export interface GeneratorDeck {
  id: string;
  title: string;
  subjectId: string;
  type: "flashcards" | "quiz";
  flashcards: GeneratedFlashcard[];
  quizzes: GeneratedQuiz[];
  createdAt: string;
}

interface GeneratorState {
  decks: GeneratorDeck[];
  addDeck: (deck: Omit<GeneratorDeck, "id" | "createdAt">) => void;
  removeDeck: (id: string) => void;
  getQuizzes: () => GeneratedQuiz[];
}

export const useGeneratorStore = create<GeneratorState>()(
  persist(
    (set, get) => ({
      decks: [],
      addDeck: (deck) =>
        set((state) => ({
          decks: [
            ...state.decks,
            {
              ...deck,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
            },
          ],
        })),
      removeDeck: (id) =>
        set((state) => ({ decks: state.decks.filter((d) => d.id !== id) })),
      getQuizzes: () => get().decks.flatMap((d) => d.quizzes),
    }),
    { name: "cognita-generator" }
  )
);
