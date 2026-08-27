"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { getAllSubjects } from "@/data/curriculum";
import {
  Send,
  Brain,
  User,
  Sparkles,
  ArrowLeft,
  RotateCcw,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
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
  timestamp: new Date(),
};

const ALL_SUBJECTS = getAllSubjects();

export default function TutorPage() {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [subjectId, setSubjectId] = useState<string>(ALL_SUBJECTS[0]?.id ?? "am1");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("cognita_tutor_messages");
      if (saved) {
        const parsed = JSON.parse(saved) as Message[];
        if (Array.isArray(parsed) && parsed.length > 0) setMessages(parsed);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    try {
      localStorage.setItem("cognita_tutor_messages", JSON.stringify(messages));
    } catch {
      // ignore
    }
  }, [messages]);

  const handleClear = () => {
    setMessages([WELCOME_MESSAGE]);
    try {
      localStorage.removeItem("cognita_tutor_messages");
    } catch {
      // ignore
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          subjectId,
        }),
      });

      if (!response.ok) {
        throw new Error("Error en la API del Tutor");
      }

      const data = await response.json();
      const assistantContent =
        data.content || "No se pudo obtener la respuesta del tutor.";

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: assistantContent,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error en la IA:", error);

      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Entiendo tu pregunta sobre "${input}". Como tutor Socrático, te guiaré con preguntas:

        1. **¿Qué concepto clave** creés que está involucrado en tu pregunta?
        2. **¿Cómo podrías acercarte** al problema paso a paso?
        3. **¿Qué información** tenés que aún no conocés?

        Intentá responderte a vos mismo primero, y yo puedo ayudarte a refinarte. ¿Por dónde empezás?`,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsTyping(false);
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
        <Link href="/" className="flex items-center gap-2">
          <ArrowLeft className="h-5 w-5" />
          <span>Volver al inicio</span>
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
            <span className="text-xs text-[var(--warning)] font-medium ml-2">Modo Demo</span>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="relative">
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              aria-label="Materia del tutor"
              className="appearance-none rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 pr-8 text-sm text-[var(--foreground)] focus:border-[var(--primary)] focus:outline-none"
            >
              {ALL_SUBJECTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <Button variant="ghost" size="sm" onClick={handleClear}>
            <RotateCcw className="h-4 w-4 mr-1" />
            Nueva conversación
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
                  <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                    {message.content.split("**").map((part, i) =>
                      i % 2 === 1 ? (
                        <strong key={i}>{part}</strong>
                      ) : (
                        <span key={i}>{part}</span>
                      )
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary)]">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <Card className="p-4">
                <div className="flex gap-1">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-[var(--muted-foreground)]" style={{ animationDelay: "0ms" }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-[var(--muted-foreground)]" style={{ animationDelay: "150ms" }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-[var(--muted-foreground)]" style={{ animationDelay: "300ms" }} />
                </div>
              </Card>
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
              placeholder="Escribí tu pregunta..."
              className="flex-1 resize-none rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
              rows={1}
              disabled={isTyping}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              size="icon"
              className="shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
<p className="mt-2 text-center text-xs text-[var(--muted-foreground)]">
      Tutor Socrático — guía el aprendizaje con preguntas, no da respuestas directas. <span className="font-medium">Escribí tu pregunta arriba y presioná Enter o clickeá el botón de envío.</span>
</p>
        </div>
      </div>
    </div>
  );
}
