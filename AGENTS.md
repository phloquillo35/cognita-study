# AGENTS.md (Workflow Context) — cognita-study
> Generado: 2026-08-29 21:18:59 · Herramienta: opencode · Proyecto: /Users/pablohernandezcanelo/Documents/cognita-study

## 🎯 Objetivo actual
Loop2 Backend Real — Supabase conectado, APIs CRUD + stores híbridos, DB push OK

## 📍 Estado actual
  Branch: main · Working tree: SUCIO (14 archivos)

  Cambios sin commit:
   AGENTS.md | 382 ++------------------------------------------------------------
   1 file changed, 7 insertions(+), 375 deletions(-)
   M AGENTS.md
  M  LOOP.md
  M  prisma/schema.prisma
  A  src/app/api/flashcards/[id]/route.ts
  A  src/app/api/flashcards/route.ts
  A  src/app/api/notes/[id]/route.ts
  A  src/app/api/notes/route.ts
  A  src/app/api/study-plans/[id]/route.ts
  A  src/app/api/study-plans/route.ts
  M  src/lib/db.ts
  A  src/lib/sync.ts
  M  src/stores/flashcardStore.ts
  M  src/stores/noteStore.ts
  M  src/stores/studyPlanStore.ts

  Últimos commits:
  f4323f6 fix(loop1): desbloqueo build — tsc 0, tests 42/42, lint 0 errors
  4320ceb docs: update AGENTS.md con estado real y guía de continuidad
  2a760d1 feat(ux): navegación global inferior, mejoras del tutor (materia/historial) y panorama por materia
  e64c376 feat(ux): ErrorBoundary global, onboarding inicial y aria-labels en navegación
  b814abc feat(backend): scaffold Prisma con carga dinámica y /api/sync health check

## ✅ Tareas activas
  (sin tareas activas)

## 🧭 Próximo paso
_(continuar donde quedó opencode. Si hay tareas in_progress arriba, retomar la primera.)_

## 🧱 Archivos clave / arquitectura
  .
.env.example
.env.local
AGENTS.md
CLAUDE.md
eslint.config.mjs
LOOP.md
next-env.d.ts
next.config.ts
package-lock.json
package.json
postcss.config.mjs
prisma
prisma/schema.prisma
public
public/file.svg
public/globe.svg
public/icons
public/manifest.json
public/next.svg
public/sw.js
public/vercel.svg
public/window.svg
README.md
scripts
scripts/extract-texts.ts
scripts/sync-drive.ts
src
src/app
src/components
src/data
src/lib
src/stores
src/types
tsconfig.json
tsconfig.tsbuildinfo
vitest.config.ts

## 🔐 Variables de entorno requeridas
  Nombres de variables (sin valores):
    DATABASE_URL
    GITHUB_ID
    GITHUB_SECRET
    GOOGLE_CLIENT_ID
    GOOGLE_CLIENT_SECRET
    NEXTAUTH_SECRET
    NEXTAUTH_URL
    OPENAI_API_KEY

## 📦 Comandos útiles
  Scripts disponibles:
    dev: next dev
    build: next build
    start: next start
    lint: eslint
    test: vitest run
    typecheck: npx tsc --noEmit

## 🧠 Decisiones tomadas
    _(decisiones de diseño/acuerdo a registrar aquí)_
