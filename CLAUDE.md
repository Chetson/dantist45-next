# CLAUDE.md

Этот файл предоставляет рекомендации для Claude Code (claude.ai/code) при работе с кодом в этом репозитории.

## Команды

```bash
npm run dev     # next dev (http://localhost:3000)
npm run build   # next build
npm run start   # next start (после сборки)
npm run lint    # eslint (flat конфиг в eslint.config.mjs)
```

Тестовый раннер не настроен.

## Предупреждение о версии Next.js

В этом проекте используется Next.js 16.4.3 / React 19.3, что отличается от более старых версий Next.js. Согласно AGENTS.md, перед написанием кода Next.js прочитайте соответствующее руководство в `node_modules/next/dist/docs/` (`01-app` — это документация App Router) и обращайте внимание на предупреждения об устаревших возможностях.

## Архитектура

Свежий шаблон `create-next-app` с использованием App Router (директория `app/`: `layout.tsx`, `page.tsx`, `globals.css`), строгий режим TypeScript, псевдоним пути `@/*` → корень репозитория.

Нестандартные настройки в [next.config.ts](next.config.ts):
- `cacheComponents: true` и `partialPrefetching: true` — применяются семантика Cache Components / частичного предварительного рендеринга, поэтому доступ к динамическим данным (например, API запросов, некэшируемые fetch) должен обрабатываться в соответствии с актуальной документацией (границы Suspense / `use cache`), иначе сборка завершится ошибкой.
- Tailwind CSS v4 подключён через правила Turbopack (загрузчик `@tailwindcss/turbopack` для `*.css`), а не через PostCSS, поэтому `postcss.config` отсутствует.