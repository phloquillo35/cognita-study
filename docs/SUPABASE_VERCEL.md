# Supabase + Vercel — Patrón Clonable (Manual, Portable)

> Objetivo: dejar cualquier proyecto Next.js + Prisma + Supabase **prod-ready** en Vercel con el patrón manual portable. Este doc es la referencia clonable para futuros proyectos.

## 1. Arquitectura dual URL (Supabase)

Supabase expone dos connection strings:

| Variable | Puerto | PgBouncer | Uso |
|----------|--------|-----------|-----|
| `DATABASE_URL` | `6543` (pooler) | `?pgbouncer=true` | **Runtime** de la app (Vercel Functions + local dev) |
| `DIRECT_URL`   | `5432` (direct) | sin pgbouncer | **Migraciones** (`prisma db push` / `migrate`) |

**Por qué dos:** Vercel Functions necesitan pooling (muchas conexiones cortas). Las migraciones necesitan conexión directa sin PgBouncer. Sin `directUrl`, `prisma db push` falla o es lento.

### Supabase Dashboard

`Supabase → Project → Settings → Database → Connection string`

- **Transaction pooling (6543)** → `DATABASE_URL`
- **Direct connection (5432)** → `DIRECT_URL`

Formato pooler: `postgresql://postgres.[ref]:[pwd]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true`
Formato direct: `postgresql://postgres:[pwd]@db.[ref].supabase.co:5432/postgres`

## 2. Prisma — schema.prisma

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

> `directUrl` es **requerido** para que `prisma migrate`/`db push` use la conexión directa. Vercel y local deben tener ambas vars.

## 3. getPrisma() graceful — singleton único

**Un solo archivo:** `src/lib/prisma.ts`

```ts
import type { PrismaClient } from "@prisma/client";
declare global { var __cognitaPrisma: PrismaClient | undefined; }
let singleton: PrismaClient | null | undefined = globalThis.__cognitaPrisma;
let tried = false;
export async function getPrisma(): Promise<PrismaClient | null> {
  if (tried) return singleton ?? null;
  tried = true;
  if (!process.env.DATABASE_URL) return null; // fallback a localStorage
  const { PrismaClient } = await import("@prisma/client");
  const c = new PrismaClient({ log: process.env.NODE_ENV==="development"?["query","error","warn"]:["error"]});
  singleton = c; if(process.env.NODE_ENV!=="production") globalThis.__cognitaPrisma=c;
  return c;
}
export async function isDbAvailable(){ const p=await getPrisma(); if(!p) return false; try{await p.$queryRaw`SELECT 1`; return true}catch{return false} }
```

**Shim compatibilidad:** `src/lib/db.ts` solo re-exporta:

```ts
export { getPrisma, isDbAvailable } from "./prisma";
```

**Uso en routes:**

```ts
const prisma = await getPrisma();
if (!prisma) return NextResponse.json({ fallback:true },{status:200, headers:{"X-Fallback":"localStorage"}});
// o 503 si es /api/register (operación que requiere DB)
```

> Nunca `new PrismaClient()` directo. Nunca `import { prisma } from "@/lib/prisma"` eager — rompe build sin `DATABASE_URL`.

## 4. Variables de entorno — matriz completa

| Var | Local `.env.local` | Vercel Production | Vercel Preview | Notas |
|-----|-------------------|-------------------|----------------|-------|
| `DATABASE_URL` | pooler 6543 | encrypted/sensitive | encrypted | `?pgbouncer=true` |
| `DIRECT_URL` | direct 5432 | encrypted/sensitive | encrypted | solo migraciones |
| `NEXTAUTH_URL` | `http://localhost:3000` | `https://<prod>.vercel.app` | `https://<preview>` o prod | debe matchear deploy alias |
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` | strong 44 chars | strong 44 chars | rotar si contiene `dev-` o `<32` chars |
| `OPENAI_API_KEY` | opcional | opcional | opcional | sin esto → mock |

Verificación:

```bash
vercel env ls --format json | python3 -c "import json,sys; print(json.load(sys.stdin)['envs'])"
vercel env ls # 8 vars (4 prod + 4 preview) esperado
cat .env.local | sed 's/=.*/=***/'
grep -E "DATABASE_URL|DIRECT_URL" .env.local | grep -o ":[0-9]\+/"
```

Rotar `NEXTAUTH_SECRET` si es débil:

```bash
NEW=$(openssl rand -base64 32)
# local
sed -i '' "s/NEXTAUTH_SECRET=.*/NEXTAUTH_SECRET=$NEW/" .env.local .env
# vercel (prod + preview) — si CLI pide gitBranch, usar API:
curl -X POST "https://api.vercel.com/v10/projects/$PRJ/env?teamId=$TEAM" \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d "{\"key\":\"NEXTAUTH_SECRET\",\"value\":\"$NEW\",\"type\":\"encrypted\",\"target\":[\"preview\"]}"
```

## 5. Setup local — script portable

```bash
./scripts/setup-env.sh         # genera .env.local si falta, valida puertos, crea .env para Prisma
./scripts/setup-env.sh --check # solo valida sin escribir
```

El script:

- Copia `.env.example → .env.local` si no existe
- Genera `NEXTAUTH_SECRET` con `openssl rand -base64 32` si detecta placeholder/weak
- Valida `DATABASE_URL` contiene `:6543` y `pgbouncer=true`, `DIRECT_URL` contiene `:5432`
- Crea/sincroniza `.env` (requerido por `prisma validate` — Prisma no lee `.env.local`)
- Ejecuta `npx prisma validate` y reporta OK/FAIL

## 6. Primer deploy a Supabase

> **Único toque real a la DB.** Si falla, diagnosticar sin reintentar destructivo.

```bash
npm install
cp .env.example .env.local # editar con credenciales Supabase
./scripts/setup-env.sh
npx prisma generate
npx prisma db push          # crea tablas en Supabase (usa DIRECT_URL)
npm run build               # debe pasar sin "Environment variable not found: DIRECT_URL"
npm run dev                 # probar local
```

**Si `db push` falla con FK violation** (ej. `notes_subjectId_fkey`):

```bash
node --env-file=.env -e "
const {PrismaClient}=require('@prisma/client');
(async()=>{const p=new PrismaClient();
 console.log('subjects',await p.subject.count(),'notes',await p.note.count());
 await p.\$executeRaw\`DELETE FROM \"notes\" WHERE \"subjectId\" NOT IN (SELECT \"id\" FROM \"subjects\")\`;
 console.log('cleaned'); await p.\$disconnect();})()"
npx prisma db push # reintentar
```

## 7. Verificación prod — checklist DONE

```bash
# build local
npx tsc --noEmit && npx eslint . && npm run build && npm test

# smoke local (requiere dev server)
PORT=3001 node --env-file=.env ./node_modules/next/dist/bin/next start --port 3001 &
curl -s http://localhost:3001/api/register -X POST -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test+'$(date +%s)'@test.local","password":"123456"}' | grep id

# deploy
git push origin main # Vercel auto-deploy (o vercel --prod)

# smoke prod
curl -s https://cognita-study.vercel.app/api/register -X POST -H "Content-Type: application/json" \
  -d '{"name":"Prod Test","email":"prod+'$(date +%s)'@test.local","password":"123456"}'
```

## 8. Clonar patrón a nuevo proyecto

1. Copiar `prisma/schema.prisma` (bloque `datasource db` con `directUrl`)
2. Copiar `src/lib/prisma.ts` + `src/lib/db.ts` (singleton graceful)
3. Copiar `.env.example` (sección dual URL + comentarios)
4. Copiar `scripts/setup-env.sh` (sin cambios, es portable)
5. Copiar este doc a `docs/SUPABASE_VERCEL.md` y adaptar `projectName`/`aliases`
6. Configurar Vercel envs: `DATABASE_URL` (6543), `DIRECT_URL` (5432), `NEXTAUTH_URL`, `NEXTAUTH_SECRET` (ambos envs)
7. Ejecutar `npx prisma db push` una vez contra el nuevo proyecto Supabase

## 9. Troubleshooting

| Síntoma | Causa | Fix |
|---------|-------|-----|
| `Environment variable not found: DIRECT_URL` en build | `.env` no existe (solo `.env.local`) | `cp .env.local .env` o `./scripts/setup-env.sh` |
| `vercel env pull` retorna valores vacíos `""` | Vars son `sensitive`/`encrypted` — pull no desencripta en CLI reciente | Verificar vía `vercel env ls`, no `pull`. Usar API para rotar. |
| `vercel env add ... preview` → `git_branch_required` | CLI preview requiere branch en versión nueva | Usar API `curl POST /v10/projects/.../env` con `target:["preview"]` |
| `db push` FK violation `notes_subjectId_fkey` | Tabla `notes` con `subjectId` huérfanos y `subjects` vacía | Borrar huérfanos: `DELETE FROM "notes" WHERE "subjectId" NOT IN (SELECT "id" FROM "subjects")` |
| Build pasa local pero falla en Vercel `DATABASE_URL` | Vercel env `DATABASE_URL` no configurada para Production | `vercel env ls` debe mostrar 8 vars (4 prod + 4 preview) |
| `NEXTAUTH_SECRET` débil | Contiene `dev-` o `<32 chars` | `openssl rand -base64 32` + rotar local y Vercel |

---

**Mantenido en:** `cognita-study` — commit `2e1df89` feat(db) unifica Prisma + directUrl.
**Alias prod:** `https://cognita-study.vercel.app` (deploy `htcavcq7f`).
