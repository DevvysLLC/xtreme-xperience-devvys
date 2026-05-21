#!/bin/bash

set -Eeuo pipefail

echo "Running vercel-build.sh"

target_env="${NEXT_PUBLIC_VERCEL_TARGET_ENV:-development}"

echo "Detected environment: $target_env"

# Run migrations before build to ensure schema is up-to-date
if [[ "$target_env" == "production" ]] || [[ "$target_env" == "preview" ]] || [[ "$target_env" == "uat" ]]; then
  db_url="${DATABASE_URL_NON_POOLING:-${POSTGRES_URL_NON_POOLING:-${DATABASE_URL:-}}}"

  if [[ -n "$db_url" ]]; then
    echo "Running database migration for environment: $target_env"
    DATABASE_URL_NON_POOLING="$db_url" pnpm run db-migrate
  else
    echo "Skipping database migration: DATABASE_URL_NON_POOLING is not set"
  fi
else
  echo "Skipping database migration for environment: $target_env"
fi

bash ./devops/bin/compile-ts.sh

pnpm run build
