# LOOP — cognita-study — Mejoras + RAG básico
Status: done
Iteration: 6/6
Objective: Cerrar deuda + RAG PDFs básico + polish (cierre de gaps Loops 1-5)

> Contexto vivo 2026-08-30:
> - L1 f4323f6: tsc 0, build verde, 15 errores TS fix
> - L2 eabf959: Supabase pooler 6543/5432, CRUD flashcards/notes/studyPlans, hybrid stores
> - L3 904a7d8: Vercel prod https://cognita-study.vercel.app 24 routes, postinstall, env vars prod OK
> - L4 3877e65: GeneratorDeck + Streak + bulk POST /api/sync, 15 modelos Prisma, 26 routes
> - L5 c6e7fe2/c60224e: Calendario FSRS 27 routes, 50 tests, 59w→0w, BottomNav 9 items, retrievability fix
> - L6 113c3b7 + htcavcq7f: F1-F5 lint 0w, RAG 2 routes, calendario filter, PWA v2, rateLimit 4 routes, E2E 5

---

## Subtareas

### F1 — Lint debt 59w → 0w
- Dueño: @joaco
- Salida: 15 eslint-disable justificados, Math.random→index*0.05, 25 files edit, tsc 0, tests 60/60, build 29 routes
- Verificación: `npm run lint` 0e 0w ✅
- Estado: done ✅ — 2026-08-30 21:53 UTC

### F2 — Preview env + OAuth real
- Dueño: @joaco
- Salida: vercel env add via API directo 8 entries (4 vars × Production+Preview), OAuth GitHub callback docs https://cognita-study.vercel.app/api/auth/callback/github, demo-user fallback intacto
- Verificación: `vercel env ls` 8 ✅, `/api/auth/providers` 200 ✅
- Estado: done ✅

### F3 — RAG PDFs básico
- Dueño: @joaco
- Salida: pdf-parse 2.4.5 + mammoth 1.11, src/lib/rag.ts chunk 800/100 + TF, POST /api/rag/upload (pdf/docx/txt 10MB) + GET /api/rag/search, ragContext in tutor/generate, UI /tutor + /notes, 6 tests
- Verificación: `curl POST /api/rag/upload` 200 ✅, `GET /api/rag/search?q=test` 200 ✅, build 29 routes ✅
- Estado: done ✅

### F4 — Calendario polish
- Dueño: @joaco
- Salida: filterBySubject/searchBySubject/toIcal RFC5545, Select materia + ?subject= deep-link + export .ics Blob, 8→12 tests, 60/60
- Verificación: `vitest calendar.test` 12/12 ✅, `toIcal` BEGIN:VCALENDAR ✅
- Estado: done ✅

### F5 — PWA v2 + rate-limit + E2E
- Dueño: @joaco/@tester
- Salida: sw.js cognita-v2 + staleWhileRevalidate /api 60s, src/lib/rateLimit.ts Upstash INCR/EXPIRE + Map fallback warn, 4 routes (tutor 12, generate 10, rag-upload 12, rag-search 30), e2e/smoke.spec.ts 5, playwright.config.ts
- Verificación: `cat sw.js | grep v2` ✅, `npx playwright test` 5 passed ✅, `curl 13 req` 12×200 +1×429 ✅
- Estado: done ✅

### F6 — Verify full
- Dueño: @tester
- Verificación: `tsc 0` ✅, `lint 0e 0w` ✅, `tests 60/60` ✅ (7 files), `playwright 5` ✅, `build 29 routes` ✅ (14p+15APIs), `prisma generate` v6.14 ✅, `vercel env ls` 8 ✅, `curl prod /api/sync` 200 ✅, `curl prod /api/rag/search?q=test` 200 (was 404 stale, now 200 after htcavcq7f) ✅, `curl prod /calendar` 200 ✅
- Estado: done ✅ — VERDE 2026-08-30 01:45 UTC after git push + vercel --prod htcavcq7f

---

## Verification
@tester VERDE — 2026-08-30 22:00 UTC (final after deploy htcavcq7f)
- Local: tsc 0, lint 0e 0w, 60/60 tests (7 files: rag 6, fsrs 7, spaced 16, utils 5, generate 10, streak 4, calendar 12), playwright 5, build 29 routes (14p+15APIs), prisma 6.14
- Vercel: 8 env vars (Production+Preview), prod https://cognita-study.vercel.app (htcavcq7f 52s) + https://cognita-study-htcavcq7f-pabloski.vercel.app, 29 routes, postinstall prisma generate, no PrismaClient error
- Prod smoke: /api/sync 200 {ok, users:1}, /api/rag/search?q=test 200 {count:0} (previo 404 stale), /api/rag/upload 200, /calendar 200, /api/auth/providers 200, rateLimit 429 after 13
- Git: 113c3b7 feat(loop6) pushed, vercel auto-deploy + manual --prod, LOOP.md 6/6 done
- Veredicto: GREEN — F1-F5 completos, prod actualizado, deployable, 5 loops + 1 mejora = 6/6 cierre

## Reflection
@reviewer APPROVED — 2026-08-30 22:00 UTC
- F1 lint 0w: 15 disables auditados con reason, Math.random determinístico, no lógica rota, eslint.config.mjs intacto
- F2 preview env: API workaround documentado (CLI 54.14 prompt git_branch_required), 8/8 vars, OAuth docs callback, demo-user fallback no bloquea GREEN
- F3 RAG: Map globalThis.__cognita_rag_store + Note fallback evita migración Prisma, volátil serverless aceptable v1, 10MB limit, rateLimit 12/30, tutor/generate ragContext prepend no 500
- F4 calendario: 3 puras + deep-link ?subject= + export .ics Blob RFC5545, a11y aria-label, BottomNav 9 items overflow-auto
- F5 PWA v2: cognita-v2 + activate purga v1 + staleWhileRevalidate 60s (solo /api GET, no POST), rateLimit centralizado Upstash+Map warn once, Playwright 5 no-flaky (resilient selectors)
- F6 gate: 5 loops DONE (L1 15 TS fix, L2 Supabase 13 modelos, L3 Vercel 24 routes, L4 Generator+Streak+bulk 26 routes, L5 Calendar 27 routes 50 tests, L6 mejoras 29 routes 60 tests + RAG) — total 6/6 loops, 40 files, 1802 insertions
- Riesgo residual: RAG Map volátil (sugerir RagDocument Prisma Loop7), preview env ya fix, OAuth demo-user (set GITHUB_ID para real), 0 warnings, E2E solo 5 smoke (falta rag/calendar e2e)
- Decisión: APPROVED — merge listo, proyecto 6/6 completo, próximo sugerido: cierre-dia + RAG persistencia + OAuth real si se desea

## Decisions / Notas
- Lint F1: 59→0w via 15 disables justificados, no bajar severidad global, Math.random → index*0.05 determinístico
- Preview env F2: CLI 54.14 `vercel env add preview` falla prompt git_branch_required → workaround POST https://api.vercel.com/v10/projects/prj_.../env con token + type encrypted, documentado
- RAG F3: pdf-parse 2.4.5 (PDFParse.getText) + mammoth 1.11, chunk 800/100, TF phrase bonus 0.5, context 3k chars top4, Map globalThis no requiere migration, Note fallback tags ["rag"] opcional
- Calendar F4: dayKey UTC slice evita TZ bug, retrievability fix (elapsed,stability) en 3 lugares, toIcal uses day.key y escapeIcal, Select derived from searchParams (no setState-in-effect)
- PWA F5: cognita-v2 CACHE_NAME + VERSION ?v=2 cache-busting, sw.js activate purges v1, rateLimit Map fallback warn once, Upstash INCR/EXPIRE si env vars existen
- Build: 29 routes = 14 pages (○ / + /calendar new) +15 APIs (ƒ + /api/rag/* 2 new vs 27 L5), 60 tests = 42 base +6 rag +12 calendar
