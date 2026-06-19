#!/bin/sh
set -eu

repo_root=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
env_file="$repo_root/apps/backend/.env"
force=0

usage() {
  printf '%s\n' "Usage: sh scripts/generate-jwt-secrets.sh [--force]" >&2
}

while [ "$#" -gt 0 ]; do
  case "$1" in
    --force)
      force=1
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      printf '%s\n' "Unknown argument: $1" >&2
      usage
      exit 1
      ;;
  esac
  shift
done

if ! command -v openssl >/dev/null 2>&1; then
  printf '%s\n' "openssl is required to generate JWT secrets." >&2
  exit 1
fi

if [ ! -f "$env_file" ]; then
  printf '%s\n' "Missing backend env file: $env_file" >&2
  exit 1
fi

get_value() {
  awk -F= -v key="$1" '
    $1 == key {
      sub(/^[^=]*=/, "")
      print
      exit
    }
  ' "$env_file"
}

is_placeholder() {
  case "$1" in
    ""|local-access-secret-at-least-32-characters|local-refresh-secret-at-least-32-characters)
      return 0
      ;;
    *)
      return 1
      ;;
  esac
}

current_access=$(get_value JWT_ACCESS_SECRET || true)
current_refresh=$(get_value JWT_REFRESH_SECRET || true)

if [ "$force" -eq 0 ]; then
  if [ -n "$current_access" ] && ! is_placeholder "$current_access"; then
    printf '%s\n' "JWT_ACCESS_SECRET already exists in apps/backend/.env. Re-run with --force to rotate it." >&2
    exit 1
  fi

  if [ -n "$current_refresh" ] && ! is_placeholder "$current_refresh"; then
    printf '%s\n' "JWT_REFRESH_SECRET already exists in apps/backend/.env. Re-run with --force to rotate it." >&2
    exit 1
  fi
fi

access_secret=$(openssl rand -hex 64)
refresh_secret=$(openssl rand -hex 64)
tmp_file=$(mktemp "${TMPDIR:-/tmp}/jwt-secrets.XXXXXX")

cleanup() {
  rm -f "$tmp_file"
}

trap cleanup EXIT HUP INT TERM

awk -v access="$access_secret" -v refresh="$refresh_secret" '
  $1 == "JWT_ACCESS_SECRET" {
    print "JWT_ACCESS_SECRET=" access
    seen_access = 1
    next
  }
  $1 == "JWT_REFRESH_SECRET" {
    print "JWT_REFRESH_SECRET=" refresh
    seen_refresh = 1
    next
  }
  {
    print
  }
  END {
    if (!seen_access) {
      print "JWT_ACCESS_SECRET=" access
    }
    if (!seen_refresh) {
      print "JWT_REFRESH_SECRET=" refresh
    }
  }
' "$env_file" > "$tmp_file"

mv "$tmp_file" "$env_file"
trap - EXIT HUP INT TERM

printf '%s\n' "Updated JWT secrets in apps/backend/.env"
