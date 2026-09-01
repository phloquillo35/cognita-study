import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  GeneratedFlashcard,
  GeneratedQuiz,
} from "@/lib/generate";
import { isDbAvailable } from "@/lib/sync";

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
  syncStatus: "idle" | "syncing" | "fallback" | "error";
  addDeck: (deck: Omit<GeneratorDeck, "id" | "createdAt">) => void;
  removeDeck: (id: string) => void;
  getQuizzes: () => GeneratedQuiz[];
  fetchAll: () => Promise<void>;
}

export const useGeneratorStore = create<GeneratorState>()(
  persist(
    (set, get) => ({
      decks: [],
      syncStatus: "idle" as const,
      addDeck: (deck) => {
        const newDeck: GeneratorDeck = { ...deck, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
        set((state) => ({ decks: [...state.decks, newDeck] }));
        isDbAvailable().then((ok)=>{ if(ok) fetch("/api/generator/decks",{ method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(newDeck)}).catch(()=>{}); });
      },
      removeDeck: (id) => {
        set((state) => ({ decks: state.decks.filter((d) => d.id !== id) }));
        isDbAvailable().then((ok)=>{ if(ok) fetch(`/api/generator/decks/${id}`,{method:"DELETE"}).catch(()=>{}); });
      },
      getQuizzes: () => get().decks.flatMap((d) => d.quizzes),
      fetchAll: async () => {
        if(!(await isDbAvailable())){ set({ syncStatus: "fallback" }); return; }
        set({ syncStatus: "syncing" });
        try{
          const res=await fetch("/api/generator/decks",{cache:"no-store"}); const json=await res.json();
          if(json.fallback){ set({ syncStatus:"fallback"}); return; }
          const remote: GeneratorDeck[] = Array.isArray(json)?json:json.data??[];
          const local=get().decks; const merged=[...remote]; const ids=new Set(remote.map(d=>d.id)); for(const lc of local) if(!ids.has(lc.id)) merged.push(lc);
          set({ decks: merged, syncStatus:"idle"});
        }catch{ set({ syncStatus:"error"}); }
      },
    }),
    { name: "cognita-generator" }
  )
);
