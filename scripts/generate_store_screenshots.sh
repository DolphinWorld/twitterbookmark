#!/usr/bin/env bash
set -euo pipefail

CHROME_BIN="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
EXT_DIR="$ROOT_DIR/x_bookmark_summarizer"
OUT_DIR="$ROOT_DIR/store/chrome/assets/screenshots"
TMP_DIR="$(mktemp -d)"

mkdir -p "$OUT_DIR"

capture() {
  local profile_dir="$1"
  local output_path="$2"
  local page_url="$3"

  rm -f "$output_path"

  "$CHROME_BIN" \
    --headless=new \
    --disable-gpu \
    --disable-background-networking \
    --disable-component-update \
    --disable-default-apps \
    --disable-sync \
    --hide-scrollbars \
    --metrics-recording-only \
    --no-default-browser-check \
    --no-first-run \
    --window-size=1280,800 \
    --virtual-time-budget=2000 \
    --user-data-dir="$profile_dir" \
    --screenshot="$output_path" \
    "$page_url" >/dev/null 2>&1 &

  local chrome_pid=$!

  for _ in {1..40}; do
    if [[ -f "$output_path" ]]; then
      break
    fi
    sleep 0.5
  done

  kill "$chrome_pid" >/dev/null 2>&1 || true
  wait "$chrome_pid" 2>/dev/null || true

  if [[ ! -f "$output_path" ]]; then
    echo "Failed to generate $output_path" >&2
    exit 1
  fi
}

capture "$TMP_DIR/popup" "$OUT_DIR/screenshot-01-popup.png" "file://$EXT_DIR/popup.html?demo=1"
capture "$TMP_DIR/options" "$OUT_DIR/screenshot-02-settings.png" "file://$EXT_DIR/options.html?demo=1"
capture "$TMP_DIR/summary" "$OUT_DIR/screenshot-03-summary.png" "file://$EXT_DIR/summary.html?demo=1"

cp "$EXT_DIR/icon128.png" "$ROOT_DIR/store/chrome/assets/icon-128.png"

echo "Generated screenshots in $OUT_DIR"
