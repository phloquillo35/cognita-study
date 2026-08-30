import { NextRequest } from "next/server";
import { getPrisma } from "@/lib/db";
import { auth } from "@/lib/auth";
async function getUserId(): Promise<string>{ try{ const s=await auth(); return (s?.user as {id?:string})?.id ?? "demo-user"; }catch{ return "demo-user"; } }
async function ensureDemoUser(prisma: NonNullable<Awaited<ReturnType<typeof getPrisma>>>, userId:string){ if(userId==="demo-user") await prisma.user.upsert({ where:{id:"demo-user"}, update:{}, create:{ id:"demo-user", name:"Demo", email:"demo@cognita.local"}}); }
export async function GET(request: NextRequest){
  const prisma=await getPrisma(); if(!prisma) return new Response(JSON.stringify({fallback:true,data:[]}),{status:200, headers:{"Content-Type":"application/json","X-Fallback":"localStorage"}});
  const userId=await getUserId(); await ensureDemoUser(prisma,userId);
  const { searchParams } = new URL(request.url); const subjectId=searchParams.get("subjectId");
  const where: Record<string,unknown> = { userId }; if(subjectId) (where as Record<string,string>).subjectId=subjectId;
  const data=await prisma.generatorDeck.findMany({ where: where as never, orderBy:{ createdAt:"desc"}});
  return new Response(JSON.stringify(data),{headers:{"Content-Type":"application/json"}});
}
export async function POST(request: NextRequest){
  const prisma=await getPrisma(); if(!prisma) return new Response(JSON.stringify({fallback:true}),{status:200, headers:{"Content-Type":"application/json","X-Fallback":"localStorage"}});
  const userId=await getUserId(); await ensureDemoUser(prisma,userId);
  let body: Record<string,unknown>; try{ body=await request.json(); }catch{ return new Response(JSON.stringify({error:"Invalid JSON"}),{status:400});}
  const subjectId=String(body.subjectId??""); const title=String(body.title??"").trim(); if(!subjectId || !title) return new Response(JSON.stringify({error:"subjectId and title required"}),{status:400});
  const created=await prisma.generatorDeck.create({ data:{ userId, subjectId, title, type: String(body.type ?? "flashcards"), flashcards: (body.flashcards as object) ?? null, quizzes: (body.quizzes as object) ?? null }});
  return new Response(JSON.stringify(created),{status:201, headers:{"Content-Type":"application/json"}});
}
