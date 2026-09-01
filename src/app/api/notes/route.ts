import { NextRequest } from "next/server";
import { getPrisma } from "@/lib/db";
import { auth } from "@/lib/auth";

async function ensureDemoUser(prisma: NonNullable<Awaited<ReturnType<typeof getPrisma>>>, userId: string) {
  if (userId === "demo-user") {
    await prisma.user.upsert({
      where: { id: "demo-user" },
      update: {},
      create: { id: "demo-user", name: "Demo", email: "demo@cognita.local" },
    });
  }
}
async function getUserId(): Promise<string> {
  try { const s = await auth(); return (s?.user as {id?:string})?.id ?? "demo-user"; } catch { return "demo-user"; }
}

export async function GET(request: NextRequest) {
  const prisma = await getPrisma();
  if (!prisma) return new Response(JSON.stringify({ fallback: true, data: [] }), { status: 200, headers: { "Content-Type": "application/json", "X-Fallback": "localStorage" } });
  const userId = await getUserId(); await ensureDemoUser(prisma, userId);
  const { searchParams } = new URL(request.url);
  const subjectId = searchParams.get("subjectId");
  const q = searchParams.get("q")?.toLowerCase();
  const tag = searchParams.get("tag");
  const where: Record<string, unknown> = { userId };
  if (subjectId) (where as Record<string,string>).subjectId = subjectId;
  let notes = await prisma.note.findMany({ where: where as never, orderBy: { updatedAt: "desc" } });
  if (q) notes = notes.filter((n: { title: string; content: string; tags: string[] }) => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q) || n.tags.some((t:string)=>t.toLowerCase().includes(q)));
  if (tag) notes = notes.filter((n: { tags: string[] }) => n.tags.includes(tag));
  return new Response(JSON.stringify(notes), { headers: { "Content-Type": "application/json" } });
}

export async function POST(request: NextRequest) {
  const prisma = await getPrisma();
  if (!prisma) return new Response(JSON.stringify({ fallback: true }), { status: 200, headers: { "Content-Type": "application/json", "X-Fallback": "localStorage" } });
  const userId = await getUserId(); await ensureDemoUser(prisma, userId);
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 }); }
  const subjectId = String(body.subjectId ?? "");
  const title = String(body.title ?? "").trim();
  const content = String(body.content ?? "").trim();
  if (!subjectId || !title || !content) return new Response(JSON.stringify({ error: "subjectId, title, content required" }), { status: 400 });
  const created = await prisma.note.create({
    data: {
      userId, subjectId, title, content,
      contentLatex: body.contentLatex as string | undefined,
      tags: (body.tags as string[]) ?? [],
    },
  });
  return new Response(JSON.stringify(created), { status: 201, headers: { "Content-Type": "application/json" } });
}
