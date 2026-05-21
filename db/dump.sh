#!/bin/bash

set -Eeuo pipefail

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DUMP_FILE="${1:-backup_${TIMESTAMP}.dump}"

docker compose exec -T db pg_dump \
  -U postgres \
  -h localhost \
  -d postgres \
  --verbose \
  --no-owner \
  --no-acl \
  --format=custom \
  --file="/tmp/dump.tmp"

# Copy from container to host
docker compose cp "db:/tmp/dump.tmp" "./${DUMP_FILE}"
docker compose exec db rm "/tmp/dump.tmp"

echo "Database dumped to: ${DUMP_FILE}"

