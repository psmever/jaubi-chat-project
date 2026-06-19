.DEFAULT_GOAL := help

PNPM ?= pnpm

.PHONY: help install dev app\:backend app\:web app\:mobile build lint typecheck \
	docker\:build docker\:pull docker\:up docker\:down docker\:ps docker\:logs docker\:reset \
	db\:up db\:down db\:restart db\:ps db\:logs db\:init db\:wait db\:reset \
	prisma\:generate prisma\:migrate

help:
	@printf '%s\n' \
		'Usage: make <target>' \
		'' \
		'Development' \
		'  install          Install workspace dependencies' \
		'  dev              Start all apps in development mode' \
		'  app:backend      Start the NestJS backend' \
		'  app:web          Start the Next.js web app' \
		'  app:mobile       Start the Expo mobile app' \
		'' \
		'Validation' \
		'  build            Build all workspace packages' \
		'  lint             Lint all workspace packages' \
		'  typecheck        Type-check all workspace packages' \
		'' \
		'Database' \
		'  db:up            Start MariaDB' \
		'  db:down          Stop MariaDB' \
		'  db:restart       Restart MariaDB' \
		'  db:ps            Show MariaDB status' \
		'  db:logs          Follow MariaDB logs' \
		'  db:init          Initialize local databases' \
		'  db:wait          Wait for MariaDB readiness' \
		'  db:reset         Recreate and initialize MariaDB data' \
		'  prisma:generate  Generate Prisma Client' \
		'  prisma:migrate   Create and apply a development migration' \
		'' \
		'Docker' \
		'  docker:build     Build Docker services' \
		'  docker:pull      Pull Docker service images' \
		'  docker:up        Start all Docker services' \
		'  docker:down      Stop all Docker services' \
		'  docker:ps        Show Docker service status' \
		'  docker:logs      Follow Docker service logs' \
		'  docker:reset     Remove services, volumes, and orphans'

install:
	$(PNPM) install

dev:
	$(PNPM) run dev

app\:backend:
	$(PNPM) run backend:dev

app\:web:
	$(PNPM) --filter @jaubi-chat/web dev

app\:mobile:
	$(PNPM) --filter @jaubi-chat/mobile dev

build:
	$(PNPM) run build

lint:
	$(PNPM) run lint

typecheck:
	$(PNPM) run typecheck

docker\:build:
	$(PNPM) run docker:build

docker\:pull:
	$(PNPM) run docker:pull

docker\:up:
	$(PNPM) run docker:up

docker\:down:
	$(PNPM) run docker:down

docker\:ps:
	$(PNPM) run docker:ps

docker\:logs:
	$(PNPM) run docker:logs

docker\:reset:
	$(PNPM) run docker:reset

db\:up:
	$(PNPM) run db:up

db\:down:
	$(PNPM) run db:down

db\:restart:
	$(PNPM) run db:restart

db\:ps:
	$(PNPM) run db:ps

db\:logs:
	$(PNPM) run db:logs

db\:init:
	$(PNPM) run db:init

db\:wait:
	$(PNPM) run db:wait

db\:reset:
	$(PNPM) run db:reset

prisma\:generate:
	$(PNPM) run backend:prisma:generate

prisma\:migrate:
	$(PNPM) run backend:prisma:migrate
