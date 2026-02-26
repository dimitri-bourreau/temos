# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Temos is a local-first time tracking app. All data is persisted in IndexedDB via Dexie.js. There are no API routes or backend — everything runs client-side. Built with Next.js 16 (App Router), React 19, TypeScript (strict), Tailwind CSS v4, and shadcn/ui.

## Commands

```bash
npm run dev          # Dev server (Turbopack)
npm run build        # Production build
npm run lint         # ESLint
npx vitest run       # Run all tests
npx vitest run src/features/entries/services/create-entry.test.ts  # Run a single test
npx vitest           # Watch mode
```

Git hooks: pre-commit runs formatting + linting, pre-push runs build + tests.

## Architecture

### Domain Logic in `/features/`

Logic is **never** in components. Each domain lives in `src/features/[domain]/` with:
- `store.ts` — Zustand store (async actions that sync IndexedDB + state)
- `services/` — Pure async functions, one per file (e.g. `create-entry.ts`)
- `hooks/` — Domain-specific React hooks (optional)

Domains: `entries`, `categories`, `timer`, `statistics`, `settings`, `calendar`, `data-exchange`.

### Component Hierarchy (Atomic Design)

`src/components/` follows atoms → molecules → organisms → templates:
- **atoms/**: Stateless, no store dependencies (e.g. `duration-display`, `stat-card`)
- **molecules/**: Compose atoms (e.g. `color-picker`, `date-navigation`)
- **organisms/**: Full sections that wire stores + UI (e.g. `entry-form`, `quick-timer`, `category-list`)
- **templates/**: Layout wrappers (`app-shell.tsx`)
- **ui/**: shadcn/ui primitives (don't edit directly — use `npx shadcn@latest add`)

### Data Layer

- `src/db/index.ts` — Dexie.js database (`TemosDB`) with tables: `entries`, `categories`, `settings`
- Services receive `db` and return promises. Stores call services and update state.
- Types in `src/types/index.ts`: `Category`, `TimeEntry`, `UserSettings`, `Period`, etc.

### Routing

```
/              → Dashboard (calendar, timer, recent entries, summary)
/entries       → Entry list with filters
/entries/new   → Create entry
/entries/[id]/edit → Edit entry
/settings      → User preferences, work schedule, data export/import
/statistics    → Charts and breakdowns by period
```

### i18n

Two locales: EN and FR via `next-intl`. Translations in `i18n/traductions/{en,fr}.json`. Locale auto-detected from browser on first visit, persisted in cookie. Components use `useTranslations()`.

### Styling

Tailwind v4 with OkLch custom color tokens in `src/app/globals.css`. Light/dark themes via `next-themes`. Category colors come from `PASTEL_COLORS` in `src/lib/constants.ts`.

## Conventions

- **One function per file** in services, with matching `.test.ts` file
- **File naming**: kebab-case for services/hooks, PascalCase for components
- **Imports**: Always use `@/` path alias (maps to `src/`)
- **All pages are client components** (`"use client"`) since they depend on Zustand stores
- **Tests**: Vitest + `fake-indexeddb`. Each test clears DB in `beforeEach()`
- **Date utilities**: Use helpers from `src/lib/date-utils.ts` (wraps date-fns)
- **CSS utility**: `cn()` from `src/lib/utils.ts` (clsx + tailwind-merge)
- Prefer modularity — several small files over few large files
- Code should be readable by a junior dev discovering the project and stack
