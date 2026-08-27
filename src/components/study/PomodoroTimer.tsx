"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, Timer } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useStreakStore } from "@/stores/streakStore";

type Mode = "focus" | "break";

const DURATIONS: Record<Mode, number> = { focus: 25 * 60, break: 5 * 60 };

export default function PomodoroTimer() {
  const [mode, setMode] = useState<Mode>("focus");
  const [secondsLeft, setSecondsLeft] = useState(DURATIONS.focus);
  const [running, setRunning] = useState(false);
  const addFocusMinutes = useStreakStore((s) => s.addFocusMinutes);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const earnedRef = useRef(0);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(intervalRef.current!);
          if (mode === "focus") {
            addFocusMinutes(25);
          }
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, mode, addFocusMinutes]);

  const switchMode = (m: Mode) => {
    setMode(m);
    setSecondsLeft(DURATIONS[m]);
    setRunning(false);
  };

  const reset = () => {
    setRunning(false);
    setSecondsLeft(DURATIONS[mode]);
  };

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");
  const progress =
    ((DURATIONS[mode] - secondsLeft) / DURATIONS[mode]) * 100;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Timer className="h-4 w-4 text-[var(--primary)]" />
          Pomodoro Focus
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex justify-center gap-2">
          {(["focus", "break"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                mode === m
                  ? "bg-[var(--primary)] text-white"
                  : "bg-[var(--primary)]/10 text-[var(--primary)]"
              }`}
            >
              {m === "focus" ? "Enfoque 25m" : "Descanso 5m"}
            </button>
          ))}
        </div>

        <div className="relative mx-auto flex h-48 w-48 items-center justify-center">
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="var(--border)"
              strokeWidth="8"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="var(--primary)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 45}
              strokeDashoffset={2 * Math.PI * 45 * (1 - progress / 100)}
            />
          </svg>
          <span className="text-4xl font-bold tabular-nums">
            {mm}:{ss}
          </span>
        </div>

        <div className="mt-4 flex justify-center gap-3">
          <Button onClick={() => setRunning((r) => !r)}>
            {running ? (
              <Pause className="h-4 w-4 mr-1" />
            ) : (
              <Play className="h-4 w-4 mr-1" />
            )}
            {running ? "Pausar" : "Iniciar"}
          </Button>
          <Button variant="outline" onClick={reset}>
            <RotateCcw className="h-4 w-4 mr-1" />
            Reiniciar
          </Button>
        </div>
        <p className="mt-3 text-center text-xs text-[var(--muted-foreground)]">
          Cada bloque de enfoque completo suma tiempo a tu racha.
        </p>
      </CardContent>
    </Card>
  );
}
