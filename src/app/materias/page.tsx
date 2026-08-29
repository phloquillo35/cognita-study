"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Layers, Brain, BookOpen, Target, Flame } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import { getAllSubjects } from "@/data/curriculum";
import { useFlashcardStore } from "@/stores/flashcardStore";
import { useNoteStore } from "@/stores/noteStore";
import { useStudyPlanStore } from "@/stores/studyPlanStore";
import { retrievability } from "@/lib/fsrs";
import Link from "next/link";

const ALL_SUBJECTS = getAllSubjects();

export default function SubjectsPage() {
  const cards = useFlashcardStore((s) => s.cards);
  const notes = useNoteStore((s) => s.notes);
  const studyPlans = useStudyPlanStore((s) => s.studyPlans);
  const [level, setLevel] = useState<string>("all");

  const levels = ["all", ...ALL_SUBJECTS.reduce<string[]>((acc, s) => {
    const lv = String(s.level);
    if (!acc.includes(lv)) acc.push(lv);
    return acc;
  }, [])];

  const rows = useMemo(() => {
    return ALL_SUBJECTS.filter((s) => level === "all" || String(s.level) === level).map(
      (subject) => {
        const subjectCards = cards.filter((c) => c.subjectId === subject.id);
        const due = subjectCards.filter(
          (c) => new Date(c.nextReview) <= new Date()
        ).length;
        const fsrsCards = subjectCards.filter(
          (c) => c.stability != null && c.lastReviewed
        );
        const retention =
          fsrsCards.length > 0
            ? Math.round(
                (fsrsCards.reduce((acc, c) => {
                  const elapsed =
                    (Date.now() - new Date(c.lastReviewed!).getTime()) /
                    86400000;
                  return acc + retrievability(c.stability!, elapsed);
                }, 0) /
                  fsrsCards.length) *
                  100
              )
            : null;
        const notesCount = notes.filter((n) => n.subjectId === subject.id).length;
        const plan = studyPlans.find((p) => p.subjectId === subject.id);
        const planPct = plan
          ? Math.round(
              (plan.topics.filter((t) => t.completed).length /
                plan.topics.length) *
                100
            )
          : null;
        return {
          subject,
          total: subjectCards.length,
          due,
          retention,
          notesCount,
          planPct,
        };
      }
    );
  }, [cards, notes, studyPlans, level]);

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
            <h1 className="text-lg font-bold">Panorama por Materia</h1>
            <p className="text-xs text-[var(--muted-foreground)]">
              Progreso, retención y actividad por asignatura
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6 flex flex-wrap gap-2">
          {levels.map((lv) => (
            <button
              key={lv}
              onClick={() => setLevel(lv)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                level === lv
                  ? "bg-[var(--primary)] text-white"
                  : "bg-[var(--primary)]/10 text-[var(--primary)]"
              }`}
            >
              {lv === "all" ? "Todas" : `Nivel ${lv}`}
            </button>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map(({ subject, total, due, retention, notesCount, planPct }) => (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Layers className="h-4 w-4 text-[var(--primary)]" />
                    {subject.name}
                  </CardTitle>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {subject.code} · Nivel {subject.level}
                  </p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="rounded-lg bg-[var(--primary)]/5 p-2">
                      <p className="flex items-center justify-center gap-1 font-bold text-[var(--primary)]">
                        <Brain className="h-3 w-3" />
                        {total}
                      </p>
                      <p className="text-[var(--muted-foreground)]">tarjetas</p>
                    </div>
                    <div className="rounded-lg bg-[var(--warning)]/5 p-2">
                      <p className="flex items-center justify-center gap-1 font-bold text-[var(--warning)]">
                        <Flame className="h-3 w-3" />
                        {due}
                      </p>
                      <p className="text-[var(--muted-foreground)]">para repasar</p>
                    </div>
                    <div className="rounded-lg bg-[var(--success)]/5 p-2">
                      <p className="flex items-center justify-center gap-1 font-bold text-[var(--success)]">
                        <BookOpen className="h-3 w-3" />
                        {notesCount}
                      </p>
                      <p className="text-[var(--muted-foreground)]">notas</p>
                    </div>
                  </div>

                  <div>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="text-[var(--muted-foreground)]">
                        Retención estimada
                      </span>
                      <span className="font-medium">
                        {retention == null ? "—" : `${retention}%`}
                      </span>
                    </div>
                    <Progress value={retention ?? 0} className="h-2" />
                  </div>

                  {planPct != null && (
                    <div>
                      <div className="mb-1 flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1 text-[var(--muted-foreground)]">
                          <Target className="h-3 w-3" />
                          Plan de estudio
                        </span>
                        <span className="font-medium">{planPct}%</span>
                      </div>
                      <Progress value={planPct} className="h-2" />
                    </div>
                  )}

                  <div className="flex gap-2 pt-1">
                    <Link href="/flashcards" className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        Repasar
                      </Button>
                    </Link>
                    <Link href="/notes" className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        Notas
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
