.PHONY: help install dev build preview lint test seed clean \
        up up-log down docker-build logs logs-app tunnel shell ps docker-clean

# ── Help ──────────────────────────────────────────────────────────────────────

help:
	@echo ""
	@echo "  🚀 tmap-vitrina — команды"
	@echo ""
	@echo "  ── Local (без Docker) ──────────────────────────────────────────"
	@echo "  make install    — Установить зависимости (root + client + server)"
	@echo "  make dev        — Запустить Vite + Express одновременно"
	@echo "  make build      — Собрать client и server"
	@echo "  make preview    — Предпросмотр production-сборки client"
	@echo "  make lint       — Запустить ESLint для client"
	@echo "  make test       — Запустить Jest-тесты server"
	@echo "  make seed       — Заполнить базу данных начальными данными"
	@echo "  make clean      — Удалить node_modules и dist"
	@echo ""
	@echo "  ── Docker Dev ──────────────────────────────────────────────────"
	@echo "  make up         — Собрать и запустить контейнеры (фон)"
	@echo "  make up-log     — Запустить с выводом логов в терминал"
	@echo "  make down       — Остановить и удалить контейнеры"
	@echo "  make docker-build — Пересобрать образ без кэша"
	@echo "  make logs       — Следить за логами всех сервисов"
	@echo "  make logs-app   — Следить за логами только app"
	@echo "  make tunnel     — Показать URL Cloudflare-туннеля"
	@echo "  make shell      — Открыть bash внутри контейнера app"
	@echo "  make ps         — Показать запущенные контейнеры"
	@echo "  make docker-clean — Удалить контейнеры, тома и образы"
	@echo ""

# ── Local ─────────────────────────────────────────────────────────────────────

# Устанавливает зависимости root, client и server
install:
	npm install
	npm install --prefix client
	npm install --prefix server

# Запускает Vite (port 5174) и Express (port 3002) через concurrently
dev:
	npm run dev

# Собирает TypeScript + Vite bundle для client и TypeScript для server
build:
	npm run build --prefix client
	npm run build --prefix server

# Предпросмотр production-сборки Vite (нужен make build перед этим)
preview:
	npm run preview --prefix client

# ESLint для client
lint:
	npm run lint --prefix client

# Jest-тесты для server
test:
	npm test --prefix server

# Drizzle seed (ts-node drizzle/seed.ts)
seed:
	cd server && npx ts-node drizzle/seed.ts

# Удаляет зависимости и артефакты сборки
clean:
	rm -rf node_modules client/node_modules server/node_modules
	rm -rf client/dist server/dist

# ── Docker Dev ────────────────────────────────────────────────────────────────

# Собирает образ и запускает app + cloudflared в фоне
up:
	docker compose up --build -d

# То же, но с выводом логов прямо в терминал (Ctrl+C для остановки)
up-log:
	docker compose up --build

# Останавливает и удаляет контейнеры
down:
	docker compose down

# Полная пересборка образа без кэша
docker-build:
	docker compose build --no-cache

# Логи всех сервисов в реальном времени
logs:
	docker compose logs -f

# Логи только контейнера app (Vite + Express)
logs-app:
	docker compose logs -f app

# Находит и выводит HTTPS URL Cloudflare Quick Tunnel
tunnel:
	@echo "🌐 Cloudflare tunnel URL:"
	@docker compose logs cloudflared 2>&1 | grep -oE 'https://[a-zA-Z0-9-]+\.trycloudflare\.com' | tail -1

# Открывает bash-шелл внутри работающего контейнера app
shell:
	docker compose exec app bash

# Список запущенных контейнеров
ps:
	docker compose ps

# Полная очистка: контейнеры + анонимные тома + локальные образы
docker-clean:
	docker compose down --volumes --rmi local
