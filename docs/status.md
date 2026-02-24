# Статус проекта (2026-02-24)

## Что работает сейчас

- Frontend (Vite): `http://localhost:5174`
- Backend API: `http://localhost:3001` (см. `server/.env`)
- Во фронте запросы идут на `/api` (axios `baseURL`), в dev проксируются Vite на backend
- Основной флоу: каталог → товар → корзина → оформление (`POST /api/orders`)
- Admin mode: `/?admin=1` → редактирование товара через `PUT /api/products/:id`
- Тема Telegram: через CSS vars `--tg-theme-*`, safe-area через `--tg-viewport-safe-area-inset-*`
- Данные: Prisma + SQLite (`server/prisma/dev.db`), сид `server/prisma/seed.ts`
- Тесты: `cd server && npm test` (в текущем окружении без поднятия TCP-порта, тестируются контроллеры)

## Что ещё сделать (приоритетно)

1. Почистить legacy frontend: старые типы/хуки/страницы, не используемые роутером (чтобы не путать поддержку).
2. Конфиг API: убрать хардкод `http://localhost:3001/api` (env или относительный `/api` для prod).
3. Под iPhone/Telegram: проверить реальный WebView (viewport/safe-area, back button, sendData) на HTTPS деплое.
