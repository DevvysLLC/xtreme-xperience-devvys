#!/bin/bash

set -Eeuo pipefail

echo "Running vercel-build.sh"

target_env="${NEXT_PUBLIC_VERCEL_TARGET_ENV:-development}"
migration_max_attempts="${DB_MIGRATE_MAX_ATTEMPTS:-3}"
migration_strict="${DB_MIGRATE_STRICT:-0}"

echo "Detected environment: $target_env"

run_db_migrations() {
  local attempt=1
  local last_exit_code=1

  while [[ "$attempt" -le "$migration_max_attempts" ]]; do
    echo "Database migration attempt ${attempt}/${migration_max_attempts}"

    if pnpm run db-migrate; then
      echo "Database migration succeeded"
      return 0
    fi

    last_exit_code=$?
    echo "Database migration attempt ${attempt} failed (exit ${last_exit_code})"
    attempt=$((attempt + 1))
  done

  return "$last_exit_code"
}

# Run migrations before build to ensure schema is up-to-date
if [[ "$target_env" == "production" ]] || [[ "$target_env" == "preview" ]] || [[ "$target_env" == "uat" ]]; then
  echo "Running database migration for environment: $target_env"
  if ! run_db_migrations; then
    if [[ "$migration_strict" == "1" ]]; then
      echo "Database migration failed after ${migration_max_attempts} attempts and strict mode is enabled."
      exit 1
    fi

    echo "WARNING: Database migration failed after ${migration_max_attempts} attempts."
    echo "WARNING: Continuing build because DB_MIGRATE_STRICT is not enabled."
  fi
else
  echo "Skipping database migration for environment: $target_env"
fi

./devops/bin/compile-ts.sh

pnpm run build
