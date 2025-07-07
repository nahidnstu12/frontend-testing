.PHONY: build run dev clean dev-frontend dev-backend dev-db

install-cmd:
	go install github.com/air-verse/air@latest
	go install github.com/swaggo/swag/cmd/swag@latest
	go install github.com/google/wire/cmd/wire@latest

build:
	npm run build
	cd api && wire ./di && go build -o server

run:
	cd api && GO_ENV=production ./server

dev:
	make -j dev-db dev-frontend dev-backend-with-db

dev-without-db:
	make -j 2 dev-frontend dev-backend

dev-frontend:
	npm run dev

dev-backend:
	cd api && air -c .air.toml

dev-backend-with-db:
	@echo "Waiting for PostgreSQL to be ready..."
	@until docker compose exec postgresql pg_isready -U postgres > /dev/null 2>&1; do \
		echo "⏳ Waiting for DB..."; \
		sleep 1; \
	done
	@echo "✅ PostgreSQL is ready!"
	make dev-backend

dev-db:
	@echo "Ensuring PostgreSQL container is up..."
	@docker compose ps postgresql | grep "running" >/dev/null || \
		docker compose -f docker-compose.yml up -d --build postgresql

clean:
	rm -rf dist api/server

test-e2e:
	cd api && go test ./e2e/... -timeout 30s -v
