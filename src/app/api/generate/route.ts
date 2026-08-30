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
import { getRagContext } from "@/lib/rag";
import { isRateLimited } from "@/lib/rateLimit";

const MAX_CHARS = 20000;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, subject, mode, ragQuery, rag, ragContext } = body as {
      text: string;
      subject?: string;
      mode?: string;
      ragQuery?: string;
      rag?: boolean;
      ragContext?: string;
    };
    const urlRag = request.nextUrl.searchParams.get("rag") === "true";

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip")?.trim() ||
      "127.0.0.1";
    if (await isRateLimited(ip, "generate", 10, 60_000)) {
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

    // RAG injection — prepend context to text if requested
    let ragContextStr = "";
    if (typeof ragContext === "string" && ragContext.trim()) {
      ragContextStr = ragContext.trim().slice(0, 4000);
    } else if (typeof ragQuery === "string" && ragQuery.trim()) {
      ragContextStr = getRagContext(ragQuery.trim(), subject);
    } else if (rag === true || urlRag) {
      ragContextStr = getRagContext(text.slice(0, 300), subject);
    }
    const augmentedText = ragContextStr
      ? `Contexto RAG (material del estudiante):\n${ragContextStr}\n\n---\n\nMaterial base:\n${text}`
      : text;

    const fallback = () =>
      m === "flashcards"
        ? { flashcards: mockFlashcards(augmentedText) }
        : { quizzes: mockQuiz(augmentedText) };

    if (process.env.OPENAI_API_KEY) {
      const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });
      try {
        const result = await generateText({
          model: openai("gpt-4o-mini"),
          prompt: buildGenerationPrompt({ text: augmentedText, subject: subjectName, mode: m }),
          maxOutputTokens: 2000,
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
