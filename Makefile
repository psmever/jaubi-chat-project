.DEFAULT_GOAL := help

PNPM ?= pnpm

.PHONY: help install dev app\:backend app\:web app\:mobile build lint typecheck \
	docker\:build docker\:pull docker\:up docker\:down docker\:ps docker\:logs docker\:reset \
	db\:up db\:down db\:restart db\:ps db\:logs db\:init db\:wait db\:reset \
	prisma\:generate prisma\:migrate jwt\:generate check

help:
	@printf '%s\n' \
		'Usage: make <target>' \
		'' \
		'Development' \
		'  install          Install deps' \
		'  dev              Start all apps' \
		'  app:backend      Start backend' \
		'  app:web          Start web app' \
		'  app:mobile       Start mobile app' \
		'' \
		'Validation' \
		'  check            Run lint and typecheck' \
		'  build            Build packages' \
		'  lint             Lint packages' \
		'  typecheck        Type-check packages' \
		'' \
		'Database' \
		'  db:up            Start DB' \
		'  db:down          Stop DB' \
		'  db:restart       Restart DB' \
		'  db:ps            Show DB status' \
		'  db:logs          Tail DB logs' \
		'  db:init          Init local DBs' \
		'  db:wait          Wait for DB' \
		'  db:reset         Reset local DB data' \
		'  prisma:generate  Generate Prisma Client' \
		'  prisma:migrate   Run dev migration' \
		'' \
		'Secrets' \
		'  jwt:generate     Generate JWT secrets' \
		'' \
		'Docker' \
		'  docker:build     Build' \
		'  docker:pull      Pull' \
		'  docker:up        Start' \
		'  docker:down      Stop' \
		'  docker:ps        Show status' \
		'  docker:logs      Tail logs' \
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

check:
	$(PNPM) run lint
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

jwt\:generate:
	$(PNPM) run jwt:generate
