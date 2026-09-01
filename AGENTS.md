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
| Zustand | Global state + localStorage persistence |

### UI Components
| Tecnología | Uso |
|-----------|-----|
| Radix UI | Primitivas accesibles (Dialog, Dropdown, Tabs, Progress, etc.) |
| CVA (Class Variance Authority) | Variantes de componentes |
| clsx + tailwind-merge | Utilidades de clases |

### Backend / API
| Tecnología | Uso |
|-----------|-----|
| Next.js API Routes | Endpoints backend |
| Vercel AI SDK | Streaming de IA |
| OpenAI SDK | Integración con GPT |
| Prisma ORM | PostgreSQL database |
| NextAuth.js v5 | Autenticación (Google + GitHub) |

### IA y Algoritmos
| Tecnología | Uso |
|-----------|-----|
| OpenAI GPT-4o-mini | Tutor IA Socrático |
| Vercel AI SDK (streamText) | Streaming de respuestas |
| SM-2 Algorithm | Repetición espaciada para flashcards |

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
│   └── sw.js                  # Service Worker offline
├── prisma/
│   └── schema.prisma          # Schema de PostgreSQL (12 modelos)
├── src/
│   ├── app/
│   │   ├── page.tsx           # Dashboard principal (Bento Grid)
│   │   ├── layout.tsx         # Root layout + ThemeProvider + PWA
│   │   ├── globals.css        # CSS variables, glass, glow effects
│   │   ├── tutor/
│   │   │   └── page.tsx       # Tutor IA Socrático (chat interface)
│   │   ├── practice/
│   │   │   └── page.tsx       # Ejercicios adaptativos
│   │   ├── flashcards/
│   │   │   └── page.tsx       # Flashcards con SM-2
│   │   ├── notes/
│   │   │   └── page.tsx       # Apuntes y notas
│   │   ├── plan/
│   │   │   └── page.tsx       # Plan de estudio adaptativo
│   │   ├── subject/[id]/
│   │   │   └── page.tsx       # Detalle de materia
│   │   ├── login/
│   │   │   └── page.tsx       # Login (GitHub + Google)
│   │   ├── offline/
│   │   │   └── page.tsx       # Fallback offline
│   │   └── api/
│   │       ├── tutor/
│   │       │   └── route.ts   # API Tutor IA (streaming)
│   │       └── auth/
│   │           └── [...nextauth]/
│   │               └── route.ts # NextAuth handler
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx     # Botón con variantes (CVA)
│   │   │   ├── Card.tsx       # Tarjetas
│   │   │   └── Progress.tsx   # Barra de progreso
│   │   ├── layout/
│   │   │   ├── Navbar.tsx     # Navegación responsive
│   │   │   └── ThemeProvider.tsx # next-themes wrapper
│   │   └── study/
│   │       └── LatexRenderer.tsx # Renderizado KaTeX
│   ├── data/
│   │   └── curriculum.ts      # 36 materias del Plan 1877 (3,300+ líneas)
│   ├── lib/
│   │   ├── auth.ts            # NextAuth config
│   │   ├── exerciseGenerator.ts # Generador de ejercicios desde el temario
│   │   ├── utils.ts           # cn(), formatPercentage(), getInitials()
│   │   ├── theme.ts           # Paleta de colores dark/light
│   │   └── spaced-repetition.ts # Algoritmo SM-2
│   ├── stores/
│   │   ├── flashcardStore.ts  # Estado de flashcards + localStorage
│   │   ├── noteStore.ts       # Estado de notas + localStorage
│   │   ├── studyPlanStore.ts  # Estado de planes de estudio
│   │   └── studySessionStore.ts # Sesiones de estudio (racha, horas, ejercicios)
│   └── types/
│       └── index.ts           # TypeScript interfaces
├── .env.example               # Variables de entorno requeridas
├── AGENTS.md                  # Este archivo
├── next.config.ts             # Configuración Next.js
├── package.json               # Dependencias
├── tailwind.config.ts         # Configuración Tailwind
└── tsconfig.json              # Configuración TypeScript
```

---

## Funcionalidades Implementadas

### 1. Dashboard Principal (`/`)
- Bento Grid con estadísticas del estudiante
- **Stats conectadas a datos reales**: materias totales (36), ejercicios resueltos, racha de días y horas de estudio provenientes de `useStudySessionStore` (localStorage)
- **Las sesiones de estudio se registran automáticamente** desde: Práctica (ejercicios + tiempo real), Flashcards (cada review) y Tutor (cada consulta)
- **Progreso por materia en vivo**: la barra `Progress` de cada materia refleja el % de temas completados del plan de estudio
- Grid del plan de estudios (36 materias por nivel)
- Quick actions: Ir al Tutor, Practicar, Plan de Estudio (navegables)
- Sección de features de IA
- Navegación a detalle de cada materia

### 2. Tutor IA Socrático (`/tutor`)
- Interfaz de chat con streaming en tiempo real
- Consume `/api/tutor` con GPT-4o-mini (Vercel AI SDK `streamText`, streaming de texto plano) + fallback mock socrático
- **Usa el material del curriculum**: inyecta temario, bibliografía, objetivos, conceptos y ejercicios tipo parcial de la materia según `?subject=id`
- Desde `/subject/[id]`, los botones "Tutor IA" y "Preguntar al Tutor" abren el tutor con el contexto de esa materia
- Prompt Socrático: guía con preguntas, nunca da respuestas directas
- Detección de temas (matemática, física, programación)
- Soporte LaTeX para fórmulas matemáticas

### 3. Práctica Adaptativa (`/practice`)
- Selector de materia (ahora las **36 materias** del plan)
- **Generador de ejercicios automático** (`src/lib/exerciseGenerator.ts`): produce 8 ejercicios de opción múltiple por materia desde el temario real — temas del syllabus, conceptos clave, objetivos, créditos, horas semanales, categoría y ejercicios tipo parcial (con distractores de otras materias, sin opciones duplicadas)
- Ejercicios de opción múltiple con explicaciones
- Puntuación y progreso por sesión
- **Registro de sesiones**: al completar una ronda se guardan ejercicios, aciertos y tiempo en `studySessionStore` (alimenta racha/horas del dashboard)
- Barra de progreso animada

### 4. Flashcards con SM-2 (`/flashcards`)
- Algoritmo de repetición espaciada SM-2
- Flip animation para revelar respuesta
- 6 niveles de calidad: Olvidé/Mal/Difícil/Bien/Fácil/Perfecto
- Cálculo automático de próxima revisión
- 20 flashcards de ejemplo precargadas
- Selector de materia
- Formulario para crear nuevas flashcards
- Cada review registra actividad en `studySessionStore` (alimenta racha/horas del dashboard)

### 5. Apuntes y Notas (`/notes`)
- CRUD completo de notas
- Sistema de tags
- Búsqueda por título, contenido y tags
- Filtro por materia
- Renderizado LaTeX con KaTeX
- Grid masonry responsivo

### 6. Plan de Estudio Adaptativo (`/plan`)
- Distribución automática de temas hasta fecha objetivo
- "Tareas de Hoy" section
- Timeline visual por fecha
- Progress bar por materia
- Creación de planes con selector de materia y fecha

### 7. Login/Registro (`/login`)
- **Crear cuenta con email y contraseña** (endpoint `/api/register`, bcrypt para hash de contraseñas)
- **Iniciar sesión con email y contraseña** (NextAuth CredentialsProvider + Prisma/PostgreSQL)
- GitHub OAuth y Google OAuth (opcional, requiere credenciales)
- UI animada con Framer Motion (tabs login/registro)

### 8. Detalle de Materia (`/subject/[id]`)
- Información completa de cada materia
- **Material completo del plan**: descripción, conceptos clave, objetivos, competencias, metodología de cursada, forma de evaluación (regularidad/promoción/recuperatorio/criterios), bibliografía oficial y complementaria
- **Ejercicios tipo parcial desplegables**: cada uno con pregunta, dificultad y solución resuelta
- Temario con dificultad estimada
- Correlativas
- Acciones rápidas (Tutor, Practicar, Flashcards)

### 9. PWA Offline
- Service Worker con cache-first para assets
- Network-first para API calls
- Página offline con auto-reconexión
- Manifest para instalación

### 10. Dark/Light Mode
- Tema oscuro por defecto (anti-fatiga visual)
- Toggle con animación
- CSS variables para todos los colores
- Persistencia en localStorage

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
Cada una de las 36 materias incluye:
- **Descripción profesional** detallada
- **Temas oficiales** (syllabus completo)
- **Conceptos clave**
- **Bibliografía** oficial y complementaria (libros reales de UTN)
- **Metodología de cursada** (teoría, práctica, TP)
- **Forma de evaluación** (regularidad, promoción, recuperatorio)
- **Objetivos de aprendizaje** (3-5 por materia)
- **Competencias** a desarrollar
- **Ejercicios tipo parcial** (2 por materia con solución)
- **Correlatividades** exactas del plan

---

## Commits Realizados

### Sesión Actual — Jornada de Desarrollo (1 de septiembre 2026)

| # | Hash | Descripción |
|---|------|-------------|
| 1 | `ae5a659` | feat: auth email/password, tutor conectado, dashboard con progreso real, UI rica de materia y generador de ejercicios para las 36 materias |

### Historia Prevía

| # | Hash | Descripción |
|---|------|-------------|
| 1 | `42e86f1` | feat: initial setup - Cognita Study |
| 2 | `b859f0e` | feat: complete all features - auth, flashcards, notes, study plan, PWA |
| 3 | `6885a76` | feat: rewrite curriculum with official Plan 1877 - 36 subjects with real data |
| 4 | `8190e3a` | feat: add bibliography, methodology, evaluation, objectives, competencies and partial examples to all 36 subjects |
| 5 | `e544380` | chore: remove helper script |
| 6 | `baa41f4` | docs: add comprehensive AGENTS.md with full project summary |

---

## Lo que Queda Pendiente

### ⭐ PENDIENTE URGENTE — Login/Registro con email (falta configurar la base de datos)
El código ya está listo (CredentialsProvider + endpoint `/api/register` + formulario email/contraseña en `/login`). Falta únicamente configurar la base de datos desde la computadora del usuario (tiene el connection string de Supabase en su casa):

- [ ] **1. Agregar `DATABASE_URL` en `.env.local`** (Supabase/PostgreSQL):
      - Supabase Dashboard → Settings → Database → Connection string
      - Pegar el string (formato: `postgresql://...pooler.supabase.com:6543/postgres`) en `.env.local`
- [ ] **2. Crear las tablas** ejecutando: `npx prisma db push`
- [ ] **3. Reiniciar el servidor** (`npm run dev`) y ya podrás crear cuenta con email/contraseña
- [ ] (Opcional) Agregar `OPENAI_API_KEY` para activar el tutor IA real (sin esto usa mock socrático con el material del curriculum)

### Prioridad Alta
- [x] **Login por email/contraseña**: Implementado (CredentialsProvider + registro en `/api/register`)
- [x] **Tutor IA conectado**: La UI `/tutor` consume `/api/tutor` con streaming real (OpenAI GPT-4o-mini) y fallback mock. Inyecta el material del curriculum (temario, bibliografía, objetivos, ejercicios tipo parcial) según `subjectId`.
- [x] **Mostrar datos nuevos en UI**: `/subject/[id]` ya muestra bibliografía, metodología, evaluación, objetivos, competencias y ejercicios tipo parcial
- [ ] **Conectar IA real**: Configurar `OPENAI_API_KEY` en `.env.local` para activar el tutor streaming (sin esto usa mock)
- [ ] **PostgreSQL database**: (ver pasos urgentes arriba) ejecutar `npx prisma db push`
- [ ] **Login OAuth funcional**: Configurar credenciales de GitHub OAuth y Google OAuth en NextAuth (opcional si usás email)

### Prioridad Media
- [x] **Dashboard con progreso real**: Stats conectadas a `studySessionStore` (ejercicios, racha, horas) y progreso por materia desde `studyPlanStore`
- [x] **Generador de ejercicios desde el temario**: `exerciseGenerator.ts` genera 8 ejercicios por materia para las 36 materias (distractores de otras materias, sin duplicados)
- [ ] **Generador de ejercicios con IA**: Usar OpenAI para variar/ampliar los ejercicios generados
- [ ] **Subida de PDFs**: Implementar upload de apuntes/PDFs con RAG
- [ ] **Flashcards con IA**: Generar flashcards automáticamente desde el temario
- [ ] **Estadísticas avanzadas**: Gráficos de progreso, heatmap de estudio, streaks

### Prioridad Baja
- [ ] **PWA icons**: Crear iconos 192x192 y 512x512 para manifest
- [ ] **Tests unitarios**: Agregar test suite con Vitest/Jest
- [ ] **Deploy en Vercel**: Configurar CI/CD
- [ ] **Notificaciones push**: Alertas de estudio y recordatorios
- [ ] **Modo oscuro/claro automático**: Seguir preferencias del sistema
- [ ] **Internacionalización**: Soporte español/inglés

---

## Cómo Ejecutar

```bash
# 1. Clonar el repositorio
git clone https://github.com/phloquillo35/cognita-study.git
cd cognita-study

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus API keys

# 4. Ejecutar en desarrollo
npm run dev

# 5. Abrir en el navegador
# http://localhost:3000
```

### Variables de Entorno Requeridas

```env
# IA (opcional - sin esto usa mock responses)
OPENAI_API_KEY=sk-...

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tu-secret-aqui

# OAuth (opcional)
GITHUB_ID=...
GITHUB_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# Database (opcional - sin esto usa localStorage)
DATABASE_URL=postgresql://...
```

---

## Arquitectura y Decisiones de Diseño

### UI/UX
- **Dark mode por defecto**: Optimizado para sesiones largas de estudio (anti-fatiga visual)
- **Glass morphism**: Efectos de vidrio esmerilado para tarjetas
- **Bento Grid**: Layout moderno tipo Apple para el dashboard
- **Micro-animaciones**: Framer Motion para transiciones suaves
- **Responsive**: Mobile-first, funciona en todos los dispositivos

### State Management
- **Zustand**: Ligero, simple, con persistencia en localStorage
- **Cada feature tiene su store**: flashcardStore, noteStore, studyPlanStore
- **Persistencia automática**: Los datos sobreviven cierre de navegador

### AI Integration
- **Vercel AI SDK**: Streaming de respuestas en tiempo real
- **Socratic prompt**: El tutor nunca da respuestas directas
- **Fallback mock**: Funciona sin API key para desarrollo

### Data
- **Curriculum completo**: 36 materias con datos reales del Plan 1877
- **3,300+ líneas de datos**: Temas, bibliografía, evaluación, objetivos
- **Correlatividades**: Grafo de dependencias entre materias

---

*Última actualización: 1 de septiembre de 2026*
*Desarrollado por: opencode (big-pickle model)*
*Repositorio: https://github.com/phloquillo35/cognita-study*

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
