"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, CalendarRange, Brain, BookOpen, Layers } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useFlashcardStore } from "@/stores/flashcardStore";
import { getAllSubjects } from "@/data/curriculum";
import { buildCalendarDays, formatMonthYear, dayKey } from "@/lib/calendar";
import { es } from "date-fns/locale";
import Link from "next/link";

const WEEKDAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const ALL_SUBJECTS = getAllSubjects();
const subjectMap = Object.fromEntries(ALL_SUBJECTS.map((s) => [s.id, s]));

export default function CalendarPage() {
  const cards = useFlashcardStore((s) => s.cards);
  const fetchAll = useFlashcardStore((s) => s.fetchAll);
  const syncStatus = useFlashcardStore((s) => s.syncStatus);

  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const days = useMemo(() => buildCalendarDays(cards, year, month, now), [cards, year, month, now]);

  const selectedDay = useMemo(() => (selectedKey ? days.find((d) => d.key === selectedKey) ?? null : null), [days, selectedKey]);

  const totalDueThisMonth = useMemo(() => days.filter((d) => d.isCurrentMonth && d.due.length > 0).reduce((acc, d) => acc + d.due.length, 0), [days]);

  const handlePrev = () => {
    if (month === 0) { setYear((y) => y - 1); setMonth(11); } else setMonth((m) => m - 1);
    setSelectedKey(null);
  };
  const handleNext = () => {
    if (month === 11) { setYear((y) => y + 1); setMonth(0); } else setMonth((m) => m + 1);
    setSelectedKey(null);
  };
  const handleToday = () => {
    const t = new Date();
    setYear(t.getFullYear());
    setMonth(t.getMonth());
    setSelectedKey(dayKey(t));
  };

  return (
    <div className="min-h-screen bg-[var(--background)] pb-20">
      <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center gap-4 px-4">
          <Link href="/">
            <Button variant="ghost" size="icon" aria-label="Volver al inicio">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="flex items-center gap-2 text-lg font-bold">
              <CalendarRange className="h-5 w-5 text-[var(--primary)]" />
              Calendario FSRS
            </h1>
            <p className="text-xs text-[var(--muted-foreground)]">
              Vencimientos por día — {totalDueThisMonth} tarjetas este mes {syncStatus === "fallback" ? "· Modo local" : syncStatus === "syncing" ? "· Sincronizando…" : ""}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleToday}>
            Hoy
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Layers className="h-4 w-4 text-[var(--primary)]" />
                {formatMonthYear(year, month, es)}
              </CardTitle>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handlePrev} aria-label="Mes anterior">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleNext} aria-label="Mes siguiente">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-[var(--muted-foreground)]">
              {WEEKDAYS.map((w) => (
                <div key={w} className="py-2">
                  {w}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {days.map((day) => (
                <button
                  key={day.key}
                  onClick={() => setSelectedKey(day.key)}
                  className={`relative flex min-h-[72px] flex-col rounded-xl border p-2 text-left transition-all hover:shadow-md ${
                    day.isToday ? "border-[var(--primary)] ring-1 ring-[var(--primary)]/20" : "border-[var(--border)]"
                  } ${day.isCurrentMonth ? "bg-[var(--card)]" : "bg-[var(--muted)]/30 opacity-60"} ${selectedKey === day.key ? "bg-[var(--primary)]/5 border-[var(--primary)]/40" : ""}`}
                >
                  <span className={`text-sm font-medium ${day.isToday ? "text-[var(--primary)]" : day.isCurrentMonth ? "text-[var(--foreground)]" : "text-[var(--muted-foreground)]"}`}>
                    {day.date.getDate()}
                  </span>
                  {day.due.length > 0 && (
                    <div className="mt-1 flex flex-col gap-1">
                      <span className={`inline-flex w-fit rounded-full px-1.5 py-0.5 text-[10px] font-bold text-white ${day.avgRetention == null ? "bg-[var(--primary)]" : day.avgRetention >= 80 ? "bg-[var(--success)]" : day.avgRetention >= 60 ? "bg-[var(--warning)]" : "bg-[var(--destructive)]"}`}>
                        {day.due.length} {day.due.length === 1 ? "tarjeta" : "tarjetas"}
                      </span>
                      {day.avgRetention != null && (
                        <span className="text-[10px] text-[var(--muted-foreground)]">
                          ret {day.avgRetention}%
                        </span>
                      )}
                    </div>
                  )}
                  {day.isToday && <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[var(--primary)]" />}
                </button>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-[var(--muted-foreground)]">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--success)]" /> ret ≥80%
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--warning)]" /> 60-79%
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--destructive)]" /> &lt;60%
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--primary)]" /> sin estabilidad
              </span>
            </div>
          </CardContent>
        </Card>

        <AnimatePresence mode="wait">
          {selectedDay ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between text-base">
                    <span>
                      {selectedDay.date.toLocaleDateString("es", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                    </span>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedKey(null)}>
                      Cerrar
                    </Button>
                  </CardTitle>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {selectedDay.due.length === 0 ? "Sin vencimientos" : `${selectedDay.due.length} tarjeta(s) — retención media ${selectedDay.avgRetention ?? "—"}%`}
                  </p>
                </CardHeader>
                <CardContent>
                  {selectedDay.due.length === 0 ? (
                    <div className="py-8 text-center">
                      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--success)]/10">
                        <CalendarRange className="h-6 w-6 text-[var(--success)]" />
                      </div>
                      <p className="text-sm text-[var(--muted-foreground)]">Nada para repasar este día. ¡Descanso merecido!</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {selectedDay.due.map((card) => (
                        <div key={card.id} className="rounded-xl border border-[var(--border)] p-3">
                          <div className="mb-1 flex items-center gap-2">
                            <span className="rounded-full bg-[var(--primary)]/10 px-2 py-0.5 text-[10px] font-medium text-[var(--primary)]">
                              {subjectMap[card.subjectId]?.name ?? card.subjectId}
                            </span>
                            <span className="text-[10px] text-[var(--muted-foreground)]">dif {card.difficulty} · rep {card.repetitions} · est {card.stability?.toFixed(1) ?? "—"}</span>
                          </div>
                          <p className="text-sm font-medium leading-snug">{card.front}</p>
                          <p className="mt-1 text-xs text-[var(--muted-foreground)] line-clamp-2">{card.back}</p>
                        </div>
                      ))}
                      <div className="pt-2">
                        <Link href="/flashcards">
                          <Button size="sm" className="w-full">
                            <Brain className="h-4 w-4 mr-1" />
                            Repasar estas tarjetas
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="p-8 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--muted)]">
                  <BookOpen className="h-6 w-6 text-[var(--muted-foreground)]" />
                </div>
                <p className="text-sm font-medium">Seleccioná un día para ver sus vencimientos</p>
                <p className="mt-1 text-xs text-[var(--muted-foreground)]">Los días con color tienen tarjetas FSRS programadas. El color indica retención estimada.</p>
              </CardContent>
            </Card>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
