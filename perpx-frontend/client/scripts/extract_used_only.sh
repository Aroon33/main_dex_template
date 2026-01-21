#!/bin/bash

# ===== 固定パス（明示）=====
PROJECT_ROOT="/home/deploy/dex_template_com/perpx-frontend"
DEST_ROOT="/home/deploy/dex_template_com/perpx-frontend-clean"

echo "▶ Project root: $PROJECT_ROOT"
echo "▶ Dest root   : $DEST_ROOT"

cd "$PROJECT_ROOT" || exit 1

echo "▶ Extracting used TypeScript files (ignore exit code)..."
npx tsc --noEmit --listFiles > used-files.txt || true

echo "▶ Normalizing paths..."
sed -i "s|$PROJECT_ROOT/||" used-files.txt

echo "▶ Creating clean directory..."
rm -rf "$DEST_ROOT"
mkdir -p "$DEST_ROOT"

echo "▶ Copying used files..."
rsync -av --files-from=used-files.txt "$PROJECT_ROOT/" "$DEST_ROOT/"

echo "▶ Copying static files..."
rsync -av \
  package.json \
  package-lock.json \
  vite.config.ts \
  tsconfig.json \
  tsconfig.node.json \
  index.html \
  public \
  "$DEST_ROOT/" 2>/dev/null || true

echo ""
echo "✅ DONE"
echo "➡ cd $DEST_ROOT && npm install && npm run build"
