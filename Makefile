.PHONY: install dev build seed clean

# Установка всех зависимостей
install:
	@echo "Installing server dependencies..."
	cd server && npm install
	@echo "Installing client dependencies..."
	cd client && npm install

# Запуск проекта в режиме разработки (параллельно)
dev:
	@echo "Starting server and client..."
	make -j 2 dev-server dev-client

dev-server:
	cd server && npm run dev

dev-client:
	cd client && npm run dev

# Сборка проекта
build:
	@echo "Building server..."
	cd server && npm run build
	@echo "Building client..."
	cd client && npm run build

# Сидирование базы данных
seed:
	@echo "Seeding database..."
	cd server && npx prisma db seed

# Очистка (удаление node_modules и dist)
clean:
	rm -rf server/node_modules client/node_modules
	rm -rf server/dist client/dist
