#!/bin/bash

set -Eeuxo pipefail

container_id=$(docker compose ps -q main_ci)

docker cp ${container_id}:/app/. .

chown $(id -u):$(id -g) ./
