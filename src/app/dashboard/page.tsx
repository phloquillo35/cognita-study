"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Brain } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
          {isDemo ? (
            <div>
              <Link
                href="/tutor"
                className="group cursor-pointer transition-all hover:border-[var(--primary)]/30 hover:shadow-lg hover:shadow-[var(--primary)]/5 rounded-xl p-6 border"
              >
                <div className="rounded-2xl bg-[var(--primary)]/10 p-4 transition-colors group-hover:bg-[var(--primary)]/20">
                  <div className="h-6 w-6 rounded-full bg-[var(--primary)]/10 flex items-center justify-center mx-auto">
                    <Brain className="h-4 w-4 text-[var(--primary)]" />
                  </div>
                </div>
                <div className="mt-3">
                  <h3 className="font-medium group-hover:text-[var(--primary)]">
                    Tutor IA Socrático
                  </h3>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    Guía con preguntas (modo mock sin API key)
                  </p>
                </div>
              </Link>
              <Link
                href="/practice"
                className="group cursor-pointer transition-all hover:border-[var(--success)]/30 hover:shadow-lg hover:shadow-[var(--success)]/5 rounded-xl p-6 border"
              >
                <div className="rounded-2xl bg-[var(--success)]/10 p-4 transition-colors group-hover:bg-[var(--success)]/20">
                  <div className="h-6 w-6 rounded-full bg-[var(--success)]/10 flex items-center justify-center mx-auto">
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
                      <rect x="2" y="6" width="20" height="12" rx="2" ry="2" />
                      <line x1="6" y1="6" x2="18" y2="6" />
                      <line x1="6" y1="18" x2="18" y2="18" />
                    </svg>
                  </div>
                  <div className="mt-3">
                    <h3 className="font-medium group-hover:text-[var(--success)]">
                      Práctica Adaptativa
                    </h3>
                    <p className="text-sm text-[var(--muted-foreground)]">
                      Ejercicios por tema con retroalimentación
                    </p>
                  </div>
                </div>
              </Link>
              <Link
                href="/plan"
                className="group cursor-pointer transition-all hover:border-[var(--warning)]/30 hover:shadow-lg hover:shadow-[var(--warning)]/5 rounded-xl p-6 border"
              >
                <div className="rounded-2xl bg-[var(--warning)]/10 p-4 transition-colors group-hover:bg-[var(--warning)]/20">
                  <div className="h-6 w-6 rounded-full bg-[var(--warning)]/10 flex items-center justify-center mx-auto">
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
                      <line x1="3" y1="11" x2="21" y2="11" />
                      <line x1="7" y1="7" x2="19" y2="7" />
                      <line x1="11" y1="7" x2="19" y2="11" />
                    </svg>
                  </div>
                  <div className="mt-3">
                    <h3 className="font-medium group-hover:text-[var(--warning)]">
                      Plan de Estudio
                    </h3>
                    <p className="text-sm text-[var(--muted-foreground)]">
                      Cronograma personalizado para parciales
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ) : (
            <div>
              <Link href="/tutor" className="group cursor-pointer">
                <div className="group-hover:text-[var(--primary)] transition-colors">
                  <h3 className="font-semibold">Tutor IA Socrático</h3>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    Resolvé dudas con guía paso a paso
                  </p>
                </div>
              </Link>
              <Link href="/practice" className="group cursor-pointer">
                <div className="group-hover:text-[var(--success)] transition-colors">
                  <h3 className="font-semibold">Práctica Adaptativa</h3>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    Ejercicios a tu nivel, progresión inteligente
                  </p>
                </div>
              </Link>
              <Link href="/plan" className="group cursor-pointer">
                <div className="group-hover:text-[var(--warning)] transition-colors">
                  <h3 className="font-semibold">Plan de Estudio</h3>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    Cronograma personalizado para parciales
                  </p>
                </div>
              </Link>
            </div>
          )}
        </section>

        {/* Study Stats */}
        <section className="mb-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="p-4 rounded-xl bg-[var(--primary)]/10">
            <p className="text-3xl font-bold text-[var(--primary)]">0</p>
            <p className="text-xs text-[var(--muted-foreground)]">Ejercicios resueltos</p>
          </div>
          <div className="p-4 rounded-xl bg-[var(--success)]/10">
            <p className="text-3xl font-bold text-[var(--success)]">0</p>
            <p className="text-xs text-[var(--muted-foreground)]">Materias completadas</p>
          </div>
          <div className="p-4 rounded-xl bg-[var(--warning)]/10">
            <p className="text-3xl font-bold text-[var(--warning)]">0</p>
            <p className="text-xs text-[var(--muted-foreground)]">Racha actual</p>
          </div>
          <div className="p-4 rounded-xl bg-[var(--cs)]/10">
            <p className="text-3xl font-bold text-[var(--cs)]">0h</p>
            <p className="text-xs text-[var(--muted-foreground)]">Horas de estudio</p>
          </div>
        </section>
      </main>
    </div>
  );
}