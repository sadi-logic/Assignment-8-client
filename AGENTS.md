# AGENTS.md

## Commands

- Dev server: `npm run dev` (Next 16 defaults to Turbopack)
- Build: `npm run build`
- Lint: `npm run lint` — runs bare `eslint` with the flat config in `eslint.config.mjs` (not `next lint`)
- Typecheck: `npx tsc --noEmit` — there is no `typecheck` script; `tsconfig.json` already sets `noEmit`
- No test runner, formatter, or CI is configured. Do not invent one.

Order before finishing a change: `npm run lint` then `npx tsc --noEmit`, then `npm run build` if the change is non-trivial.

## Stack (Next.js 16.4.3, React 19.3, Tailwind 4)

- App Router only (`src/app/`), single page + root layout. Path alias: `@/*` → `./src/*`.
- Notable `next.config.ts` flags that change behavior:
  - `cacheComponents: true` — caching/dynamic APIs follow the Next 16 "cache components" model (successor to `dynamicIO`/`use cache`). Read `node_modules/next/dist/docs/` before relying on request memoization, `use cache`, or Suspense rules.
  - `reactCompiler: true` — React Compiler runs via `babel-plugin-react-compiler`; component memoization is automatic.
  - Tailwind 4 is wired through a Turbopack loader rule for `*.css` (no `postcss.config`).
- Layouts/components use generated typed-route globals (e.g. `LayoutProps<"/">`); these types come from `.next/types` and only exist after a dev/build run.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
