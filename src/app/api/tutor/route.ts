import { NextRequest } from "next/server";
import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

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

// Simple in-memory rate limit (sliding window) keyed by IP.
const RATE_LIMIT = 12;
const RATE_WINDOW_MS = 60_000;
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
    const { messages, subjectId } = await request.json();

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    if (isRateLimited(ip)) {
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

    if (process.env.OPENAI_API_KEY) {
      const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });

      const result = await generateText({
        model: openai("gpt-4o-mini"),
        system: SOCRATIC_SYSTEM_PROMPT,
        maxTokens: 1200,
        messages: messages.map((msg: { role: string; content: string }) => ({
          role: msg.role as "user" | "assistant" | "system",
          content: msg.content,
        })),
      });

      if (subjectId) {
        console.log(
          `Tutor response for subject ${subjectId}: ${result.text.length} chars`
        );
      }

      return new Response(JSON.stringify({ content: result.text }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const mockResponse = generateMockResponse(
      messages[messages.length - 1]?.content || ""
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

function generateMockResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase();

  if (lower.includes("derivad") || lower.includes("derivar")) {
    return `¡Excelente pregunta sobre derivadas! 🎯

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
    return `Las integrales son fundamentales en ingeniería 💡

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
    return `La física es pura lógica aplicada 🔬

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

  return `Entiendo tu consulta. Como tu tutor Socrático, voy a guiarte:

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
