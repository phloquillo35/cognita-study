"use client";

import { useState, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Brain,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ChevronRight,
  Sparkles,
  Target,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import { useStudySessionStore } from "@/stores/studySessionStore";
import {
  generateExercises,
  getSubjectsForPractice,
  type GeneratedExercise,
} from "@/lib/exerciseGenerator";
import Link from "next/link";

function nowMs(): number {
  return Date.now();
}

export default function PracticePage() {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const logSession = useStudySessionStore((state) => state.logSession);
  const sessionStartRef = useRef<number | null>(null);

  const exercises = useMemo<GeneratedExercise[]>(
    () => (selectedSubject ? generateExercises(selectedSubject) : []),
    [selectedSubject]
  );
  const currentExercise = exercises[currentExerciseIndex];

  const startSession = (subjectId: string) => {
    sessionStartRef.current = nowMs();
    setSelectedSubject(subjectId);
    setCurrentExerciseIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore({ correct: 0, total: 0 });
  };

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    if (sessionStartRef.current === null) {
      sessionStartRef.current = nowMs();
    }
    setSelectedAnswer(index);
    setShowExplanation(true);
    const newCorrect =
      score.correct + (index === currentExercise.correctIndex ? 1 : 0);
    const newTotal = score.total + 1;
    setScore({ correct: newCorrect, total: newTotal });
    if (newTotal === exercises.length) {
      logSession((nowMs() - sessionStartRef.current) / 60000, newTotal, newCorrect);
      sessionStartRef.current = null;
    }
  };

  const handleNext = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const handleReset = () => {
    if (sessionStartRef.current !== null) {
      logSession((nowMs() - sessionStartRef.current) / 60000, score.total, score.correct);
      sessionStartRef.current = null;
    }
    setCurrentExerciseIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore({ correct: 0, total: 0 });
  };

  const allSubjects = getSubjectsForPractice();

  if (!selectedSubject) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-lg font-bold">Práctica Adaptativa</h1>
              <p className="text-xs text-[var(--muted-foreground)]">
                Elegí una materia para comenzar
              </p>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {allSubjects.map((subject) => (
              <motion.div
                key={subject.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card
                  className="cursor-pointer transition-all hover:border-[var(--primary)]/50 hover:shadow-lg"
                  onClick={() => startSession(subject.id)}
                >
                  <CardContent className="flex items-center gap-4 p-6">
                    <div className="rounded-2xl bg-[var(--primary)]/10 p-4">
                      <Target className="h-6 w-6 text-[var(--primary)]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{subject.name}</h3>
                      <p className="text-sm text-[var(--muted-foreground)]">
                        {subject.topics.length} temas • Nivel {subject.level}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-[var(--muted-foreground)]" />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (exercises.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <Card className="max-w-md text-center">
          <CardContent className="p-8">
            <Sparkles className="mx-auto mb-4 h-12 w-12 text-[var(--primary)]" />
            <h2 className="text-xl font-bold mb-2">Sin ejercicios</h2>
            <p className="text-[var(--muted-foreground)] mb-4">
              No se pudieron generar ejercicios para esta materia.
            </p>
            <Button onClick={() => setSelectedSubject(null)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Elegir otra materia
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedSubject(null)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-bold">
              {allSubjects.find((s) => s.id === selectedSubject)?.name}
            </h1>
            <p className="text-xs text-[var(--muted-foreground)]">
              Ejercicio {currentExerciseIndex + 1} de {exercises.length}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              {score.correct}/{score.total}
            </span>
            <Target className="h-4 w-4 text-[var(--success)]" />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8">
        {/* Progress */}
        <div className="mb-8">
          <Progress
            value={currentExerciseIndex + 1}
            max={exercises.length}
            className="h-2"
          />
        </div>

        {/* Exercise */}
        <motion.div
          key={currentExercise.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  Ejercicio {currentExerciseIndex + 1}
                </CardTitle>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-2 w-2 rounded-full ${
                        i < currentExercise.difficulty
                          ? "bg-[var(--primary)]"
                          : "bg-[var(--secondary)]"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-lg whitespace-pre-wrap">{currentExercise.question}</p>
            </CardContent>
          </Card>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {currentExercise.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={selectedAnswer !== null}
                className={`w-full rounded-xl border p-4 text-left transition-all ${
                  selectedAnswer === null
                    ? "border-[var(--border)] hover:border-[var(--primary)] hover:bg-[var(--primary)]/5"
                    : index === currentExercise.correctIndex
                    ? "border-[var(--success)] bg-[var(--success)]/10 text-[var(--success)]"
                    : index === selectedAnswer
                    ? "border-[var(--destructive)] bg-[var(--destructive)]/10 text-[var(--destructive)]"
                    : "border-[var(--border)] opacity-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-medium ${
                      selectedAnswer === null
                        ? "border-[var(--border)]"
                        : index === currentExercise.correctIndex
                        ? "border-[var(--success)] bg-[var(--success)] text-white"
                        : index === selectedAnswer
                        ? "border-[var(--destructive)] bg-[var(--destructive)] text-white"
                        : "border-[var(--border)]"
                    }`}
                  >
                    {selectedAnswer !== null &&
                    index === currentExercise.correctIndex ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : selectedAnswer !== null && index === selectedAnswer ? (
                      <XCircle className="h-4 w-4" />
                    ) : (
                      String.fromCharCode(65 + index)
                    )}
                  </div>
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-[var(--primary)]/30 bg-[var(--primary)]/5">
                <CardContent className="p-6">
                  <div className="mb-2 flex items-center gap-2 text-[var(--primary)]">
                    <Brain className="h-5 w-5" />
                    <span className="font-semibold">Explicación</span>
                  </div>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">
                    {currentExercise.explanation}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Actions */}
          {selectedAnswer !== null && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 flex justify-center gap-3"
            >
              {currentExerciseIndex < exercises.length - 1 ? (
                <Button onClick={handleNext} size="lg">
                  Siguiente Ejercicio
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              ) : (
                <Button onClick={handleReset} size="lg">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reiniciar Práctica
                </Button>
              )}
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
