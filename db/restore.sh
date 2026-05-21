#!/bin/bash

set -Eeuo pipefail

DUMP_FILE="${1:?Please provide dump file as first argument}"
JOBS="${2:-4}"

if [[ ! -f "$DUMP_FILE" ]]; then
  echo "Error: File '$DUMP_FILE' not found"
  exit 1
fi

# Copy to container
docker compose cp "$DUMP_FILE" "db:/tmp/restore.tmp"

docker compose exec -T db pg_restore \
  -U postgres \
  -h localhost \
  -d postgres \
  --verbose \
  --no-owner \
  --no-acl \
  --clean \
  --if-exists \
  --jobs="$JOBS" \
  "/tmp/restore.tmp"

docker compose exec db rm "/tmp/restore.tmp"
echo "Database restored from: $DUMP_FILE"

