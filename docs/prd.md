# PRD / План MVP

## Актуальность (срез)

Состояние репозитория на **2026-02-24** (ориентир: `main`, коммит `93e9bbe` от 2026-02-22):

**Уже сделано**
- Frontend: экраны `/` (каталог), `/p/:id` (товар), `/cart`, `/checkout`.
- Каталог: поиск, фильтры (chips + bottom sheet), карточки товаров 2-в-ряд.
- Корзина: stepper, удаление, сохранение в `localStorage`.
- Оформление: `POST /api/orders` + `sendData(...)` при наличии Telegram контекста.
- Admin mode: `?admin=1` + редактирование товара (через API `PUT /api/products/:id`).
- Telegram: подключён `@telegram-apps/sdk` (theme params + viewport/safe-area + back button) + browser-stub (`client/src/utils/telegramAdapter.ts`).
- Backend: Express + Prisma (SQLite), сид `server/prisma/seed.ts`.

**Что ещё осталось сделать (крупное)**
- Убрать/почистить legacy-код в `client/src` (есть старые типы/хуки/страницы, не используемые роутером).
- Для прод-режима: базу API держать относительной (`/api/*`), а для нестандартных окружений — вынести в env (см. `VITE_API_URL`).

## 0) Цель MVP

Собрать мини-приложение (WebApp / Mini App), которое:

* показывает **каталог товаров** (с фильтрами/поиском),
* открывает **страницу товара**,
* позволяет **добавлять/менять количество в корзине**,
* оформляет **заказ-заявку** (без обязательной оплаты на MVP),
* работает:

  1. **в браузере** (dev mode, без Telegram),
  2. **в Telegram на iPhone** (WebView).

---

## 1) Входные артефакты (обязательно использовать)

1. **Дизайн-спека**: `telegram_miniapp_shop_design_system_spec.md`

   * UI-каркас, компоненты, состояния, критерии.

2. **Токены**: `telegram_miniapp_shop_tokens.json`

   * использовать как source of truth для spacing/radius/typography и маппинга на `--tg-theme-*`.

3. **Картинки**: `amazingchoco_images_from_page.zip`

   * актуально сейчас: картинки уже лежат в `client/public/assets/products/…` и используются в сидировании `server/prisma/seed.ts`.

---

## 2) Технологии (обновленный стек)

**Frontend**

* React 18 + TypeScript + Vite.
* CSS: Tailwind CSS (v4) (токены заводятся как CSS-переменные и мапятся на `--tg-theme-*`).

**Telegram SDK слой**

* Использовать современный SDK `@telegram-apps/sdk` (и `@telegram-apps/sdk-react`), который умеет биндинг CSS vars темы/viewport (функции по созданию и биндингу `--tg-theme-*` и viewport vars).
* Поддержать чтение theme params через launch parameter `tgWebAppThemeParams` (на уровне понимания).

**Backend**

* Node.js + Express.
* ORM: Prisma (используется для хранения товаров и заказов).

---

## 3) Ограничения по теме/стилям (важно)

* Никаких “жёстких” цветов: всё через `--tg-theme-*` (фон, текст, кнопки, secondary bg и т.п.). ([GitHub][3])
* UI должен корректно выглядеть в light/dark (Telegram theme).
* Учесть viewport/safe-area, чтобы CTA не прятались (через SDK биндинг viewport CSS vars). ([JSR][1])

---

## 4) Функциональный состав (минимум)

### 4.1 Экран “Каталог”

* Сетка карточек 2-в-ряд.
* Поиск по названию.
* Фильтры:

  * коллекция (chips),
  * особенности (chips),
  * вид (chips),
  * кнопка “Фильтры” → bottom sheet с чекбоксами.
* Карточка товара: фото, название (2 строки), подзаголовок/теги, цена, вес, кнопка “+”.

### 4.2 Экран “Товар”

* Галерея/картинка.
* Название, теги (Vegan/Новинка/Без сахара…).
* Цена + вес/вариант (если есть).
* Stepper количества + CTA “В корзину”.
* Аккордеоны: “Описание / Состав / Хранение / Доставка”.

### 4.3 Корзина

* Список товаров, количество (stepper), удалить.
* Итог.
* CTA “Оформить”.

### 4.4 Оформление

* Поля: имя/телефон (минимум), адрес/комментарий, способ (самовывоз/курьер).
* На submit:

  * если внутри Telegram: `Telegram.WebApp.sendData(JSON.stringify(order))`
  * если в браузере: показать JSON заказа на экране (dev-fallback).

> Mini Apps поддерживают встроенную авторизацию/контекст и JS API внутри Telegram. ([core.telegram.org][4])

---

## 5) Изменение товаров и заказы (Backend)

* Для хранения товаров и заказов используется полноценный backend (Node.js + Express + Prisma), а не `localStorage`.
* Сделать **Admin mode** в UI (по query param `?admin=1` или скрытый toggle 10 тапов по версии):
  * редактирование: `title`, `price`, `inStock`, `badges`, `weight`
  * UI отправляет запросы на backend для сохранения изменений.
* В обычном режиме админ-контролы скрыты.

---

## 6) Модели данных (Prisma)

Схема для списка товаров будет реализована на стороне сервера через Prisma:

```prisma
model Product {
  id           String   @id @default(uuid())
  title        String
  subtitle     String?  @db.Text
  price        Float
  currency     String   @default("RUB")
  weightLabel  String?  // "60 г", "1 кг"
  badges       String[] // ["Vegan","Новинка"] (массив или JSON)
  images       String[] // массив путей к картинкам
  collection   String?
  features     String[]
  kind         String?
  description  String?  @db.Text
  composition  String?  @db.Text
  storage      String?  @db.Text
  delivery     String?  @db.Text
  inStock      Boolean  @default(true)
}
```

Далее:

* `GET /products` = запрос списка товаров с сервера (из БД).
* Оформление заказа = `POST /orders` с передачей данных на сервер.
* Корзина = сохранение выбранных позиций локально (`cart:{productId: qty}`), пока заказ не оформлен.

---

## 7) Навигация (routes)

* `/` → Каталог
* `/p/:id` → Товар
* `/cart` → Корзина
* `/checkout` → Оформление

---

## 8) Dev-режим без Telegram (обязателен)

Чтобы проверить в браузере:

* Добавить адаптер `telegramAdapter.ts`:

  * если `window.Telegram?.WebApp` нет — создать stub (theme defaults, noop методов, fake initData).
* В UI показывать бейдж “Browser mode”.

## 8.1) Порты dev-окружения (актуально сейчас)

- Backend: `http://localhost:3001` (см. `server/.env`, маршруты `/api/*`).
- Frontend (Vite): `http://localhost:5174` (см. `client/vite.config.ts`).

---

## 9) Запуск и тест на iPhone (Telegram WebView)

### 9.1 URL и HTTPS

* Для production-режима Telegram принимает **только HTTPS** ссылки. ([docs.telegram-mini-apps.com][5])
* Для разработки можно использовать **test environment**, где допускается HTTP/IP (если пользуешься тестовым окружением Telegram). ([docs.telegram-mini-apps.com][6])

**Рекомендуемый путь для быстрого теста на iPhone:**

* Деплой на Vercel/Netlify (получить HTTPS URL).
* Этот URL прописать в BotFather как Web App link / menu button. (про настройку menu button есть гайд в документации mini apps). ([docs.telegram-mini-apps.com][7])

### 9.2 Как открыть на iPhone

* Открываешь бота → кнопка меню/кнопка WebApp → Mini App открывается в Telegram.

---

## 10) Deliverables (что агент должен отдать)

1. Репозиторий с проектом:

* `README.md` с командами:

  * установка/запуск dev (`make install`, `make dev`) + порты
  * сидирование (`make seed`)
  * сборка/запуск prod (`make build`, `node server/dist/index.js`)
  * деплой (Vercel/Netlify) + где вставить URL в BotFather

2. Реализованные экраны + компоненты из спек-файла (минимум перечисленный выше).

3. Использование токенов:

* токены подключены и реально используются (spacing/radius/typography),
* цвета — через `--tg-theme-*`.

4. Проверка:

* работает добавление/удаление/изменение количества,
* корзина переживает перезагрузку, данные о товарах грузятся с сервера,
* checkout сохраняет заказ через API (backend), затем опционально отправляет `sendData` (для закрытия WebApp в Telegram).

---

## 11) Out of scope (явно не делать в MVP)

* Реальная оплата (можно оставить “hook” на будущее).
* Личный кабинет/история заказов (опционально как заглушка).
* Сложная система ролей и авторизации (строгая валидация initData может быть реализована в базовом виде для защиты API).
