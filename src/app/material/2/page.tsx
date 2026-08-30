"use client";

import { useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Loader } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

interface Material {
  id: string;
  filename: string;
  type: string;
  size?: number;
  extracted?: boolean;
  content?: string;
}

export default function MaterialPage2() {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [material, setMaterial] = useState<Material | null>(null);

  useEffect(() => {
    const mockContent: Material = {
      id: "2",
      filename: "algebra-practice.docx",
      type: "docx",
      extracted: true,
      content: "Contenido simulado de práctica de álgebra - matrizes, determinantes, sistemas lineales. Ejercicios de práctica para el curso AGA."
    };
    if (mockContent) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- mock demo content load on mount, intentional
      setMaterial(mockContent);
    }
    setIsLoading(false);
  }, [id]);

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <Loader className="h-6 w-6 mx-auto animate-spin text-primary" />
        <p className="mt-2">Cargando material...</p>
      </div>
    );
  }

  if (!material) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Material no disponible</h1>
          <p className="mt-2 text-[var(--muted-foreground)]">El material solicitado no fue encontrado.</p>
          <Link href="/" className="mt-4">
            <button className="rounded-xl px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)]">Volver al inicio</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold">algebra-practice.docx</h1>
              <span className="rounded-full px-2.5 py-0.5 text-xs font-medium bg-success/10 text-success">docx</span>
            </div>
            <p className="text-sm text-[var(--muted-foreground)]">ID: 2 • Nivel: Segundo año</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mx-auto max-w-2xl p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)]">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p className="text-sm text-[var(--muted-foreground)]">
              Contenido extraído (modo demo) - el archivo original está en Google Drive y será procesado cuando esté disponible. Este material corresponde a la materia AGA (Álgebra Lineal).
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}