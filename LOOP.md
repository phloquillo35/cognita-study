# LOOP — cognita-study — Backend 100%
Status: done
Iteration: 4/5
Objective: Backend 100% — Generator + Streak + bulk sync + OAuth migración

> Loop1 DONE f4323f6, Loop2 DONE eabf959, Loop3 DONE 904a7d8 (Vercel prod https://cognita-study.vercel.app)
> Loop4 DONE: GeneratorDeck + Streak models, APIs + bulk sync, stores híbridos, OAuth fallback

---

## Subtareas

### D1 — Modelo DB: GeneratorDeck + Streak
- Dueño: @joaco
- Salida: prisma/schema.prisma + GeneratorDeck (id, userId, subjectId, title, type, flashcards/quizzes Json) + Streak (userId PK, current/longest, totalFocusMinutes/totalReviews, lastActiveDate, daily Json) + User relations, `db push` 7.41s + generate v6.14 ✅
- Verificación: `grep GeneratorDeck|Streak prisma/schema.prisma` 2 modelos, `tsc 0` ✅
- Estado: done ✅

### D2 — APIs: generator decks + streak/stats + bulk POST /api/sync
- Dueño: @joaco
- Salida: `GET/POST /api/generator/decks` + `GET/DELETE [id]`, `GET/POST /api/streak` (upsert daily), `POST /api/sync` bulk $transaction upsert flashcards/notes/studyPlans/generatorDecks/streak + migrateFrom demo-user
- Verificación: dev 3001 `POST decks` 201 ✅, `GET streak` 0 ✅, `POST streak` 2/5 ✅, `POST /api/sync` bulk 1 ✅, build 27 routes ✅
- Estado: done ✅

### D3 — Stores híbridos: generatorStore + streakStore
- Dueño: @joaco
- Salida: generatorStore syncStatus/fetchAll/fire-and-forget POST/DELETE, streakStore syncStatus/fetchAll/syncToDb + registerActivity/addFocusMinutes/addReviews auto-sync, isDbAvailable cache 30s, persist preservado
- Verificación: tsc 0 ✅, tests 42/42 ✅, build verde ✅, manual QA POST streak daily merge ✅
- Estado: done ✅

### D4 — OAuth real + migración demo-user
- Dueño: @joaco
- Salida: auth.ts jwt callbacks + demo-user fallback intacto, PrismaAdapter opcional documentado (no instalado, no bloquea), Vercel env OAuth vars opcionales, POST /api/sync migrateFrom demo-user → real user via updateMany + streak upsert, fallback demo-user verde si sin creds
- Verificación: `/api/auth/providers` 200, demo-user fallback sin crash, migrate tested via bulk sync ✅
- Estado: done ✅ — fallback demo-user not blocking GREEN, OAuth real deferred a creds provistas

### D5 — Verify full
- Dueño: @tester
- Verificación: `tsc 0` ✅, `lint 0e 57w` ✅, `tests 42/42` ✅, `build 27 routes` (6 Loop2 + 3 Loop4: generator, streak, sync bulk) ✅, `prisma generate` ✅, `prisma db push` 7.41s ✅, dev 3001 QA generator/streak/sync 200 ✅
- Estado: done ✅

---

## Verification
@tester VERDE — 2026-08-30
- tsc 0, lint 0e 57w, 42/42 tests, build 27 routes (Compiled successfully), prisma 6.14 generate+push
- Live QA dev 3001: generator decks CRUD 201, streak GET 0 → POST 2/5 → daily merge, bulk sync POST 1, flashcards/notes/study-plans still ok, fallback localStorage intacto
- DB: Supabase vxttpffxh pooler 5432 session push + 6543 tx runtime, users 1 (demo-user), 15 modelos now, streak daily Json, generatorDecks Json
- Veredicto: GREEN — backend 100% operativo (generator+streak+bulk), hybrid fallback, deployable

## Reflection
@reviewer APPROVED — 2026-08-30
- Modelos: GeneratorDeck Json flashcards/quizzes + Streak Json daily — elección Streak single row vs StreakDay daily rows: single row más simple para Zustand Record<string,DailyActivity>, vistas futuras pueden migrar a StreakDay si agrega analytics por fecha
- APIs: bulk sync $transaction upsert + migrateFrom demo-user→real empaqueta todo en una call, usado por futura UI "Migrar mis datos al loguearme"
- Stores: generator/streak Fire-and-forget + fetchAll merge (last-write-wins), streakStore syncToDb en cada mutación + isDbAvailable cache evita spam /api/sync
- OAuth: demo-user fallback documentado, PrismaAdapter no instalado no bloquea — cuando GITHUB_ID etc se seteen en Vercel, auth() retornará real userId y bulk sync migrará
- Riesgo residual: 57 warnings, preview env vars incompletas, OAuth real sin creds (no bloquea), RAG/calendario aún no
- Decisión: merge listo, próximo loop Iteration 5 — RAG PDFs / calendario FSRS / polish

## Decisions / Notas
- Streak modelo single row con daily Json vs tabla diaria: elegido single row por simplicidad y compat directa con streakStore Record
- GeneratorDeck type string "flashcards"|"quiz" + flashcards/quizzes Json nullable — mapea directo a GeneratorDeck interface
- Bulk sync idempotent upsert por id, studyPlans usa id fallback subjectId+userId si no hay id
- Supabase: usar pooler 5432 para push, 6543 tx para runtime — ya configurado Vercel Production
- Vercel: último prod https://cognita-study-eopg2neo7-pabloski.vercel.app aliased vercel.app, postinstall prisma generate OK
