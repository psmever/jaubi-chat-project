.DEFAULT_GOAL := help

PNPM ?= pnpm

FILE_PROJECTS := backend web mobile

PROJECT_ROOT_backend := apps/backend
PROJECT_ROOT_web := apps/web
PROJECT_ROOT_mobile := apps/mobile

CREATE_FILE_PROJECT := $(strip \
	$(foreach project,$(FILE_PROJECTS),\
		$(if $($(project)),$(project))))

.PHONY: help install dev app\:backend app\:web app\:mobile build lint typecheck \
	create\:file \
	db\:build db\:pull db\:up db\:down db\:restart db\:ps db\:logs db\:init db\:wait db\:reset \
	prisma\:generate prisma\:migrate jwt\:generate check

help:
	@printf '%s\n' \
		'Usage: make <target>' \
		'' \
		'Development' \
		'  install          Install deps' \
		'  db:up            Start local DB' \
		'  dev              Start all apps' \
		'  app:backend      Start backend' \
		'  app:web          Start web app' \
		'  app:mobile       Start mobile app' \
		'' \
		'Files' \
		'  create:file      Create a file under an app src directory' \
		'' \
		'Validation' \
		'  check            Run lint and typecheck' \
		'  build            Build packages' \
		'  lint             Lint packages' \
		'  typecheck        Type-check packages' \
		'' \
		'Database' \
		'  db:build         Build DB container' \
		'  db:pull          Pull DB image' \
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
		'  jwt:generate     Generate JWT secrets'

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

create\:file:
	@test "$(words $(CREATE_FILE_PROJECT))" -eq 1 || { \
		echo "Usage: make create:file backend=path/to/file.ts"; \
		echo "Projects: $(FILE_PROJECTS)"; \
		exit 2; \
	}
	@relative="$($(CREATE_FILE_PROJECT))"; \
	case "$$relative" in \
		/*|../*|*/../*|*/..) \
			echo "Path must be relative to src: $$relative"; \
			exit 2 ;; \
	esac; \
	target="$(PROJECT_ROOT_$(CREATE_FILE_PROJECT))/src/$$relative"; \
	test ! -e "$$target" || { \
		echo "File already exists: $$target"; \
		exit 2; \
	}; \
	mkdir -p "$$(dirname "$$target")"; \
	touch "$$target"; \
	echo "Created: $$target"

build:
	$(PNPM) run build

lint:
	$(PNPM) run lint

typecheck:
	$(PNPM) run typecheck

check:
	$(PNPM) run lint
	$(PNPM) run typecheck

db\:build:
	$(PNPM) run docker:build

db\:pull:
	$(PNPM) run docker:pull

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
