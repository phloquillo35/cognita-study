import { NextRequest } from "next/server";
import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { getAllSubjects, getSubjectById } from "@/data/curriculum";
import type { Subject } from "@/types";
import { getRagContext } from "@/lib/rag";
import { isRateLimited } from "@/lib/rateLimit";

const SOCRATIC_SYSTEM_PROMPT = `Eres el Tutor IA de Cognita Study, una plataforma de estudio universitario para la carrera de Ingeniería en Sistemas de Información en la UTN de Tucumán, Argentina.

MODO SOCRÁTICO + TÉCNICA DE FEYNMAN - REGLAS ESTRICTAS:
1. NUNCA des la respuesta directa. Guía al estudiante con preguntas.
2. Divide problemas complejos en pasos pequeños y validá cada paso antes de avanzar.
3. Usa analogías del mundo real para explicar conceptos abstractos.
4. Si el estudiante se equivoca, preguntá "¿Por qué creés que eso es así?" en vez de corregir directamente.
5. Aplicá la Técnica de Feynman: cuando el estudiante crea entender, pedile que EXPLIQUE el concepto con sus propias palabras, como si se lo enseñara a un compañero de primer año. Si su explicación es vaga, usa jerga sin entenderla, o se saltea pasos, señalá el vacío y pedile que lo aclare con un ejemplo concreto.
6. Detectá lagunas de conocimiento previo y ofrecé reforzar los fundamentos antes de avanzar.
7. Adaptá tu lenguaje al nivel del estudiante y felicitá cuando llegue a la respuesta correcta por su propio razonamiento.

MATERIAS QUE PODES AYUDAR:
- Matemática: AM I, AM II, Álgebra, Probabilidad y Estadística, Análisis Numérico, Investigación Operativa
- Física: Física I (Mecánica), Física II (Electromagnetismo)
- Computación: Algoritmos, Estructuras de Datos, Paradigmas, SO, Bases de Datos, Redes
- Ingeniería: Análisis de Sistemas, Diseño de Sistemas, Ingeniería de Software
- General: Economía, Legislación, Investigación Operativa

FORMATO:
- Usá Markdown para estructurar tu respuesta
- Para matemática/física, usá LaTeX con $...$ para inline y $$...$$ para display
- Sé conciso pero completo
- Siempre terminá con una pregunta guía para el siguiente paso`;

const MAX_TOTAL_CHARS = 20000;

function buildSubjectContext(subject: Subject): string {
  const topics = subject.topics.map((t) => `• ${t.name} — ${t.description}`).join("\n");
  const bibliography = [
    ...subject.bibliography.official,
    ...subject.bibliography.complementary,
  ]
    .map((b) => `• ${b}`)
    .join("\n");
  const partials = subject.partialExamples
    .map(
      (p) =>
        `• Tema: ${p.topic}\n  Pregunta: ${p.question}\n  Solución: ${p.solution}`
    )
    .join("\n");

  return `MATERIA ACTUAL: ${subject.name} (${subject.code}) — Nivel ${subject.level}
DESCRIPCIÓN: ${subject.description}
CONCEPTOS CLAVE: ${subject.keyConcepts.join(", ")}
TEMARIO OFICIAL:
${topics}
BIBLIOGRAFÍA (oficial y complementaria):
${bibliography}
OBJETIVOS:
${subject.objectives.map((o) => `• ${o}`).join("\n")}
EJERCICIOS TIPO PARCIAL:
${partials}

Usá este material como base para tus guías, explicaciones y preguntas. Cuando el estudiante pregunte sobre esta materia, anclate en el temario y los conceptos oficiales del plan de la UTN.`;
}

function buildAllSubjectsIndex(): string {
  return getAllSubjects()
    .map(
      (s) =>
        `${s.id}: ${s.name} (${s.code}, Nivel ${s.level}) — ${s.keyConcepts.join(", ")}`
    )
    .join("\n");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, subjectId, ragQuery, rag, ragContext } = body as {
      messages: { role: string; content: string }[];
      subjectId?: string;
      ragQuery?: string;
      rag?: boolean;
      ragContext?: string;
    };
    const urlRag = request.nextUrl.searchParams.get("rag") === "true";

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip")?.trim() ||
      "127.0.0.1";
    if (await isRateLimited(ip, "tutor", 12, 60_000)) {
      return new Response(
        JSON.stringify({ error: "Too many requests, try again later" }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Messages array is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const totalChars = messages.reduce(
      (acc: number, m: { content?: string }) => acc + (m.content?.length || 0),
      0
    );
    if (totalChars > MAX_TOTAL_CHARS) {
      return new Response(
        JSON.stringify({ error: "Message content exceeds size limit" }),
        { status: 413, headers: { "Content-Type": "application/json" } }
      );
    }

    // RAG context injection — supports ragQuery, ragContext, rag boolean, or ?rag=true
    let ragContextStr = "";
    if (typeof ragContext === "string" && ragContext.trim()) {
      ragContextStr = ragContext.trim().slice(0, 4000);
    } else if (typeof ragQuery === "string" && ragQuery.trim()) {
      ragContextStr = getRagContext(ragQuery.trim(), subjectId);
    } else if (rag === true || urlRag) {
      const lastUser = [...messages].reverse().find((m) => m.role === "user")?.content ?? "";
      if (lastUser.trim()) ragContextStr = getRagContext(lastUser.trim(), subjectId);
    }

    const subject = subjectId ? getSubjectById(subjectId) : undefined;
    const subjectContext = subject
      ? buildSubjectContext(subject)
      : `MATERIAS DISPONIBLES (usá la que corresponda según la pregunta del estudiante):
${buildAllSubjectsIndex()}`;

    let systemPrompt = `${SOCRATIC_SYSTEM_PROMPT}

CONTEXTO DEL PLAN DE ESTUDIOS (UTN - Lic. en Sistemas, Plan 1877):
${subjectContext}`;
    if (ragContextStr) {
      systemPrompt += `\n\nContexto RAG (material del estudiante):\n${ragContextStr}\n\nUsá este contexto para fundamentar tu respuesta y citá la fuente cuando sea relevante. Si el contexto no es relevante, ignoralo.`;
    }

    if (process.env.OPENAI_API_KEY) {
      const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });

      const result = await generateText({
        model: openai("gpt-4o-mini"),
        system: systemPrompt,
        maxOutputTokens: 1200,
        messages: messages.map((msg: { role: string; content: string }) => ({
          role: msg.role as "user" | "assistant" | "system",
          content: msg.content,
        })),
      });

      if (subjectId) {
        console.log(
          `Tutor response for subject ${subjectId}: ${result.text.length} chars${ragContextStr ? " (RAG)" : ""}`
        );
      }

      return new Response(JSON.stringify({ content: result.text, ragContext: ragContextStr || undefined }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const mockResponse = generateMockResponse(
      messages[messages.length - 1]?.content || "",
      ragContextStr
    );

    return new Response(
      JSON.stringify({ content: mockResponse, role: "assistant" }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Tutor API error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

function generateMockResponse(userMessage: string, ragContextStr?: string): string {
  const ragPrefix =
    ragContextStr && ragContextStr.trim()
      ? `**Contexto de tus apuntes:**\n> ${ragContextStr.slice(0, 600).replace(/\n/g, "\n> ")}\n\n---\n\n`
      : "";
  const lower = userMessage.toLowerCase();

  if (lower.includes("derivad") || lower.includes("derivar")) {
    return `${ragPrefix}¡Excelente pregunta sobre derivadas! 🎯

Antes de darte la respuesta, dejame guiarte:

1. **¿Qué es una derivada conceptualmente?**
   La derivada mide la *tasa de cambio instantánea* de una función en un punto.

2. **Pensá en esto:** Si tenés una función $f(x)$ que representa la posición de un auto en el tiempo, ¿qué representaría su derivada?

3. **Para calcularla**, empezá por identificar:
   - ¿La función es una de las básicas que ya conocés? ($x^n$, $\\sin x$, $e^x$, etc.)
   - ¿Estás ante una composición (regla de la cadena)?
   - Hay una división de funciones (regla del cociente)?

**¿Podés decirme qué función específica querés derivar? Así te guío paso a paso.** 📐`;
  }

  if (lower.includes("integral") || lower.includes("integrar")) {
    return `${ragPrefix}Las integrales son fundamentales en ingeniería 💡

Pensemos juntos:

1. **Concepto clave:** La integral es la *operación inversa* de la derivada. Si la derivada te da la tasa de cambio, la integral te da el *acumulado*.

2. **Analogía:** Si conocés la velocidad de un auto (derivada de la posición), la integral te da la posición total recorrida.

3. **Para integrar**, identificá primero:
   - ¿Es una integral inmediata? (una de las fórmulas básicas)
   - ¿Necesitás sustitución?
   - ¿Necesitás integración por partes?

**¿Qué función necesitás integrar? Y más importante: ¿cuál es tu primer instinto sobre cómo resolverla?** 🧠`;
  }

  if (lower.includes("física") || lower.includes("fisica") || lower.includes("fuerza") || lower.includes("newton")) {
    return `${ragPrefix}La física es pura lógica aplicada 🔬

Vamos por partes:

1. **Primero, identificá:** ¿De qué tipo de problema se trata?
   - ¿Cinemática? (movimiento, velocidad, aceleración)
   - ¿Dinámica? (fuerzas, masa, aceleración - Ley de Newton)
   - ¿Energía? (trabajo, energía cinética/potencial)

2. **Dibujá el diagrama de cuerpo libre:**
   - ¿Qué fuerzas actúan sobre el objeto?
   - ¿En qué dirección va cada una?

3. **Recordá la Segunda Ley de Newton:** $\\vec{F} = m \\vec{a}$

**Contame: ¿cuál es el enunciado del problema? Así te ayudo a descomponerlo.** 📊`;
  }

  return `${ragPrefix}Entiendo tu consulta. Como tu tutor Socrático, voy a guiarte:

1. **Identifiquemos** el concepto central de tu pregunta
2. **Construyamos** el razonamiento juntos paso a paso
3. **Verifiquemos** que el resultado tenga sentido

Para ayudarte mejor, necesito que me digas:
- **¿Qué materia específica?** (matemática, física, programación, etc.)
- **¿Qué tema dentro de esa materia?**
- **¿Tenés un ejercicio concreto o es un concepto teórico?**

La clave del aprendizaje profundo es que vos construyas la respuesta, no que yo te la dé. 🧠

**¿Por dónde querés empezar?**`;
}
