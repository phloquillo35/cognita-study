"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Brain, Target, Trophy, Flame, Clock, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFlashcardStore } from "@/stores/flashcardStore";
import { useGeneratorStore } from "@/stores/generatorStore";
import { useStreakStore } from "@/stores/streakStore";

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
      </main>
    </div>
  );
}