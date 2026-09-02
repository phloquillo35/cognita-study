import type { PrismaClient } from "@prisma/client";

// Singleton graceful — funciona sin DATABASE_URL (retorna null, fallback a localStorage)
// Patrón clonable: mismo archivo copiar a futuros proyectos. Usa globalThis para HMR.

declare global {
  var __cognitaPrisma: PrismaClient | undefined;
}

let prismaSingleton: PrismaClient | null | undefined = globalThis.__cognitaPrisma;
let tried = false;

export async function getPrisma(): Promise<PrismaClient | null> {
  if (tried) return prismaSingleton ?? null;
  tried = true;

  if (!process.env.DATABASE_URL) {
    prismaSingleton = null;
    return null;
  }

  try {
    const { PrismaClient: Client } = await import("@prisma/client");
    const client = new Client({
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    }) as PrismaClient;
    prismaSingleton = client;
    if (process.env.NODE_ENV !== "production") {
      globalThis.__cognitaPrisma = client;
    }
    return client;
  } catch {
    prismaSingleton = null;
    return null;
  }
}

export async function isDbAvailable(): Promise<boolean> {
  const p = await getPrisma();
  if (!p) return false;
  try {
    await p.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}

/**
 * @deprecated Usar `getPrisma()` — este export existe solo por compatibilidad.
 * En runtime sin DATABASE_URL lanzará al acceder.
 */
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    throw new Error(
      `Acceso directo a 'prisma.${String(prop)}' deprecado — usá 'const prisma = await getPrisma(); if (!prisma) return fallback;' (ver src/lib/prisma.ts)`
    );
  },
});
