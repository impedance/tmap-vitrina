# Docker & Cloudflare Local Development Plan (Single Container)

This plan outlines how to configure your project to run locally using a **single Docker container** for both Frontend and Backend, along with a Cloudflare Tunnel container to expose the application to Telegram.

## Proposed Architecture for Development

1.  **Monolithic Dev Container (`app`)**: 
    -   Mounts the entire project root (`./`) into the container.
    -   Uses `concurrently` (or a simple shell script) to start both the Vite dev server (`client/npm run dev`) and the backend API server (`server/npm run dev`) simultaneously.
    -   Hot Module Replacement (HMR) and backend auto-restarts (`ts-node-dev`) will work out of the box because the host files are mounted.
2.  **Cloudflare Tunnel Container (`cloudflared`)**: Creates a secure tunnel directly to the `app` container (specifically to the Vite frontend port), giving you a randomized `trycloudflare.com` HTTPS URL.

## Proposed Changes

### Configuration Files

#### [NEW] [docker-compose.yaml](file:///home/spec/work/tmap-vitrina/docker-compose.yaml)
*   **Purpose**: Orchestrates the app container and the tunnel.
*   **Key Features**: 
    *   Defines `app` and `cloudflared` services.
    *   Maps the root volume `./:/app` so changes in both client and server are instantly reflected.
    *   Exposes port 5173 (client) and 3000 (server) to the host for local debugging.

#### [NEW] [Dockerfile.dev](file:///home/spec/work/tmap-vitrina/Dockerfile.dev)
*   **Purpose**: A single Docker image definition for the dev environment in the project root.
*   **Key Features**: 
    *   Based on Node.js.
    *   Sets up the working directory.
    *   Installs dependencies for both client and server during the image build phase (or relies on an init script to run `npm install` on mount).
    *   Runs a command that starts both Vite and the Node.js API.

### Code Updates

#### [NEW] [package.json](file:///home/spec/work/tmap-vitrina/package.json) (Root level - Optional but recommended)
*   **Change**: Create a root-level `package.json` to manage the concurrent start script.
*   **Key Features**: Add `concurrently` as a dev dependency. Add a `dev` script: `"dev": "concurrently \"npm --prefix server run dev\" \"npm --prefix client run dev -- --host\""`.

#### [MODIFY] [client/vite.config.ts](file:///home/spec/work/tmap-vitrina/client/vite.config.ts)
*   **Change**: Configure the Vite dev server to:
    1.  Proxy API requests (e.g., `/api`) to `localhost:3000` (since the backend runs in the exact same container).
    2.  Allow traffic from Cloudflare's randomly generated hosts.

## Verification Plan

### Manual Verification
1.  **Start the environment**: Run `docker-compose -f docker-compose.yaml up --build`.
2.  **Check Tunnel URL**: Look at the terminal output for the `cloudflared` container and copy the `https://...trycloudflare.com` URL.
3.  **Telegram Mini App Test**: Paste the URL into BotFather and open the Mini App on your target device.
4.  **Hot-Reload Test**: Change a file in `client/` and verify the UI updates. Change a file in `server/` and verify the API updates.

## Backlog: Production Considerations (1GB RAM VDS)

Этот план выше описывает **среду для локальной разработки (Development)**. После реализации локального окружения, для деплоя на боевой VDS с 1 ГБ оперативной памяти потребуется оптимизация для продакшена.

### 1. Проблема: Запуск Dev-сборки на VDS
В режиме разработки работают «тяжелые» инструменты, следящие за изменениями файлов.
*   **ОС Linux + Docker daemon:** ~200 - 250 МБ
*   **Vite Dev Server (Client):** ~150 - 300 МБ
*   **Backend на `ts-node-dev`:** ~150 - 300 МБ
*   **Cloudflared Tunnel (опционально для тестов):** ~20 - 50 МБ
*   **Итого RAM:** от **520 МБ до 900+ МБ**.
*   **Риск:** Запуск `npm install` или пересборка фронтенда внутри контейнера почти гарантированно приведет к OOM (Out of Memory) и падению процесса на сервере с 1 ГБ ОЗУ.

### 2. Решение: Сборка Prod-версии
Для продакшена необходимо использовать Multi-stage сборку: фронтенд компилируется в статику, а бэкенд запускается через обычный Node.js.
*   **ОС Linux + Docker daemon:** ~200 - 250 МБ
*   **Статика фронтенда (Nginx):** ~10 - 20 МБ
*   **Backend (чистый Node.js):** ~70 - 150 МБ
*   **Итого RAM:** **~300 - 470 МБ**.
*   **Итог:** 1 ГБ ОЗУ **полностью хватит** для стабильной работы приложения, при этом останется запас для небольшой БД (PostgreSQL/Redis) или кэша. Нагрузка на CPU также будет минимальной (0-15%).

### План действий для Prod-окружения
1.  **Настроить Swap:** Обязательно добавить файл подкачки на 1-2 ГБ на сервере, чтобы избежать зависаний при установке зависимостей или деплое.
2.  **Создать `Dockerfile.prod`:** Использовать Multi-stage сборку для отдачи статики фронтенда через Nginx и запуска скомпилированного кода бэкенда.
3.  **CI/CD (Опционально):** Перенести сборку образов на GitHub Actions, чтобы VDS занимался только скачиванием готовых образов и их запуском, избегая пиковых нагрузок.
