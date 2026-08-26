import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Note } from "@/types";

interface NoteState {
  notes: Note[];
  addNote: (note: Omit<Note, "id" | "createdAt" | "updatedAt"> & { id?: string }) => void;
  removeNote: (id: string) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  getNotesBySubject: (subjectId: string) => Note[];
  getNotesByTag: (tag: string) => Note[];
  searchNotes: (query: string) => Note[];
}

export const useNoteStore = create<NoteState>()(
  persist(
    (set, get) => ({
      notes: [],

      addNote: (note) => {
        const now = new Date();
        const newNote: Note = {
          ...note,
          id: note.id ?? crypto.randomUUID(),
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ notes: [...state.notes, newNote] }));
      },

      removeNote: (id) =>
        set((state) => ({
          notes: state.notes.filter((n) => n.id !== id),
        })),

      updateNote: (id, updates) =>
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === id ? { ...n, ...updates, updatedAt: new Date() } : n
          ),
        })),

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
