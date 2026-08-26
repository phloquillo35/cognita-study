"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import Link from "next/link";
import { BookOpen, Loader } from "lucide-react";
import { useState, useEffect } from "react";

interface Material {
  id: string;
  filename: string;
  type: "pdf" | "docx" | "other";
  size?: number;
  extracted?: boolean;
}

interface SubjectMaterials {
  [subjectId: string]: Material[];
}

export default function MaterialList({ subjectId }: { subjectId: string }) {
  const [isLoading, setIsLoading] = useState(true);
  const [materials, setMaterials] = useState<Material[]>([]);

  // Datos iniciales (se poblarán después de la extracción)
  const initialMaterials: Material[] = [
    { id: "1", filename: "manual-matematica.pdf", type: "pdf", extracted: false },
    { id: "2", filename: "algebra-practice.docx", type: "docx", extracted: false },
    { id: "3", filename: "ejercicios-parciales.pdf", type: "pdf", extracted: false },
  ];

  useEffect(() => {
    setMaterials(initialMaterials);
    setIsLoading(false);
  }, [subjectId]);

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="p-6 text-center"
      >
        <Loader className="h-6 w-6 mx-auto animate-spin text-primary" />
        <p className="mt-2">Cargando materiales...</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <CardHeader>
          <CardTitle>📚 Materiales de estudio</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Materiales disponibles para {subjectId ? subjectId : "tu materia"}
          </p>
        </CardContent>
      </Card>

      <div className="space-y-2">
        {materials.length === 0 && !isLoading && (
          <p className="text-sm text-muted-foreground">
            No hay materiales cargados. Ejecutá el script de extracción.
          </p>
        )}

        {materials.map((material: Material) => (
          <motion.div
            key={material.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + Math.random() * 0.2 }}
            className="flex items-center gap-3 p-3 rounded bg-primary/5 hover:bg-primary/10 transition-colors"
          >
            <div
              className={`w-8 h-8 rounded flex items-center justify-center ${material.type === "pdf" ? "bg-primary/10 text-primary" : material.type === "docx" ? "bg-success/10 text-success" : "bg-secondary/10 text-secondary"}`}
            >
              {material.type === "pdf" ? <BookOpen /> : material.type === "docx" ? <BookOpen /> : <Loader />}
            </div>
            <div className="flex-1 min-w-0">
              <Link
                href={`/material/${material.id}`}
                className="font-medium hover:underline underline-offset-2"
              >
                {material.filename}
              </Link>
              <p className="text-xs text-muted-foreground">{material.type}</p>
            </div>
            <div className="flex-0">
              {!material.extracted && (
                <span className="text-xs text-warning fw-medium">Sin extraer</span>
              )}
              {material.extracted && (
                <span className="text-xs text-success fw-medium">Extraído</span>
              )}
            </div>
          </motion.div>
        ))}
        {materials.length === 0 && (
          <p className="text-xs text-muted-foreground text-center">
            Colocá archivos en public/materials/primer-anio/{subjectId}/ y ejecutá
            <code className="mono">npx tsx scripts/extract-texts.ts</code>
          </p>
        )}
      </div>
    </div>
  );
}