// Lógica pura para la generación de flashcards/quizzes a partir de material.
// Compartido entre la API route y (potencialmente) tests.

export interface GeneratedFlashcard {
  front: string;
  back: string;
}

export interface GeneratedQuiz {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export type GenerationMode = "flashcards" | "quiz";

export interface GenerationInput {
  text: string;
  subject: string;
  mode: GenerationMode;
}

export function buildGenerationPrompt(input: GenerationInput): string {
  const base = `Eres un asistente pedagógico de Cognita Study para estudiantes de Ingeniería en Sistemas (UTN Tucumán, Argentina).
Materia: ${input.subject}.
A partir del material de estudio, genera contenido en español, preciso y conciso. Usá LaTeX con $...$ para fórmulas matemáticas cuando corresponda.
MATERIAL:
"""
${input.text}
"""`;

  if (input.mode === "flashcards") {
    return (
      base +
      `\n\nGenerá hasta 12 flashcards (pregunta/respuesta) que fomenten el active recall (recuperación activa), no resúmenes pasivos.
Respondé ÚNICAMENTE con un arreglo JSON (sin markdown, sin texto extra):
[{"front":"...","back":"..."}]`
    );
  }

  return (
    base +
    `\n\nGenerá hasta 8 preguntas de opción múltiple (exactamente 4 opciones) que evalúen comprensión profunda, no memorización superficial.
Respondé ÚNICAMENTE con un arreglo JSON (sin markdown, sin texto extra):
[{"question":"...","options":["a","b","c","d"],"correctIndex":0,"explanation":"..."}]`
  );
}

export function parseGenerated(raw: string): {
  flashcards: GeneratedFlashcard[];
  quizzes: GeneratedQuiz[];
} {
  let cleaned = raw.trim();
  const fence = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence) cleaned = fence[1].trim();

  const start = cleaned.indexOf("[");
  const end = cleaned.lastIndexOf("]");
  if (start === -1 || end === -1) throw new Error("No se encontró un arreglo JSON");
  const arr = JSON.parse(cleaned.slice(start, end + 1));
  if (!Array.isArray(arr)) throw new Error("Formato inesperado");

  const flashcards = arr
    .filter((x) => x && typeof x.front === "string" && typeof x.back === "string")
    .map((x) => ({ front: String(x.front), back: String(x.back) }));

  const quizzes = arr
    .filter(
      (x) =>
        x &&
        typeof x.question === "string" &&
        Array.isArray(x.options) &&
        x.options.length >= 2 &&
        typeof x.correctIndex === "number"
    )
    .map((x) => ({
      question: String(x.question),
      options: x.options.map(String),
      correctIndex: Math.min(Math.max(Number(x.correctIndex), 0), x.options.length - 1),
      explanation: typeof x.explanation === "string" ? x.explanation : "",
    }));

  if (flashcards.length > 0 && quizzes.length === 0) return { flashcards, quizzes: [] };
  if (quizzes.length > 0 && flashcards.length === 0) return { flashcards: [], quizzes };
  return { flashcards, quizzes };
}

function splitSentences(text: string): string[] {
  return text
    .split(/\n+|(?<=\.)\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 25);
}

export function mockFlashcards(text: string): GeneratedFlashcard[] {
  const parts = splitSentences(text).slice(0, 8);
  if (parts.length === 0) {
    return [
      {
        front: "Concepto clave del material",
        back: text.slice(0, 240) || "Sin contenido para procesar.",
      },
    ];
  }
  return parts.map((p) => ({
    front: `¿Qué afirma este concepto? ${p.slice(0, 45).trim()}…`,
    back: p,
  }));
}

export function mockQuiz(text: string): GeneratedQuiz[] {
  return [
    {
      question: "Según el material provisto, ¿cuál es la idea principal?",
      options: [
        "La síntesis del material (respuesta generada en modo demo)",
        "Opción distractora A",
        "Opción distractora B",
        "Opción distractora C",
      ],
      correctIndex: 0,
      explanation:
        "Modo demo: conectá OPENAI_API_KEY para generar preguntas reales basadas en tu material.",
    },
  ];
}
