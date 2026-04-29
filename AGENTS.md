# AGENTS.md

## Project

Local React workspace for investment observation and portfolio analysis.

- Framework: Vite + React + TypeScript
- Styling: Tailwind CSS v4 through `@tailwindcss/vite`
- Icons: `lucide-react`
- Data source: JSON files in `data/`

## Commands

```bash
npm run dev
npm run typecheck
```

## Structure

```text
data/
  portfolio.json
  watchlist.json
  events.json
  daily-gainers.json
src/
  analysis/
  components/
  data/
  lib/
  types/
  RootApp.tsx
  main.tsx
  styles.css
```

## Conventions

- Keep editable investment data in `data/*.json`.
- Keep analysis logic in `src/analysis/`, not inside UI components.
- Keep shared formatting helpers in `src/lib/`.
- Keep domain types in `src/types/domain.ts`.
- Keep React components small and typed.
- Use `lucide-react` icons for navigation, metrics, and status signals.
- Use Tailwind component classes from `src/styles.css`.
- Keep UI copy concise and product-like.
- Do not add investment disclaimer boilerplate unless explicitly requested.

## Verification

Before finishing code changes, run:

```bash
npm run typecheck
```
