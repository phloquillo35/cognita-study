import { NextRequest } from "next/server";
import { getPrisma } from "@/lib/db";
import { auth } from "@/lib/auth";
async function ensureDemoUser(prisma: NonNullable<Awaited<ReturnType<typeof getPrisma>>>, userId:string){ if(userId==="demo-user") await prisma.user.upsert({ where:{id:"demo-user"}, update:{}, create:{ id:"demo-user", name:"Demo", email:"demo@cognita.local"}}); }
async function getUserId(): Promise<string>{ try{ const s=await auth(); return (s?.user as {id?:string})?.id ?? "demo-user"; }catch{ return "demo-user"; } }
export async function GET(request: NextRequest){
  const prisma=await getPrisma(); if(!prisma) return new Response(JSON.stringify({fallback:true,data:[]}),{status:200, headers:{"Content-Type":"application/json","X-Fallback":"localStorage"}});
  const userId=await getUserId(); await ensureDemoUser(prisma,userId);
  const { searchParams } = new URL(request.url); const subjectId=searchParams.get("subjectId");
  const where: Record<string,unknown>={ userId }; if(subjectId) (where as Record<string,string>).subjectId=subjectId;
  const data=await prisma.studyPlan.findMany({ where: where as never, orderBy:{ createdAt:"desc"}});
  return new Response(JSON.stringify(data),{headers:{"Content-Type":"application/json"}});
}
export async function POST(request: NextRequest){
  const prisma=await getPrisma(); if(!prisma) return new Response(JSON.stringify({fallback:true}),{status:200, headers:{"Content-Type":"application/json","X-Fallback":"localStorage"}});
  const userId=await getUserId(); await ensureDemoUser(prisma,userId);
  let body: Record<string,unknown>; try{ body=await request.json(); }catch{ return new Response(JSON.stringify({error:"Invalid JSON"}),{status:400});}
  const subjectId=String(body.subjectId??""); const targetDate=body.targetDate ? new Date(body.targetDate as string) : null;
  if(!subjectId || !targetDate) return new Response(JSON.stringify({error:"subjectId and targetDate required"}),{status:400});
  const created=await prisma.studyPlan.create({ data:{ userId, subjectId, targetDate, dailyMinutes: Number(body.dailyMinutes ?? 30), completed: Boolean(body.completed ?? false), topics: (body.topics as object) ?? null }});
  return new Response(JSON.stringify(created),{status:201, headers:{"Content-Type":"application/json"}});
}
