#!/bin/bash

set -Eeuo pipefail

if [ -z ${1+x} ]
then
  echo 'ERROR Migration name and environment name are required'
  echo 'Usage example:'
  echo "./datocms/autogenerate-migration.sh 'create article' 'my-environment'"
  exit 1
fi

script_dir="$(dirname $(dirname $(realpath $0)))"

datocms migrations:new "${1}" \
  --config-file="${script_dir}/datocms/config.json" \
  --ts \
  --autogenerate="${2}"
