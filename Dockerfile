# syntax=docker/dockerfile:1

# Цели сборки:
#   runner   — образ сайта (Next.js standalone), запускается сервисом app;
#   migrator — одноразовый контейнер: prisma migrate deploy + seed пустой БД.
# Сборка не обращается к БД: данные подставляются во время запроса.

FROM node:24-alpine AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# ─── Зависимости ───────────────────────────────────────────────────────
FROM base AS deps
COPY package.json package-lock.json prisma.config.ts ./
COPY prisma ./prisma
# postinstall запускает prisma generate — поэтому схема копируется заранее.
RUN npm ci

# ─── Миграции и seed ───────────────────────────────────────────────────
FROM deps AS migrator
COPY . .
RUN npx prisma generate
CMD ["sh", "-c", "npx prisma migrate deploy && npx tsx prisma/seed.ts --if-empty"]

# ─── Сборка Next.js ────────────────────────────────────────────────────
FROM deps AS builder
COPY . .
RUN npx prisma generate && npm run build

# ─── Рабочий образ ─────────────────────────────────────────────────────
FROM base AS runner
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0

COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public

# Каталог для фото из админки; в docker-compose на него монтируется том.
RUN mkdir -p /app/uploads && chown node:node /app/uploads

USER node
EXPOSE 3000
CMD ["node", "server.js"]
