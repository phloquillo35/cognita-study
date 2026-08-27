"use client";

import { useState, useEffect, useMemo } from "react";
import { ArrowLeft, Flame, Clock, Target, CalendarClock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import PomodoroTimer from "@/components/study/PomodoroTimer";
import { useStreakStore } from "@/stores/streakStore";
import Link from "next/link";

export default function FocusPage() {
  const { currentStreak, longestStreak, totalFocusMinutes } = useStreakStore();
  const [examDate, setExamDate] = useState<string>("");
  const [now, setNow] = useState<number>(Date.now());

  useEffect(() => {
    const saved = localStorage.getItem("cognita-exam-date");
    if (saved) setExamDate(saved);
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const countdown = useMemo(() => {
    if (!examDate) return null;
    const target = new Date(examDate).getTime();
    let diff = Math.max(0, target - now);
    const days = Math.floor(diff / 86400000);
    diff -= days * 86400000;
    const hours = Math.floor(diff / 3600000);
    diff -= hours * 3600000;
    const mins = Math.floor(diff / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    return { days, hours, mins, secs, passed: target <= now };
  }, [examDate, now]);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center gap-4 px-4">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-lg font-bold">Sesión de Enfoque</h1>
            <p className="text-xs text-[var(--muted-foreground)]">
              Bloques Pomodoro, racha diaria y countdown a tu parcial
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-5xl gap-6 px-4 py-8 md:grid-cols-2">
        <PomodoroTimer />

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Flame className="h-4 w-4 text-[var(--warning)]" />
              Tu Racha
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-3">
              <span className="text-5xl font-bold text-[var(--warning)]">
                {currentStreak}
              </span>
              <span className="mb-1 text-[var(--muted-foreground)]">
                días seguidos
              </span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl border border-[var(--border)] p-3">
                <p className="text-[var(--muted-foreground)]">Racha máxima</p>
                <p className="text-xl font-bold">{longestStreak} días</p>
              </div>
              <div className="rounded-xl border border-[var(--border)] p-3">
                <p className="text-[var(--muted-foreground)]">Tiempo enfocado</p>
                <p className="text-xl font-bold">
                  {Math.floor(totalFocusMinutes / 60)}h {totalFocusMinutes % 60}m
                </p>
              </div>
            </div>
            <Link href="/flashcards" className="mt-4 block">
              <Button variant="outline" className="w-full">
                <Target className="h-4 w-4 mr-1" />
                Repasar flashcards pendientes
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <CalendarClock className="h-4 w-4 text-[var(--primary)]" />
              Countdown al próximo parcial
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-4">
              <input
                type="date"
                value={examDate}
                onChange={(e) => {
                  setExamDate(e.target.value);
                  localStorage.setItem("cognita-exam-date", e.target.value);
                }}
                className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm focus:border-[var(--primary)] focus:outline-none"
              />
              {countdown && (
                <div className="flex gap-3">
                  {[
                    ["Días", countdown.days],
                    ["Horas", countdown.hours],
                    ["Min", countdown.mins],
                    ["Seg", countdown.secs],
                  ].map(([label, val]) => (
                    <div
                      key={label}
                      className="rounded-xl bg-[var(--primary)]/10 px-4 py-2 text-center"
                    >
                      <p className="text-2xl font-bold tabular-nums">
                        {String(val).padStart(2, "0")}
                      </p>
                      <p className="text-xs text-[var(--muted-foreground)]">
                        {label}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <p className="mt-3 flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
              <Clock className="h-3 w-3" />
              {examDate
                ? countdown?.passed
                  ? "¡Ese parcial ya pasó! Fijá la próxima fecha."
                  : "Recordá: la consistencia vence a la intensidad."
                : "Seleccioná la fecha de tu próximo examen para ver la cuenta regresiva."}
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
