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
		'사용법: make <target>' \
		'' \
		'개발' \
		'  install          의존성 설치' \
		'  db:up            로컬 DB 시작' \
		'  dev              모든 앱 실행' \
		'  app:backend      백엔드 실행' \
		'  app:web          웹 앱 실행' \
		'  app:mobile       모바일 앱 실행' \
		'' \
		'파일' \
		'  create:file      앱의 src 디렉터리 아래에 파일 생성' \
		'' \
		'검증' \
		'  check            lint와 typecheck 실행' \
		'  build            패키지 빌드' \
		'  lint             패키지 lint 실행' \
		'  typecheck        패키지 타입 검사' \
		'' \
		'데이터베이스' \
		'  db:build         DB 컨테이너 빌드' \
		'  db:pull          DB 이미지 가져오기' \
		'  db:down          DB 중지' \
		'  db:restart       DB 재시작' \
		'  db:ps            DB 상태 확인' \
		'  db:logs          DB 로그 보기' \
		'  db:init          로컬 DB 초기화' \
		'  db:wait          DB 준비 대기' \
		'  db:reset         로컬 DB 데이터 초기화' \
		'  prisma:generate  Prisma Client 생성' \
		'  prisma:migrate   개발용 마이그레이션 실행' \
		'' \
		'비밀값' \
		'  jwt:generate     JWT 비밀키 생성'

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
