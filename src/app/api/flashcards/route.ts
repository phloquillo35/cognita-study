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

export async function GET(request: NextRequest) {
  const prisma = await getPrisma();
  if (!prisma) {
    return new Response(JSON.stringify({ fallback: true, data: [] }), {
      status: 200,
      headers: { "Content-Type": "application/json", "X-Fallback": "localStorage" },
    });
  }

  let userId: string | null = null;
  try {
    const session = await auth();
    userId = (session?.user as { id?: string })?.id ?? null;
  } catch {
    userId = null;
  }
  if (!userId) userId = "demo-user";
  await ensureDemoUser(prisma, userId);

  const { searchParams } = new URL(request.url);
  const subjectId = searchParams.get("subjectId");
  const due = searchParams.get("due");

  const where: Record<string, unknown> = { userId };
  if (subjectId) (where as Record<string, string>).subjectId = subjectId;
  if (due === "true") (where as Record<string, unknown>).nextReview = { lte: new Date() };

  try {
    const data = await prisma.flashcard.findMany({
      where: where as never,
      orderBy: { nextReview: "asc" },
    });
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ error: "db-error", fallback: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", "X-Fallback": "localStorage" },
    });
  }
}

export async function POST(request: NextRequest) {
  const prisma = await getPrisma();
  if (!prisma) {
    return new Response(JSON.stringify({ fallback: true, error: "no-db" }), {
      status: 200,
      headers: { "Content-Type": "application/json", "X-Fallback": "localStorage" },
    });
  }

  let userId: string | null = null;
  try {
    const session = await auth();
    userId = (session?.user as { id?: string })?.id ?? null;
  } catch {
    userId = null;
  }
  if (!userId) userId = "demo-user";
  await ensureDemoUser(prisma, userId);

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
  }

  const subjectId = String((body as Record<string, unknown>).subjectId ?? "");
  const front = String((body as Record<string, unknown>).front ?? "").trim();
  const back = String((body as Record<string, unknown>).back ?? "").trim();
  if (!subjectId || !front || !back) {
    return new Response(JSON.stringify({ error: "subjectId, front and back are required" }), { status: 400 });
  }

  try {
    const created = await prisma.flashcard.create({
      data: {
        userId,
        subjectId,
        front,
        back,
        frontLatex: (body as Record<string, unknown>).frontLatex as string | undefined,
        backLatex: (body as Record<string, unknown>).backLatex as string | undefined,
        difficulty: Number((body as Record<string, unknown>).difficulty ?? 1),
        nextReview: (body as Record<string, unknown>).nextReview ? new Date((body as Record<string, unknown>).nextReview as string) : new Date(),
        reviewCount: Number((body as Record<string, unknown>).reviewCount ?? 0),
        correctCount: Number((body as Record<string, unknown>).correctCount ?? 0),
        interval: Number((body as Record<string, unknown>).interval ?? 0),
        easeFactor: Number((body as Record<string, unknown>).easeFactor ?? 2.5),
        repetitions: Number((body as Record<string, unknown>).repetitions ?? 0),
        stability: (body as Record<string, unknown>).stability != null ? Number((body as Record<string, unknown>).stability) : null,
        lastReviewed: (body as Record<string, unknown>).lastReviewed ? new Date((body as Record<string, unknown>).lastReviewed as string) : null,
      },
    });
    return new Response(JSON.stringify(created), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: "db-error", details: String(e) }), { status: 500 });
  }
}
