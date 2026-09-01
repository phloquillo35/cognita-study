import { NextRequest } from "next/server";
import { getPrisma } from "@/lib/db";
import { auth } from "@/lib/auth";
async function getUserId(): Promise<string> { try{ const s=await auth(); return (s?.user as {id?:string})?.id ?? "demo-user"; }catch{ return "demo-user"; } }
async function ensureDemoUser(prisma: NonNullable<Awaited<ReturnType<typeof getPrisma>>>, userId:string){ if(userId==="demo-user") await prisma.user.upsert({ where:{id:"demo-user"}, update:{}, create:{ id:"demo-user", name:"Demo", email:"demo@cognita.local"}}); }
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const prisma = await getPrisma(); if(!prisma) return new Response(JSON.stringify({ fallback:true }),{status:200, headers:{"Content-Type":"application/json","X-Fallback":"localStorage"}});
  const { id } = await params; const userId = await getUserId(); await ensureDemoUser(prisma,userId);
  const note = await prisma.note.findFirst({ where:{ id, userId }});
  if(!note) return new Response(JSON.stringify({error:"not found"}),{status:404});
  return new Response(JSON.stringify(note),{headers:{"Content-Type":"application/json"}});
}
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const prisma = await getPrisma(); if(!prisma) return new Response(JSON.stringify({ fallback:true }),{status:200, headers:{"Content-Type":"application/json","X-Fallback":"localStorage"}});
  const { id } = await params; const userId = await getUserId(); await ensureDemoUser(prisma,userId);
  let body: Record<string,unknown>; try{ body=await req.json();}catch{ return new Response(JSON.stringify({error:"Invalid JSON"}),{status:400});}
  const existing = await prisma.note.findFirst({ where:{ id, userId }}); if(!existing) return new Response(JSON.stringify({error:"not found"}),{status:404});
  const data: Record<string,unknown> = {};
  if("subjectId" in body) data.subjectId = String(body.subjectId);
  if("title" in body) data.title = String(body.title);
  if("content" in body) data.content = String(body.content);
  if("contentLatex" in body) data.contentLatex = body.contentLatex as string | null;
  if("tags" in body) data.tags = body.tags as string[];
  const updated = await prisma.note.update({ where:{ id }, data});
  return new Response(JSON.stringify(updated),{headers:{"Content-Type":"application/json"}});
}
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const prisma = await getPrisma(); if(!prisma) return new Response(JSON.stringify({ fallback:true }),{status:200, headers:{"Content-Type":"application/json","X-Fallback":"localStorage"}});
  const { id } = await params; const userId = await getUserId(); await ensureDemoUser(prisma,userId);
  const existing = await prisma.note.findFirst({ where:{ id, userId }}); if(!existing) return new Response(JSON.stringify({error:"not found"}),{status:404});
  await prisma.note.delete({ where:{ id }});
  return new Response(JSON.stringify({ok:true}),{headers:{"Content-Type":"application/json"}});
}
