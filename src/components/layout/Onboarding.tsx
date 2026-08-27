"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Target, Brain, Clock, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

const FEATURES = [
  { href: "/flashcards", label: "Flashcards con FSRS", Icon: Brain, desc: "Repaso espaciado óptimo" },
  { href: "/exam", label: "Modo Examen", Icon: Target, desc: "Simulacros y repaso de débiles" },
  { href: "/focus", label: "Sesión de Enfoque", Icon: Clock, desc: "Pomodoro, racha y parciales" },
  { href: "/notes", label: "Apuntes", Icon: BookOpen, desc: "Notas con LaTeX y quiz IA" },
];

export function Onboarding() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem("cognita_onboarded") !== "1") {
        setOpen(true);
      }
    } catch {
      // ignore
    }
  }, []);

  const close = () => {
    try {
      localStorage.setItem("cognita_onboarded", "1");
    } catch {
      // ignore
    }
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
          onClick={close}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-2xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="rounded-2xl bg-[var(--primary)]/10 p-2">
                  <Sparkles className="h-5 w-5 text-[var(--primary)]" />
                </div>
                <h2 className="text-lg font-bold">¡Bienvenido a Cognita Study!</h2>
              </div>
              <button
                onClick={close}
                aria-label="Cerrar"
                className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mb-4 text-sm text-[var(--muted-foreground)]">
              Tu plataforma de estudio con IA. Empezá por alguna de estas secciones:
            </p>
            <div className="grid gap-2">
              {FEATURES.map(({ href, label, Icon, desc }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={close}
                  className="flex items-center gap-3 rounded-xl border border-[var(--border)] p-3 transition-colors hover:border-[var(--primary)]/40 hover:bg-[var(--primary)]/5"
                >
                  <div className="rounded-lg bg-[var(--primary)]/10 p-2">
                    <Icon className="h-4 w-4 text-[var(--primary)]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{label}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">{desc}</p>
                  </div>
                </Link>
              ))}
            </div>
            <Button className="mt-5 w-full" onClick={close}>
              Empezar a estudiar
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
