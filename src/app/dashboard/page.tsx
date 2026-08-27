"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Brain, Target, Trophy, Flame, Clock, BookOpen, Layers } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFlashcardStore } from "@/stores/flashcardStore";
import { useGeneratorStore } from "@/stores/generatorStore";
import { useStreakStore, lastNDays } from "@/stores/streakStore";
import { retrievability } from "@/lib/fsrs";

export default function DashboardPage() {
  const [demoMode, setDemoMode] = useState(false);
  const pathname = usePathname();

  // Detectar modo demo desde localStorage (setado por login)
  useEffect(() => {
    try {
      const isDemo = localStorage.getItem("cognita_demo") === "1";
      if (isDemo) {
        setDemoMode(true);
      }
    } catch (e) {
      // localStorage not available (e.g., private window)
    }
  }, []);

  // Determinar si estamos en modo demo (tanto state como localStorage)
  const isDemo = demoMode || typeof window !== "undefined" && localStorage.getItem("cognita_demo") === "1";

  const cards = useFlashcardStore((s) => s.cards);
  const decks = useGeneratorStore((s) => s.decks);
  const { currentStreak, totalFocusMinutes } = useStreakStore();

  const totalReviews = cards.reduce((a, c) => a + (c.reviewCount ?? 0), 0);
  const activeSubjects = new Set(cards.map((c) => c.subjectId)).size;
  const quizzesCount = decks.reduce((a, d) => a + d.quizzes.length, 0);
  const focusHours = Math.floor(totalFocusMinutes / 60);
  const focusMins = totalFocusMinutes % 60;

  const { daily } = useStreakStore();
  const days = lastNDays(14);
  const activity = days.map((d) => ({
    ...d,
    reviews: daily[d.key]?.reviews ?? 0,
    minutes: daily[d.key]?.minutes ?? 0,
  }));
  const maxActivity = Math.max(1, ...activity.map((a) => a.reviews));

  const fsrsCards = cards.filter(
    (c) => c.stability != null && c.lastReviewed
  );
  const retention =
    fsrsCards.length > 0
      ? Math.round(
          (fsrsCards.reduce((acc, c) => {
            const elapsed =
              (Date.now() - new Date(c.lastReviewed!).getTime()) / 86400000;
            return acc + retrievability(c.stability!, elapsed);
          }, 0) /
            fsrsCards.length) *
            100
        )
      : null;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Demo mode banner */}
      {isDemo && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-xl py-3"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-[var(--warning)]" />
              <span className="font-medium text-[var(--foreground)]">Modo Demo</span>
              <span className="text-xs text-[var(--muted-foreground)]"> — Algunas funciones usan datos simulados</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => localStorage.removeItem("cognita_demo")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </Button>
          </div>
        </motion.div>
      )}

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
            <a href="/" className="flex items-center gap-2.5 shrink-0">
              <div className="w-9 h-9 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center">
                <Brain className="w-5 h-5 text-[var(--primary)]" />
              </div>
              <span className="text-lg font-bold text-[var(--foreground)] hidden sm:block">
                Cognita Study
              </span>
            </a>
          </div>
        </header>

        <section className="mb-12">
          <div className="text-center">
            <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {isDemo ? "Modo Demo" : "Cognita Study"}
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-[var(--muted-foreground)]">
              {isDemo
                ? "Plataforma en modo simulado — las funciones de IA, login y Drive usan datos de prueba"
                : "Tu carrera, potenciada por IA"}
            </p>
          </div>
        </section>

        {/* Quick Links */}
        <section className="mb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              href: "/tutor",
              title: "Tutor IA Socrático",
              desc: "Guía con preguntas (modo mock sin API key)",
              color: "primary",
              Icon: Brain,
            },
            {
              href: "/flashcards",
              title: "Flashcards & Repaso",
              desc: "Spaced repetition con FSRS + generador IA",
              color: "primary",
              Icon: BookOpen,
            },
            {
              href: "/exam",
              title: "Modo Examen",
              desc: "Simulacro y repaso de puntos débiles",
              color: "success",
              Icon: Target,
            },
            {
              href: "/focus",
              title: "Sesión de Enfoque",
              desc: "Pomodoro, racha diaria y countdown",
              color: "warning",
              Icon: Clock,
            },
            {
              href: "/practice",
              title: "Práctica Adaptativa",
              desc: "Ejercicios por tema con retroalimentación",
              color: "success",
              Icon: Trophy,
            },
            {
              href: "/plan",
              title: "Plan de Estudio",
              desc: "Cronograma personalizado para parciales",
              color: "warning",
              Icon: Flame,
            },
            {
              href: "/materias",
              title: "Panorama por Materia",
              desc: "Retención y progreso por asignatura",
              color: "cs",
              Icon: Layers,
            },
          ].map(({ href, title, desc, color, Icon }) => (
            <Link
              key={href}
              href={href}
              className={`group cursor-pointer transition-all hover:border-[var(--${color})]/30 hover:shadow-lg hover:shadow-[var(--${color})]/5 rounded-xl p-6 border`}
            >
              <div className={`rounded-2xl bg-[var(--${color})]/10 p-4 transition-colors group-hover:bg-[var(--${color})]/20`}>
                <div className={`h-6 w-6 rounded-full bg-[var(--${color})]/10 flex items-center justify-center mx-auto`}>
                  <Icon className={`h-4 w-4 text-[var(--${color})]`} />
                </div>
              </div>
              <div className="mt-3">
                <h3 className={`font-medium group-hover:text-[var(--${color})]`}>{title}</h3>
                <p className="text-sm text-[var(--muted-foreground)]">{desc}</p>
              </div>
            </Link>
          ))}
        </section>

        {/* Study Stats */}
        <section className="mb-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="p-4 rounded-xl bg-[var(--primary)]/10">
            <p className="text-3xl font-bold text-[var(--primary)]">{totalReviews}</p>
            <p className="text-xs text-[var(--muted-foreground)]">Repasos realizados</p>
          </div>
          <div className="p-4 rounded-xl bg-[var(--success)]/10">
            <p className="text-3xl font-bold text-[var(--success)]">{activeSubjects}</p>
            <p className="text-xs text-[var(--muted-foreground)]">Materias activas</p>
          </div>
          <div className="p-4 rounded-xl bg-[var(--warning)]/10">
            <p className="text-3xl font-bold text-[var(--warning)]">{currentStreak}</p>
            <p className="text-xs text-[var(--muted-foreground)]">Racha actual (días)</p>
          </div>
          <div className="p-4 rounded-xl bg-[var(--cs)]/10">
            <p className="text-3xl font-bold text-[var(--cs)]">
              {focusHours}h{focusMins}m
            </p>
            <p className="text-xs text-[var(--muted-foreground)]">Tiempo de enfoque</p>
          </div>
        </section>

        {/* Analytics profundo */}
        <section className="mb-12 grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Actividad (últimos 14 días)</CardTitle>
              <p className="text-xs text-[var(--muted-foreground)]">
                Repasos registrados por día
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex h-40 items-end gap-1.5">
                {activity.map((d) => (
                  <div key={d.key} className="flex flex-1 flex-col items-center gap-1">
                    <div
                      className="w-full rounded-t bg-[var(--primary)]/70 transition-all"
                      style={{ height: `${(d.reviews / maxActivity) * 100}%`, minHeight: d.reviews ? "6px" : "2px" }}
                      title={`${d.reviews} repasos · ${d.minutes} min`}
                    />
                    <span className="text-[9px] text-[var(--muted-foreground)]">{d.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Retención estimada</CardTitle>
              <p className="text-xs text-[var(--muted-foreground)]">
                Probabilidad media de recordar hoy (FSRS)
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2">
                <span className="text-5xl font-bold text-[var(--success)]">
                  {retention ?? "—"}
                </span>
                {retention != null && <span className="text-xl text-[var(--muted-foreground)]">%</span>}
              </div>
              <p className="mt-3 text-xs text-[var(--muted-foreground)]">
                {retention == null
                  ? "Repasá algunas tarjetas para calcular tu retención."
                  : retention >= 80
                  ? "¡Excelente! Tu memoria está sólida."
                  : "Repasá las tarjetas pendientes para subirla."}
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl border border-[var(--border)] p-3">
                  <p className="text-[var(--muted-foreground)]">Quizzes IA</p>
                  <p className="text-xl font-bold">{quizzesCount}</p>
                </div>
                <div className="rounded-xl border border-[var(--border)] p-3">
                  <p className="text-[var(--muted-foreground)]">Materias activas</p>
                  <p className="text-xl font-bold">{activeSubjects}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}