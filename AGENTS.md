# AGENTS.md (Workflow Context) — cognita-study
> Generado: 2026-08-29 21:27:56 · Herramienta: opencode · Proyecto: /Users/pablohernandezcanelo/Documents/cognita-study

## 🎯 Objetivo actual
Loop3 Deploy Vercel — prod https://cognita-study.vercel.app, 24 routes, env vars, QA smoke ok

## 📍 Estado actual
  Branch: main · Working tree: SUCIO (2 archivos)

  Cambios sin commit:
   AGENTS.md | 97 ++-------------------------------------------------------------
   LOOP.md   | 85 +++++++++++++++++++++++--------------------------------
   2 files changed, 38 insertions(+), 144 deletions(-)
   M AGENTS.md
   M LOOP.md

  Últimos commits:
  9a4e75d chore(deploy): add postinstall prisma generate for Vercel build
  eabf959 feat(backend): Loop2 — Supabase + CRUD APIs + stores híbridos
  f4323f6 fix(loop1): desbloqueo build — tsc 0, tests 42/42, lint 0 errors
  4320ceb docs: update AGENTS.md con estado real y guía de continuidad
  2a760d1 feat(ux): navegación global inferior, mejoras del tutor (materia/historial) y panorama por materia

## ✅ Tareas activas
  (sin tareas activas)

## 🧭 Próximo paso
_(continuar donde quedó opencode. Si hay tareas in_progress arriba, retomar la primera.)_

## 🧱 Archivos clave / arquitectura
  .
.env.example
.env.local
.vercel
.vercel/project.json
.vercel/README.txt
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
    postinstall: prisma generate
    typecheck: npx tsc --noEmit

## 🧠 Decisiones tomadas
      _(decisiones de diseño/acuerdo a registrar aquí)_
