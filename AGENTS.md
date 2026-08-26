# Cognita Study

Plataforma de estudio universitario con inteligencia artificial para la carrera de Ingeniería en Sistemas de Información — UTN Facultad Regional Tucumán.

## Características

- 🧠 **Tutor IA Socrático** — Guía el aprendizaje con preguntas, no da respuestas directas
- 📐 **Verificación Matemática** — Ecuaciones verificadas con SymPy
- 📊 **Progreso Adaptativo** — Se adapta a tu nivel y puntos débiles
- 🔁 **Repetición Espaciada** — Algoritmo SM-2 para memorización a largo plazo
- 📚 **Plan de Estudios Completo** — 30+ materias, 5 niveles del plan 2023
- 🌙 **Dark/Light Mode** — Temas optimizados para anti-fatiga visual
- 📱 **PWA** — Funciona offline

## Tech Stack

- **Frontend:** Next.js 15 + Tailwind CSS + Framer Motion
- **UI:** shadcn/ui + Radix UI
- **State:** Zustand
- **Database:** PostgreSQL + Prisma ORM
- **AI:** OpenAI / Anthropic Claude + Vercel AI SDK
- **Math:** KaTeX + SymPy
- **Auth:** NextAuth.js

## Getting Started

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local

# Ejecutar migraciones de BD
npx prisma db push

# Iniciar desarrollo
npm run dev
```

## Plan de Estudios (UTN FRT - Plan 2023)

| Nivel | Materias |
|-------|----------|
| I | AM I, Álgebra, Física I, Lógica, AED, Arquitectura, SpyN, Inglés I |
| II | AM II, Física II, SSL, Paradigmas, SO, ASI, Ing. y Sociedad, Inglés II |
| III | Prob y Est, BD, Des. Software, CD, AN, DSI, Eco, Sem. Integrador |
| IV | IO, Simulación, Ing. Software, Redes, Tecn. Automatización, Legislación, Adm. SI |
| V | IA, Ciencia de Datos, Sist. Gestión, Gestión Gerencial, Seg. SI, Proyecto Final |
