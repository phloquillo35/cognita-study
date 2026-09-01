import { NextRequest } from "next/server";
import { getPrisma } from "@/lib/db";
import { auth } from "@/lib/auth";

async function getUserId(): Promise<string> { try { const s = await auth(); return (s?.user as { id?: string })?.id ?? "demo-user"; } catch { return "demo-user"; } }
async function ensureDemoUser(prisma: NonNullable<Awaited<ReturnType<typeof getPrisma>>>, userId: string) { if (userId === "demo-user") await prisma.user.upsert({ where: { id: "demo-user" }, update: {}, create: { id: "demo-user", name: "Demo", email: "demo@cognita.local" } }); }

export async function POST(request: NextRequest) {
  const prisma = await getPrisma();
  if (!prisma) return new Response(JSON.stringify({ fallback: true }), { status: 200, headers: { "Content-Type": "application/json", "X-Fallback": "localStorage" } });
  const userId = await getUserId(); await ensureDemoUser(prisma, userId);
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 }); }
  const migrateFrom = body.migrateFrom as string | undefined;
  const sourceUserId = migrateFrom ?? userId;
  let synced = 0;
  try {
    await prisma.$transaction(async (tx) => {
      const flashcards = (body.flashcards as unknown[]) ?? [];
      for (const c of flashcards as Record<string, unknown>[]) {
        const id = String(c.id ?? ""); if (!id) continue;
        await tx.flashcard.upsert({
          where: { id },
          update: { userId, subjectId: String(c.subjectId), front: String(c.front), back: String(c.back), difficulty: Number(c.difficulty ?? 1), nextReview: c.nextReview ? new Date(c.nextReview as string) : new Date(), reviewCount: Number(c.reviewCount ?? 0), correctCount: Number(c.correctCount ?? 0), interval: Number(c.interval ?? 0), easeFactor: Number(c.easeFactor ?? 2.5), repetitions: Number(c.repetitions ?? 0), stability: c.stability != null ? Number(c.stability) : null, lastReviewed: c.lastReviewed ? new Date(c.lastReviewed as string) : null },
          create: { id, userId, subjectId: String(c.subjectId), front: String(c.front), back: String(c.back), difficulty: Number(c.difficulty ?? 1), nextReview: c.nextReview ? new Date(c.nextReview as string) : new Date(), reviewCount: Number(c.reviewCount ?? 0), correctCount: Number(c.correctCount ?? 0), interval: Number(c.interval ?? 0), easeFactor: Number(c.easeFactor ?? 2.5), repetitions: Number(c.repetitions ?? 0), stability: c.stability != null ? Number(c.stability) : null, lastReviewed: c.lastReviewed ? new Date(c.lastReviewed as string) : null },
        }); synced++;
      }
      const notes = (body.notes as unknown[]) ?? [];
      for (const n of notes as Record<string, unknown>[]) {
        const id = String(n.id ?? ""); if (!id) continue;
        await tx.note.upsert({ where: { id }, update: { userId, subjectId: String(n.subjectId), title: String(n.title), content: String(n.content), tags: (n.tags as string[]) ?? [] }, create: { id, userId, subjectId: String(n.subjectId), title: String(n.title), content: String(n.content), tags: (n.tags as string[]) ?? [] } }); synced++;
      }
      const studyPlans = (body.studyPlans as unknown[]) ?? [];
      for (const p of studyPlans as Record<string, unknown>[]) {
        const id = String(p.id ?? p.subjectId ?? ""); if (!id) continue;
        const subjectId = String(p.subjectId ?? id);
        await tx.studyPlan.upsert({ where: { id: p.id ? String(p.id) : subjectId + "_" + userId }, update: { subjectId, targetDate: p.targetDate ? new Date(p.targetDate as string) : new Date(), dailyMinutes: Number(p.dailyMinutes ?? 30), completed: Boolean(p.completed), topics: (p.topics as object) ?? null }, create: { userId, subjectId, targetDate: p.targetDate ? new Date(p.targetDate as string) : new Date(), dailyMinutes: Number(p.dailyMinutes ?? 30), completed: Boolean(p.completed), topics: (p.topics as object) ?? null } }); synced++;
      }
      const decks = (body.generatorDecks as unknown[]) ?? (body.decks as unknown[]) ?? [];
      for (const d of decks as Record<string, unknown>[]) {
        const id = String(d.id ?? ""); if (!id) continue;
        await tx.generatorDeck.upsert({ where: { id }, update: { userId, subjectId: String(d.subjectId), title: String(d.title), type: String(d.type ?? "flashcards"), flashcards: (d.flashcards as object) ?? null, quizzes: (d.quizzes as object) ?? null }, create: { id, userId, subjectId: String(d.subjectId), title: String(d.title), type: String(d.type ?? "flashcards"), flashcards: (d.flashcards as object) ?? null, quizzes: (d.quizzes as object) ?? null } }); synced++;
      }
      const streak = body.streak as Record<string, unknown> | undefined;
      if (streak) {
        await tx.streak.upsert({ where: { userId }, update: { currentStreak: Number(streak.currentStreak ?? 0), longestStreak: Number(streak.longestStreak ?? 0), totalFocusMinutes: Number(streak.totalFocusMinutes ?? 0), totalReviews: Number(streak.totalReviews ?? 0), lastActiveDate: streak.lastActiveDate as string | null, daily: (streak.daily as object) ?? {} }, create: { userId, currentStreak: Number(streak.currentStreak ?? 0), longestStreak: Number(streak.longestStreak ?? 0), totalFocusMinutes: Number(streak.totalFocusMinutes ?? 0), totalReviews: Number(streak.totalReviews ?? 0), lastActiveDate: streak.lastActiveDate as string | null, daily: (streak.daily as object) ?? {} } }); synced++;
      }
      if (migrateFrom && migrateFrom !== userId) {
        await tx.flashcard.updateMany({ where: { userId: sourceUserId }, data: { userId } });
        await tx.note.updateMany({ where: { userId: sourceUserId }, data: { userId } });
        await tx.studyPlan.updateMany({ where: { userId: sourceUserId }, data: { userId } });
        await tx.generatorDeck.updateMany({ where: { userId: sourceUserId }, data: { userId } });
        const s = await tx.streak.findUnique({ where: { userId: sourceUserId } });
        if (s) await tx.streak.upsert({ where: { userId }, update: { currentStreak: s.currentStreak, longestStreak: s.longestStreak, totalFocusMinutes: s.totalFocusMinutes, totalReviews: s.totalReviews, lastActiveDate: s.lastActiveDate, daily: s.daily as object }, create: { userId, currentStreak: s.currentStreak, longestStreak: s.longestStreak, totalFocusMinutes: s.totalFocusMinutes, totalReviews: s.totalReviews, lastActiveDate: s.lastActiveDate, daily: s.daily as object } });
      }
    });
    return new Response(JSON.stringify({ ok: true, synced, userId }), { headers: { "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: "db-error", details: String(e) }), { status: 500 });
  }
}

export async function GET() {
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
