/**
 * Script para sincronizar archivos de Google Drive de primer año
 * 
 * Uso: gdown --folder "URL_DEL_DRIVE" o manualmente copiar la carpeta
 * 
 * Estructura esperada en public/materials/primer-anio/:
   am1/  (Análisis Matemático I - ISI-101)
   aga/  (Álgebra y Geometría Analítica - ISI-102)
   fis1/ (Física I - ISI-103)
   ing1/ (Inglés I - ISI-104)
   led/  (Lógica y Estructuras Discretas - ISI-105)
   aed/  (Algoritmos y Estructuras de Datos - ISI-106)
   ac1/  (Arquitectura de Computadoras - ISI-107)
   spn/  (Sistemas y Procesos de Negocio - ISI-108)
 * 
 * Cada carpeta contiene: PDFs, DOCX, apuntes, parciales, etc.
 * 
 * Después de colocar los archivos, ejecutar:
   npx tsx scripts/extract-texts.ts
 * para generar el manifest y las notas.
 */

import { execSync } from "child_process";
import fs from "fs";
import path from "path";

// Configuración
const FOLDER_ID = "1CClpJMaM_gqJ0_IMsg8uSmyx4W279r5i";
const LOCAL_BASE = path.join("public", "materials", "primer-anio");
const MANIFEST_PATH = path.join("public", "materials", "manifest.json");

function downloadDriveFolder() {
  console.log("📥 Sincronizando Drive...");
  console.log("⚠️  Si el link no es público, colocá los archivos manualmente en:", LOCAL_BASE);
  console.log("");

  try {
    const foldUrl = `https://drive.google.com/drive/folders/${FOLDER_ID}`;
    execSync(`gdown --folder "${foldUrl}" --quiet 2>/dev/null`);
    console.log("✅ Descarga completada via gdown");
  } catch (e) {
    console.log("⚠️  gdown falló (puede que el folder no sea público)");
    console.log("   Colocá manualmente la carpeta en:", LOCAL_BASE);
    console.log("   La carpeta debe tener 8 subcarpetas: am1, aga, fis1, ing1, led, aed, ac1, spn");
  }

  verificarEstructura();
}

function verificarEstructura() {
  const carpetasEsperadas = ["am1", "aga", "fis1", "ing1", "led", "aed", "ac1", "spn"];
  console.log("\n📁 Verificando estructura en", LOCAL_BASE);

  const carpetasExistentes = fs.existsSync(LOCAL_BASE) ? fs.readdirSync(LOCAL_BASE) : [];
  const faltantes = carpetasEsperadas.filter((c) => !carpetasExistentes.includes(c));

  if (faltantes.length > 0) {
    console.log("❌ Carpetas faltantes:", faltantes);
    console.log("   Asegurate de tener las 8 carpetas de primer año");
  } else {
    console.log("✅ Todas las 8 carpetas de primer año presentes");
  }

  // Listar archivos de ejemplo
  if (fs.existsSync(LOCAL_BASE)) {
    for (const carpeta of carpetasEsperadas) {
      const carpetaPath = path.join(LOCAL_BASE, carpeta);
      if (fs.existsSync(carpetaPath)) {
        const archivos = fs.readdirSync(carpetaPath).slice(0, 3);
        console.log(`  📂 ${carpeta}: ${archivos.join(", ")}...`);
      }
    }
  }
}

downloadDriveFolder();

// Generar manifest después de colocar archivos
if (fs.existsSync(LOCAL_BASE)) {
  const manifest: Record<string, string[]> = {};
  const carpetas = fs.readdirSync(LOCAL_BASE);

  for (const carpeta of carpetas) {
    const carpetaPath = path.join(LOCAL_BASE, carpeta);
    if (fs.statSync(carpetaPath).isDirectory()) {
      const archivos: string[] = fs.readdirSync(carpetaPath).map((f: string) => f);
      manifest[carpeta] = archivos;
    }
  }

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  console.log(`\n📋 Manifest generado en ${MANIFEST_PATH}`);
}

// Script auxiliar para extraer texto
console.log("\n📝 Para extraer texto de los archivos ejecutar:");
console.log("  npx tsx scripts/extract-texts.ts");