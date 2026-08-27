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
npm run dev                  # http://localhost:3000
```

Variables de entorno (`.env.local`):

```env
OPENAI_API_KEY=sk-...        # opcional — sin esto el tutor usa respuestas mock
NEXTAUTH_SECRET=...          # requerido para login real
GITHUB_ID= / GITHUB_SECRET=  # OAuth opcional
GOOGLE_CLIENT_ID= / GOOGLE_CLIENT_SECRET=
DATABASE_URL=postgresql://  # opcional — hoy la app usa localStorage
```

## Estado de la capa de datos

La app funciona 100% en el cliente con `localStorage`. Existe `prisma/schema.prisma` (13 modelos) como diseño de un backend futuro, pero **aún no está cableado** (no hay migraciones ni cliente generado). Para activarlo: instalar `@prisma/client` + `prisma`, `prisma db push` y mover la persistencia de los stores Zustand a Server Actions / rutas API.

## Scripts

```bash
npm run dev      # desarrollo
npm run build    # build de producción
npm run start    # servir build
npm run lint     # ESLint
```
