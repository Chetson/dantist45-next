# CLAUDE.md

Этот файл предоставляет рекомендации для Claude Code (claude.ai/code) при работе с кодом в этом репозитории.

## Команды

```bash
npm run dev     # next dev (http://localhost:3000)
npm run build   # next build
npm run start   # next start (после сборки)
npm run lint    # eslint (flat конфиг в eslint.config.mjs)

npm run db:up       # docker compose up -d postgres (только БД для разработки)
docker compose up -d --build   # весь стек в Docker, см. DEPLOYMENT.md
npm run db:migrate  # prisma migrate dev
npm run db:seed     # prisma db seed — ПЕРЕЗАПИСЫВАЕТ контентные таблицы
npm run db:studio   # prisma studio
npm run import:legacy -- path/to/database.db  # перенос прайса из SQLite старого сайта
```

Первый запуск: `cp .env.example .env`, `npm run db:up`, `npm run db:migrate`, `npm run db:seed`, `npm run dev`.

Тестовый раннер не настроен.

## Предупреждение о версии Next.js

В этом проекте используется Next.js 16.4.3 / React 19.3, что отличается от более старых версий Next.js. Согласно AGENTS.md, перед написанием кода Next.js прочитайте соответствующее руководство в `node_modules/next/dist/docs/` (`01-app` — это документация App Router) и обращайте внимание на предупреждения об устаревших возможностях.

## Архитектура

App Router, строгий TypeScript, псевдоним `@/*` → корень репозитория. Стек и подходы — [spec.md](spec.md), план переработки сайта — [refactor-plan.md](refactor-plan.md).

- `prisma/schema.prisma` — модель данных; `prisma/seed.ts` + `prisma/seed-data/*` — начальные данные из документов клиники (`TODO(клиника)` — что уточнить).
- `lib/db.ts` — `getDb()`, ленивый синглтон PrismaClient; `lib/data/*` — серверные функции чтения: `await connection()` снаружи, `'use cache'` + `cacheTag` внутри, вызывающие компоненты — в `<Suspense>`. Сборка не должна обращаться к БД (Docker-образ собирается без неё).
- Деплой: `Dockerfile` + `docker-compose.yml` (postgres → migrate → app → caddy), инструкция — [DEPLOYMENT.md](DEPLOYMENT.md).
- `components/layout/*` — Header/Footer; `components/ui/*` — общие элементы (`buttonClass`, `SectionHeading`, `PageHeader`, `Markdown`, иконки); `components/{home,services,staff,clinics}/*` — блоки страниц.
- Дизайн — по мотивам dentist.madethemes.com: цвета — токены в `app/globals.css` (`brand`, `brand-deep`, `accent`…), заголовки — `font-display` (Playfair Display), текст — Golos Text. Только Tailwind, без отдельных CSS-модулей.
- Страницы `[slug]` читают `params` внутри `<Suspense>` (без `generateStaticParams` — сборка без БД).
- На сайте нет форм и сторонних трекеров (требование по 152-ФЗ, см. refactor-plan.md, раздел 9).

Нестандартные настройки в [next.config.ts](next.config.ts):
- `cacheComponents: true` и `partialPrefetching: true` — применяются семантика Cache Components / частичного предварительного рендеринга, поэтому доступ к динамическим данным (например, API запросов, некэшируемые fetch) должен обрабатываться в соответствии с актуальной документацией (границы Suspense / `use cache`), иначе сборка завершится ошибкой.
- Tailwind CSS v4 подключён через правила Turbopack (загрузчик `@tailwindcss/turbopack` для `*.css`), а не через PostCSS, поэтому `postcss.config` отсутствует.