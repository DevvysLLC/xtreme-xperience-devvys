#!/bin/bash

set -Eeuo pipefail

docker compose exec db /bin/bash -c 'psql -d postgres://postgres:postgres@db:5432/postgres'
