#!/bin/bash

set -Eeuo pipefail

echo "Running vercel-build.sh"

target_env="${NEXT_PUBLIC_VERCEL_TARGET_ENV:-development}"

echo "Detected environment: $target_env"

# Run migrations before build to ensure schema is up-to-date
if [[ "$target_env" == "production" ]] || [[ "$target_env" == "preview" ]] || [[ "$target_env" == "uat" ]]; then
  echo "Running database migration for environment: $target_env"
  pnpm run db-migrate
else
  echo "Skipping database migration for environment: $target_env"
fi

./devops/bin/compile-ts.sh

pnpm run build
