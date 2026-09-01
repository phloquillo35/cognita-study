import type { PrismaClient } from "@prisma/client";

let prisma: PrismaClient | null = null;
let tried = false;

export async function getPrisma(): Promise<PrismaClient | null> {
  if (tried) return prisma;
  tried = true;
  if (!process.env.DATABASE_URL) return null;
  try {
    const { PrismaClient: Client } = await import("@prisma/client");
    prisma = new Client() as PrismaClient;
    return prisma;
  } catch {
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
