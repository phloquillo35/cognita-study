"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Calculator,
  Atom,
  Code2,
  Cog,
  BookOpen,
  Brain,
  Target,
  TrendingUp,
  Zap,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import {
  CURRICULUM,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
} from "@/data/curriculum";
import type { SubjectCategory } from "@/types";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

const categoryIcons: Record<SubjectCategory, React.ReactNode> = {
  math: <Calculator className="h-5 w-5" />,
  physics: <Atom className="h-5 w-5" />,
  cs: <Code2 className="h-5 w-5" />,
  engineering: <Cog className="h-5 w-5" />,
  general: <BookOpen className="h-5 w-5" />,
};

const stats = [
  { label: "Materias Totales", value: "30+", icon: <BookOpen className="h-5 w-5" />, color: "text-[var(--primary)]" },
  { label: "Ejercicios Resueltos", value: "0", icon: <Target className="h-5 w-5" />, color: "text-[var(--success)]" },
  { label: "Racha Actual", value: "0 días", icon: <Zap className="h-5 w-5" />, color: "text-[var(--warning)]" },
  { label: "Horas de Estudio", value: "0h", icon: <Clock className="h-5 w-5" />, color: "text-[var(--cs)]" },
];

export default function HomePage() {
  const totalSubjects = CURRICULUM.levels.reduce(
    (acc, level) => acc + level.subjects.length,
    0
  );
  const totalTopics = CURRICULUM.levels.reduce(
    (acc, level) =>
      acc +
      level.subjects.reduce(
        (subAcc, subject) => subAcc + subject.topics.length,
        0
      ),
    0
  );

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--primary)]">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              <span className="text-gradient">Cognita</span>{" "}
              <span className="text-[var(--muted-foreground)]">Study</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Iniciar Sesión
              </Button>
            </Link>
            <Link href="/tutor">
              <Button size="sm">
                Comenzar
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-12 text-center"
        >
          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Tu carrera,{" "}
            <span className="text-gradient">potenciada por IA</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-[var(--muted-foreground)]">
            Tutorías Socráticas, ejercicios adaptativos y plan de estudios
            inteligente para{" "}
            <strong>{CURRICULUM.career}</strong> —{" "}
            {CURRICULUM.university}
          </p>
          <div className="flex items-center justify-center gap-3">
              <Link href="/tutor">
                <Button size="lg" className="gap-2">
                  <Zap className="h-5 w-5" />
                  Empezar a Estudiar
                </Button>
              </Link>
              <Link href="/plan">
                <Button size="lg" variant="outline">
                  Ver Plan de Estudios
                </Button>
              </Link>
            </div>
        </motion.section>

        {/* Stats Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="mb-12 grid grid-cols-2 gap-4 lg:grid-cols-4"
        >
          {stats.map((stat) => (
            <motion.div key={stat.label} variants={item}>
              <Card className="glow">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className={`rounded-xl bg-[var(--secondary)] p-3 ${stat.color}`}>
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      {stat.label}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="mb-6 text-2xl font-bold">Acciones Rápidas</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link href="/tutor">
              <Card className="group cursor-pointer transition-all hover:border-[var(--primary)]/50 hover:shadow-lg hover:shadow-[var(--primary)]/5">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="rounded-2xl bg-[var(--primary)]/10 p-4 transition-colors group-hover:bg-[var(--primary)]/20">
                    <Brain className="h-6 w-6 text-[var(--primary)]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">Tutor IA Socrático</h3>
                    <p className="text-sm text-[var(--muted-foreground)]">
                      Resolvé dudas con guía paso a paso
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-[var(--muted-foreground)] transition-transform group-hover:translate-x-1 group-hover:text-[var(--primary)]" />
                </CardContent>
              </Card>
            </Link>

            <Link href="/practice">
              <Card className="group cursor-pointer transition-all hover:border-[var(--success)]/50 hover:shadow-lg hover:shadow-[var(--success)]/5">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="rounded-2xl bg-[var(--success)]/10 p-4 transition-colors group-hover:bg-[var(--success)]/20">
                    <Target className="h-6 w-6 text-[var(--success)]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">Práctica Adaptativa</h3>
                    <p className="text-sm text-[var(--muted-foreground)]">
                      Ejercicios a tu nivel, progresión inteligente
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-[var(--muted-foreground)] transition-transform group-hover:translate-x-1 group-hover:text-[var(--success)]" />
                </CardContent>
              </Card>
            </Link>

            <Card className="group cursor-pointer transition-all hover:border-[var(--warning)]/50 hover:shadow-lg hover:shadow-[var(--warning)]/5">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="rounded-2xl bg-[var(--warning)]/10 p-4 transition-colors group-hover:bg-[var(--warning)]/20">
                  <TrendingUp className="h-6 w-6 text-[var(--warning)]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Plan de Estudio</h3>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    Cronograma personalizado para parciales
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-[var(--muted-foreground)] transition-transform group-hover:translate-x-1 group-hover:text-[var(--warning)]" />
              </CardContent>
            </Card>
          </div>
        </motion.section>

        {/* Curriculum Overview - Bento Grid */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Plan de Estudios</h2>
              <p className="text-[var(--muted-foreground)]">
                {CURRICULUM.plan} — {totalSubjects} materias •{" "}
                {totalTopics} temas
              </p>
            </div>
            <Link href="/plan">
              <Button variant="outline" size="sm">
                Ver todo
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {/* Levels */}
            {CURRICULUM.levels.map((level, idx) => (
              <motion.div
                key={level.level}
                variants={item}
                initial="hidden"
                animate="show"
                transition={{ delay: 0.5 + idx * 0.1 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        Nivel {level.level} — {level.name}
                      </CardTitle>
                      <span className="rounded-full bg-[var(--primary)]/10 px-3 py-1 text-xs font-medium text-[var(--primary)]">
                        {level.subjects.length} materias
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {level.subjects.map((subject) => (
                        <Link
                          key={subject.id}
                          href={`/subject/${subject.id}`}
                        >
                          <div
                            className="group flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--background)] p-3 transition-all hover:border-[var(--primary)]/30 hover:bg-[var(--secondary)] cursor-pointer"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`rounded-lg p-2 ${CATEGORY_COLORS[subject.category]}`}
                              >
                                {categoryIcons[subject.category]}
                              </div>
                              <div>
                                <p className="text-sm font-medium group-hover:text-[var(--primary)]">
                                  {subject.name}
                                </p>
                                <p className="text-xs text-[var(--muted-foreground)]">
                                  {subject.topics.length} temas •{" "}
                                  {subject.hoursPerWeek}h/semana
                                </p>
                              </div>
                            </div>
                            <Progress
                              value={0}
                              className="w-16"
                            />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* AI Features Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12"
        >
          <h2 className="mb-6 text-2font-bold">Potenciado por IA</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Tutoría Socrática",
                desc: "La IA te guía con preguntas en vez de darte respuestas directas",
                icon: <Brain className="h-6 w-6" />,
                color: "var(--primary)",
              },
              {
                title: "Verificación Matemática",
                desc: "Ecuaciones verificadas con SymPy para 100% de precisión",
                icon: <Calculator className="h-6 w-6" />,
                color: "var(--math)",
              },
              {
                title: "Repetición Espaciada",
                desc: "Algoritmo SM-2 para memorización a largo plazo",
                icon: <Clock className="h-6 w-6" />,
                color: "var(--warning)",
              },
              {
                title: "Progreso Adaptativo",
                desc: "El sistema se adapta a tu nivel y puntos débiles",
                icon: <TrendingUp className="h-6 w-6" />,
                color: "var(--success)",
              },
            ].map((feature) => (
              <Card
                key={feature.title}
                className="group text-center transition-all hover:shadow-lg"
              >
                <CardContent className="p-6">
                  <div
                    className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
                    style={{
                      backgroundColor: `color-mix(in srgb, ${feature.color} 10%, transparent)`,
                      color: feature.color,
                    }}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="mb-2 font-semibold">{feature.title}</h3>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    {feature.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.section>

        {/* Footer */}
        <footer className="mt-16 border-t border-[var(--border)] py-8 text-center">
          <p className="text-sm text-[var(--muted-foreground)]">
            Cognita Study — {CURRICULUM.university}
          </p>
          <p className="mt-1 text-xs text-[var(--muted-foreground)]">
            {CURRICULUM.plan} • {totalSubjects} materias • {totalTopics} temas de estudio
          </p>
        </footer>
      </main>
    </div>
  );
}
