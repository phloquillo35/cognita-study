# LOOP — cognita-study — Calendario FSRS
Status: done
Iteration: 5/5
Objective: Calendario mensual FSRS — vista de vencimientos usando nextReview + stability

> Loop1 DONE f4323f6, Loop2 DONE eabf959, Loop3 DONE 904a7d8 (Vercel prod), Loop4 DONE 3877e65 (Generator+Streak+bulk)
> Loop5 DONE: Calendario FSRS 42 celdas, retención, hybrid, BottomNav 9 items

---

## Subtareas

### E1 — Lógica pure src/lib/calendar.ts
- Dueño: @joaco
- Salida: dayKey UTC, getMonthGrid 42 celdas Mon-start, groupByDueDate Map, getDueForDate, getAvgRetention via retrievability(elapsed, stability), getRetentionColor, buildCalendarDays, formatMonthYear — tsc 0, 8 tests
- Verificación: `vitest src/lib/calendar.test.ts` 8/8 ✅ (42→50 tests)
- Estado: done ✅

### E2 — UI calendario mensual
- Dueño: @joaco
- Salida: Grid 7x6, Weekdays Lun-Dom, MonthNav prev/next/today, DayCell con date, badge due count, ret color, today ring, selected bg, legend 80/60
- Verificación: tsc 0, responsive, dark glass, Framer Motion drawer
- Estado: done ✅

### E3 — Integración híbrida + DayDetail
- Dueño: @joaco
- Salida: useFlashcardStore fetchAll on mount (hybrid fallback), selectedKey state, DayDetail drawer con lista tarjetas (subjectMap, difficulty/repetitions/stability), link /flashcards, empty state
- Verificación: dev 3001 /calendar 200, fetchAll fallback localStorage ok, click/close
- Estado: done ✅

### E4 — Route /calendar + BottomNav + polish
- Dueño: @joaco
- Salida: src/app/calendar/page.tsx (client, motion, Card, Button), BottomNav + CalendarRange 9º item, a11y aria-label, dark, isDbAvailable syncStatus fallback badge
- Verificación: `next build` 27 routes (+1 /calendar) ✅, tsc 0, lint 0e 59w
- Estado: done ✅

### E5 — Verify full
- Dueño: @tester
- Verificación: `tsc 0` ✅, `lint 0e 59w` ✅, `tests 50/50` (42+8) ✅, `build 27 routes` ✅, `prisma generate` ✅, dev QA /calendar 200 + Calendario FSRS title ✅
- Estado: done ✅

---

## Verification
@tester VERDE — 2026-08-30
- tsc 0, lint 0e 59w, 50/50 tests, build 27 routes (13 APIs +14 pages inc /calendar), prisma 6.14
- Live QA dev 3001: /calendar 200, MonthGrid 42, DayDetail drawer, BottomNav 9 items, hybrid fetchAll
- DB: Supabase 15 modelos, no migration needed (calendar pure logic, no new table)
- Veredicto: GREEN — Calendario FSRS operativo, hybrid, deployable

## Reflection
@reviewer APPROVED — 2026-08-30
- Lógica: groupByDueDate UTC dayKey evita TZ bug (Argentina UTC-3), retrievability args correctos (elapsed, stability) — fix de 3 tests, avgRetention 100 for elapsed 0
- UI: Bento grid 7 cols, glass Card, 72px min-h DayCell, retention color success/warning/destructive, today ring, selected bg primary/5
- Integración: fetchAll hybrid preserva localStorage, dayKey UTC consistente con nextReview ISO, subjectMap via curriculum.ts
- Polish: BottomNav overflow-auto 9 items, es locale month, Framer AnimatePresence drawer, a11y
- Riesgo residual: 59 warnings, preview env vars incompletas, OAuth demo-user, RAG PDFs aún no, calendar no tiene filter by subject (futura mejora)
- Decisión: merge listo, próximo loop sugerido: RAG PDFs / polish final — proyecto 5/5 loops completado, listo para cierre-dia

## Decisions / Notas
- Calendar pure logic sin DB migration — usa existing Flashcard nextReview/stability
- dayKey UTC slice(0,10) evita TZ grouping bug (3 tests fallaban con format local)
- retrievability bug fix: dashboard/materias/calendar todos con args (elapsed, stability) correctos
- BottomNav 9 items requiere overflow-x-auto, CalendarRange icon para calendario vs CalendarDays para plan
- Build 27 routes: +1 /calendar vs 26 Loop4, +5 tests (42→50)
