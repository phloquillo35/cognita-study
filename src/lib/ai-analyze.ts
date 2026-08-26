// Función para verificar si hay API key de OpenAI
export function hayApiKeyOpenAI(): boolean {
  return !!process.env.OPENAI_API_KEY;
}

// Generar prompt de análisis
export function getPromptAnalisis(contenido: string, tipoArchivo: string) {
  return `Soy un asistente de estudio para Cognita Study, la plataforma de la UTN-FRT.

Archivo: ${tipoArchivo}
Contenido: ${contenido.substring(0, 3000)}${contenido.length > 3000 ? "..." : ""}

Por favor, generá:
1. Un resumen de 3-5 puntos clave
2. 3 flashcards (pregunta/respuesta)
3. Los objetivos de aprendizaje principales
4. Las competencias que se desarrollan

Respondé en formato JSON con las claves: resumen, flashcards, objetivos, competencias.
`;
}

// Analizar archivo (simulado sin API key, real con API)
export async function analizarArchivo(ruta: string, tipo: string) {
  if (!hayApiKeyOpenAI()) {
    console.log("⚠️  OPENAI_API_KEY no configurada - returning mock");
    return {
      resumen: "No hay API key - análisis pendiente",
      flashcards: [],
      objetivos: [],
      competencias: [],
    };
  }

  // TODO: Implementar con OpenAI API cuando esté disponible
  return {
    resumen: "Análisis pendiente - configurar OPENAI_API_KEY",
    flashcards: [],
    objetivos: [],
    competencias: [],
  };
}

// Generar flashcards desde texto
export function generarFlashcards(texto: string, tema: string) {
  if (!hayApiKeyOpenAI()) {
    // Flashcards por defecto sin IA
    return [
      {
        pregunta: `¿Qué es ${tema}?`,
        respuesta: "Definición básica del tema relevante para la materia.",
      },
    ];
  }

  // TODO: Implementar con OpenAI cuando esté disponible
  return [
    {
      pregunta: `Concepto clave sobre ${tema}`,
      respuesta: "Definición extraída del material de estudio.",
    },
  ];
}