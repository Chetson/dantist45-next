# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev     # next dev (http://localhost:3000)
npm run build   # next build
npm run start   # next start (after build)
npm run lint    # eslint (flat config in eslint.config.mjs)
```

No test runner is configured.

## Next.js version warning

This project uses Next.js 16.4.3 / React 19.3, which differs from older Next.js versions. Per AGENTS.md, read the relevant guide in `node_modules/next/dist/docs/` (`01-app` is the App Router docs) before writing Next.js code, and heed deprecation notices.

## Architecture

Fresh `create-next-app` scaffold using the App Router (`app/` directory: `layout.tsx`, `page.tsx`, `globals.css`), TypeScript strict mode, path alias `@/*` → repo root.

Non-default settings in [next.config.ts](next.config.ts):
- `cacheComponents: true` and `partialPrefetching: true` — Cache Components / partial prerendering semantics apply, so dynamic data access (e.g. request APIs, uncached fetches) must be handled per the current docs (Suspense boundaries / `use cache`) or the build will error.
- Tailwind CSS v4 is wired through Turbopack rules (`@tailwindcss/turbopack` loader for `*.css`) rather than PostCSS, so there is no `postcss.config`.
