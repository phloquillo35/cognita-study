"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2, Check, Upload } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { getAllSubjects } from "@/data/curriculum";
import { useFlashcardStore } from "@/stores/flashcardStore";
import { useGeneratorStore } from "@/stores/generatorStore";
import type {
  GeneratedFlashcard,
  GeneratedQuiz,
  GenerationMode,
} from "@/lib/generate";

const ALL_SUBJECTS = getAllSubjects();

export default function AIGenerator({
  mode,
}: {
  mode: GenerationMode;
}) {
  const [text, setText] = useState("");
  const [subjectId, setSubjectId] = useState(ALL_SUBJECTS[0]?.id ?? "am1");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    flashcards: GeneratedFlashcard[];
    quizzes: GeneratedQuiz[];
  } | null>(null);
  const [saved, setSaved] = useState(false);

  const addCard = useFlashcardStore((s) => s.addCard);
  const addDeck = useGeneratorStore((s) => s.addDeck);

  const handleFile = (file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setText(String(reader.result ?? ""));
    reader.readAsText(file);
  };

  const handleGenerate = async () => {
    if (!text.trim()) {
      setError("Pegá o subí el material de estudio primero.");
      return;
    }
    setLoading(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: text.slice(0, 20000),
          subject: ALL_SUBJECTS.find((s) => s.id === subjectId)?.name ?? "General",
          mode,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error al generar");
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!result) return;
    const subjectName =
      ALL_SUBJECTS.find((s) => s.id === subjectId)?.name ?? "General";
    if (mode === "flashcards" && result.flashcards.length > 0) {
      result.flashcards.forEach((fc) =>
        addCard({
          subjectId,
          front: fc.front,
          back: fc.back,
          difficulty: 1,
          nextReview: new Date(),
          reviewCount: 0,
          correctCount: 0,
          interval: 0,
          easeFactor: 2.5,
          repetitions: 0,
        })
      );
    } else if (mode === "quiz" && result.quizzes.length > 0) {
      addDeck({
        title: `Quiz IA — ${subjectName}`,
        subjectId,
        type: "quiz",
        flashcards: [],
        quizzes: result.quizzes,
      });
    }
    setSaved(true);
  };

  const items =
    mode === "flashcards" ? result?.flashcards ?? [] : result?.quizzes ?? [];

  return (
    <Card className="border-[var(--primary)]/20 bg-[var(--primary)]/5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Sparkles className="h-4 w-4 text-[var(--primary)]" />
          Generador IA{" "}
          {mode === "flashcards" ? "de Flashcards" : "de Quizzes"}
        </CardTitle>
        <p className="text-xs text-[var(--muted-foreground)]">
          Pegá el material (o subí un .txt) y la IA genera{" "}
          {mode === "flashcards"
            ? "tarjetas de repaso"
            : "preguntas de opción múltiple"}
          . Funciona con OPENAI_API_KEY o en modo demo.
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Pegá aquí tus apuntes, transcripción o texto del libro..."
          rows={5}
          className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] transition-colors focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]/20"
        />

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="appearance-none rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 pr-10 text-sm text-[var(--foreground)] transition-colors focus:border-[var(--primary)] focus:outline-none"
            >
              {ALL_SUBJECTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm text-[var(--foreground)] transition-colors hover:border-[var(--primary)]/50">
            <Upload className="h-4 w-4" />
            Subir .txt
            <input
              type="file"
              accept=".txt,.md,.text"
              className="hidden"
              onChange={(e) => e.target.files && handleFile(e.target.files[0])}
            />
          </label>

          <Button onClick={handleGenerate} disabled={loading} className="ml-auto">
            {loading ? (
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4 mr-1" />
            )}
            Generar
          </Button>
        </div>

        {error && (
          <p className="text-sm text-[var(--destructive)]">{error}</p>
        )}

        <AnimatePresence>
          {items.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2 overflow-hidden"
            >
              <p className="text-xs font-medium text-[var(--muted-foreground)]">
                {items.length} elemento(s) generado(s)
              </p>
              <div className="max-h-56 space-y-2 overflow-auto pr-1">
                {mode === "flashcards"
                  ? (result!.flashcards as GeneratedFlashcard[]).map((fc, i) => (
                      <div
                        key={i}
                        className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-3 text-sm"
                      >
                        <p className="font-medium">{fc.front}</p>
                        <p className="mt-1 text-[var(--muted-foreground)]">
                          {fc.back}
                        </p>
                      </div>
                    ))
                  : (result!.quizzes as GeneratedQuiz[]).map((q, i) => (
                      <div
                        key={i}
                        className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-3 text-sm"
                      >
                        <p className="font-medium">{q.question}</p>
                        <ul className="mt-1 list-inside list-disc text-[var(--muted-foreground)]">
                          {q.options.map((o, oi) => (
                            <li
                              key={oi}
                              className={
                                oi === q.correctIndex ? "text-[var(--success)]" : ""
                              }
                            >
                              {o}
                              {oi === q.correctIndex ? " ✓" : ""}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={handleSave}>
                  <Check className="h-4 w-4 mr-1" />
                  Guardar en mis {mode === "flashcards" ? "flashcards" : "quizzes"}
                </Button>
                {saved && (
                  <span className="text-xs text-[var(--success)]">
                    ¡Guardado!
                  </span>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
