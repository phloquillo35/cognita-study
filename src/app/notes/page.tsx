"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  FileText,
  Plus,
  Search,
  Trash2,
  ChevronDown,
  X,
  Tag,
  Calendar,
  BookOpen,
  Edit3,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { getAllSubjects } from "@/data/curriculum";
import { useNoteStore } from "@/stores/noteStore";
import LatexRenderer from "@/components/study/LatexRenderer";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

const ALL_SUBJECTS = getAllSubjects();

export default function NotesPage() {
  const { notes, addNote, removeNote, updateNote } = useNoteStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [showForm, setShowForm] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [expandedNoteId, setExpandedNoteId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newSubject, setNewSubject] = useState(ALL_SUBJECTS[0]?.id ?? "am1");
  const [newTagInput, setNewTagInput] = useState("");
  const [newTags, setNewTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string | null>(null);
  const [expandedTags, setExpandedTags] = useState<string[]>([]);

  const filteredNotes = useMemo(() => {
    let result = notes;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q) ||
          n.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (selectedSubject !== "all") {
      result = result.filter((n) => n.subjectId === selectedSubject);
    }

    return result.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }, [notes, searchQuery, selectedSubject]);

  const subjectMap = useMemo(
    () => Object.fromEntries(ALL_SUBJECTS.map((s) => [s.id, s])),
    []
  );

  const handleAddTag = () => {
    const tag = newTagInput.trim().toLowerCase();
    if (tag && !newTags.includes(tag)) {
      setNewTags([...newTags, tag]);
    }
    setNewTagInput("");
  };

  const handleRemoveTag = (tag: string) => {
    setNewTags(newTags.filter((t) => t !== tag));
  };

  const handleAddNoteToExpanded = (noteId: string, tag: string) => {
    const note = notes.find((n) => n.id === noteId);
    if (note && !note.tags.includes(tag)) {
      updateNote(noteId, { tags: [...note.tags, tag] });
    }
  };

  const handleRemoveTagFromNote = (noteId: string, tag: string) => {
    const note = notes.find((n) => n.id === noteId);
    if (note) {
      updateNote(noteId, { tags: note.tags.filter((t) => t !== tag) });
    }
  };

  const handleSubmit = () => {
    if (!newTitle.trim() || !newContent.trim()) return;

    if (editingNoteId) {
      updateNote(editingNoteId, {
        title: newTitle.trim(),
        content: newContent.trim(),
        subjectId: newSubject,
        tags: newTags,
      });
    } else {
      addNote({
        subjectId: newSubject,
        title: newTitle.trim(),
        content: newContent.trim(),
        tags: newTags,
      });
    }

    resetForm();
  };

  const resetForm = () => {
    setNewTitle("");
    setNewContent("");
    setNewSubject(ALL_SUBJECTS[0]?.id ?? "am1");
    setNewTags([]);
    setNewTagInput("");
    setShowForm(false);
    setEditingNoteId(null);
  };

  const handleEdit = (noteId: string) => {
    const note = notes.find((n) => n.id === noteId);
    if (!note) return;
    setEditingNoteId(noteId);
    setNewTitle(note.title);
    setNewContent(note.content);
    setNewSubject(note.subjectId);
    setNewTags([...note.tags]);
    setShowForm(true);
    setExpandedNoteId(null);
  };

  const expandedNote = expandedNoteId ? notes.find((n) => n.id === expandedNoteId) : null;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-bold">Apuntes</h1>
            <p className="text-xs text-[var(--muted-foreground)]">
              Tus notas de estudio con soporte LaTeX
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
            <FileText className="h-4 w-4" />
            <span>{notes.length} notas</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Search & Filter Bar */}
        <div className="mb-8 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar notas..."
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] py-2.5 pl-10 pr-4 text-sm text-[var(--card-foreground)] placeholder:text-[var(--muted-foreground)] transition-colors hover:border-[var(--primary)]/50 focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]/20"
            />
          </div>

          <div className="relative">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="appearance-none rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 pr-10 text-sm font-medium text-[var(--card-foreground)] transition-colors hover:border-[var(--primary)]/50 focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]/20"
            >
              <option value="all">Todas las materias</option>
              {ALL_SUBJECTS.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
          </div>

          <Button onClick={() => { resetForm(); setShowForm(true); }}>
            <Plus className="h-4 w-4 mr-1" />
            Nueva nota
          </Button>
        </div>

        {/* Add/Edit Note Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 overflow-hidden"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    {editingNoteId ? "Editar nota" : "Nueva nota"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">
                          Título
                        </label>
                        <input
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          placeholder="Ej: Teorema del valor intermedio"
                          className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] transition-colors hover:border-[var(--primary)]/50 focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]/20"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">
                          Materia
                        </label>
                        <div className="relative">
                          <select
                            value={newSubject}
                            onChange={(e) => setNewSubject(e.target.value)}
                            className="w-full appearance-none rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 pr-10 text-sm text-[var(--foreground)] transition-colors hover:border-[var(--primary)]/50 focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]/20"
                          >
                            {ALL_SUBJECTS.map((subject) => (
                              <option key={subject.id} value={subject.id}>
                                {subject.name}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">
                        Contenido
                      </label>
                      <textarea
                        value={newContent}
                        onChange={(e) => setNewContent(e.target.value)}
                        placeholder="Escribí tu nota acá... Podés usar $para$ LaTeX inline y $$para$$ LaTeX en bloque."
                        rows={8}
                        className="w-full resize-y rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 font-mono text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] transition-colors hover:border-[var(--primary)]/50 focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]/20"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">
                        Etiquetas
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {newTags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 rounded-full bg-[var(--primary)]/10 px-3 py-1 text-xs font-medium text-[var(--primary)]"
                          >
                            {tag}
                            <button
                              onClick={() => handleRemoveTag(tag)}
                              className="ml-0.5 hover:text-[var(--destructive)]"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="mt-2 flex gap-2">
                        <input
                          value={newTagInput}
                          onChange={(e) => setNewTagInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddTag();
                            }
                          }}
                          placeholder="Agregar etiqueta..."
                          className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] transition-colors hover:border-[var(--primary)]/50 focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]/20"
                        />
                        <Button variant="outline" size="sm" onClick={handleAddTag}>
                          <Tag className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={resetForm}>
                        Cancelar
                      </Button>
                      <Button size="sm" onClick={handleSubmit}>
                        {editingNoteId ? "Guardar cambios" : "Crear nota"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Expanded Note Detail */}
        <AnimatePresence>
          {expandedNote && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 overflow-hidden"
            >
              <Card className="border-2 border-[var(--primary)]/30">
                <CardHeader className="flex flex-row items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-xl">{expandedNote.title}</CardTitle>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      {(() => {
                        const subj = subjectMap[expandedNote.subjectId];
                        if (!subj) return null;
                        return (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--primary)]/10 px-3 py-1 text-xs font-medium text-[var(--primary)]">
                            <BookOpen className="h-3 w-3" />
                            {subj.name}
                          </span>
                        );
                      })()}
                      <span className="flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
                        <Calendar className="h-3 w-3" />
                        {formatDistanceToNow(new Date(expandedNote.updatedAt), {
                          addSuffix: true,
                          locale: es,
                        })}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {expandedNote.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 rounded-full bg-[var(--secondary)] px-3 py-1 text-xs font-medium text-[var(--secondary-foreground)]"
                        >
                          {tag}
                          <button
                            onClick={() => handleRemoveTagFromNote(expandedNote.id, tag)}
                            className="ml-0.5 hover:text-[var(--destructive)]"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                      {tagInput === expandedNote.id ? (
                        <div className="flex gap-1">
                          <input
                            autoFocus
                            value={expandedTags[0] ?? ""}
                            onChange={(e) => setExpandedTags([e.target.value])}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && expandedTags[0]?.trim()) {
                                handleAddNoteToExpanded(expandedNote.id, expandedTags[0].trim().toLowerCase());
                                setTagInput(null);
                                setExpandedTags([]);
                              }
                              if (e.key === "Escape") {
                                setTagInput(null);
                                setExpandedTags([]);
                              }
                            }}
                            placeholder="nueva etiqueta"
                            className="w-28 rounded-lg border border-[var(--border)] bg-[var(--background)] px-2 py-0.5 text-xs text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
                          />
                        </div>
                      ) : (
                        <button
                          onClick={() => setTagInput(expandedNote.id)}
                          className="inline-flex items-center gap-1 rounded-full border border-dashed border-[var(--border)] px-3 py-1 text-xs text-[var(--muted-foreground)] hover:border-[var(--primary)]/50 hover:text-[var(--primary)]"
                        >
                          <Plus className="h-3 w-3" />
                          tag
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-[var(--muted-foreground)] hover:text-[var(--primary)]"
                      onClick={() => handleEdit(expandedNote.id)}
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-[var(--muted-foreground)] hover:text-[var(--destructive)]"
                      onClick={() => {
                        removeNote(expandedNote.id);
                        setExpandedNoteId(null);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setExpandedNoteId(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-xl bg-[var(--muted)]/50 p-6">
                    <LatexRenderer content={expandedNote.content} className="text-[var(--foreground)]" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notes Grid */}
        {filteredNotes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="text-center">
              <CardContent className="p-12">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-[var(--primary)]/10">
                  <FileText className="h-10 w-10 text-[var(--primary)]" />
                </div>
                <h2 className="mb-2 text-xl font-bold">
                  {searchQuery || selectedSubject !== "all"
                    ? "No se encontraron notas"
                    : "Tus apuntes van acá"}
                </h2>
                <p className="mb-6 text-[var(--muted-foreground)]">
                  {searchQuery || selectedSubject !== "all"
                    ? "Probá con otros filtros o creá una nueva nota."
                    : "Creá tu primera nota de estudio. Soporta LaTeX para fórmulas matemáticas."}
                </p>
                <Button onClick={() => { resetForm(); setShowForm(true); }}>
                  <Plus className="h-4 w-4 mr-1" />
                  Nueva nota
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [column-fill:_balance]">
            {filteredNotes.map((note, index) => {
              const subj = subjectMap[note.subjectId];
              const isExpanded = expandedNoteId === note.id;
              const preview = note.content.length > 100
                ? note.content.slice(0, 100) + "..."
                : note.content;

              return (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="mb-4 break-inside-avoid"
                >
                  <Card
                    className={`cursor-pointer transition-all hover:border-[var(--primary)]/30 hover:shadow-lg ${
                      isExpanded ? "border-2 border-[var(--primary)]/30" : ""
                    }`}
                    onClick={() => setExpandedNoteId(isExpanded ? null : note.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-base leading-snug">
                          {note.title}
                        </CardTitle>
                        <div className="flex items-center gap-0.5 shrink-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-[var(--muted-foreground)] hover:text-[var(--primary)]"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(note.id);
                            }}
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-[var(--muted-foreground)] hover:text-[var(--destructive)]"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeNote(note.id);
                            }}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="mb-3 text-sm leading-relaxed text-[var(--muted-foreground)]">
                        {preview}
                      </p>

                      {note.tags.length > 0 && (
                        <div className="mb-3 flex flex-wrap gap-1.5">
                          {note.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-[var(--secondary)]/80 px-2 py-0.5 text-[10px] font-medium text-[var(--secondary-foreground)]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        {subj ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--primary)]/10 px-2 py-0.5 text-[10px] font-medium text-[var(--primary)]">
                            <BookOpen className="h-2.5 w-2.5" />
                            {subj.name}
                          </span>
                        ) : (
                          <span />
                        )}
                        <span className="text-[10px] text-[var(--muted-foreground)]">
                          {formatDistanceToNow(new Date(note.updatedAt), {
                            addSuffix: true,
                            locale: es,
                          })}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
