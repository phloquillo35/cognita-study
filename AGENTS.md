# Cognita Study — Resumen del Proyecto

Plataforma de estudio universitario con inteligencia artificial para la carrera de **Licenciatura en Sistemas de Información** — UTN Facultad Regional Tucumán (Plan 2023, Ordenanza 1877).

---

## Información General

| Campo | Valor |
|-------|-------|
| **Nombre** | Cognita Study |
| **URL GitHub** | https://github.com/phloquillo35/cognita-study |
| **Universidad** | UTN - Facultad Regional Tucumán |
| **Carrera** | Licenciatura en Sistemas de Información |
| **Plan** | Plan 2023 (Ordenanza 1877) |
| **Total materias** | 36 obligatorias + Electivas |
| **Total horas carrera** | 3,992 horas + 200h Práctica Profesional Supervisada |
| **Niveles** | 5 niveles (5 años) |

---

## Tech Stack

### Frontend
| Tecnología | Versión | Uso |
|-----------|---------|-----|
| Next.js | 16.3.3 | Framework React (App Router + Turbopack) |
| React | 19.x | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.x | Utility-first CSS |
| Framer Motion | 12.x | Animaciones y transiciones |
| Lucide React | - | Iconografía |
| KaTeX | - | Renderizado de LaTeX/Matemática |
| date-fns | - | Manipulación de fechas |

### State Management
| Tecnología | Uso |
|-----------|-----|
| Zustand | Global state + localStorage persistence (flashcardStore, noteStore, studyPlanStore, generatorStore, streakStore) |

### UI Components
| Tecnología | Uso |
|-----------|-----|
| Radix UI | Solo `@radix-ui/react-slot` (vía Button) |
| CVA (Class Variance Authority) | Variantes de componentes |
| clsx + tailwind-merge | Utilidades de clases |

### Backend / API
| Tecnología | Uso |
|-----------|-----|
| Next.js API Routes | Endpoints backend (`/api/tutor`, `/api/generate`, `/api/sync`, `/api/auth`) |
| Vercel AI SDK | Respuestas de IA vía `generateText` |
| OpenAI SDK | Integración con GPT-4o-mini |
| Prisma ORM | PostgreSQL — **scaffold presente** (`src/lib/db.ts` + `prisma/schema.prisma`) pero **no cableado**: la app persiste en localStorage |
| NextAuth.js v5 | Autenticación (Google/GitHub) — requiere credenciales OAuth |

### IA y Algoritmos
| Tecnología | Uso |
|-----------|-----|
| OpenAI GPT-4o-mini | Tutor IA Socrático + Generador de flashcards/quizzes |
| Vercel AI SDK | `/api/tutor` (server-side) y `/api/generate` (server-side) |
| **FSRS-6** | Repetición espaciada para flashcards (`src/lib/fsrs.ts`). Reemplaza al SM-2 original |
| Técnica de Feynman | El tutor pide explicar con palabras propias y detecta lagunas |

### Otros
| Tecnología | Uso |
|-----------|-----|
| next-themes | Dark/Light mode |
| Service Worker | PWA offline-first |
| Web App Manifest | Instalación como app |

---

## Estructura del Proyecto

```
cognita-study/
├── public/
│   ├── manifest.json          # PWA manifest
│   ├── icons/                 # icon.svg, icon-maskable.svg (PWA)
│   └── sw.js                  # Service Worker offline
├── prisma/
│   └── schema.prisma          # Schema PostgreSQL (13 modelos) — scaffold, no cableado
├── src/
│   ├── app/
│   │   ├── page.tsx           # Dashboard principal
│   │   ├── layout.tsx         # Root layout + ThemeProvider + ErrorBoundary + AppShell + Onboarding
│   │   ├── globals.css        # CSS variables, glass, glow effects
│   │   ├── tutor/page.tsx     # Tutor IA Socrático (chat, materia, historial persistente)
│   │   ├── practice/page.tsx  # Práctica adaptativa (quizzes IA + progreso)
│   │   ├── flashcards/page.tsx# Flashcards con FSRS-6 + AIGenerator + export/import
│   │   ├── notes/page.tsx     # Apuntes y notas (CRUD, tags, LaTeX, quiz IA)
│   │   ├── plan/page.tsx      # Plan de estudio adaptativo
│   │   ├── exam/page.tsx      # Modo Examen (simulacro + repaso de débiles)
│   │   ├── focus/page.tsx     # Sesión de Enfoque (Pomodoro + racha + countdown)
│   │   ├── materias/page.tsx  # Panorama por Materia (retención, progreso)
│   │   ├── subject/[id]/page.tsx # Detalle de materia
│   │   ├── login/page.tsx     # Login (GitHub + Google) — requiere OAuth
│   │   ├── offline/page.tsx   # Fallback offline
│   │   └── api/
│   │       ├── tutor/route.ts       # Tutor IA (rate-limit IP 12/min, Feynman prompt)
│   │       ├── generate/route.ts    # Generador IA (rate-limit 10/min, validación 20k chars)
│   │       ├── sync/route.ts        # Health check de DB (scaffold backend)
│   │       └── auth/[...nextauth]/route.ts # NextAuth handler
│   ├── components/
│   │   ├── ui/                # Button.tsx, Card.tsx, Progress.tsx
│   │   ├── layout/            # ThemeProvider, ErrorBoundary, Onboarding, AppShell, BottomNav
│   │   └── study/             # LatexRenderer, AIGenerator, PomodoroTimer
│   ├── data/curriculum.ts     # 36 materias del Plan 1877 (3,300+ líneas)
│   ├── lib/
│   │   ├── auth.ts            # NextAuth config
│   │   ├── utils.ts           # cn(), formatPercentage(), getInitials()
│   │   ├── theme.ts           # Paleta de colores
│   │   ├── fsrs.ts            # Algoritmo FSRS-6 (puro, testeable)
│   │   ├── spaced-repetition.ts # Wrapper FSRS para flashcards (compat SM-2)
│   │   ├── generate.ts        # Prompt + parser + mock del generador IA
│   │   └── db.ts              # Cliente Prisma con carga dinámica (scaffold)
│   ├── stores/
│   │   ├── flashcardStore.ts  # + importCards (export/import)
│   │   ├── noteStore.ts
│   │   ├── studyPlanStore.ts
│   │   ├── generatorStore.ts  # Decks generados por IA
│   │   └── streakStore.ts     # Racha diaria + actividad diaria
│   └── types/index.ts         # Flashcard ahora incluye stability/difficulty
├── .env.example
├── AGENTS.md
├── next.config.ts
├── package.json
├── tsconfig.json
└── vitest.config.ts           # Tests en src/lib y src/stores
```

---

## Funcionalidades Implementadas

### 1. Dashboard (`/`)
- Stats reales (repasos, materias activas, racha, tiempo de enfoque).
- Gráfico de **actividad de 14 días** y **retención estimada FSRS**.
- Quick links a todas las secciones (Tutor, Flashcards, Examen, Enfoque, Práctica, Plan, Materias).

### 2. Tutor IA Socrático (`/tutor`)
- Chat consume `/api/tutor` (server-side; la API key nunca se expone al cliente).
- Prompt **estilo Feynman**: guía con preguntas, pide explicar con palabras propias y detecta lagunas.
- **Selector de materia** enviado a la API.
- **Historial persistente** en `localStorage` + botón "Nueva conversación".
- LaTeX para fórmulas. Fallback mock si no hay `OPENAI_API_KEY`. Rate-limit IP 12/min.

### 3. Práctica Adaptativa (`/practice`)
- Selector de materia (matemática/física).
- Ejercicios: ejemplos estáticos (`SAMPLE_EXERCISES`) **+ quizzes generados por IA** (`/api/generate`, modo quiz).
- Botón "Generar con IA" en caliente.
- Resultado con % y repaso de puntos débiles; registra repasos en la racha.

### 4. Flashcards con FSRS-6 (`/flashcards`)
- Algoritmo **FSRS-6** (`src/lib/fsrs.ts`); las tarjetas guardan `stability`/`difficulty`.
- Flip animation, 6 niveles de calidad, cálculo automático de próxima revisión.
- **Generador IA** embebido (`AIGenerator`) para crear flashcards/quizzes desde texto o `.txt`.
- **Exportar / Importar** decks en JSON (`importCards`).

### 5. Apuntes y Notas (`/notes`)
- CRUD completo, tags, búsqueda, filtro por materia, renderizado LaTeX.
- Botón **"Generar quiz con IA"** desde cualquier nota → crea quizzes y enlaza a `/exam`.

### 6. Plan de Estudio Adaptativo (`/plan`)
- Distribución automática de temas hasta fecha objetivo (`createSmartPlan`).
- "Tareas de Hoy", timeline visual, progress por materia, creación de planes.

### 7. Modo Examen (`/exam`)
- Simulacro con flashcards pendientes + quizzes generados.
- Repaso automático de **puntos débiles** al finalizar, con opción de reintentar solo errores.

### 8. Sesión de Enfoque (`/focus`)
- **Pomodoro** (`PomodoroTimer`) con bloques de 25/5 min que suman tiempo de enfoque.
- **Racha diaria** (`streakStore`) y **countdown** a la fecha del próximo parcial.

### 9. Panorama por Materia (`/materias`)
- Por asignatura: tarjetas totales, pendientes, **retención FSRS**, notas y progreso de plan. Filtrable por nivel.

### 10. Login (`/login`) · Detalle de Materia (`/subject/[id]`) · PWA Offline · Dark/Light
- NextAuth v5 (GitHub/Google) — requiere credenciales OAuth en `.env.local`.
- Detalle de materia con temario, dificultad y correlativas.
- Service Worker cache-first + manifest; página offline.
- Tema oscuro por defecto con toggle.

### 11. UX transversal
- **Navegación global inferior** (`BottomNav` + `AppShell`) en todas las páginas (oculta en `/tutor`).
- **ErrorBoundary** global y **onboarding** inicial.
- `aria-label` en botones de navegación.

### 12. Tests
- Vitest en `src/lib` y `src/stores`: `spaced-repetition.test.ts`, `fsrs.test.ts`, `generate.test.ts`, `streakStore.test.ts`. Correr con `npm run test`.

---

## Plan de Estudios — 36 Materias (Plan 1877)

### Nivel 1 (Primer Año) — 32h/semana, 768h total
| # | Materia | Código | Horas | R | Dificultad |
|---|---------|--------|-------|---|------------|
| 1 | Análisis Matemático I | ISI-101 | 120h | 10 | ⭐⭐⭐⭐ |
| 2 | Álgebra y Geometría Analítica | ISI-102 | 120h | 10 | ⭐⭐⭐⭐ |
| 3 | Física I | ISI-103 | 120h | 10 | ⭐⭐⭐⭐ |
| 4 | Inglés I | ISI-104 | 48h | 3 | ⭐⭐ |
| 5 | Lógica y Estructuras Discretas | ISI-105 | 72h | 6 | ⭐⭐⭐ |
| 6 | Algoritmos y Estructuras de Datos | ISI-106 | 120h | 10 | ⭐⭐⭐⭐ |
| 7 | Arquitectura de Computadoras | ISI-107 | 96h | 6 | ⭐⭐⭐⭐ |
| 8 | Sistemas y Procesos de Negocio | ISI-108 | 72h | 5 | ⭐⭐ |

### Nivel 2 (Segundo Año) — 32h/semana, 768h total
| # | Materia | Código | Horas | R | Dificultad |
|---|---------|--------|-------|---|------------|
| 9 | Análisis Matemático II | ISI-201 | 120h | 10 | ⭐⭐⭐⭐⭐ |
| 10 | Física II | ISI-202 | 120h | 10 | ⭐⭐⭐⭐ |
| 11 | Ingeniería y Sociedad | ISI-203 | 48h | 3 | ⭐ |
| 12 | Inglés II | ISI-204 | 48h | 3 | ⭐⭐ |
| 13 | Sintaxis y Semántica de los Lenguajes | ISI-205 | 96h | 8 | ⭐⭐⭐⭐ |
| 14 | Paradigmas de Programación | ISI-206 | 96h | 8 | ⭐⭐⭐ |
| 15 | Sistemas Operativos | ISI-207 | 96h | 8 | ⭐⭐⭐⭐ |
| 16 | Análisis de Sistemas de Información | ISI-208 | 144h | 10 | ⭐⭐⭐⭐ |

### Nivel 3 (Tercer Año) — 31h/semana, 744h total
| # | Materia | Código | Horas | R | Dificultad |
|---|---------|--------|-------|---|------------|
| 17 | Probabilidad y Estadística | ISI-301 | 72h | 6 | ⭐⭐⭐ |
| 18 | Economía | ISI-302 | 72h | 6 | ⭐⭐ |
| 19 | Bases de Datos | ISI-303 | 96h | 8 | ⭐⭐⭐⭐ |
| 20 | Desarrollo de Software | ISI-304 | 96h | 8 | ⭐⭐⭐⭐ |
| 21 | Comunicación de Datos | ISI-305 | 96h | 8 | ⭐⭐⭐ |
| 22 | Análisis Numérico | ISI-306 | 72h | 6 | ⭐⭐⭐ |
| 23 | Diseño de Sistemas de Información | ISI-307 | 144h | 10 | ⭐⭐⭐⭐⭐ |

### Nivel 4 (Cuarto Año) — 31h/semana, 744h total
| # | Materia | Código | Horas | R | Dificultad |
|---|---------|--------|-------|---|------------|
| 24 | Legislación | ISI-401 | 48h | 4 | ⭐⭐ |
| 25 | Ingeniería y Calidad de Software | ISI-402 | 72h | 6 | ⭐⭐⭐ |
| 26 | Redes de Datos | ISI-403 | 96h | 8 | ⭐⭐⭐⭐ |
| 27 | Investigación Operativa | ISI-404 | 96h | 8 | ⭐⭐⭐⭐ |
| 28 | Simulación | ISI-405 | 72h | 6 | ⭐⭐⭐ |
| 29 | Tecnologías para la Automatización | ISI-406 | 72h | 6 | ⭐⭐⭐ |
| 30 | Administración de Sistemas de Información | ISI-407 | 144h | 10 | ⭐⭐⭐⭐ |

### Nivel 5 (Quinto Año) — 32h/semana, 768h total
| # | Materia | Código | Horas | R | Dificultad |
|---|---------|--------|-------|---|------------|
| 31 | Inteligencia Artificial | ISI-501 | 72h | 6 | ⭐⭐⭐⭐ |
| 32 | Ciencia de Datos | ISI-502 | 72h | 6 | ⭐⭐⭐⭐ |
| 33 | Sistemas de Gestión | ISI-503 | 96h | 8 | ⭐⭐⭐ |
| 34 | Gestión Gerencial | ISI-504 | 72h | 6 | ⭐⭐ |
| 35 | Seguridad en los Sistemas de Información | ISI-505 | 72h | 6 | ⭐⭐⭐⭐ |
| 36 | Proyecto Final | ISI-506 | 144h | 15 | ⭐⭐⭐⭐⭐ |

### Datos por cada materia
Cada una de las 36 materias incluye: descripción profesional, temas oficiales, conceptos clave, bibliografía, metodología, forma de evaluación, objetivos, competencias, ejercicios tipo parcial y correlatividades.

---

## Commits Realizados

### Baseline (upstream original)
| Hash | Descripción |
|------|-------------|
| `42e86f1` | feat: initial setup - Cognita Study |
| `b859f0e` | feat: complete all features - auth, flashcards, notes, study plan, PWA |
| `6885a76` | feat: rewrite curriculum with official Plan 1877 - 36 subjects |
| `8190e3a` | feat: add bibliography, methodology, evaluation, objectives, competencies and partial examples |
| `e544380` | chore: remove helper script |
| `baa41f4` | docs: add comprehensive AGENTS.md with full project summary |
| `e74edc4` | feat: integrate Drive materials + RAG scaffolding + UI for first-year subjects |
| `2cd0368` | feat: hybrid demo mode — wire buttons, dashboard, material viewers, login demo |

### Auditoría y mejoras (`audit/improvements` → `main`)
| Hash | Descripción |
|------|-------------|
| `9fde4be` | audit: fix build blocker, secure tutor AI, clean dead code & PWA |
| `593517e` | audit(loop2): env example, fix SW offline cache, Vitest tests, clean auth |
| `8c3e656` | audit(loop3): add IP rate-limit to /api/tutor |
| `9a057cd` | feat: FSRS-6, generador IA, modo examen, Feynman tutor, focus/streaks, dashboard real y export/import |
| `8785be6` | test: Vitest para generate/fsrs/streakStore + limpieza de imports |
| `c18f10d` | feat(practice): consume quizzes IA, progreso y resultado con repaso de débiles |
| `5b955b3` | feat(analytics): actividad diaria 14 días y retención FSRS en dashboard |
| `85132ee` | feat(notes): generar quiz con IA desde una nota y enlazar a /exam |
| `b814abc` | feat(backend): scaffold Prisma con carga dinámica y /api/sync health check |
| `e64c376` | feat(ux): ErrorBoundary global, onboarding inicial y aria-labels |
| `2a760d1` | feat(ux): navegación global inferior, mejoras del tutor y panorama por materia |

---

## Estado Actual y Próximos Pasos (para el agente en tu PC)

Todo el trabajo de auditoría/mejora está en la rama `audit/improvements` y también fusión-adelantada en `main`
(commit `2a760d1`). **El entorno donde se generó este código NO tiene Node.js**, así que no se pudieron correr
`build`, `lint` ni `test`. En tu computadora, **antes de seguir**, validá:

```bash
npm install
npm run build      # debe compilar sin errores
npm run test       # Vitest: fsrs, generate, spaced-repetition, streakStore
npm run lint
```

Si algo falla, corregilo y commitealo. Luego continuá con el backlog de abajo.

### Backlog priorizado (sugerencias de continuidad)
1. **Fase B — Backend real (multi-dispositivo)**: instalar/generar `@prisma/client` (`npx prisma generate`),
   definir `DATABASE_URL`, y reemplazar los stores de Zustand por llamadas a la API (usar `/api/sync` como base
   y agregar endpoints CRUD para flashcards/notes/plans). Esto habilita sincronización entre dispositivos.
2. **Login funcional**: configurar credenciales OAuth de GitHub y Google en `.env.local` y verificar `/login`
   (hoy el flujo está cableado pero sin credenciales no autentica).
3. **Enriquecer `/subject/[id]`**: ya hay datos en `curriculum.ts` (bibliografía, metodología, evaluación,
   objetivos, ejercicios tipo parcial). Mostralos en la UI.
4. **Subida de PDFs + RAG**: el scaffold existe (`e74edc4`). Implementar parsing de PDF y retrieval semántico
   para alimentar al tutor y al generador.
5. **Vista de repaso / calendario**: una página dedicada que liste las flashcards próximas a vencer (FSRS) en
   un calendario mensual, aprovechando `stability`/`nextReview`.
6. **Deploy en Vercel**: CI/CD, configurar variables de entorno (`OPENAI_API_KEY`, `DATABASE_URL`, OAuth).
7. **Internacionalización** (es/en) y **notificaciones push** de recordatorio de estudio.

> Regla de oro: mantené el modo "sin backend" funcionando (localStorage) como fallback cuando no haya
> `DATABASE_URL`, para no romper la experiencia en desarrollo.

---

## Cómo Ejecutar

```bash
git clone https://github.com/phloquillo35/cognita-study.git
cd cognita-study
npm install
cp .env.example .env.local   # editar con tus keys
npm run dev                  # http://localhost:3000
```

### Variables de Entorno
```env
OPENAI_API_KEY=sk-...                       # opcional (sin esto: mock)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tu-secret-aqui
GITHUB_ID=...                               # opcional (login)
GITHUB_SECRET=...
GOOGLE_CLIENT_ID=...                        # opcional (login)
GOOGLE_CLIENT_SECRET=...
DATABASE_URL=postgresql://...               # opcional (sin esto: localStorage)
```

---

## Arquitectura y Decisiones de Diseño

### UI/UX
- Dark mode por defecto (anti-fatiga), glass morphism, Bento Grid, micro-animaciones (Framer Motion), mobile-first.

### State Management
- Zustand con persistencia en localStorage: `flashcardStore`, `noteStore`, `studyPlanStore`, `generatorStore`, `streakStore`.
- Cada feature tiene su store; los datos sobreviven al cierre del navegador.

### IA Integration
- Vercel AI SDK server-side; prompt Socrático + Técnica de Feynman; fallback mock sin API key.
- Generador IA (`/api/generate`) con rate-limit 10/min y validación de tamaño.

### Algoritmo de repetición espaciada
- **FSRS-6** en `src/lib/fsrs.ts` (funciones puras y testeables). `spaced-repetition.ts` es un wrapper que
  mantiene la firma previa (`ReviewQuality`, `getQualityLabel`, `getQualityColor`, `isDue`) para no romper
  la UI. Las tarjetas persisten `stability` y `difficulty`.

### Backend
- Scaffold presente: `src/lib/db.ts` (Prisma con carga dinámica para no romper el build sin el paquete) y
  `/api/sync` (health check). Falta cablear los stores a la DB.

### Data
- Curriculum completo (36 materias, Plan 1877), 3,300+ líneas en `src/data/curriculum.ts`.

---

*Última actualización: 27 de agosto de 2026*
*Mantenido por: opencode (big-pickle) + agente en la PC del usuario*
*Repositorio: https://github.com/phloquillo35/cognita-study*
