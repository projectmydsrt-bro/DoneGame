#!/bin/bash
set -e

# ==============================
# DSRT Full Game Installer (CDN version)
# ==============================
# 1. Clone open-source full games
# 2. Pisahkan asset ke CDN folder
# 3. Ubah path asset di HTML ke https://www.dsrt-artweb.online/
# 4. Siapkan struktur final untuk GitHub Pages + CDN hosting

CDN_URL="https://www.dsrt-artweb.online/game"
BASE_DIR="$(pwd)"
GAME_DIR="$BASE_DIR/game"
TMP_DIR="$BASE_DIR/.temp_games"

mkdir -p "$TMP_DIR" "$GAME_DIR"

# --- helper function to update HTML paths ---
rewrite_paths() {
  local html_file="$1"
  local game_path="$2"
  local cdn_path="${CDN_URL}/${game_path}"
  echo "🌐 Rewriting asset paths in $html_file to $cdn_path ..."
  sed -i "s|src=\"assets/|src=\"${cdn_path}/assets/|g" "$html_file" || true
  sed -i "s|href=\"assets/|href=\"${cdn_path}/assets/|g" "$html_file" || true
  sed -i "s|url(assets/|url(${cdn_path}/assets/|g" "$html_file" || true
}

# --- example game mapping per category ---
declare -A MAP
MAP[arcade]="https://github.com/sourabhv/FlappyBirdClone.git"
MAP[puzzle]="https://github.com/gabrielecirulli/2048.git"
MAP[racing]="https://github.com/CodeExplainedRepo/Car-Racing-Game-JavaScript.git"
MAP[shooter]="https://github.com/dissimulate/SpaceInvaders.git"
MAP[action]="https://github.com/jakesgordon/javascript-tetris.git"
MAP[adventure]="https://github.com/photonstorm/phaser-examples.git"
MAP[platformer]="https://github.com/mneubrand/js-platformer.git"
MAP[simulation]="https://github.com/godotengine/godot-demo-projects.git"
MAP[visualnovel]="https://github.com/ayanamist/renpy-web-demo.git"

# --- clone & process ---
for category in "${!MAP[@]}"; do
  repo_url="${MAP[$category]}"
  repo_name=$(basename -s .git "$repo_url")
  dest_cat="$GAME_DIR/$category"
  mkdir -p "$dest_cat"

  echo "==============================="
  echo "🎮 Category: $category"
  echo "📦 Cloning: $repo_name"
  echo "==============================="

  git clone --depth 1 "$repo_url" "$TMP_DIR/$repo_name" || continue

  src="$TMP_DIR/$repo_name"
  dst="$dest_cat/$repo_name"
  mkdir -p "$dst/assets"

  # detect index.html location
  html_src=$(find "$src" -name "index.html" | head -n 1)
  if [ -z "$html_src" ]; then
    html_src=$(find "$src" -name "*.html" | head -n 1)
  fi

  if [ -f "$html_src" ]; then
    cp "$html_src" "$dst/index.html"
  fi

  # copy assets
  find "$src" -type d \( -name "assets" -o -name "res" -o -name "textures" -o -name "images" -o -name "audio" -o -name "media" \) | while read -r dir; do
    cp -r "$dir"/* "$dst/assets/" 2>/dev/null || true
  done

  # rewrite CDN paths
  if [ -f "$dst/index.html" ]; then
    rewrite_paths "$dst/index.html" "$category/$repo_name"
  fi

  rm -rf "$src"
done

echo "✅ All games prepared with CDN paths!"
echo "Next: run ./upload_to_cdn.sh to push assets."
