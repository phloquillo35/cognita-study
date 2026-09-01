"use client";

import { useState, useMemo, useEffect } from "react";
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
  Loader2,
  FileQuestion,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import { useGeneratorStore } from "@/stores/generatorStore";
import { useStreakStore } from "@/stores/streakStore";
import { useStudySessionStore } from "@/stores/studySessionStore";
import {
  generateExercises,
  getSubjectsForPractice,
  type GeneratedExercise,
} from "@/lib/exerciseGenerator";
import Link from "next/link";

interface Exercise {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: number;
}

const SAMPLE_EXERCISES: Record<string, Exercise[]> = {
  am1: [
    {
      id: "am1-ex1",
      question: "Calcule la derivada de $f(x) = x^3 + 2x^2 - 5x + 3$",
      options: [
        "$3x^2 + 4x - 5$",
        "$3x^2 + 2x - 5$",
        "$x^2 + 4x - 5$",
        "$3x^2 + 4x + 5$",
      ],
      correctIndex: 0,
      explanation:
        "Aplicamos la regla de la potencia: $\\frac{d}{dx}[x^n] = nx^{n-1}$. Para $x^3$ obtenemos $3x^2$, para $2x^2$ obtenemos $4x$, para $-5x$ obtenemos $-5$, y la constante 3 se anula.",
      difficulty: 2,
    },
    {
      id: "am1-ex2",
      question:
        "¿Cuál es el límite $\\lim_{x \\to 0} \\frac{\\sin x}{x}$?",
      options: ["0", "1", "$\\infty$", "No existe"],
      correctIndex: 1,
      explanation:
        "Este es uno de los límites fundamentales. Se puede demostrar con el Teorema del Sandwich o con series de Taylor: $\\sin x \\approx x$ cuando $x \\to 0$, por lo tanto el límite es 1.",
      difficulty: 2,
    },
    {
      id: "am1-ex3",
      question:
        "Encuentre las raíces de $x^2 - 5x + 6 = 0$",
      options: [
        "$x = 2, x = 3$",
        "$x = -2, x = -3$",
        "$x = 1, x = 6$",
        "$x = -2, x = 3$",
      ],
      correctIndex: 0,
      explanation:
        "Factorizando: $x^2 - 5x + 6 = (x-2)(x-3) = 0$, entonces $x = 2$ o $x = 3$. Verificación: $2^2 - 5(2) + 6 = 4 - 10 + 6 = 0$ ✓ y $3^2 - 5(3) + 6 = 9 - 15 + 6 = 0$ ✓",
      difficulty: 1,
    },
    {
      id: "am1-ex4",
      question:
        "¿Cuál es la integral $\\int 2x \\, dx$?",
      options: ["$x^2 + C$", "$2x^2 + C$", "$x + C$", "$2 + C$"],
      correctIndex: 0,
      explanation:
        "Por la regla de la potencia a la inversa: $\\int x^n \\, dx = \\frac{x^{n+1}}{n+1} + C$. Entonces $\\int 2x \\, dx = 2 \\cdot \\frac{x^2}{2} + C = x^2 + C$.",
      difficulty: 1,
    },
  ],
  aga: [
    {
      id: "aga-ex1",
      question:
        "Si $A = \\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}$, ¿cuál es $\\det(A)$?",
      options: ["$-2$", "$2$", "$10$", "$-10$"],
      correctIndex: 0,
      explanation:
        "Para una matriz 2×2: $\\det(A) = ad - bc = (1)(4) - (2)(3) = 4 - 6 = -2$.",
      difficulty: 2,
    },
  ],
};

export default function PracticePage() {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [weak, setWeak] = useState<Exercise[]>([]);
  const [finished, setFinished] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);

  const decks = useGeneratorStore((s) => s.decks);
  const addDeck = useGeneratorStore((s) => s.addDeck);
  const addReviews = useStreakStore((s) => s.addReviews);
  const logSession = useStudySessionStore((state) => state.logSession);

  const allSubjects = getSubjectsForPractice();

  const generatedExercises = useMemo<Exercise[]>(() => {
    if (!selectedSubject) return [];
    const fromApi = decks.flatMap((d) =>
      d.subjectId === selectedSubject
        ? d.quizzes.map((q, i) => ({
            id: `gen-${d.id}-${i}`,
            question: q.question,
            options: q.options,
            correctIndex: q.correctIndex,
            explanation: q.explanation,
            difficulty: 2,
          }))
        : []
    );
    const offline = generateExercises(selectedSubject) as unknown as Exercise[];
    return [...offline, ...fromApi];
  }, [decks, selectedSubject]);

  const exercises = selectedSubject
    ? [...generatedExercises, ...(SAMPLE_EXERCISES[selectedSubject] || [])]
    : [];
  const currentExercise = exercises[currentExerciseIndex];
  const subjectName =
    allSubjects.find((s) => s.id === selectedSubject)?.name ?? "la materia";

  const handleGenerate = async () => {
    if (!selectedSubject) return;
    setGenerating(true);
    setGenError(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: `Generá ejercicios de práctica resueltos para ${subjectName}. Incluí derivadas, integrales, límites y problemas de aplicación con sus respuestas.`,
          subject: subjectName,
          mode: "quiz",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error al generar");
      if (data.quizzes?.length) {
        addDeck({
          title: `Práctica IA — ${subjectName}`,
          subjectId: selectedSubject,
          type: "quiz",
          flashcards: [],
          quizzes: data.quizzes,
        });
        setCurrentExerciseIndex(0);
        setSelectedAnswer(null);
        setShowExplanation(false);
        setScore({ correct: 0, total: 0 });
        setWeak([]);
        setFinished(false);
      }
    } catch (e) {
      setGenError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setGenerating(false);
    }
  };

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    setShowExplanation(true);
    setScore((prev) => ({
      correct: prev.correct + (index === currentExercise.correctIndex ? 1 : 0),
      total: prev.total + 1,
    }));
    if (index !== currentExercise.correctIndex) {
      setWeak((w) => [...w, currentExercise]);
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
    setCurrentExerciseIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setWeak([]);
    setFinished(false);
    setScore({ correct: 0, total: 0 });
  };

  useEffect(() => {
    if (exercises.length > 0 && score.total >= exercises.length && !finished) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- derived finished state from score, intentional
      setFinished(true);
      addReviews(score.total);
      logSession(5, score.total, score.correct);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [score.total, exercises.length]);

  if (!selectedSubject) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
            <Link href="/">
              <Button variant="ghost" size="icon" aria-label="Volver al inicio">
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
                  onClick={() => setSelectedSubject(subject.id)}
                >
                  <CardContent className="flex items-center gap-4 p-6">
                    <div
                      className={`rounded-2xl p-4 ${
                        subject.category === "math"
                          ? "bg-[var(--math)]/10"
                          : "bg-[var(--physics)]/10"
                      }`}
                    >
                      <Target
                        className={`h-6 w-6 ${
                          subject.category === "math"
                            ? "text-[var(--math)]"
                            : "text-[var(--physics)]"
                        }`}
                      />
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
            <h2 className="text-xl font-bold mb-2">Próximamente</h2>
            <p className="text-[var(--muted-foreground)] mb-4">
              Los ejercicios para esta materia estarán disponibles pronto con
              nuestro generador IA adaptativo.
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
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerate}
              disabled={generating}
            >
              {generating ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4 mr-1" />
              )}
              Generar con IA
            </Button>
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
        {genError && (
          <p className="mb-6 text-center text-sm text-[var(--destructive)]">
            {genError}
          </p>
        )}

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
          {selectedAnswer !== null && !finished && (
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
                <Button onClick={() => setFinished(true)} size="lg">
                  <FileQuestion className="h-4 w-4 mr-1" />
                  Ver resultado
                </Button>
              )}
            </motion.div>
          )}

          {finished && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8"
            >
              <Card className="text-center">
                <CardContent className="p-8">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--success)]/10">
                    <Target className="h-8 w-8 text-[var(--success)]" />
                  </div>
                  <h2 className="mb-1 text-2xl font-bold">
                    {score.total
                      ? Math.round((score.correct / score.total) * 100)
                      : 0}
                    %
                  </h2>
                  <p className="mb-6 text-[var(--muted-foreground)]">
                    {score.correct} de {score.total} correctas
                  </p>
                  {weak.length > 0 && (
                    <div className="mb-6 text-left">
                      <p className="mb-2 text-sm font-semibold text-[var(--warning)]">
                        Para repasar ({weak.length})
                      </p>
                      <ul className="space-y-1 text-sm text-[var(--muted-foreground)]">
                        {weak.slice(0, 5).map((w) => (
                          <li key={w.id} className="truncate">
                            • {w.question}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="flex flex-wrap justify-center gap-3">
                    <Button onClick={handleReset}>
                      <RotateCcw className="h-4 w-4 mr-1" />
                      Repetir
                    </Button>
                    <Button variant="outline" onClick={handleGenerate} disabled={generating}>
                      <Sparkles className="h-4 w-4 mr-1" />
                      Más con IA
                    </Button>
                    <Button variant="ghost" onClick={() => setSelectedSubject(null)}>
                      Otra materia
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
}

