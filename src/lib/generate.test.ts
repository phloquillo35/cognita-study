import { describe, it, expect } from "vitest";
import {
  buildGenerationPrompt,
  parseGenerated,
  mockFlashcards,
  mockQuiz,
} from "./generate";

describe("buildGenerationPrompt", () => {
  it("includes subject and material for flashcards", () => {
    const p = buildGenerationPrompt({
      text: "contenido",
      subject: "Álgebra",
      mode: "flashcards",
    });
    expect(p).toContain("Álgebra");
    expect(p).toContain("contenido");
    expect(p).toContain("flashcards");
    expect(p).toContain("[");
  });

  it("requests 4-option quizzes for quiz mode", () => {
    const p = buildGenerationPrompt({
      text: "x",
      subject: "Física I",
      mode: "quiz",
    });
    expect(p).toContain("opción múltiple");
    expect(p).toContain("correctIndex");
  });
});

describe("parseGenerated", () => {
  it("parses a flashcards array", () => {
    const raw = '[{"front":"¿Qué es?", "back":"es esto"}]';
    const r = parseGenerated(raw);
    expect(r.flashcards).toHaveLength(1);
    expect(r.flashcards[0]).toEqual({ front: "¿Qué es?", back: "es esto" });
    expect(r.quizzes).toHaveLength(0);
  });

  it("parses a quizzes array with options/correctIndex", () => {
    const raw = JSON.stringify([
      {
        question: "1+1?",
        options: ["1", "2", "3", "4"],
        correctIndex: 1,
        explanation: "dos",
      },
    ]);
    const r = parseGenerated(raw);
    expect(r.quizzes).toHaveLength(1);
    expect(r.quizzes[0].correctIndex).toBe(1);
    expect(r.quizzes[0].options).toHaveLength(4);
  });

  it("strips markdown code fences", () => {
    const raw = '```json\n[{"front":"a","back":"b"}]\n```';
    const r = parseGenerated(raw);
    expect(r.flashcards).toHaveLength(1);
  });

  it("clamps correctIndex into range", () => {
    const raw = JSON.stringify([
      { question: "q", options: ["a", "b"], correctIndex: 9 },
    ]);
    const r = parseGenerated(raw);
    expect(r.quizzes[0].correctIndex).toBe(1);
  });

  it("throws on non-JSON input", () => {
    expect(() => parseGenerated("esto no es json")).toThrow();
  });

  it("ignores malformed entries", () => {
    const raw = JSON.stringify([
      { front: "ok", back: "si" },
      { nope: true },
      { question: "q", options: ["a", "b"], correctIndex: 0 },
    ]);
    const r = parseGenerated(raw);
    expect(r.flashcards).toHaveLength(1);
    expect(r.quizzes).toHaveLength(1);
  });
});

describe("mock generators", () => {
  it("mockFlashcards returns at least one card", () => {
    expect(mockFlashcards("texto de más de veinticinco caracteres de largo aquí").length).toBeGreaterThan(0);
  });
  it("mockQuiz returns a single quiz with 4 options", () => {
    const q = mockQuiz("x");
    expect(q).toHaveLength(1);
    expect(q[0].options).toHaveLength(4);
  });
});
