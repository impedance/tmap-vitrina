
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

   * распаковать в `public/assets/products/…` и использовать в мок-каталоге.

---

## 2) Технологии (рекомендованный стек)

**Frontend**

* React + TypeScript + Vite (или Next.js, если уже есть стартовый проект).
* CSS: Tailwind или CSS Modules (главное — **завести токены** и использовать `--tg-theme-*`).

**Telegram SDK слой**

* Использовать SDK, который умеет биндинг CSS vars темы/viewport (например `@tma/sdk`: функции по созданию и биндингу `--tg-theme-*` и viewport vars). ([JSR][1])
* Поддержать чтение theme params через launch parameter `tgWebAppThemeParams` (на уровне понимания). ([docs.telegram-mini-apps.com][2])

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

## 5) “Изменять товары” (как сделать без админки и backend)

Чтобы закрыть твоё “изменять их” в MVP:

* Сделать **Admin mode** по query param `?admin=1` (или скрытый toggle 10 тапов по версии):

  * редактирование: `title`, `price`, `inStock`, `badges`, `weight`
  * изменения сохранять в `localStorage` (поверх мок-данных).
* В обычном режиме админ-контролы скрыты.

---

## 6) Данные (мок-API)

Сделать файл `src/data/products.seed.json` с полями:

```ts
type Product = {
  id: string;
  title: string;
  subtitle?: string;
  price: number;
  currency: "RUB";
  weightLabel?: string; // "60 г", "1 кг"
  badges?: string[]; // ["Vegan","Новинка"]
  images: string[]; // /assets/products/...
  collection?: string;
  features?: string[];
  kind?: string;
  description?: string;
  composition?: string;
  storage?: string;
  delivery?: string;
  inStock?: boolean;
};
```

Далее:

* `GET /products` = чтение seed + override из localStorage (admin edits)
* Корзина = localStorage (`cart:{productId: qty}`)

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

  * `npm i`
  * `npm run dev` (browser)
  * `npm run build && npm run preview`
  * деплой (Vercel/Netlify) + где вставить URL в BotFather

2. Реализованные экраны + компоненты из спек-файла (минимум перечисленный выше).

3. Использование токенов:

* токены подключены и реально используются (spacing/radius/typography),
* цвета — через `--tg-theme-*`.

4. Проверка:

* работает добавление/удаление/изменение количества,
* корзина переживает перезагрузку (localStorage),
* checkout формирует payload и отправляет через `sendData` (в Telegram) / показывает JSON (в браузере).

---

## 11) Out of scope (явно не делать в MVP)

* Реальная оплата (можно оставить “hook” на будущее).
* Личный кабинет/история заказов (опционально как заглушка).
* Настоящий backend и валидация initData (это уже следующая итерация; для production нужно валидировать init data на сервере). ([docs.telegram-mini-apps.com][8])
