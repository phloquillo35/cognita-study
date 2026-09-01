import {
  getAllSubjects,
  getSubjectById,
  CATEGORY_LABELS,
} from "@/data/curriculum";
import type { Subject } from "@/types";

export interface GeneratedExercise {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: number;
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function sample<T>(arr: T[], count: number): T[] {
  return shuffle(arr).slice(0, count);
}

function buildDistractors(
  pool: string[],
  correct: string,
  count: number
): string[] {
  const filtered = pool.filter((item) => item !== correct);
  return sample(filtered, Math.min(count, filtered.length));
}

interface BuildOptions {
  question: string;
  answer: string;
  distractors: string[];
  explanation: string;
  difficulty: number;
}

function buildMultipleChoice(
  { question, answer, distractors, explanation, difficulty }: BuildOptions,
  sortKey: string
): GeneratedExercise {
  const options = shuffle([answer, ...distractors]);
  const correctIndex = options.indexOf(answer);
  return {
    id: `gen-${sortKey}`,
    question,
    options,
    correctIndex,
    explanation,
    difficulty,
  };
}

export function generateExercises(
  subjectId: string,
  limit = 8
): GeneratedExercise[] {
  const subject = getSubjectById(subjectId);
  if (!subject) return [];

  const allSubjects = getAllSubjects();
  const others = allSubjects.filter((s) => s.id !== subjectId);
  const othersTopics = others.flatMap((s) => s.topics.map((t) => t.name));
  const othersConcepts = others.flatMap((s) => s.keyConcepts);
  const othersObjectives = others.flatMap((s) => s.objectives);

  const exercises: GeneratedExercise[] = [];
  const subjectTopics = subject.topics.map((t) => t.name);
  const subjectConcepts = subject.keyConcepts;

  subjectTopics.forEach((topic, idx) => {
    exercises.push(
      buildMultipleChoice(
        {
          question: `¿Cuál de los siguientes temas se estudia en ${subject.name}?`,
          answer: topic,
          distractors: buildDistractors(othersTopics, topic, 3),
          explanation: `${topic} forma parte del temario oficial de ${subject.name} (${subject.topics[idx]?.difficulty ?? 2}/5 de dificultad). ${subject.topics[idx]?.description ?? ""}`,
          difficulty: 1,
        },
        `${subject.id}-topic-${idx}`
      )
    );
  });

  subjectConcepts.forEach((concept, idx) => {
    exercises.push(
      buildMultipleChoice(
        {
          question: `¿Cuál es un concepto clave que se desarrolla en ${subject.name}?`,
          answer: concept,
          distractors: buildDistractors(othersConcepts, concept, 3),
          explanation: `"${concept}" es uno de los conceptos núcleo del programa oficial de ${subject.name}.`,
          difficulty: 2,
        },
        `${subject.id}-concept-${idx}`
      )
    );
  });

  subject.objectives.forEach((objective, idx) => {
    exercises.push(
      buildMultipleChoice(
        {
          question: `Según el programa oficial, ¿cuál de estos es un objetivo de aprendizaje de ${subject.name}?`,
          answer: objective,
          distractors: buildDistractors(othersObjectives, objective, 3),
          explanation: `Es un objetivo declarado en el programa de la asignatura ${subject.name} (${subject.code}).`,
          difficulty: 2,
        },
        `${subject.id}-obj-${idx}`
      )
    );
  });

  const creditsAnswer = `${subject.credits} créditos`;
  exercises.push(
    buildMultipleChoice(
      {
        question: `¿Cuántos créditos otorga ${subject.name}?`,
        answer: creditsAnswer,
        distractors: buildDistractors(
          [
            ...new Set(
              others.map((s) => `${s.credits} créditos`)
            ),
          ],
          creditsAnswer,
          3
        ),
        explanation: `${subject.name} otorga ${subject.credits} créditos dentro de la Licenciatura en Sistemas de Información (Plan 2023).`,
        difficulty: 1,
      },
      `${subject.id}-credits`
    )
  );

  const hoursAnswer = `${subject.hoursPerWeek} hs/semana`;
  exercises.push(
    buildMultipleChoice(
      {
        question: `¿Cuántas horas semanales destina el plan oficial a ${subject.name}?`,
        answer: hoursAnswer,
        distractors: buildDistractors(
          [...new Set(others.map((s) => `${s.hoursPerWeek} hs/semana`))],
          hoursAnswer,
          3
        ),
        explanation: `El plan de estudios asigna ${subject.hoursPerWeek} horas semanales a ${subject.name} (${subject.totalHours} hs totales).`,
        difficulty: 1,
      },
      `${subject.id}-hours`
    )
  );

  const catLabel = CATEGORY_LABELS[subject.category];
  exercises.push(
    buildMultipleChoice(
      {
        question: `¿A qué categoría pertenece ${subject.name}?`,
        answer: catLabel,
        distractors: buildDistractors(
          Object.values(CATEGORY_LABELS),
          catLabel,
          Object.values(CATEGORY_LABELS).length - 1
        ),
        explanation: `${subject.name} se clasifica dentro de ${catLabel.toLowerCase()}.`,
        difficulty: 1,
      },
      `${subject.id}-category`
    )
  );

  subject.partialExamples.forEach((example, idx) => {
    exercises.push(
      buildMultipleChoice(
        {
          question: `Tipo parcial: ${example.topic} — ${example.question}`,
          answer: example.solution,
          distractors: buildDistractors(
            othersTopics.length >= 3 ? othersTopics : othersConcepts,
            example.solution,
            3
          ),
          explanation: `Resolución: ${example.solution}`,
          difficulty: example.difficulty,
        },
        `${subject.id}-partial-${idx}`
      )
    );
  });

  return sample(exercises, Math.min(limit, exercises.length)).sort((a, b) =>
    a.difficulty - b.difficulty
  );
}

export function getSubjectsForPractice(): Subject[] {
  return getAllSubjects();
}