// RAG (Retrieval-Augmented Generation) para los materiales de Drive
// Este módulo quedará listo para cuando se configure la API key y el vector store

// Tipos para documentos del Drive
export interface DocumentoDrive {
  id: string;
  subject: string;
  filename: string;
  text: string;
  metadata: {
    subject: string;
    source: "drive";
  };
}

// Clase para manejar el RAG
export class DriveRAG {
  private documentos: DocumentoDrive[] = [];
  private initialized: boolean = false;

  // Cargar documentos desde un manifest
  async cargarDesdeManifest(manifest: Record<string, string[]>, subjects: string[]) {
    this.documentos = [];

    for (const subjectId of subjects) {
      if (!manifest[subjectId]) continue;

      const archivos = manifest[subjectId];
      for (const filename of archivos) {
        this.documentos.push({
          id: `${subjectId}-${filename}`,
          subject: subjectId,
          filename,
          text: "", // Se poblará con el texto extraído
          metadata: {
            subject: subjectId,
            source: "drive",
          },
        });
      }
    }

    this.initialized = this.documentos.length > 0;
    console.log(`📚 Cargados ${this.documentos.length} documentos Drive para RAG`);
  }

  // Buscar documentos relevantes (búsqueda simple por texto)
  buscarRelevantes(query: string, k: number = 3): DocumentoDrive[] {
    if (!this.initialized || this.documentos.length === 0) return [];

    // Búsqueda simple por coincidencia de texto en minúsculas
    const queryLower = query.toLowerCase();
    const resultados: DocumentoDrive[] = [];

    for (const doc of this.documentos) {
      if (doc.text.toLowerCase().includes(queryLower)) {
        resultados.push(doc);
      }
    }

    return resultados.slice(0, k);
  }

  // Obtener contexto formateado para el Tutor IA
  obtenerContexto(query: string): string {
    const docs = this.buscarRelevantes(query, 3);

    if (docs.length === 0) return "";

    const contextoParts = docs.map((doc) => {
      return `=== Archivo: ${doc.filename} (${doc.subject}) ===
${doc.text.substring(0, 300)}${doc.text.length > 300 ? "..." : ""}
===`;
    });

    return contextoParts.join("\n\n");
  }
}

// Instancia exportada para usar en todo el proyecto
export const driveRAG = new DriveRAG();