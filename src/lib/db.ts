// Shim de compatibilidad — fuente única en src/lib/prisma.ts
// Mantiene imports existentes `from "@/lib/db"` sin cambios.
export { getPrisma, isDbAvailable } from "./prisma";
