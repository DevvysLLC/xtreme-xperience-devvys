#!/bin/bash

set -Eeuo pipefail

echo 'Setting up git user'

git config --global user.email "engineering@vaangroup.com"
git config --global user.name "Autobot"

echo 'Committing codegen artefacts'

find src -type f -exec grep -l 'build-fingerprint:codegen' {} \; | xargs -r git add --

git add .aiderignore .cursorignore .gitattributes .repomixignore || echo 'Could not commit ignore files'

if [[ -n $(git diff --staged --name-only) ]]; then
  git commit --quiet --author='Autobot <engineering@vaangroup.com>' --message='Codegen'
else
  echo 'Codegen artifacts unchanged since last build'
fi
