"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Brain,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Trophy,
  Flame,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import { getAllSubjects } from "@/data/curriculum";
import { useFlashcardStore } from "@/stores/flashcardStore";
import { useGeneratorStore } from "@/stores/generatorStore";
import { calculateNextReview } from "@/lib/spaced-repetition";
import Link from "next/link";

interface ExamItem {
  id: string;
  kind: "flashcard" | "quiz";
  subjectId: string;
  prompt: string;
  answer: string; // for flashcard: back; for quiz: explanation
  options?: string[];
  correctIndex?: number;
}

export default function ExamPage() {
  const cards = useFlashcardStore((s) => s.cards);
  const updateCard = useFlashcardStore((s) => s.updateCard);
  const decks = useGeneratorStore((s) => s.decks);
  const [reviewIds, setReviewIds] = useState<string[] | null>(null);
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [weak, setWeak] = useState<ExamItem[]>([]);
  const [finished, setFinished] = useState(false);
  const subjectMap = useMemo(
    () => Object.fromEntries(getAllSubjects().map((s) => [s.id, s])),
    []
  );

  const items: ExamItem[] = useMemo(() => {
    const now = new Date();
    const due = cards.filter((c) => new Date(c.nextReview) <= now);
    const fcItems: ExamItem[] = due.map((c) => ({
      id: `fc-${c.id}`,
      kind: "flashcard",
      subjectId: c.subjectId,
      prompt: c.front,
      answer: c.back,
    }));
    const quizItems: ExamItem[] = decks.flatMap((d) =>
      d.quizzes.map((q, i) => ({
        id: `q-${d.id}-${i}`,
        kind: "quiz",
        subjectId: d.subjectId,
        prompt: q.question,
        answer: q.explanation,
        options: q.options,
        correctIndex: q.correctIndex,
      }))
    );
    const all = [...fcItems, ...quizItems];
    return reviewIds ? all.filter((i) => reviewIds.includes(i.id)) : all;
  }, [cards, decks, reviewIds]);

  const current = items[index];

  const reset = (focusWeak: boolean) => {
    setReviewIds(focusWeak && weak.length > 0 ? weak.map((w) => w.id) : null);
    setIndex(0);
    setRevealed(false);
    setSelected(null);
    setScore({ correct: 0, total: 0 });
    setWeak([]);
    setFinished(false);
    setStarted(true);
  };

  const gradeFlashcard = (known: boolean) => {
    if (!current || current.kind !== "flashcard") return;
    const cardId = current.id.replace("fc-", "");
    const card = cards.find((c) => c.id === cardId);
    if (card) {
      const quality = known ? 4 : 0;
      const r = calculateNextReview(card, quality);
      updateCard(cardId, {
        interval: r.interval,
        easeFactor: r.easeFactor,
        repetitions: r.repetitions,
        nextReview: r.nextReview,
        lastReviewed: new Date(),
        reviewCount: card.reviewCount + 1,
        correctCount: card.correctCount + (known ? 1 : 0),
        stability: r.stability,
        difficulty: r.difficulty,
      });
    }
    if (!known) setWeak((w) => [...w, current]);
    setScore((s) => ({ correct: s.correct + (known ? 1 : 0), total: s.total + 1 }));
    advance();
  };

  const gradeQuiz = (optionIndex: number) => {
    if (!current || current.kind !== "quiz" || selected !== null) return;
    setSelected(optionIndex);
    const correct = optionIndex === current.correctIndex;
    if (!correct && current) setWeak((w) => [...w, current]);
    setScore((s) => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }));
  };

  const advance = () => {
    setRevealed(false);
    setSelected(null);
    if (index >= items.length - 1) setFinished(true);
    else setIndex((i) => i + 1);
  };

  if (!started) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
            <Link href="/">
              <Button variant="ghost" size="icon" aria-label="Volver al inicio">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-lg font-bold">Modo Examen</h1>
              <p className="text-xs text-[var(--muted-foreground)]">
                Practicá con recuperación activa y repaso de puntos débiles
              </p>
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-2xl px-4 py-16 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-[var(--primary)]/10">
            <Trophy className="h-10 w-10 text-[var(--primary)]" />
          </div>
          <h2 className="mb-2 text-2xl font-bold">Simulacro de Parcial</h2>
          <p className="mb-8 text-[var(--muted-foreground)]">
            {items.length} ítems disponibles (flashcards pendientes + quizzes
            generados). Al terminar, repasamos tus puntos débiles.
          </p>
          <div className="flex justify-center gap-3">
            <Button size="lg" onClick={() => reset(false)} disabled={items.length === 0}>
              <Trophy className="h-4 w-4 mr-1" />
              Comenzar ({items.length})
            </Button>
            {weak.length === 0 && (
              <Button
                variant="outline"
                size="lg"
                onClick={() => reset(false)}
                disabled
              >
                Repasar errores
              </Button>
            )}
          </div>
          {items.length === 0 && (
            <p className="mt-6 text-sm text-[var(--muted-foreground)]">
              No hay nada para practicar. Generá quizzes con el Generador IA o
              cargá flashcards pendientes.
            </p>
          )}
        </main>
      </div>
    );
  }

  if (finished) {
    const pct = score.total ? Math.round((score.correct / score.total) * 100) : 0;
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <main className="mx-auto max-w-2xl px-4 py-16 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-[var(--success)]/10">
            <Trophy className="h-10 w-10 text-[var(--success)]" />
          </div>
          <h2 className="mb-2 text-2xl font-bold">¡Examen completado!</h2>
          <p className="mb-2 text-5xl font-bold text-[var(--primary)]">{pct}%</p>
          <p className="mb-8 text-[var(--muted-foreground)]">
            {score.correct} de {score.total} correctas
          </p>

          {weak.length > 0 && (
            <Card className="mb-8 text-left">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Flame className="h-4 w-4 text-[var(--warning)]" />
                  Puntos débiles a repasar ({weak.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {weak.map((w, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-[var(--border)] p-3 text-sm"
                  >
                    <p className="font-medium">{w.prompt}</p>
                    {w.kind === "quiz" && (
                      <p className="mt-1 text-[var(--muted-foreground)]">
                        {w.answer}
                      </p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <div className="flex justify-center gap-3">
            {weak.length > 0 && (
              <Button onClick={() => reset(true)}>
                <RotateCcw className="h-4 w-4 mr-1" />
                Repasar solo errores ({weak.length})
              </Button>
            )}
            <Button variant="outline" onClick={() => reset(false)}>
              Repetir examen
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-3xl items-center gap-4 px-4">
          <Button variant="ghost" size="icon" onClick={() => setStarted(false)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-bold">Modo Examen</h1>
            <p className="text-xs text-[var(--muted-foreground)]">
              {score.total + 1} de {items.length}
            </p>
          </div>
          <span className="text-sm font-medium">
            {score.correct}/{score.total}
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8">
        <Progress value={score.total + 1} max={items.length} className="mb-8 h-2" />

        <motion.div
          key={current.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-[var(--primary)]/10 px-3 py-1 text-xs font-medium text-[var(--primary)]">
                  {subjectMap[current.subjectId]?.name ?? current.subjectId}
                </span>
                <span className="text-xs text-[var(--muted-foreground)]">
                  {current.kind === "flashcard" ? "Flashcard" : "Quiz"}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-lg">{current.prompt}</p>
            </CardContent>
          </Card>

          {current.kind === "quiz" ? (
            <div className="space-y-3">
              {current.options!.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => gradeQuiz(i)}
                  disabled={selected !== null}
                  className={`w-full rounded-xl border p-4 text-left transition-all ${
                    selected === null
                      ? "border-[var(--border)] hover:border-[var(--primary)] hover:bg-[var(--primary)]/5"
                      : i === current.correctIndex
                      ? "border-[var(--success)] bg-[var(--success)]/10 text-[var(--success)]"
                      : i === selected
                      ? "border-[var(--destructive)] bg-[var(--destructive)]/10 text-[var(--destructive)]"
                      : "border-[var(--border)] opacity-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-medium">
                      {selected !== null && i === current.correctIndex ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : selected === i ? (
                        <XCircle className="h-4 w-4" />
                      ) : (
                        String.fromCharCode(65 + i)
                      )}
                    </div>
                    <span>{opt}</span>
                  </div>
                </button>
              ))}
              {selected !== null && (
                <Card className="border-[var(--primary)]/30 bg-[var(--primary)]/5">
                  <CardContent className="p-4 text-sm">
                    <div className="mb-1 flex items-center gap-2 text-[var(--primary)]">
                      <Brain className="h-4 w-4" />
                      <span className="font-semibold">Explicación</span>
                    </div>
                    {current.answer}
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            !revealed && (
              <Button size="lg" onClick={() => setRevealed(true)}>
                Mostrar respuesta
              </Button>
            )
          )}

          {current.kind === "flashcard" && revealed && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="mb-6 border-[var(--success)]/30 bg-[var(--success)]/5">
                <CardContent className="p-4 text-sm">
                  <p className="font-semibold text-[var(--success)] mb-1">Respuesta</p>
                  {current.answer}
                </CardContent>
              </Card>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="border-[var(--success)]/30 text-[var(--success)]"
                  onClick={() => gradeFlashcard(true)}
                >
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  Lo sabía
                </Button>
                <Button
                  variant="outline"
                  className="border-[var(--destructive)]/30 text-[var(--destructive)]"
                  onClick={() => gradeFlashcard(false)}
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  No lo sabía
                </Button>
              </div>
            </motion.div>
          )}

          {current.kind === "quiz" && selected !== null && (
            <div className="mt-6 flex justify-center">
              <Button size="lg" onClick={advance}>
                Siguiente
              </Button>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}

