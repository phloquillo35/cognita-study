import { NextRequest } from "next/server";
import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import {
  buildGenerationPrompt,
  parseGenerated,
  mockFlashcards,
  mockQuiz,
  type GenerationMode,
} from "@/lib/generate";

const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60_000;
const MAX_CHARS = 20000;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > RATE_LIMIT;
}

export async function POST(request: NextRequest) {
  try {
    const { text, subject, mode } = await request.json();

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    if (isRateLimited(ip)) {
      return new Response(
        JSON.stringify({ error: "Too many requests, try again later" }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!text || typeof text !== "string") {
      return new Response(JSON.stringify({ error: "Text is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    if (text.length > MAX_CHARS) {
      return new Response(
        JSON.stringify({ error: "Content exceeds size limit" }),
        { status: 413, headers: { "Content-Type": "application/json" } }
      );
    }

    const m: GenerationMode = mode === "quiz" ? "quiz" : "flashcards";
    const subjectName = typeof subject === "string" && subject ? subject : "General";

    const fallback = () =>
      m === "flashcards"
        ? { flashcards: mockFlashcards(text) }
        : { quizzes: mockQuiz(text) };

    if (process.env.OPENAI_API_KEY) {
      const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });
      try {
        const result = await generateText({
          model: openai("gpt-4o-mini"),
          system: buildGenerationPrompt({ text, subject: subjectName, mode: m }),
          maxTokens: 2000,
          temperature: 0.7,
        });
        const parsed = parseGenerated(result.text);
        if (m === "flashcards" ? parsed.flashcards.length === 0 : parsed.quizzes.length === 0) {
          return new Response(JSON.stringify(fallback()), {
            headers: { "Content-Type": "application/json" },
          });
        }
        return new Response(JSON.stringify(parsed), {
          headers: { "Content-Type": "application/json" },
        });
      } catch {
        return new Response(JSON.stringify(fallback()), {
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    return new Response(JSON.stringify(fallback()), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("generate API error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
