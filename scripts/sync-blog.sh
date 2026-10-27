#!/usr/bin/env bash
# Sync blog content from the founder's business repo into this site repo.
#
#   content/blog/*.mdx|*.md   →  content/blog/   (README/_ files skipped)
#   public/blog/**            →  public/blog/    (design sources .html/.svg skipped)
#
# Usage:  bash scripts/sync-blog.sh
# Then:   npm run build        (add BLOG_INCLUDE_DRAFTS=1 to preview drafts)
set -euo pipefail

SRC="${BLOG_SRC:-$HOME/Hoardy_2026/hoardy-business}"
DEST="$(cd "$(dirname "$0")/.." && pwd)"

if [ ! -d "$SRC/.git" ]; then
  echo "✗ Source repo not found at $SRC"
  echo "  Clone it first:  git clone https://github.com/kmohamedmaaz/hoardy-business.git \"$SRC\""
  exit 1
fi

echo "→ Pulling latest posts from $(basename "$SRC")…"
git -C "$SRC" pull --ff-only --quiet || echo "  (offline — using local copy of the source repo)"

mkdir -p "$DEST/content/blog" "$DEST/public/blog"

# Posts only (README is docs, underscore files are templates)
rsync -a --delete-excluded \
  --exclude 'README.md' --exclude '_*' \
  --include '*/' --include '*.md' --include '*.mdx' --exclude '*' \
  "$SRC/content/blog/" "$DEST/content/blog/"

# Post assets (PNGs/JPGs only — the .html/.svg design sources stay in the source repo)
if [ -d "$SRC/public/blog" ]; then
  rsync -a \
    --include '*/' --include '*.png' --include '*.jpg' --include '*.jpeg' --include '*.webp' --include '*.gif' \
    --exclude '*' \
    "$SRC/public/blog/" "$DEST/public/blog/"
fi

echo "✓ Synced. Posts in site repo:"
ls -1 "$DEST/content/blog" | grep -Ei '\.(md|mdx)$' | grep -v '^_' || echo "  (none yet)"
