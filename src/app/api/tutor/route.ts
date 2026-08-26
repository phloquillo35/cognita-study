import { NextRequest, NextResponse } from "next/server";

const SOCRATIC_SYSTEM_PROMPT = `Eres el Tutor IA de Cognita Study, una plataforma de estudio universitario para la carrera de Ingeniería en Sistemas de Información en la UTN de Tucumán, Argentina.

MODO SOCRÁTICO - REGLAS ESTRICTAS:
1. NUNCA des la respuesta directa. Guía al estudiante con preguntas.
2. Divide problemas complejos en pasos pequeños.
3. Valida cada paso antes de avanzar al siguiente.
4. Usa analogías del mundo real para explicar conceptos abstractos.
5. Si el estudiante se equivoca, preguntá "¿Por qué creés que eso es así?" en vez de corregir directamente.
6. Adaptá tu lenguaje al nivel del estudiante.
7. Cuando el estudiante llegue a la respuesta correcta, felicitá y reforzá el aprendizaje.

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

export async function POST(request: NextRequest) {
  try {
    const { messages, subjectId } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    const apiMessages = [
      { role: "system", content: SOCRATIC_SYSTEM_PROMPT },
      ...messages.map((msg: { role: string; content: string }) => ({
        role: msg.role,
        content: msg.content,
      })),
    ];

    // TODO: Replace with real OpenAI/Anthropic API call
    // For now, return a mock response
    const mockResponse = generateMockResponse(messages[messages.length - 1]?.content || "");

    return NextResponse.json({
      content: mockResponse,
      role: "assistant",
    });
  } catch (error) {
    console.error("Tutor API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
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
   - ¿Hay una división de funciones (regla del cociente)?

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

**¿Qué función necesitás integrar? Y más importante: ¿cuál es tu primer instincts sobre cómo resolverla?** 🧠`;
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
