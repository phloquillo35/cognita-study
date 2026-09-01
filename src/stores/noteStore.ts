import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Note } from "@/types";
import { isDbAvailable } from "@/lib/sync";

interface NoteState {
  notes: Note[];
  syncStatus: "idle" | "syncing" | "fallback" | "error";
  addNote: (note: Omit<Note, "id" | "createdAt" | "updatedAt"> & { id?: string }) => void;
  removeNote: (id: string) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  getNotesBySubject: (subjectId: string) => Note[];
  getNotesByTag: (tag: string) => Note[];
  searchNotes: (query: string) => Note[];
  fetchAll: () => Promise<void>;
}

export const useNoteStore = create<NoteState>()(
  persist(
    (set, get) => ({
      notes: [],
      syncStatus: "idle" as const,

      addNote: (note) => {
        const now = new Date();
        const newNote: Note = {
          ...note,
          id: note.id ?? crypto.randomUUID(),
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ notes: [...state.notes, newNote] }));
        isDbAvailable().then((ok) => { if (ok) fetch("/api/notes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newNote) }).catch(()=>{}); });
      },

      removeNote: (id) => {
        set((state) => ({ notes: state.notes.filter((n) => n.id !== id) }));
        isDbAvailable().then((ok)=>{ if(ok) fetch(`/api/notes/${id}`,{method:"DELETE"}).catch(()=>{}); });
      },

      updateNote: (id, updates) => {
        set((state) => ({ notes: state.notes.map((n) => n.id === id ? { ...n, ...updates, updatedAt: new Date() } : n) }));
        isDbAvailable().then((ok)=>{ if(ok) fetch(`/api/notes/${id}`,{ method:"PATCH", headers:{"Content-Type":"application/json"}, body: JSON.stringify(updates)}).catch(()=>{}); });
      },

      getNotesBySubject: (subjectId) =>
        get().notes.filter((n) => n.subjectId === subjectId),

      getNotesByTag: (tag) =>
        get().notes.filter((n) => n.tags.includes(tag)),

      searchNotes: (query) => {
        const q = query.toLowerCase().trim();
        if (!q) return get().notes;
        return get().notes.filter(
          (n) =>
            n.title.toLowerCase().includes(q) ||
            n.content.toLowerCase().includes(q) ||
            n.tags.some((t) => t.toLowerCase().includes(q))
        );
      },

      fetchAll: async () => {
        if (!(await isDbAvailable())) { set({ syncStatus: "fallback" }); return; }
        set({ syncStatus: "syncing" });
        try {
          const res = await fetch("/api/notes", { cache: "no-store" });
          const json = await res.json();
          if (json.fallback) { set({ syncStatus: "fallback" }); return; }
          const remote: Note[] = Array.isArray(json) ? json : json.data ?? [];
          const parsed = remote.map((n) => ({ ...n, createdAt: new Date(n.createdAt), updatedAt: new Date(n.updatedAt) }));
          const local = get().notes;
          const merged = [...parsed];
          const remoteIds = new Set(parsed.map((n)=>n.id));
          for(const lc of local) if(!remoteIds.has(lc.id)) merged.push(lc);
          set({ notes: merged, syncStatus: "idle" });
        } catch { set({ syncStatus: "error" }); }
      },
    }),
    {
      name: "cognita-notes",
    }
  )
);

export function selectNotesBySubject(state: NoteState, subjectId: string): Note[] {
  return state.notes.filter((n) => n.subjectId === subjectId);
}

export function selectNotesByTag(state: NoteState, tag: string): Note[] {
  return state.notes.filter((n) => n.tags.includes(tag));
}
