# LOOP — cognita-study — Deploy Vercel
Status: done
Iteration: 3/5
Objective: Deploy a producción en Vercel con env vars + verificación prod

> Loop1 DONE (f4323f6): tsc 0, 42/42 tests, build verde 24 routes — stack desbloqueado.
> Loop2 DONE (eabf959): Supabase vxttpffxh pooler 6543/5432, prisma push 13 modelos, APIs CRUD + stores híbridos, build 24 routes, live QA dev 3001 OK.
> Loop3 DONE (9a4e75d + deploy eopg2neo7): Vercel prod deploy 24 routes, env vars, QA smoke ok.

---

## Subtareas

### C1 — CLI + link + compat build
- Dueño: @joaco
- Salida: Vercel CLI 54.14.0 phloquillo35, `vercel link --yes` → .vercel/project.json prj_DLBjVZnDxgTlbLEPCMGxsTvVnheU, package.json postinstall prisma generate, tsc 0 ✅
- Estado: done ✅

### C2 — Env vars Vercel
- Dueño: @joaco
- Salida: DATABASE_URL pooler 6543 tx, DIRECT_URL 5432 session, NEXTAUTH_SECRET 6OU+..., NEXTAUTH_URL https://cognita-study.vercel.app (actualizado de pabloski alias), vercel env ls 4 vars Production ✅
- Estado: done ✅

### C3 — Deploy prod
- Dueño: @joaco
- Salida: `vercel --prod --yes` → https://cognita-study-eopg2neo7-pabloski.vercel.app aliased cognita-study.vercel.app, Build Completed 11s, Compiled successfully 24 routes, prisma generate v6.14 ✅ (redeploy tras NEXTAUTH_URL fix)
- Estado: done ✅ — also git push 9a4e75d auto-deploy, 2 deploys READY

### C4 — QA prod
- Dueño: @tester
- Salida: `GET /api/sync` {status:ok, users:1} 200, `POST/GET/PATCH/DELETE /api/flashcards` 201/200, `POST/GET /api/notes` 201, `POST/GET /api/study-plans` 201 topics Json, `POST /api/tutor` mock 200, `GET /offline|manifest|sw.js` 200, fallback degradado verificado
- Verificación: curl https://cognita-study.vercel.app/api/* prod OK (pabloski alias protected, vercel.app alias public) ✅
- Estado: done ✅ — test data cleaned (0 flashcards/notes/plans post-QA)

### C5 — Verify full
- Dueño: @tester + @reviewer
- Verificación: `tsc 0` ✅, `lint 0e 56w` ✅, `tests 42/42` ✅, `build 24 routes` ✅, `prisma generate` v6.14 ✅, prod smoke 100% ✅
- Estado: done ✅

---

## Verification
@tester VERDE — 2026-08-30
- Local: tsc 0, lint 0e, 42/42 tests, build 24 routes, prisma generate
- Prod: https://cognita-study.vercel.app (alias de eopg2neo7 + q8z1ywr9d) — sync ok, 3 CRUDs 201/200, tutor mock, PWA 200
- Vercel: CLI 54.14, .vercel/project.json, env ls 4 vars Production, 2 deploys READY 34s/57s, postinstall prisma generate no error
- Veredicto: GREEN — deployable y deployado, DB Supabase pooler operativa, hybrid fallback intacto

## Reflection
@reviewer APPROVED — 2026-08-30
- Deploy: postinstall fix crítico (sin él build Vercel PrismaClient not found), NEXTAUTH_URL migrado pabloski → cognita-study.vercel.app canonical, env vars production+preview parcial (preview branch prompts pendientes pero no bloquean prod)
- Alias: cognita-study-pabloski.vercel.app protected por Vercel SSO, cognita-study.vercel.app public — QA debe usar vercel.app alias
- Riesgo residual: 56 warnings, generator/streak aún local, preview env vars incompletas (4 vars solo production, preview necesita re-add con --yes bypass), bulk POST /api/sync pending, OAuth real sin creds (demo-user)
- Decisión: merge listo, próximo loop Iteration 4 — generator/streak DB + OAuth real + bulk sync

## Decisions / Notas
- Vercel project pabloski/cognita-study pre-existía (15 deploys 3d), link --yes reutilizó prj_DLBjVZnDxgTlbLEPCMGxsTvVnheU
- NEXTAUTH_URL debe ser https://cognita-study.vercel.app (no pabloski variant) — actualizado y redeployado
- DATABASE_URL prod pooler 6543 ?pgbouncer=true, DIRECT_URL 5432 session — ambas en Vercel Production
- Build Vercel 8.9s + 32s total, prisma generate 104ms, Turbopack 16.3.3
- Handoff: AGENTS.md actualizado, commit 9a4e75d + deploy eopg2neo7
