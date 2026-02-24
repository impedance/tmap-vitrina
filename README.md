# tmap-vitrina

Telegram Mini App (WebApp) витрина магазина: каталог → товар → корзина → оформление заказа (без оплаты на MVP) + простой admin-режим.

## Структура

- `client/` — React + TS + Vite + Tailwind v4
- `server/` — Node.js + Express + Prisma (SQLite)
- Документация: `docs/prd.md`, `telegram_miniapp_shop_design_system_spec.md`, `telegram_miniapp_shop_tokens.json`

## Быстрый старт (dev)

### 1) Установка

```bash
make install
```

Альтернатива:

```bash
npm run install-all
```

### 2) Запуск

```bash
make dev
```

Что поднимется:

- Frontend (Vite): `http://localhost:5174`
- Backend API: `http://localhost:3001`
  - `GET /api/products`
  - `GET /api/products/:id`
  - `POST /api/orders`

Dev-удобство: во фронте запросы идут на относительный `/api` (см. `client/src/utils/api.ts`) и проксируются Vite на backend (см. `client/vite.config.ts`).

## База данных и сид

Backend использует SQLite (Prisma). Dev-конфиг лежит в `server/.env`:

- `DATABASE_URL="file:./dev.db"`
- `PORT=3001`

Сидирование (добавляет тестовые товары с картинками из `client/public/assets/products/`):

```bash
make seed
```

## Admin mode

Открой:

- `http://localhost:5174/?admin=1`

В карточках товаров появится кнопка настройки (шестерёнка) → редактирование `title`, `price`, `inStock`, `badges`, `weightLabel`.

## Сборка (prod)

```bash
make build
```

После сборки backend умеет раздавать статический фронт из `client/dist` вместе с API:

```bash
node server/dist/index.js
```
