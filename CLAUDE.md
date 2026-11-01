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
- Дизайн — по макету «Dental Clinic» (Behance, rs-dent): светлый холодный фон, лавандовый акцент (`brand`), небесно-голубые градиентные панели (`bg-sky-panel`), «стеклянные» карточки (`card`, `card-glass`), свечение (`glow`), крупные строчные заголовки (`heading-xl`, Manrope 800), текст — Raleway. Токены и утилиты — в `app/globals.css`; только Tailwind, без CSS-модулей. Имена людей и названия статей в заголовках не переводятся в строчные (`PageHeader keepCase`).
- Сетка и типографика — утилиты в `app/globals.css`: `container-page` (80rem), 12 колонок `grid-cols-12` с промежутком `gap-4 sm:gap-6` везде (тогда сетки на 2/3/4 колонки совпадают с 12-колоночной), `section-y`, `panel-pad`, `card-pad`, `card-pad-sm`; шкала заголовков `type-display` → `type-h1` → `type-h2` → `type-h3` → `type-h4`, плюс `type-lead`, `type-eyebrow`. Не задавайте размеры шрифтов и отступы карточек вручную. Внешние края всех блоков (карточек, панелей, шапки, футера) лежат на краях контейнера.
- После правки `app/globals.css` перезапускайте `npm run dev`: загрузчик `@tailwindcss/turbopack` не пересобирает стили по горячей перезагрузке (классы в компонентах подхватываются без перезапуска).
- Шапка: `components/layout/Header.tsx` + клиентская `StickyHeader.tsx` (анимация по `data-scrolled`). Вторая строка шапки для конкретной страницы — параллельный маршрут `app/@subnav/*` (сейчас только `/services`, компонент `SubnavLinks` с подсветкой текущего раздела); `@subnav/[...catchAll]`, `@subnav/page.tsx` и `default.tsx` возвращают `null`. При добавлении нового слота перезапускайте `npm run dev`.
- Страницы `[slug]` читают `params` внутри `<Suspense>` (без `generateStaticParams` — сборка без БД).
- На сайте нет форм и сторонних трекеров (требование по 152-ФЗ, см. refactor-plan.md, раздел 9).

Нестандартные настройки в [next.config.ts](next.config.ts):
- `cacheComponents: true` и `partialPrefetching: true` — применяются семантика Cache Components / частичного предварительного рендеринга, поэтому доступ к динамическим данным (например, API запросов, некэшируемые fetch) должен обрабатываться в соответствии с актуальной документацией (границы Suspense / `use cache`), иначе сборка завершится ошибкой.
- Tailwind CSS v4 подключён через правила Turbopack (загрузчик `@tailwindcss/turbopack` для `*.css`), а не через PostCSS, поэтому `postcss.config` отсутствует.