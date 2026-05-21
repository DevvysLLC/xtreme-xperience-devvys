#!/bin/bash

set -Eeuo pipefail

destination=${1:-$(date '+vaan-%F-%H-%M-%S')}
script_dir="$(dirname $(realpath $0))"

./devops/bin/compile-ts.sh

datocms maintenance:on \
  && datocms migrations:run \
    --config-file="${script_dir}/config.json" \
    --migrations-dir="${script_dir}/lib/migrations" \
    --destination="${destination}" \
  || datocms maintenance:off

datocms maintenance:off
