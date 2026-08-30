import { NextRequest } from "next/server";
import { getPrisma } from "@/lib/db";
import { auth } from "@/lib/auth";
async function getUserId(): Promise<string>{ try{ const s=await auth(); return (s?.user as {id?:string})?.id ?? "demo-user"; }catch{ return "demo-user"; } }
async function ensureDemoUser(prisma: NonNullable<Awaited<ReturnType<typeof getPrisma>>>, userId:string){ if(userId==="demo-user") await prisma.user.upsert({ where:{id:"demo-user"}, update:{}, create:{ id:"demo-user", name:"Demo", email:"demo@cognita.local"}}); }
export async function GET(request: NextRequest){
  const prisma=await getPrisma(); if(!prisma) return new Response(JSON.stringify({fallback:true,data:null}),{status:200, headers:{"Content-Type":"application/json","X-Fallback":"localStorage"}});
  const userId=await getUserId(); await ensureDemoUser(prisma,userId);
  const streak=await prisma.streak.findUnique({ where:{ userId }});
  return new Response(JSON.stringify(streak ?? { userId, currentStreak:0, longestStreak:0, totalFocusMinutes:0, totalReviews:0, lastActiveDate:null, daily:{} }),{headers:{"Content-Type":"application/json"}});
}
export async function POST(request: NextRequest){
  const prisma=await getPrisma(); if(!prisma) return new Response(JSON.stringify({fallback:true}),{status:200, headers:{"Content-Type":"application/json","X-Fallback":"localStorage"}});
  const userId=await getUserId(); await ensureDemoUser(prisma,userId);
  let body: Record<string,unknown>; try{ body=await request.json(); }catch{ return new Response(JSON.stringify({error:"Invalid JSON"}),{status:400});}
  const data: Record<string,unknown> = {};
  if("currentStreak" in body) data.currentStreak=Number(body.currentStreak);
  if("longestStreak" in body) data.longestStreak=Number(body.longestStreak);
  if("totalFocusMinutes" in body) data.totalFocusMinutes=Number(body.totalFocusMinutes);
  if("totalReviews" in body) data.totalReviews=Number(body.totalReviews);
  if("lastActiveDate" in body) data.lastActiveDate=body.lastActiveDate as string | null;
  if("daily" in body) data.daily=body.daily as object;
  const updated=await prisma.streak.upsert({ where:{ userId }, update: data, create:{ userId, currentStreak: Number(body.currentStreak??0), longestStreak: Number(body.longestStreak??0), totalFocusMinutes: Number(body.totalFocusMinutes??0), totalReviews: Number(body.totalReviews??0), lastActiveDate: body.lastActiveDate as string | null, daily: (body.daily as object) ?? {} }});
  return new Response(JSON.stringify(updated),{headers:{"Content-Type":"application/json"}});
}
