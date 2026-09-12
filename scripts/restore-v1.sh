#!/bin/bash
set -euo pipefail
ROOT=/workspace
SNAP=/workspace/snapshots/v1-locked
if [ ! -d "$SNAP/src" ]; then
  echo "missing snapshot" >&2
  exit 1
fi
rsync -a "$SNAP/src/" "$ROOT/src/"
rsync -a "$SNAP/public/" "$ROOT/public/"
for f in package.json tsconfig.json vite.config.ts eslint.config.mjs startup.sh; do
  [ -f "$SNAP/$f" ] && cp "$SNAP/$f" "$ROOT/$f"
done
echo "restored v1-locked"
