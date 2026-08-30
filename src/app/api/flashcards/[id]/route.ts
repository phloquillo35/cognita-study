import { NextRequest } from "next/server";
import { getPrisma } from "@/lib/db";
import { auth } from "@/lib/auth";

async function ensureDemoUser(prisma: NonNullable<Awaited<ReturnType<typeof getPrisma>>>, userId: string) {
  if (userId === "demo-user") {
    await prisma.user.upsert({
      where: { id: "demo-user" },
      update: {},
      create: {
        id: "demo-user",
        name: "Demo",
        email: "demo@cognita.local",
        university: "UTN - FRT",
        career: "Ingeniería en Sistemas de Información",
      },
    });
  }
}

async function getUserId(): Promise<string> {
  try {
    const session = await auth();
    return (session?.user as { id?: string })?.id ?? "demo-user";
  } catch {
    return "demo-user";
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const prisma = await getPrisma();
  if (!prisma) return new Response(JSON.stringify({ fallback: true }), { status: 200, headers: { "Content-Type": "application/json", "X-Fallback": "localStorage" } });
  const { id } = await params;
  const userId = await getUserId();
  await ensureDemoUser(prisma, userId);
  const card = await prisma.flashcard.findFirst({ where: { id, userId } });
  if (!card) return new Response(JSON.stringify({ error: "not found" }), { status: 404 });
  return new Response(JSON.stringify(card), { headers: { "Content-Type": "application/json" } });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const prisma = await getPrisma();
  if (!prisma) return new Response(JSON.stringify({ fallback: true }), { status: 200, headers: { "Content-Type": "application/json", "X-Fallback": "localStorage" } });
  const { id } = await params;
  const userId = await getUserId();
  await ensureDemoUser(prisma, userId);
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 }); }

  const allowed: Record<string, unknown> = {};
  const keys = ["subjectId","front","back","frontLatex","backLatex","difficulty","nextReview","reviewCount","correctCount","interval","easeFactor","repetitions","stability","lastReviewed"];
  for (const k of keys) if (k in body) {
    let v: unknown = (body as Record<string, unknown>)[k];
    if (k === "nextReview" || k === "lastReviewed") v = v ? new Date(v as string) : null;
    if (k === "difficulty" || k === "reviewCount" || k === "correctCount" || k === "interval" || k === "repetitions") v = v != null ? Number(v) : v;
    if (k === "easeFactor" || k === "stability") v = v != null ? Number(v) : null;
    (allowed as Record<string, unknown>)[k] = v;
  }

  try {
    const updated = await prisma.flashcard.update({ where: { id }, data: allowed });
    // ensure ownership
    if (updated.userId !== userId) return new Response(JSON.stringify({ error: "forbidden" }), { status: 403 });
    return new Response(JSON.stringify(updated), { headers: { "Content-Type": "application/json" } });
  } catch {
    return new Response(JSON.stringify({ error: "not found or db-error" }), { status: 404 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const prisma = await getPrisma();
  if (!prisma) return new Response(JSON.stringify({ fallback: true }), { status: 200, headers: { "Content-Type": "application/json", "X-Fallback": "localStorage" } });
  const { id } = await params;
  const userId = await getUserId();
  await ensureDemoUser(prisma, userId);
  const existing = await prisma.flashcard.findFirst({ where: { id, userId } });
  if (!existing) return new Response(JSON.stringify({ error: "not found" }), { status: 404 });
  await prisma.flashcard.delete({ where: { id } });
  return new Response(JSON.stringify({ ok: true }), { headers: { "Content-Type": "application/json" } });
}
