import { NextRequest } from "next/server";
import { getPrisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  if (!process.env.DATABASE_URL) {
    return new Response(
      JSON.stringify({
        status: "no-db",
        message:
          "Modo local (localStorage). Definí DATABASE_URL y ejecutá `prisma generate` para habilitar el backend.",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }

  const prisma = await getPrisma();
  if (!prisma) {
    return new Response(
      JSON.stringify({
        status: "prisma-missing",
        message:
          "DATABASE_URL definida pero '@prisma/client' no está instalado o generado.",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    // Health check liviano: contar usuarios.
    const count = await (prisma as { user: { count: () => Promise<number> } }).user.count();
    return new Response(
      JSON.stringify({ status: "ok", users: count }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch {
    return new Response(
      JSON.stringify({
        status: "db-error",
        message: "No se pudo conectar a la base de datos.",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }
}
