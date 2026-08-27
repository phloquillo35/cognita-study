// Cliente Prisma con carga dinámica.
// Se importa de forma diferida para que el build no falle si "@prisma/client"
// no está instalado/generado todavía (modo solo-localStorage).

let prisma: unknown = null;
let tried = false;

export async function getPrisma(): Promise<unknown | null> {
  if (tried) return prisma as unknown;
  tried = true;
  if (!process.env.DATABASE_URL) return null;
  try {
    const mod = await import("@prisma/client");
    const PrismaClient = (mod as { PrismaClient: new () => unknown }).PrismaClient;
    prisma = new PrismaClient();
    return prisma;
  } catch {
    return null;
  }
}
