# Развёртывание сайта «Дантист»

Проект целиком поднимается одной командой Docker Compose: скачали из git, заполнили `.env`, запустили.

## 1. Из чего состоит стек

| Сервис | Что делает | Наружу |
|---|---|---|
| `postgres` | PostgreSQL 17, данные в томе `postgres-data` | только `127.0.0.1:5432` |
| `migrate` | Одноразовый: применяет миграции Prisma, наполняет **пустую** БД начальными данными и завершается | — |
| `app` | Сайт Next.js (standalone), проверка `GET /api/health` | `127.0.0.1:3000` |
| `caddy` | Обратный прокси с автоматическим HTTPS (Let's Encrypt). Включается профилем `proxy` | `80`, `443` |

Порядок запуска: `postgres` (healthy) → `migrate` (успешно завершился) → `app` (healthy) → `caddy`.

Сборке образа база не нужна: страницы пререндерятся без данных, данные подставляются при запросе и кэшируются в памяти.

## 2. Требования

- Docker Engine 24+ с плагином Compose v2 (`docker compose version`). На Mac/Windows — Docker Desktop.
- Сервер: от 1 vCPU, 2 ГБ RAM (сборка образа на 1 ГБ может не уместиться), 10 ГБ диска.
- Для HTTPS: домен, A-запись которого указывает на IP сервера, и открытые порты 80 и 443.

## 3. Переменные окружения (`.env`)

```bash
cp .env.example .env
```

| Переменная | Значение по умолчанию | Описание |
|---|---|---|
| `POSTGRES_USER` | `dantist` | Пользователь БД |
| `POSTGRES_PASSWORD` | `dantist` | **На сервере обязательно сменить.** Только латинские буквы и цифры: пароль подставляется в URL подключения |
| `POSTGRES_DB` | `dantist45` | Имя БД |
| `POSTGRES_PORT` | `5432` | Порт БД на хосте (слушает только `127.0.0.1`) |
| `DATABASE_URL` | `postgresql://dantist:dantist@localhost:5432/dantist45?schema=public` | Только для разработки на хосте (`npm run dev`, Prisma CLI). Должен совпадать с `POSTGRES_*`. Контейнеры собирают свой адрес сами |
| `SITE_URL` | `https://dantist45.ru` | Публичный адрес сайта: canonical-ссылки, `sitemap.xml`, `robots.txt` |
| `APP_PORT` | `3000` | Порт сайта на хосте |
| `APP_BIND` | `127.0.0.1` | `127.0.0.1` — сайт виден только локально и через Caddy; `0.0.0.0` — открыть порт наружу без прокси |
| `DOMAIN` | `localhost` | Домен для Caddy, например `dantist45.ru`; `www.` перенаправляется на него |

Сгенерировать пароль: `openssl rand -hex 24`.

> Пароль БД задаётся только при **первом** создании тома. Если поменять `POSTGRES_PASSWORD` позже, PostgreSQL продолжит принимать старый пароль — смените его в самой БД (`ALTER USER ... PASSWORD ...`) или пересоздайте том (данные будут потеряны).

## 4. Локальная разработка

```bash
npm install
cp .env.example .env
npm run db:up        # только PostgreSQL в Docker
npm run db:migrate   # применить миграции
npm run db:seed      # начальные данные (перезаписывает контент!)
npm run dev          # http://localhost:3000
```

После изменения `prisma/schema.prisma`: `npm run db:migrate -- --name описание_изменения` — создаст миграцию в `prisma/migrations/`, её нужно закоммитить.

## 5. Проверка всего стека локально

```bash
docker compose up -d --build
```

Сайт — http://127.0.0.1:3000. Если порт занят (например, запущен `npm run dev`): `APP_PORT=3100 docker compose up -d --build`.

HTTPS через Caddy на своей машине (самоподписанный сертификат, браузер предупредит):

```bash
DOMAIN=localhost docker compose --profile proxy up -d --build
```

## 6. Первый деплой на сервер

1. Установить Docker: https://docs.docker.com/engine/install/ (для Ubuntu — раздел «Install using the apt repository»).
2. Открыть порты (пример для `ufw`):
   ```bash
   sudo ufw allow OpenSSH && sudo ufw allow 80 && sudo ufw allow 443 && sudo ufw enable
   ```
   Порт БД (5432) открывать не нужно — он слушает только localhost.
3. Скачать проект:
   ```bash
   git clone https://github.com/Chetson/dantist45-next.git /opt/dantist45
   cd /opt/dantist45
   ```
4. Настроить окружение:
   ```bash
   cp .env.example .env
   nano .env   # POSTGRES_PASSWORD, DATABASE_URL (тот же пароль), DOMAIN
   ```
5. Направить домен (A-запись `@` и `www`) на IP сервера и дождаться, пока DNS обновится (`dig +short dantist45.ru`).
6. Запустить:
   ```bash
   docker compose --profile proxy up -d --build
   ```
7. Проверить:
   ```bash
   docker compose --profile proxy ps   # app — healthy, migrate — Exited (0)
   curl https://dantist45.ru/api/health  # {"status":"ok"}
   ```

Caddy сам получает и продлевает сертификат. Если сертификат не выдаётся — смотрите `docker compose logs caddy`: обычно DNS ещё не обновился или закрыт порт 80.

## 7. Обновление сайта

```bash
cd /opt/dantist45
git pull
docker compose --profile proxy up -d --build
```

Новые миграции применятся автоматически (сервис `migrate`), seed повторно не запустится. Старые образы можно чистить: `docker image prune -f`.

## 8. Данные

### Начальное наполнение

`migrate` запускает seed с флагом `--if-empty`: данные из `prisma/seed-data/` загружаются только в пустую БД. Принудительно перезалить seed (**перезапишет** услуги, врачей, лицензии и т. д.):

```bash
docker compose run --rm migrate npx prisma db seed
docker compose restart app   # сбросить кэш данных в памяти
```

### Перенос прайса со старого сайта

Скопируйте `data/database.db` со старого сервера, затем:

```bash
docker compose run --rm -v /путь/к/database.db:/tmp/legacy.db:ro migrate \
  npx tsx scripts/import-legacy-sqlite.ts /tmp/legacy.db
docker compose restart app
```

Скрипт выведет позиции, цену которых не удалось распознать, — их нужно поправить вручную.

### Резервные копии

```bash
# бэкап
docker compose exec -T postgres sh -c 'pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" -Fc' > backup-$(date +%F).dump

# восстановление
docker compose exec -T postgres sh -c 'pg_restore -U "$POSTGRES_USER" -d "$POSTGRES_DB" --clean --if-exists' < backup-2026-11-01.dump
docker compose restart app
```

Ежедневный бэкап через cron (`crontab -e`), хранить 14 дней:

```cron
0 3 * * * cd /opt/dantist45 && docker compose exec -T postgres sh -c 'pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" -Fc' > /opt/backups/dantist45-$(date +\%F).dump && find /opt/backups -name 'dantist45-*.dump' -mtime +14 -delete
```

Копии стоит регулярно уносить с сервера (другой сервер, облачное хранилище).

### Кэш данных

Сайт кэширует данные из БД в памяти. Изменения через будущую админку будут сбрасывать кэш автоматически. После ручных правок в БД (Prisma Studio, SQL, восстановление бэкапа) выполните `docker compose restart app`.

### Файлы

Сканы лицензий и прочие файлы из `public/` встроены в образ — после их изменения нужен `git pull` и пересборка. Загрузка файлов из админки (этап 2) будет хранить их в отдельном томе.

## 9. Полезные команды

```bash
docker compose ps                     # статус сервисов
docker compose logs -f app            # логи сайта
docker compose logs migrate           # результат миграций и seed
docker compose restart app            # перезапуск сайта
docker compose down                   # остановить всё (данные сохраняются)
docker compose exec postgres psql -U dantist dantist45   # консоль БД
```

`docker compose down -v` **удаляет тома вместе с базой данных** — только если данные точно не нужны.

## 10. Персональные данные

Сайт не собирает данные посетителей: на нём нет форм, счётчиков и сторонних виджетов, шрифты раздаются с собственного домена. Не подключайте аналитику и встраиваемые карты без согласования (см. `refactor-plan.md`, раздел 9).
