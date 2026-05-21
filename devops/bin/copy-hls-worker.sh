#!/bin/bash

set -Eeuo pipefail

# Copy the HLS.js Web Worker to public/assets/js so it is served as a static
# asset at /assets/js/hls.worker.js.  The worker offloads demuxing from the
# main thread, improving video playback performance.
#
# This script is called during prebuild. The output file is gitignored.

project_root=$(dirname "$(dirname "$(dirname "$(realpath "$0")")")")

src="${project_root}/node_modules/hls.js/dist/hls.worker.js"
dest_dir="${project_root}/public/assets/js"
dest="${dest_dir}/hls.worker.js"

if [ ! -f "$src" ]; then
  echo "Warning: hls.js worker not found at ${src}. Skipping copy." >&2
  exit 0
fi

mkdir -p "$dest_dir"
cp "$src" "$dest"
echo "Copied hls.js worker to ${dest}"
