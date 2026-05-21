#!/usr/bin/env bash

set -Eeuo pipefail

compare_with=${1:-main}

# 1. Show difference with the main branch or specific commit
# 2. List unstaged files in working copy
# 3. List staged files
# 4. List untracked files
(printf ".gitignore\0" \
  && git diff -z --name-only --diff-filter=ACMRT "${compare_with}"...HEAD \
  && git diff -z --name-only --diff-filter=ACMRT \
  && git diff -z --name-only --cached --diff-filter=ACMRT \
  && git ls-files -z --others --exclude-standard) \
  | xargs -0 -I{} bash -c 'test -e "{}" && printf "%s\0" "{}" || exit 0' \
  | xargs -0 rg --files-without-match 'build-fingerprint' \
  | sort -h \
  | uniq
