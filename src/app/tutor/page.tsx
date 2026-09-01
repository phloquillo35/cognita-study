"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Brain,
  User,
  Sparkles,
  ArrowLeft,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useStudySessionStore } from "@/stores/studySessionStore";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content: `¡Hola! Soy tu tutor de **Cognita Study** 🧠

Puedo ayudarte con:
• **Matemática** — Cálculo, álgebra, estadística, ecuaciones diferenciales
• **Física** — Mecánica, electromagnetismo, termodinámica
• **Programación** — Algoritmos, estructuras de datos, paradigmas
• **Sistemas** — Redes, bases de datos, ingeniería de software

¿En qué materia necesitas ayuda hoy?`,
};

export default function TutorPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-[var(--background)]">
          <Sparkles className="h-8 w-8 animate-spin text-[var(--primary)]" />
        </div>
      }
    >
      <TutorChat />
    </Suspense>
  );
}

function TutorChat() {
  const searchParams = useSearchParams();
  const subjectId = searchParams.get("subject");
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const logSession = useStudySessionStore((state) => state.logSession);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };
    logSession(0, 1, 0);

    const assistantId = (Date.now() + 1).toString();

    setMessages((prev) => [
      ...prev,
      userMessage,
      { id: assistantId, role: "assistant", content: "" },
    ]);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const history = [...messages, userMessage].slice(1).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history, subjectId: subjectId || undefined }),
      });

      if (!res.ok) {
        let detail = "Error al conectarse con el tutor.";
        try {
          const data = await res.json();
          if (data?.error) detail = data.error;
        } catch {
          /* not json */
        }
        throw new Error(detail);
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        const text = await res.text();
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: text } : m
          )
        );
      } else {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, content: m.content + chunk } : m
            )
          );
        }
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al conectar con el tutor."
      );
      setMessages((prev) => prev.filter((m) => m.id !== assistantId));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-screen flex-col bg-[var(--background)]">
      {/* Header */}
      <header className="flex items-center gap-4 border-b border-[var(--border)] bg-[var(--background)]/80 px-4 py-3 backdrop-blur-xl">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)]/10">
            <Brain className="h-5 w-5 text-[var(--primary)]" />
          </div>
          <div>
            <h1 className="font-semibold">Tutor IA Socrático</h1>
            <p className="text-xs text-[var(--muted-foreground)]">
              Modo guía — te ayudo a llegar a la respuesta
            </p>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <BookOpen className="h-4 w-4 mr-2" />
            Historial
          </Button>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-3xl space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-3 ${
                  message.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    message.role === "user"
                      ? "bg-[var(--secondary)]"
                      : "bg-[var(--primary)]"
                  }`}
                >
                  {message.role === "user" ? (
                    <User className="h-4 w-4 text-[var(--muted-foreground)]" />
                  ) : (
                    <Sparkles className="h-4 w-4 text-white" />
                  )}
                </div>
                <Card
                  className={`max-w-[80%] p-4 ${
                    message.role === "user"
                      ? "bg-[var(--primary)] text-white"
                      : ""
                  }`}
                >
                  {message.content === "" && isLoading ? (
                    <div className="flex gap-1">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-[var(--muted-foreground)]" style={{ animationDelay: "0ms" }} />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-[var(--muted-foreground)]" style={{ animationDelay: "150ms" }} />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-[var(--muted-foreground)]" style={{ animationDelay: "300ms" }} />
                    </div>
                  ) : (
                    <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                      {message.content.split("**").map((part, i) =>
                        i % 2 === 1 ? (
                          <strong key={i}>{part}</strong>
                        ) : (
                          <span key={i}>{part}</span>
                        )
                      )}
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-xl bg-[var(--destructive)]/10 p-3 text-sm text-[var(--destructive)]"
            >
              {error}
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-[var(--border)] bg-[var(--background)] p-4">
        <div className="mx-auto max-w-3xl">
          <div className="flex gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribí tu pregunta... (Shift+Enter para nueva línea)"
              className="flex-1 resize-none rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
              rows={1}
              disabled={isLoading}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              size="icon"
              className="shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="mt-2 text-center text-xs text-[var(--muted-foreground)]">
            Tutor Socrático — guía el aprendizaje con preguntas, no da respuestas directas
          </p>
        </div>
      </div>
    </div>
  );
}