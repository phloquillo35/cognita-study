"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  BookOpen,
  CheckCircle2,
  Circle,
  Brain,
  Target,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import { getSubjectById, CATEGORY_COLORS, CATEGORY_LABELS } from "@/data/curriculum";
import Link from "next/link";
import type { SubjectCategory } from "@/types";

export default function SubjectPage() {
  const params = useParams();
  const subjectId = params.id as string;
  const subject = getSubjectById(subjectId);

  if (!subject) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Materia no encontrada</h1>
          <p className="mt-2 text-[var(--muted-foreground)]">
            No se pudo encontrar la materia con ID: {subjectId}
          </p>
          <Link href="/">
            <Button className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Inicio
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const totalEstimatedMinutes = subject.topics.reduce(
    (acc, topic) => acc + topic.estimatedMinutes,
    0
  );
  const totalEstimatedHours = Math.round(totalEstimatedMinutes / 60);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold">{subject.name}</h1>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  CATEGORY_COLORS[subject.category as SubjectCategory]
                }`}
              >
                {CATEGORY_LABELS[subject.category as SubjectCategory]}
              </span>
            </div>
            <p className="text-sm text-[var(--muted-foreground)]">
              {subject.code} • Nivel {subject.level}
            </p>
          </div>
          <Button>
            <Brain className="h-4 w-4 mr-2" />
            Tutor IA
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Subject Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card>
            <CardContent className="p-6">
              <div className="grid gap-6 sm:grid-cols-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-[var(--primary)]/10 p-3">
                    <BookOpen className="h-5 w-5 text-[var(--primary)]" />
                  </div>
                  <div>
                    <p className="text-sm text-[var(--muted-foreground)]">
                      Créditos
                    </p>
                    <p className="text-xl font-bold">{subject.credits}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-[var(--cs)]/10 p-3">
                    <Clock className="h-5 w-5 text-[var(--cs)]" />
                  </div>
                  <div>
                    <p className="text-sm text-[var(--muted-foreground)]">
                      Horas Estimadas
                    </p>
                    <p className="text-xl font-bold">{totalEstimatedHours}h</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-[var(--success)]/10 p-3">
                    <Target className="h-5 w-5 text-[var(--success)]" />
                  </div>
                  <div>
                    <p className="text-sm text-[var(--muted-foreground)]">
                      Temas
                    </p>
                    <p className="text-xl font-bold">
                      {subject.topics.length}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Prerequisites */}
        {subject.prerequisites.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <h2 className="mb-3 text-lg font-semibold">Correlativas</h2>
            <div className="flex flex-wrap gap-2">
              {subject.prerequisites.map((prereqId) => (
                <Link key={prereqId} href={`/subject/${prereqId}`}>
                  <span className="cursor-pointer rounded-full border border-[var(--border)] bg-[var(--secondary)] px-3 py-1 text-sm transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)]">
                    {prereqId.toUpperCase()}
                  </span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}

        {/* Topics */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="mb-4 text-lg font-semibold">Temario</h2>
          <div className="space-y-3">
            {subject.topics.map((topic, idx) => (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + idx * 0.05 }}
              >
                <Card className="group cursor-pointer transition-all hover:border-[var(--primary)]/30 hover:shadow-md">
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--secondary)] text-sm font-bold text-[var(--muted-foreground)] group-hover:bg-[var(--primary)] group-hover:text-white">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium group-hover:text-[var(--primary)]">
                        {topic.name}
                      </h3>
                      <p className="text-sm text-[var(--muted-foreground)]">
                        {topic.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xs text-[var(--muted-foreground)]">
                          {Math.round(topic.estimatedMinutes / 60)}h{" "}
                          {topic.estimatedMinutes % 60}min
                        </p>
                        <div className="mt-1 flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <div
                              key={i}
                              className={`h-1.5 w-1.5 rounded-full ${
                                i < topic.difficulty
                                  ? "bg-[var(--primary)]"
                                  : "bg-[var(--secondary)]"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <Circle className="h-5 w-5 text-[var(--muted-foreground)] group-hover:text-[var(--primary)]" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Quick Actions */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          <Card className="group cursor-pointer transition-all hover:border-[var(--primary)]/50 hover:shadow-lg hover:shadow-[var(--primary)]/5">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-2xl bg-[var(--primary)]/10 p-4">
                <Brain className="h-6 w-6 text-[var(--primary)]" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Preguntar al Tutor</h3>
                <p className="text-sm text-[var(--muted-foreground)]">
                  Resolvé dudas sobre esta materia
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-[var(--muted-foreground)] transition-transform group-hover:translate-x-1" />
            </CardContent>
          </Card>

          <Card className="group cursor-pointer transition-all hover:border-[var(--success)]/50 hover:shadow-lg hover:shadow-[var(--success)]/5">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-2xl bg-[var(--success)]/10 p-4">
                <Target className="h-6 w-6 text-[var(--success)]" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Practicar</h3>
                <p className="text-sm text-[var(--muted-foreground)]">
                  Ejercicios adaptativos por tema
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-[var(--muted-foreground)] transition-transform group-hover:translate-x-1" />
            </CardContent>
          </Card>

          <Card className="group cursor-pointer transition-all hover:border-[var(--warning)]/50 hover:shadow-lg hover:shadow-[var(--warning)]/5">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-2xl bg-[var(--warning)]/10 p-4">
                <CheckCircle2 className="h-6 w-6 text-[var(--warning)]" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Crear Flashcards</h3>
                <p className="text-sm text-[var(--muted-foreground)]">
                  Repetición espaciada para memorizar
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-[var(--muted-foreground)] transition-transform group-hover:translate-x-1" />
            </CardContent>
          </Card>
        </motion.section>
      </main>
    </div>
  );
}
