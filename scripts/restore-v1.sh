#!/bin/bash
set -euo pipefail
cd /workspace
if git rev-parse v1-locked >/dev/null 2>&1; then
  git checkout v1-locked -- src public package.json tsconfig.json vite.config.ts eslint.config.mjs startup.sh
  echo "restored v1-locked from git tag"
  exit 0
fi
SNAP=/workspace/snapshots/v1-locked
if [ ! -d "$SNAP/src" ]; then
  echo "missing snapshot" >&2
  exit 1
fi
cp -a "$SNAP/src/." /workspace/src/
cp -a "$SNAP/public/." /workspace/public/
for f in package.json tsconfig.json vite.config.ts eslint.config.mjs startup.sh; do
  [ -f "$SNAP/$f" ] && cp "$SNAP/$f" "/workspace/$f"
done
echo "restored v1-locked from folder snapshot"
