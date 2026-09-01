import { NextRequest } from "next/server";
import { getPrisma } from "@/lib/db";
import { auth } from "@/lib/auth";
async function getUserId(): Promise<string>{ try{ const s=await auth(); return (s?.user as {id?:string})?.id ?? "demo-user"; }catch{ return "demo-user"; } }
async function ensureDemoUser(prisma: NonNullable<Awaited<ReturnType<typeof getPrisma>>>, userId:string){ if(userId==="demo-user") await prisma.user.upsert({ where:{id:"demo-user"}, update:{}, create:{ id:"demo-user", name:"Demo", email:"demo@cognita.local"}}); }
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }){
  const prisma=await getPrisma(); if(!prisma) return new Response(JSON.stringify({fallback:true}),{status:200, headers:{"Content-Type":"application/json","X-Fallback":"localStorage"}});
  const { id } = await params; const userId=await getUserId(); await ensureDemoUser(prisma,userId);
  const existing=await prisma.generatorDeck.findFirst({ where:{ id, userId }}); if(!existing) return new Response(JSON.stringify({error:"not found"}),{status:404});
  await prisma.generatorDeck.delete({ where:{ id }});
  return new Response(JSON.stringify({ok:true}),{headers:{"Content-Type":"application/json"}});
}
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }){
  const prisma=await getPrisma(); if(!prisma) return new Response(JSON.stringify({fallback:true}),{status:200, headers:{"Content-Type":"application/json","X-Fallback":"localStorage"}});
  const { id } = await params; const userId=await getUserId(); await ensureDemoUser(prisma,userId);
  const deck=await prisma.generatorDeck.findFirst({ where:{ id, userId }});
  if(!deck) return new Response(JSON.stringify({error:"not found"}),{status:404});
  return new Response(JSON.stringify(deck),{headers:{"Content-Type":"application/json"}});
}
