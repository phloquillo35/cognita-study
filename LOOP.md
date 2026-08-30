# LOOP — cognita-study — Backend Real
Status: done
Iteration: 2/5
Objective: Backend real con PostgreSQL — migrar Zustand localStorage a API CRUD con fallback degradado

> Loop 1 DONE (f4323f6): tsc 0, 42/42 tests, build verde. Stack desbloqueado.
> Loop 2 objetivo OPCIÓN B aprobada: persistencia multi-dispositivo vía PostgreSQL + Prisma, híbrido con fallback localStorage si no hay DB/auth.

---

## Subtareas

### B1 — Infra DB + bootstrap
- Dueño: @joaco
- Salida: .env.local con DATABASE_URL pooler (6543 pgbouncer) + DIRECT_URL session (5432), prisma 6.14, `db push` OK 13.08s, /api/sync ok
- Verificación: `DATABASE_URL` pooler `aws-0-us-east-2.pooler.supabase.com:6543` + `node prisma.user.count()` 0 ✅ + `GET /api/sync` {status:ok, users:0} ✅
- Estado: done ✅ — DB Supabase vxttpffxhyrdeawjypks conectada (TCP 6543/5432 OK), schema 13 modelos push + generate

### B2 — API Flashcards CRUD
- Dueño: @joaco
- Salida: `GET/POST /api/flashcards` + `GET/PATCH/DELETE /api/flashcards/[id]` con auth() fallback demo-user, prisma Flashcard con interval/easeFactor/repetitions/stability/lastReviewed/createdAt
- Verificación: `POST am1 front/back` 201 {id} ✅, `GET` 1 ✅, `PATCH difficulty 5` ✅, `DELETE` 200 ✅, build 24 routes ✅
- Estado: done ✅

### B3 — API Notes + StudyPlans
- Dueño: @joaco
- Salida: `GET/POST /api/notes` + `[id]` PATCH/DELETE con tags search, `GET/POST /api/study-plans` + `[id]` con topics Json, subject relation removida (subjectId string plano)
- Verificación: `POST notes` 201 ✅, `GET notes` 1 ✅, `POST study-plans` 201 con topics Json ✅, `GET study-plans` 1 ✅, `DELETE` all 0 ✅
- Estado: done ✅

### B4 — Migrar stores Zustand a híbrido
- Dueño: @joaco
- Salida: `src/lib/sync.ts` isDbAvailable/cache/withFallback/apiFetch, `flashcardStore` + `noteStore` + `studyPlanStore` con syncStatus, fetchAll, fire-and-forget sync POST/PATCH/DELETE via isDbAvailable, persist preservado
- Verificación: tsc 0 ✅, tests 42/42 ✅, build verde sin hydration mismatch ✅, manual QA: addCard local + fetch POST background ✅
- Estado: done ✅

### B5 — Auth integration + sync endpoint
- Dueño: @joaco
- Salida: auth() con fallback demo-user auto-upsert, /api/sync ya retorna ok/no-db, prisma-missing, db-error — no crash sin OAuth creds (jwt strategy), demo-user ensure en cada API
- Verificación: `auth` fallback demo-user OK ✅, `GET /api/sync` {status:ok} con DB, fallback localStorage sin DB ✅
- Estado: done ✅ (bulk POST /api/sync diferido a Iteration 3 opcional)

### B6 — Verify full
- Dueño: @tester
- Verificación:
  - `npx tsc --noEmit` 0 errores ✅
  - `npm run lint` 0 errors 56 warnings ✅
  - `npm run test` 5 suites 42/42 ✅
  - `npm run build` Compiled successfully 24 routes (6 nuevas APIs) ✅
  - `npx prisma generate` v6.14.0 ✅ + `db push` 8.16s ✅
  - Integración: POST/GET/PATCH/DELETE flashcards/notes/study-plans vía dev server 3001 (2.7-4.3s, X-Fallback ausente en modo DB) ✅ + fallback localStorage intacto ✅

---

## Verification
@tester VERDE — 2026-08-30
- tsc 0, lint 0 errors, 42/42 tests, build verde 24 routes, prisma generate+push OK
- Live QA dev server 3001: /api/sync ok, flashcards CRUD 201/200, notes CRUD, study-plans CRUD con topics Json — todo contra Supabase pooler (6543/5432)
- Fallback verificado: sin DATABASE_URL → {fallback:true} X-Fallback header, stores mantienen localStorage
- Veredicto: GREEN — backend multi-dispositivo operativo, híbrido degradado OK, deployable Vercel (requiere env vars)

## Reflection
@reviewer APPROVED — 2026-08-30
- Infra: Supabase vxttpffxhyrdeawjypks (us-east-2) pooler 6543 tx + 5432 session, .env.local + DIRECT_URL, schema push 13 modelos con nuevos campos Flashcard (interval/easeFactor/repetitions/stability) + StudyPlan topics Json
- API: consistencia fallback (200+fallback vs 200 ok) documentada, demo-user upsert evita FK error sin OAuth, subject relation removida evita seed obligatorio
- Stores: hybrid sin romper tests (fire-and-forget), fetchAll con merge local+remote (last-write-wins por id), syncStatus idle/syncing/fallback/error
- Build: verde ambos modos, prisma 6.14 estable (no 8.0-rc)
- Riesgo residual: 56 warnings (unused vars), generatorStore/streakStore aún sin DB (Iteration 3), bulk POST /api/sync pending, OAuth real sin creds (usa demo-user)
- Decisión: merge listo, próximo loop sugerido: Iteration 3 — generator/streak + Vercel deploy + OAuth real

## Decisions / Notas
- DB: Supabase pooler elegida (6543 pgbouncer tx para app, 5432 session para push/migrate). Direct db.* host no resuelve DNS — usar aws-0-*.pooler.supabase.com
- Schema: Flashcard + Note + StudyPlan removieron relation a Subject (Subject ya no tiene flashcards/notes/studyPlans) para evitar seed obligatorio; subjectId queda string plano (curriculum.ts es fuente)
- Auth: NextAuth 5 beta con demo-user fallback — permite dev sin OAuth, multi-device real requiere OAuth + userId real (futura migración demo-user → real user)
- Sync helper: isDbAvailable cache 30s evita spamear /api/sync por cada addCard
- Estimación Iteration 2: B1-B6 completado en 1 jornada con DB real, fallback-only habría sido 0.5 jornada
