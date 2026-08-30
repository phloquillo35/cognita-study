import fs from 'fs';
import path from 'path';

const LOCAL_BASE = path.join(process.cwd(), 'public', 'materials', 'primer-anio');

interface FileInfo {
  subject: string;
  filename: string;
  type: 'pdf' | 'docx' | 'other';
  extractedText?: string;
}

// Mock: en producción usaríamos pdf-parse y mammoth
// Por ahora, solo registramos los archivos y sus tipos
function clasificarTipo(filename: string): 'pdf' | 'docx' | 'other' {
  const lower = filename.toLowerCase();
  if (lower.endsWith('.pdf')) return 'pdf';
  if (lower.endsWith('.docx') || lower.endsWith('.doc')) return 'docx';
  return 'other';
}

function listarArchivos(base: string): FileInfo[] {
  const resultados: FileInfo[] = [];
  if (!fs.existsSync(base)) return resultados;
  
  const carpetas = fs.readdirSync(base).filter(f => fs.statSync(path.join(base, f)).isDirectory());
  
  for (const carpeta of carpetas) {
    const carpetaPath = path.join(base, carpeta);
    const archivos = fs.readdirSync(carpetaPath).filter(f => fs.statSync(path.join(carpetaPath, f)).isFile());
    
    for (const archivo of archivos) {
      const tipo = clasificarTipo(archivo);
      resultados.push({
        subject: carpeta,
        filename: archivo,
        type: tipo,
      });
    }
  }
  
  return resultados;
}

console.log('🔍 Listado de archivos en Drive integration:');
const archivos = listarArchivos(LOCAL_BASE);

console.log(`\nTotal de archivos: ${archivos.length}`);
archivos.forEach((a, i) => {
  console.log(`  ${i + 1}. [${a.subject}] ${a.filename} (${a.type})`);
});

// En producción, aquí usaríamos:
// - pdf-parse para PDFs: const pdf = await pdfParse(fs.readFileSync(ruta)); texto = pdf.text
// - mammoth para DOCX: const result = await mammoth.convertAsync({path: ruta}); texto = result.value
// - Tesseract para imágenes

console.log('\n📝 Próximo paso: generar manifest con textos extraídos (Fase 2)');