"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  Plus,
  Target,
  Trash2,
  BookOpen,
  Flame,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import { getAllSubjects, getSubjectById } from "@/data/curriculum";
import {
  useStudyPlanStore,
  createSmartPlan,
  type SubjectPlan,
  type TopicPlan,
} from "@/stores/studyPlanStore";
import {
  format,
  differenceInDays,
  isToday,
  isBefore,
  addDays,
  isSameDay,
} from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";

const ALL_SUBJECTS = getAllSubjects();

function getSubjectMap() {
  return Object.fromEntries(ALL_SUBJECTS.map((s) => [s.id, s]));
}

function getTopicName(subjectId: string, topicId: string): string {
  const subject = getSubjectById(subjectId);
  if (!subject) return topicId;
  const topic = subject.topics.find((t) => t.id === topicId);
  return topic?.name ?? topicId;
}

function getTopicDifficulty(subjectId: string, topicId: string): number {
  const subject = getSubjectById(subjectId);
  return subject?.topics.find((t) => t.id === topicId)?.difficulty ?? 3;
}

const DIFFICULTY_LABELS: Record<number, string> = {
  1: "Fácil",
  2: "Medio",
  3: "Normal",
  4: "Difícil",
  5: "Muy difícil",
};

function TodayTasksSection() {
  const { studyPlans, toggleTopicComplete } = useStudyPlanStore();
  const subjectMap = useMemo(() => getSubjectMap(), []);

  const todayTopics: { plan: SubjectPlan; topic: TopicPlan }[] = [];

  for (const plan of studyPlans) {
    for (const topic of plan.topics) {
      if (
        isSameDay(new Date(topic.scheduledDate), new Date()) &&
        !topic.completed
      ) {
        todayTopics.push({ plan, topic });
      }
    }
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--warning)]/10">
          <Flame className="h-4 w-4 text-[var(--warning)]" />
        </div>
        <h2 className="text-lg font-bold text-[var(--foreground)]">
          Tareas de Hoy
        </h2>
        <span className="rounded-full bg-[var(--warning)]/10 px-2 py-0.5 text-xs font-medium text-[var(--warning)]">
          {format(new Date(), "d 'de' MMMM", { locale: es })}
        </span>
      </div>

      {todayTopics.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex items-center justify-center gap-3 p-8">
            <CheckCircle2 className="h-5 w-5 text-[var(--success)]" />
            <p className="text-sm text-[var(--muted-foreground)]">
              No hay tareas programadas para hoy. ¡A disfrutar el día!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {todayTopics.map(({ plan, topic }, index) => (
            <motion.div
              key={`${plan.subjectId}-${topic.topicId}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="transition-all hover:border-[var(--primary)]/30">
                <CardContent className="flex items-center gap-4 p-4">
                  <button
                    onClick={() =>
                      toggleTopicComplete(plan.subjectId, topic.topicId)
                    }
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-[var(--border)] transition-colors hover:border-[var(--primary)]"
                  >
                    {topic.completed && (
                      <CheckCircle2 className="h-4 w-4 text-[var(--success)]" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--foreground)]">
                      {getTopicName(plan.subjectId, topic.topicId)}
                    </p>
                    <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                      {subjectMap[plan.subjectId]?.name ?? plan.subjectId}
                      <span className="mx-1.5">·</span>
                      <span
                        className={
                          getTopicDifficulty(plan.subjectId, topic.topicId) <= 2
                            ? "text-[var(--success)]"
                            : getTopicDifficulty(plan.subjectId, topic.topicId) >= 4
                              ? "text-[var(--destructive)]"
                              : "text-[var(--muted-foreground)]"
                        }
                      >
                        {DIFFICULTY_LABELS[
                          getTopicDifficulty(plan.subjectId, topic.topicId)
                        ] ?? "Normal"}
                      </span>
                    </p>
                  </div>
                  <Clock className="h-4 w-4 shrink-0 text-[var(--muted-foreground)]" />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </motion.section>
  );
}

function PlanCard({
  plan,
  onSelect,
  isSelected,
}: {
  plan: SubjectPlan;
  onSelect: () => void;
  isSelected: boolean;
}) {
  const { removePlan } = useStudyPlanStore();
  const subjectMap = useMemo(() => getSubjectMap(), []);
  const subject = subjectMap[plan.subjectId];
  const daysRemaining = differenceInDays(
    new Date(plan.targetDate),
    new Date()
  );
  const completedCount = plan.topics.filter((t) => t.completed).length;
  const totalCount = plan.topics.length;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <Card
        className={`cursor-pointer transition-all ${
          isSelected
            ? "border-[var(--primary)]/50 shadow-md"
            : "hover:border-[var(--primary)]/30"
        }`}
        onClick={onSelect}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base">{subject?.name ?? plan.subjectId}</CardTitle>
              <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                {subject?.code}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 text-[var(--muted-foreground)] hover:text-[var(--destructive)]"
              onClick={(e) => {
                e.stopPropagation();
                removePlan(plan.subjectId);
              }}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[var(--muted-foreground)]">
                {completedCount} / {totalCount} temas
              </span>
              <span className="font-medium text-[var(--foreground)]">
                {percentage}%
              </span>
            </div>
            <Progress value={percentage} className="h-2" />
          </div>

          <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)]">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span>
                {format(new Date(plan.targetDate), "d MMM", { locale: es })}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span>{plan.dailyMinutes} min/día</span>
            </div>
            <span
              className={`font-medium ${
                daysRemaining < 0
                  ? "text-[var(--destructive)]"
                  : daysRemaining <= 3
                    ? "text-[var(--warning)]"
                    : "text-[var(--success)]"
              }`}
            >
              {daysRemaining < 0
                ? `${Math.abs(daysRemaining)}d vencido`
                : daysRemaining === 0
                  ? "Hoy"
                  : `${daysRemaining}d restantes`}
            </span>
          </div>

          {plan.completed && (
            <div className="flex items-center gap-1.5 rounded-lg bg-[var(--success)]/10 px-3 py-1.5 text-xs font-medium text-[var(--success)]">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Completado
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

function PlanTimeline({ plan }: { plan: SubjectPlan }) {
  const { toggleTopicComplete } = useStudyPlanStore();

  const groupedByDate = useMemo(() => {
    const map = new Map<string, TopicPlan[]>();
    for (const topic of plan.topics) {
      const dateKey = format(new Date(topic.scheduledDate), "yyyy-MM-dd");
      if (!map.has(dateKey)) map.set(dateKey, []);
      map.get(dateKey)!.push(topic);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [plan.topics]);

  return (
    <div className="relative ml-4 border-l-2 border-[var(--border)] pl-6">
      {groupedByDate.map(([dateKey, topics], groupIndex) => {
        const date = new Date(dateKey + "T00:00:00");
        const isTodayDate = isToday(date);
        const isPast = isBefore(date, new Date()) && !isTodayDate;

        return (
          <motion.div
            key={dateKey}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: groupIndex * 0.05 }}
            className="relative mb-6 last:mb-0"
          >
            <div
              className={`absolute -left-[31px] top-0 h-4 w-4 rounded-full border-2 ${
                isTodayDate
                  ? "border-[var(--primary)] bg-[var(--primary)]"
                  : isPast
                    ? "border-[var(--muted-foreground)] bg-[var(--muted-foreground)]"
                    : "border-[var(--border)] bg-[var(--background)]"
              }`}
            />

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm font-semibold ${
                    isTodayDate
                      ? "text-[var(--primary)]"
                      : isPast
                        ? "text-[var(--muted-foreground)]"
                        : "text-[var(--foreground)]"
                  }`}
                >
                  {isTodayDate
                    ? "Hoy"
                    : format(date, "EEEE d 'de' MMMM", { locale: es })}
                </span>
                {isTodayDate && (
                  <span className="rounded-full bg-[var(--primary)]/10 px-2 py-0.5 text-[10px] font-medium text-[var(--primary)]">
                    HOY
                  </span>
                )}
              </div>

              <div className="space-y-1.5">
                {topics.map((topic) => (
                  <div
                    key={topic.topicId}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors ${
                      topic.completed
                        ? "bg-[var(--success)]/5"
                        : "bg-[var(--card)]"
                    }`}
                  >
                    <button
                      onClick={() =>
                        toggleTopicComplete(plan.subjectId, topic.topicId)
                      }
                      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors"
                      style={{
                        borderColor: topic.completed
                          ? "var(--success)"
                          : "var(--border)",
                        backgroundColor: topic.completed
                          ? "var(--success)"
                          : "transparent",
                      }}
                    >
                      {topic.completed && (
                        <CheckCircle2 className="h-3 w-3 text-white" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm ${
                          topic.completed
                            ? "text-[var(--muted-foreground)] line-through"
                            : "text-[var(--foreground)]"
                        }`}
                      >
                        {getTopicName(plan.subjectId, topic.topicId)}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        getTopicDifficulty(plan.subjectId, topic.topicId) <= 2
                          ? "bg-[var(--success)]/10 text-[var(--success)]"
                          : getTopicDifficulty(plan.subjectId, topic.topicId) >= 4
                            ? "bg-[var(--destructive)]/10 text-[var(--destructive)]"
                            : "bg-[var(--secondary)] text-[var(--muted-foreground)]"
                      }`}
                    >
                      {DIFFICULTY_LABELS[
                        getTopicDifficulty(plan.subjectId, topic.topicId)
                      ] ?? "Normal"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

function AddPlanDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { studyPlans, addPlan } = useStudyPlanStore();
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [targetDate, setTargetDate] = useState(() => {
    const d = addDays(new Date(), 30);
    return format(d, "yyyy-MM-dd");
  });
  const [dailyMinutes, setDailyMinutes] = useState(60);

  const availableSubjects = useMemo(() => {
    const existingIds = new Set(studyPlans.map((p) => p.subjectId));
    return ALL_SUBJECTS.filter((s) => !existingIds.has(s.id));
  }, [studyPlans]);

  const selectedSubject = useMemo(
    () => ALL_SUBJECTS.find((s) => s.id === selectedSubjectId),
    [selectedSubjectId]
  );

  const handleCreate = () => {
    if (!selectedSubject || !targetDate) return;

    const topicDurations: Record<string, number> = {};
    for (const t of selectedSubject.topics) {
      topicDurations[t.id] = t.estimatedMinutes;
    }

    const plan = createSmartPlan(
      selectedSubject.id,
      selectedSubject.topics.map((t) => t.id),
      topicDurations,
      new Date(targetDate),
      dailyMinutes
    );

    addPlan(plan);
    setSelectedSubjectId("");
    onClose();
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-[var(--primary)]" />
                Nuevo Plan de Estudio
              </CardTitle>
              <p className="text-sm text-[var(--muted-foreground)]">
                Seleccioná una materia y configurá tu plan personalizado
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">
                  Materia
                </label>
                <div className="relative">
                  <select
                    value={selectedSubjectId}
                    onChange={(e) => setSelectedSubjectId(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 pr-10 text-sm text-[var(--foreground)] transition-colors hover:border-[var(--primary)]/50 focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]/20"
                  >
                    <option value="">Seleccionar materia...</option>
                    {availableSubjects.map((subject) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name} ({subject.topics.length} temas)
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
                </div>
              </div>

              {selectedSubject && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="rounded-xl bg-[var(--secondary)]/50 p-3 text-sm"
                >
                  <p className="font-medium text-[var(--foreground)]">
                    {selectedSubject.topics.length} temas ·{" "}
                    {Math.round(
                      selectedSubject.topics.reduce(
                        (acc, t) => acc + t.estimatedMinutes,
                        0
                      ) / 60
                    )}{" "}
                    horas estimadas
                  </p>
                  <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                    {selectedSubject.description}
                  </p>
                </motion.div>
              )}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">
                  Fecha objetivo
                </label>
                <div className="relative">
                  <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    min={format(new Date(), "yyyy-MM-dd")}
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] py-2.5 pl-10 pr-4 text-sm text-[var(--foreground)] transition-colors hover:border-[var(--primary)]/50 focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]/20"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">
                  Minutos de estudio por día
                </label>
                <div className="relative">
                  <Clock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
                  <input
                    type="number"
                    value={dailyMinutes}
                    onChange={(e) =>
                      setDailyMinutes(Math.max(15, Number(e.target.value)))
                    }
                    min={15}
                    step={15}
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] py-2.5 pl-10 pr-4 text-sm text-[var(--foreground)] transition-colors hover:border-[var(--primary)]/50 focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]/20"
                  />
                </div>
                <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                  Los temas se distribuirán automáticamente entre los días
                  disponibles
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="ghost" onClick={onClose}>
                  Cancelar
                </Button>
                <Button
                  onClick={handleCreate}
                  disabled={!selectedSubjectId || !targetDate}
                >
                  <Target className="h-4 w-4 mr-1" />
                  Crear Plan
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function StudyPlanPage() {
  const { studyPlans, getOverallProgress } = useStudyPlanStore();
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);

  const overallProgress = getOverallProgress();
  const selectedPlan = studyPlans.find((p) => p.subjectId === selectedPlanId);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-bold">Plan de Estudio</h1>
            <p className="text-xs text-[var(--muted-foreground)]">
              Organizá tu cursada con planes adaptativos
            </p>
          </div>
          {studyPlans.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
              <Target className="h-4 w-4" />
              <span>{overallProgress.percentage}%</span>
            </div>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--primary)]/10">
            <BookOpen className="h-8 w-8 text-[var(--primary)]" />
          </div>
          <h1 className="mb-2 text-3xl font-bold text-[var(--foreground)]">
            Plan de Estudio
          </h1>
          <p className="text-[var(--muted-foreground)]">
            Distribuí tus temas inteligentemente hasta el día del parcial
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Left column: Today + Plans list */}
          <div className="space-y-8 lg:col-span-2">
            {/* Today's Tasks */}
            <TodayTasksSection />

            {/* Overall Progress */}
            {studyPlans.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Progreso General</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[var(--muted-foreground)]">
                          {overallProgress.completed} / {overallProgress.total}{" "}
                          temas completados
                        </span>
                        <span className="font-bold text-[var(--foreground)]">
                          {overallProgress.percentage}%
                        </span>
                      </div>
                      <Progress
                        value={overallProgress.percentage}
                        className="h-3"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Mis Planes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-[var(--foreground)]">
                  Mis Planes
                </h2>
                <Button
                  size="sm"
                  onClick={() => setShowAddDialog(true)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Nuevo Plan
                </Button>
              </div>

              {studyPlans.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="flex flex-col items-center justify-center gap-4 p-12 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--primary)]/10">
                      <Target className="h-7 w-7 text-[var(--primary)]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[var(--foreground)]">
                        Sin planes todavía
                      </h3>
                      <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                        Creá un plan para distribuir tus temas hasta el parcial
                      </p>
                    </div>
                    <Button onClick={() => setShowAddDialog(true)}>
                      <Plus className="h-4 w-4 mr-1" />
                      Crear mi primer plan
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence>
                    {studyPlans.map((plan) => (
                      <PlanCard
                        key={plan.subjectId}
                        plan={plan}
                        onSelect={() =>
                          setSelectedPlanId(
                            selectedPlanId === plan.subjectId
                              ? null
                              : plan.subjectId
                          )
                        }
                        isSelected={selectedPlanId === plan.subjectId}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          </div>

          {/* Right column: Timeline */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {selectedPlan ? (
                <motion.div
                  key={selectedPlan.subjectId}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>
                            {getSubjectById(selectedPlan.subjectId)?.name ??
                              selectedPlan.subjectId}
                          </CardTitle>
                          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                            Cronograma de estudio hasta el{" "}
                            {format(new Date(selectedPlan.targetDate), "d 'de' MMMM 'de' yyyy", {
                              locale: es,
                            })}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedPlanId(null)}
                        >
                          Cerrar
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <PlanTimeline plan={selectedPlan} />
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center gap-4 p-16 text-center">
                      <Calendar className="h-10 w-10 text-[var(--muted-foreground)]" />
                      <div>
                        <h3 className="font-semibold text-[var(--foreground)]">
                          Seleccioná un plan
                        </h3>
                        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                          Elegí una materia para ver su cronograma de estudio
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <AddPlanDialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
      />
    </div>
  );
}
