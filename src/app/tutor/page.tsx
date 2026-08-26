"use client";

import { useState, useRef, useEffect } from "react";
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

const SAMPLE_RESPONSES: Record<string, string> = {
  default: `Entiendo tu pregunta. Como tutor Socrático, voy a guiarte paso a paso:

1. **Identifiquemos** el concepto clave
2. **Construyamos** el razonamiento juntos
3. **Resolvamos** el problema

¿Podrías contarme qué ya sabés sobre este tema? Así puedo adaptar mi explicación a tu nivel.`,
  matematica: `¡Excelente elección! La matemática es fundamental para la ingeniería.

Para ayudarte mejor, necesito que me digas:
• **¿Qué tema específico?** (ej: derivadas, integrales, matrices)
• **¿Qué nivel?** (ej: estoy aprendiendo, necesito repasar, o quiero ejercicios difíciles)
• **¿Tenés algún ejercicio concreto?**

Mientras tanto, recordá que en Cognita Study puedo:
✅ Explicarte conceptos con ejemplos
✅ Guiarte paso a paso en ejercicios
✅ Verificar tus respuestas con motor matemático
✅ Generar ejercicios adaptativos`,
  fisica: `La física es apasionante y muy aplicada a la ingeniería.

Contame:
• **¿Qué rama?** (Mecánica, Electromagnetismo, Termodinámica)
• **¿Qué tipo de problema?** (Conceptual, matemático, de aplicación)
• **¿Hay algún ejercicio específico que necesites resolver?**

Puedo ayudarte con:
📐 Explicaciones con diagrams
📊 Resolución paso a paso
🔬 Conexiones con el mundo real
📝 Ejercicios personalizados`,
};

export default function TutorPage() {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response (will be replaced with real API)
    setTimeout(() => {
      const lowerInput = input.toLowerCase();
      let response = SAMPLE_RESPONSES.default;

      if (lowerInput.includes("matem") || lowerInput.includes("calculo") || lowerInput.includes("algebra")) {
        response = SAMPLE_RESPONSES.matematica;
      } else if (lowerInput.includes("física") || lowerInput.includes("fisica") || lowerInput.includes("mecánica")) {
        response = SAMPLE_RESPONSES.fisica;
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
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
              placeholder="Escribí tu pregunta... (Shift+Enter para nueva línea)"
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
            Tutor Socrático — guía el aprendizaje con preguntas, no da respuestas directas
          </p>
        </div>
      </div>
    </div>
  );
}
