# План доработок (актуально на 2026-02-24)

Цель: довести проект до устойчивого MVP (каталог → товар → корзина → оформление) и убрать нестыковки между кодом, данными и документацией.

## 0) Уже синхронизировано в репозитории

- Документация: добавлен корневой `README.md`, актуализирован `docs/prd.md`, добавлены `docs/status.md` и этот план.
- Frontend: убран хардкод `http://localhost:3001/api` → запросы через `/api` + Vite proxy.
- Backend: ответы по `Product` нормализованы (массивы `badges/images/features`), фикс частичного `inStock`, обновлены тесты под ограничения окружения.
- Удалены legacy страницы/хуки/типы, не используемые роутером (чтобы не плодить две модели данных).

## 1) Source of truth (как сейчас устроено)

### Фронтенд
- React + TS + Vite + Tailwind v4 (`client/`)
- Роуты: `/`, `/p/:id`, `/cart`, `/checkout` (`client/src/App.tsx`)
- Telegram SDK: `@telegram-apps/sdk` + биндинг viewport/theme vars (`client/src/components/TelegramProvider.tsx`)
- Browser-mode: stub `window.Telegram.WebApp` + выставление `--tg-theme-*` (`client/src/utils/telegramAdapter.ts`)
- API-клиент: axios с `baseURL=/api` (можно переопределить `VITE_API_URL`) (`client/src/utils/api.ts`)
- В dev запросы `/api` и `/uploads` проксируются на backend через Vite (`client/vite.config.ts`)

### Бэкенд
- Express + Prisma + SQLite (`server/`)
- API:
  - `GET /api/products`, `GET /api/products/:id`
  - `POST/PUT/DELETE /api/products` (multer, `uploads/`)
  - `POST /api/orders`, `GET /api/orders`
- Модель данных: `server/prisma/schema.prisma`
- Dev env: `server/.env` (`PORT=3001`, `DATABASE_URL="file:./dev.db"`)
- Сид: `server/prisma/seed.ts` (картинки берутся из `client/public/assets/products/`)

## 2) Найденные нестыковки/ошибки (и что с ними делать)

### 2.1 API baseURL/порты
Проблема: хардкод `http://localhost:3001/api` в клиенте ломает prod-сценарий (когда backend раздаёт `client/dist`) и усложняет деплой.
Решение: держать базу относительной (`/api`) + Vite proxy в dev + опциональный env `VITE_API_URL` для нестандартных окружений.

### 2.2 Формат ответа Product (badges/images/features)
Проблема: сервер хранил поля как JSON-строки, а в UI местами ожидались массивы/строки → приходилось парсить в разных местах и легко получить рассинхрон.
Решение: API всегда возвращает `badges/images/features` как массивы (нормализация в контроллере), независимо от того, как это хранится в БД.

### 2.3 `inStock=false` при частичном update
Проблема: при `PUT /api/products/:id` без `inStock` значение могло «съезжать» в `false` (из-за `undefined` → `false` логики в JS).
Решение: вычислять `inStock` только если поле реально пришло, иначе не менять.

### 2.4 Тесты в текущем окружении
Факт: в окружении запуска тестов запрещён bind TCP-портов (даже на `127.0.0.1`), поэтому `supertest(request(app).get(...))` падает.
Решение: тестировать контроллеры напрямую (без HTTP), а для Prisma использовать отдельный sqlite-файл в `/tmp` как базу.

## 3) План работ (по приоритетам)

### P0 — стабилизация MVP (1–2 дня)
1. **Согласовать типы Product/Order на фронте**
   - Добавить типы, совпадающие с `server/prisma/schema.prisma` (и тем, что реально возвращает API).
   - Постепенно заменить `any` в ключевых местах: Catalog/Product/Cart/Checkout.
   - Критерий готовности: `tsc -b` проходит в `client/` без ослабления `strict`.

2. **UX/ошибки сети**
   - Единый обработчик ошибок: toast/snackbar вместо `alert`.
   - Пустые состояния/лоадеры на всех экранах (каталог/товар/оформление).

### P1 — Telegram-качество (1–2 дня)
1. **Проверка в реальном Telegram WebView на iPhone**
   - Проверить safe-area (CTA не под панелью), back button, theme switching.
   - Проверить `sendData` поведение (что реально уходит и в каких контекстах доступно).
   - Критерий готовности: чек-лист с результатами + фиксы по UI.

2. **Минимальная защита admin mode**
   - Сейчас доступ по `?admin=1` (это только для dev/MVP).
   - Варианты:
     - whitelist `user_id` из `initDataUnsafe` (Telegram), или
     - секретный ключ в env + простая проверка, или
     - отключить admin в prod.

### P2 — Backend/данные (по необходимости)
1. **Валидация входных данных**
   - `POST /orders`: валидировать телефон/имя/корзину (минимум) и возвращать понятные ошибки.
   - `POST/PUT /products`: валидировать `price`, JSON-строки массивов.

2. **Миграция хранения JSON-строк (опционально)**
   - Сейчас `badges/images/features/items` хранятся строками.
   - Если нужен следующий уровень: перейти на отдельные таблицы/отношения или JSON (если сменить DB на Postgres).

## 4) Критерии готовности MVP (Definition of Done)

- `make dev` поднимает фронт и бэк, каталог грузится, корзина работает, заказ создаётся.
- `make seed` наполняет базу, картинки отображаются.
- Admin mode редактирует товар, изменения видны в каталоге без перезагрузки (или после refetch).
- `cd server && npm test` проходит.
- Документация не противоречит коду: порты, команды, где лежат картинки, как устроен API.

## 5) Что делать прямо сейчас (самый короткий список)

1. Согласовать: чистим ли полностью legacy-страницы/типы во фронте или переносим в `legacy/` для истории.
2. Решить, нужен ли admin в проде (и какой уровень защиты).
3. Сделать тестовый HTTPS деплой (Vercel/Netlify) и прогнать iPhone WebView чек-лист.
