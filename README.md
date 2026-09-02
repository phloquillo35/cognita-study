# Cognita Study 🧠

Plataforma de estudio universitario con IA para la **Licenciatura en Sistemas de Información** (UTN Facultad Regional Tucumán, Plan 2023 — Ordenanza 1877).

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript** (strict)
- **Tailwind CSS 4** (+ `@tailwindcss/typography`)
- **Zustand** para estado, con persistencia en `localStorage`
- **Vercel AI SDK** + **OpenAI GPT-4o-mini** para el Tutor Socrático
- **NextAuth v5** (β) para autenticación
- PWA: Service Worker + Web App Manifest (instalable, offline-first)

## Funcionalidades

- **Tutor IA Socrático** (`/tutor`): chat que guía con preguntas en vez de dar respuestas directas. La clave de OpenAI se usa solo en `/api/tutor` (server-side); sin `OPENAI_API_KEY` responde con un fallback mock.
- **Flashcards con SM-2** (`/flashcards`): repetición espaciada real.
- **Plan de estudio**, **práctica adaptativa**, **apuntes** y **detalle de materia** con el plan de estudios completo (36 materias) en `src/data/curriculum.ts`.
- **Dark/Light mode** y **PWA instalable**.

## Puesta en marcha

```bash
npm install
cp .env.example .env.local   # edita con tus claves (la IA es opcional)
./scripts/setup-env.sh       # valida dual URL + genera NEXTAUTH_SECRET + crea .env para Prisma
npx prisma db push           # primera vez: sincroniza Supabase (requiere DIRECT_URL)
npm run dev                  # http://localhost:3000
```

Variables de entorno (`.env.local` — ver `.env.example` completo):

```env
OPENAI_API_KEY=sk-...        # opcional — sin esto el tutor usa respuestas mock
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=...          # generado con: openssl rand -base64 32
GITHUB_ID= / GITHUB_SECRET=  # OAuth opcional
GOOGLE_CLIENT_ID= / GOOGLE_CLIENT_SECRET=
DATABASE_URL=postgresql://...:6543/postgres?pgbouncer=true  # Supabase pooler (runtime)
DIRECT_URL=postgresql://...:5432/postgres                   # Supabase direct (migraciones)
```

> Patrón clonable: ver `docs/SUPABASE_VERCEL.md` (dual URL, getPrisma() graceful, checklist prod).

## Estado de la capa de datos

- **Prisma + Supabase PostgreSQL** prod-ready (Vercel Functions via `DATABASE_URL` pooler 6543, migraciones via `DIRECT_URL` 5432).
- **Singleton graceful** `src/lib/prisma.ts` → `getPrisma(): Promise<PrismaClient | null>` (fallback a `localStorage` si no hay `DATABASE_URL`). `src/lib/db.ts` es shim re-export.
- Todas las rutas API (`/api/notes`, `/api/flashcards`, `/api/study-plans`, `/api/generator/decks`, `/api/streak`, `/api/sync`, `/api/tutor/rag`) usan `getPrisma()` con `X-Fallback: localStorage` cuando no hay DB.
- `npx prisma db push` ya ejecutado contra Supabase — ver `docs/SUPABASE_VERCEL.md` para replicar en otro proyecto.

## Scripts

```bash
npm run dev      # desarrollo
npm run build    # build de producción
npm run start    # servir build
npm run lint     # ESLint
```
