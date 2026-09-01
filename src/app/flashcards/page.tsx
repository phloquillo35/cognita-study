"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Brain,
  Plus,
  RotateCcw,
  Calendar,
  Layers,
  CheckCircle2,
  XCircle,
  Sparkles,
  Trash2,
  ChevronDown,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import { getAllSubjects } from "@/data/curriculum";
import { useFlashcardStore } from "@/stores/flashcardStore";
import { useStudySessionStore } from "@/stores/studySessionStore";
import { useStreakStore } from "@/stores/streakStore";
import {
  calculateNextReview,
  type ReviewQuality,
} from "@/lib/spaced-repetition";
import AIGenerator from "@/components/study/AIGenerator";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

const SAMPLE_CARDS: {
  subjectId: string;
  front: string;
  back: string;
}[] = [
  {
    subjectId: "am1",
    front: "Definición de derivada",
    back: "f'(x) = lim[h→0] (f(x+h) - f(x)) / h. Representa la tasa de cambio instantánea de una función en un punto.",
  },
  {
    subjectId: "am1",
    front: "Regla de la cadena",
    back: "Si f(x) = g(h(x)), entonces f'(x) = g'(h(x)) · h'(x). La derivada del exterior evaluada en el interior, multiplicada por la derivada del interior.",
  },
  {
    subjectId: "am1",
    front: "Límite fundamental: lim[x→0] sin(x)/x",
    back: "El límite es 1. Se demuestra con el Teorema del Sandwich o con series de Taylor: sin(x) ≈ x cuando x→0.",
  },
  {
    subjectId: "am1",
    front: "Integral de x^n",
    back: "∫ x^n dx = x^(n+1)/(n+1) + C, para n ≠ -1. Para n = -1: ∫ x^(-1) dx = ln|x| + C.",
  },
  {
    subjectId: "am1",
    front: "Teorema del valor intermedio",
    back: "Si f es continua en [a,b] y k está entre f(a) y f(b), entonces existe c ∈ (a,b) tal que f(c) = k. Especialmente: si f(a) y f(b) tienen distinto signo, existe c con f(c) = 0.",
  },
  {
    subjectId: "aga",
    front: "Determinante de una matriz 2×2",
    back: "Para A = [[a,b],[c,d]], det(A) = ad - bc. Si det(A) = 0, la matriz es singular (no invertible).",
  },
  {
    subjectId: "aga",
    front: "¿Qué es un espacio vectorial?",
    back: "Un conjunto V con operaciones de suma y multiplicación por escalar que satisfacen los 8 axiomas: clausura, asociatividad, conmutatividad, elemento neutro, inverso aditivo, y compatibilidad escalar.",
  },
  {
    subjectId: "aga",
    front: "Autovalores y autovectores",
    back: "Si Av = λv con v ≠ 0, entonces λ es autovalor y v es autovector. Se encuentran resolviendo det(A - λI) = 0 (polinomio característico).",
  },
  {
    subjectId: "fis1",
    front: "Segunda Ley de Newton",
    back: "F = m·a (fuerza = masa × aceleración). La aceleración de un objeto es directamente proporcional a la fuerza neta e inversamente proporcional a su masa.",
  },
  {
    subjectId: "fis1",
    front: "Trabajo de una fuerza constante",
    back: "W = F·d·cos(θ), donde F es la fuerza, d el desplazamiento y θ el ángulo entre ambos. Unidades: Joules (J) = Newton·metro.",
  },
  {
    subjectId: "fis1",
    front: "Conservación de la energía mecánica",
    back: "En ausencia de fuerzas no conservativas: E = K + U = constante, donde K = ½mv² (energía cinética) y U es la energía potencial.",
  },
  {
    subjectId: "fis1",
    front: "Movimiento armónico simple - periodo",
    back: "Para un resorte: T = 2π√(m/k). Para un péndulo simple: T = 2π√(L/g). El periodo no depende de la amplitud.",
  },
  {
    subjectId: "led",
    front: "Leyes de De Morgan",
    back: "¬(P ∧ Q) ≡ ¬P ∨ ¬Q y ¬(P ∨ Q) ≡ ¬P ∧ ¬Q. La negación de una conjunción es la disyunción de las negaciones, y viceversa.",
  },
  {
    subjectId: "led",
    front: "¿Qué es una función inyectiva?",
    back: "Una función f: A→B es inyectiva (uno a uno) si para todo x₁, x₂ ∈ A: f(x₁) = f(x₂) ⟹ x₁ = x₂. Cada elemento del codominio tiene a lo sumo una preimagen.",
  },
  {
    subjectId: "aed",
    front: "Complejidad de búsqueda binaria",
    back: "O(log n). Requiere datos ordenados. En cada paso elimina la mitad de los elementos restantes. Para n elementos, máximo log₂(n) comparaciones.",
  },
  {
    subjectId: "aed",
    front: "¿Qué es un ABB (Árbol Binario de Búsqueda)?",
    back: "Árbol binario donde para cada nodo: todos los valores del subárbol izquierdo son menores y todos los del derecho son mayores. Permite búsqueda, inserción y eliminación en O(log n) promedio.",
  },
  {
    subjectId: "arq",
    front: "Ley de Amdahl",
    back: "Speedup = 1 / ((1 - P) + P/S), donde P es la fracción paralelizable y S el speedup del componente paralelo. Define el límite máximo de aceleración al paralelizar.",
  },
  {
    subjectId: "arq",
    front: "Jerarquía de memoria",
    back: "Registros > Cache (L1/L2/L3) > RAM > Disco. A menor jerarquía: mayor velocidad, menor capacidad, mayor costo por byte. El principio de localidad justifica esta organización.",
  },
  {
    subjectId: "so",
    front: "Condición de carrera",
    back: "Ocurre cuando dos o más procesos acceden a un recurso compartido y el resultado depende del orden de ejecución. Se previene con semáforos, monitores o exclusiones mutuas.",
  },
  {
    subjectId: "bd",
    front: "Forma Normal 1FN (1FN)",
    back: "Una relación está en 1FN si todos los atributos son atómicos (indivisibles) y no hay atributos multivalorados ni grupos repetitivos.",
  },
];

const ALL_SUBJECTS = getAllSubjects();

const QUALITY_CONFIG: {
  quality: ReviewQuality;
  label: string;
  color: string;
  icon: React.ReactNode;
}[] = [
  {
    quality: 0,
    label: "Olvidé",
    color:
      "bg-[var(--destructive)]/10 text-[var(--destructive)] hover:bg-[var(--destructive)]/20 border-[var(--destructive)]/30",
    icon: <XCircle className="h-4 w-4" />,
  },
  {
    quality: 1,
    label: "Mal",
    color:
      "bg-[var(--destructive)]/10 text-[var(--destructive)] hover:bg-[var(--destructive)]/20 border-[var(--destructive)]/30",
    icon: <XCircle className="h-4 w-4" />,
  },
  {
    quality: 2,
    label: "Difícil",
    color:
      "bg-[var(--warning)]/10 text-[var(--warning)] hover:bg-[var(--warning)]/20 border-[var(--warning)]/30",
    icon: <RotateCcw className="h-4 w-4" />,
  },
  {
    quality: 3,
    label: "Bien",
    color:
      "bg-[var(--primary)]/10 text-[var(--primary)] hover:bg-[var(--primary)]/20 border-[var(--primary)]/30",
    icon: <CheckCircle2 className="h-4 w-4" />,
  },
  {
    quality: 4,
    label: "Fácil",
    color:
      "bg-[var(--success)]/10 text-[var(--success)] hover:bg-[var(--success)]/20 border-[var(--success)]/30",
    icon: <CheckCircle2 className="h-4 w-4" />,
  },
  {
    quality: 5,
    label: "Perfecto",
    color:
      "bg-[var(--success)]/10 text-[var(--success)] hover:bg-[var(--success)]/20 border-[var(--success)]/30",
    icon: <CheckCircle2 className="h-4 w-4" />,
  },
];

export default function FlashcardsPage() {
  const { cards, addCard, removeCard, updateCard } = useFlashcardStore();
  const logSession = useStudySessionStore((state) => state.logSession);
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFront, setNewFront] = useState("");
  const [newBack, setNewBack] = useState("");
  const [newSubject, setNewSubject] = useState(ALL_SUBJECTS[0]?.id ?? "am1");

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(cards, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cognita-flashcards.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        const arr = Array.isArray(parsed) ? parsed : parsed.cards;
        if (Array.isArray(arr)) {
          const imported = arr.map((c: Record<string, unknown>) => ({
            ...c,
            id: typeof c.id === "string" ? c.id : crypto.randomUUID(),
            createdAt:
              c.createdAt instanceof Date
                ? c.createdAt
                : new Date(c.createdAt as string),
          })) as unknown as import("@/types").Flashcard[];
          useFlashcardStore.getState().importCards(imported);
        }
      } catch {
        // ignorar archivo inválido
      }
    };
    reader.readAsText(file);
  };

  const filteredDueCards = useMemo(() => {
    const now = new Date();
    const due = cards.filter((c) => new Date(c.nextReview) <= now);
    if (selectedSubject === "all") return due;
    return due.filter((c) => c.subjectId === selectedSubject);
  }, [cards, selectedSubject]);

  const safeIndex = Math.min(currentIndex, Math.max(filteredDueCards.length - 1, 0));
  const currentCard = filteredDueCards[safeIndex];

  const subjectMap = useMemo(
    () => Object.fromEntries(ALL_SUBJECTS.map((s) => [s.id, s])),
    []
  );

  const handleRate = (quality: ReviewQuality) => {
    if (!currentCard) return;
    const result = calculateNextReview(currentCard, quality);
    updateCard(currentCard.id, {
      interval: result.interval,
      easeFactor: result.easeFactor,
      repetitions: result.repetitions,
      stability: result.stability,
      difficulty: result.difficulty,
      nextReview: result.nextReview,
      lastReviewed: new Date(),
      reviewCount: currentCard.reviewCount + 1,
      correctCount: currentCard.correctCount + (quality >= 3 ? 1 : 0),
    });
logSession(0, 1, quality >= 3 ? 1 : 0);
    useStreakStore.getState().addReviews(1);
    setIsFlipped(false);
    setReviewedCount((prev) => prev + 1);
    setCurrentIndex((prev) =>
      prev >= filteredDueCards.length - 1 ? 0 : prev
    );
  };

  const handleAddCard = () => {
    if (!newFront.trim() || !newBack.trim()) return;
    addCard({
      subjectId: newSubject,
      front: newFront.trim(),
      back: newBack.trim(),
      difficulty: 1,
      nextReview: new Date(),
      reviewCount: 0,
      correctCount: 0,
      interval: 0,
      easeFactor: 2.5,
      repetitions: 0,
    });
    setNewFront("");
    setNewBack("");
    setShowAddForm(false);
  };

  const handleLoadSampleCards = () => {
    const existing = new Set(cards.map((c) => c.front));
    let count = 0;
    SAMPLE_CARDS.forEach((sample) => {
      if (!existing.has(sample.front)) {
        addCard({
          subjectId: sample.subjectId,
          front: sample.front,
          back: sample.back,
          difficulty: 1,
          nextReview: new Date(),
          reviewCount: 0,
          correctCount: 0,
          interval: 0,
          easeFactor: 2.5,
          repetitions: 0,
        });
        count++;
      }
    });
    if (count > 0) {
      setReviewedCount(0);
      setCurrentIndex(0);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-bold">Flashcards</h1>
            <p className="text-xs text-[var(--muted-foreground)]">
              Repetición espaciada con algoritmo SM-2
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
            <Layers className="h-4 w-4" />
            <span>
              {reviewedCount} revisadas
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        {/* Controls */}
        <div className="mb-8 flex flex-wrap items-center gap-4">
          {/* Subject selector */}
          <div className="relative">
            <select
              value={selectedSubject}
              onChange={(e) => {
                setSelectedSubject(e.target.value);
                setCurrentIndex(0);
                setIsFlipped(false);
                setReviewedCount(0);
              }}
              className="appearance-none rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 pr-10 text-sm font-medium text-[var(--card-foreground)] transition-colors hover:border-[var(--primary)]/50 focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]/20"
            >
              <option value="all">Todas las materias</option>
              {ALL_SUBJECTS.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Nueva tarjeta
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleLoadSampleCards}
          >
            <Sparkles className="h-4 w-4 mr-1" />
            Cargar ejemplos
          </Button>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleExport}>
              Exportar
            </Button>
            <label className="inline-flex cursor-pointer items-center rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm transition-colors hover:border-[var(--primary)]/50">
              Importar
              <input
                type="file"
                accept="application/json"
                className="hidden"
                onChange={(e) =>
                  e.target.files && handleImport(e.target.files[0])
                }
              />
            </label>
          </div>

          <div className="ml-auto flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
            <Clock className="h-4 w-4" />
            {filteredDueCards.length} para revisar
          </div>
        </div>

        {/* AI Generator */}
        <div className="mb-8">
          <AIGenerator mode="flashcards" />
        </div>

        {/* Add card form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 overflow-hidden"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Nueva flashcard</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">
                        Materia
                      </label>
                      <div className="relative">
                        <select
                          value={newSubject}
                          onChange={(e) => setNewSubject(e.target.value)}
                          className="w-full appearance-none rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 pr-10 text-sm text-[var(--foreground)] transition-colors hover:border-[var(--primary)]/50 focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]/20"
                        >
                          {ALL_SUBJECTS.map((subject) => (
                            <option key={subject.id} value={subject.id}>
                              {subject.name}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">
                        Frente (pregunta)
                      </label>
                      <textarea
                        value={newFront}
                        onChange={(e) => setNewFront(e.target.value)}
                        placeholder="Ej: ¿Qué es una derivada?"
                        rows={2}
                        className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] transition-colors hover:border-[var(--primary)]/50 focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]/20"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">
                        Dorso (respuesta)
                      </label>
                      <textarea
                        value={newBack}
                        onChange={(e) => setNewBack(e.target.value)}
                        placeholder="Ej: La derivada es la tasa de cambio instantánea..."
                        rows={3}
                        className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] transition-colors hover:border-[var(--primary)]/50 focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]/20"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAddForm(false)}
                      >
                        Cancelar
                      </Button>
                      <Button size="sm" onClick={handleAddCard}>
                        <Plus className="h-4 w-4 mr-1" />
                        Agregar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Flashcard display */}
        {filteredDueCards.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="text-center">
              <CardContent className="p-12">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-[var(--success)]/10">
                  <CheckCircle2 className="h-10 w-10 text-[var(--success)]" />
                </div>
                <h2 className="mb-2 text-xl font-bold">
                  ¡Todo al día!
                </h2>
                <p className="mb-6 text-[var(--muted-foreground)]">
                  No hay tarjetas para revisar ahora. Agregá nuevas tarjetas o
                  volvé más tarde cuando haya repeticiones pendientes.
                </p>
                <div className="flex justify-center gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowAddForm(true)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Nueva tarjeta
                  </Button>
                  <Button onClick={handleLoadSampleCards}>
                    <Sparkles className="h-4 w-4 mr-1" />
                    Cargar ejemplos
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {/* Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--muted-foreground)]">
                  Progreso de la sesión
                </span>
                <span className="font-medium">
                  {reviewedCount} / {filteredDueCards.length}
                </span>
              </div>
              <Progress
                value={reviewedCount}
                max={filteredDueCards.length}
                className="h-2"
              />
            </div>

            {/* Card flip area */}
            <div
              className="relative cursor-pointer"
              onClick={() => currentCard && setIsFlipped(!isFlipped)}
              style={{ perspective: 1000 }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentCard?.id ?? "empty"}
                  initial={{ opacity: 0, rotateY: isFlipped ? -90 : 0 }}
                  animate={{ opacity: 1, rotateY: 0 }}
                  exit={{ opacity: 0, rotateY: isFlipped ? 0 : 90 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="min-h-[320px] border-2 transition-all hover:shadow-xl">
                    <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                      {!isFlipped ? (
                        <>
                          <div className="mb-4 rounded-full bg-[var(--primary)]/10 px-3 py-1 text-xs font-medium text-[var(--primary)]">
                            Pregunta
                          </div>
                          <h2 className="mb-4 text-2xl font-bold text-[var(--foreground)]">
                            {currentCard?.front}
                          </h2>
                          <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                            <Layers className="h-4 w-4" />
                            {subjectMap[currentCard?.subjectId ?? ""]?.name ??
                              "Desconocida"}
                          </div>
                          <p className="mt-4 text-xs text-[var(--muted-foreground)]">
                            Tocá para ver la respuesta
                          </p>
                        </>
                      ) : (
                        <>
                          <div className="mb-4 rounded-full bg-[var(--success)]/10 px-3 py-1 text-xs font-medium text-[var(--success)]">
                            Respuesta
                          </div>
                          <h2 className="mb-4 text-xl font-semibold text-[var(--foreground)]">
                            {currentCard?.back}
                          </h2>
                          <div className="flex items-center gap-4 text-xs text-[var(--muted-foreground)]">
                            <span>
                              Repeticiones: {currentCard?.repetitions}
                            </span>
                            <span>•</span>
                            <span>
                              Intervalo: {currentCard?.interval ?? 0} días
                            </span>
                            <span>•</span>
                            <span>
                              Facilidad: {currentCard?.easeFactor.toFixed(1)}
                            </span>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Rating buttons */}
            <AnimatePresence>
              {isFlipped && currentCard && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="space-y-4"
                >
                  <p className="text-center text-sm font-medium text-[var(--muted-foreground)]">
                    ¿Qué tan bien lo sabías?
                  </p>
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                    {QUALITY_CONFIG.map((config) => (
                      <Button
                        key={config.quality}
                        variant="outline"
                        className={`flex-col gap-1 h-auto py-3 ${config.color}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRate(config.quality);
                        }}
                      >
                        {config.icon}
                        <span className="text-xs font-medium">
                          {config.label}
                        </span>
                      </Button>
                    ))}
                  </div>

                  {/* Next review info */}
                  <Card className="border-dashed">
                    <CardContent className="flex items-center justify-center gap-6 p-4 text-sm text-[var(--muted-foreground)]">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        <span>
                          Próxima revisión:{" "}
                          {formatDistanceToNow(
                            calculateNextReview(currentCard, 3).nextReview,
                            { addSuffix: true, locale: es }
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Brain className="h-4 w-4" />
                        <span>
                          Intervalo:{" "}
                          {calculateNextReview(currentCard, 3).interval} días
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Card list */}
            <div className="mt-8">
              <h3 className="mb-4 text-sm font-semibold text-[var(--muted-foreground)]">
                Todas las tarjetas ({filteredDueCards.length})
              </h3>
              <div className="space-y-2">
                {filteredDueCards.map((card, index) => (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <Card className="transition-all hover:border-[var(--primary)]/30">
                      <CardContent className="flex items-center gap-4 p-4">
                        <div className="flex-1 min-w-0">
                          <p className="truncate text-sm font-medium text-[var(--foreground)]">
                            {card.front}
                          </p>
                          <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                            {subjectMap[card.subjectId]?.name ?? "Desconocida"}{" "}
                            · Rep: {card.repetitions} · EF:{" "}
                            {card.easeFactor.toFixed(1)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {card.nextReview <= new Date() && (
                            <span className="rounded-full bg-[var(--warning)]/10 px-2 py-0.5 text-xs font-medium text-[var(--warning)]">
                              Pendiente
                            </span>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-[var(--muted-foreground)] hover:text-[var(--destructive)]"
                            onClick={() => removeCard(card.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
