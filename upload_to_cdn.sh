#!/bin/bash
set -e

# ==============================
# DSRT CDN Uploader
# ==============================
# Upload all asset folders from each game/category to your CDN server.
# Replace with your actual connection details.

CDN_HOST="ftp.dsrt-artweb.online"
CDN_USER="your_username"
CDN_PASS="your_password"
REMOTE_PATH="/public_html/game"   # sesuaikan dengan folder CDN kamu
LOCAL_PATH="$(pwd)/game"

echo "🚀 Uploading assets from $LOCAL_PATH to $CDN_HOST ..."

# requires lftp (Linux, Codespaces, macOS)
if ! command -v lftp >/dev/null 2>&1; then
  echo "Installing lftp..."
  sudo apt-get update && sudo apt-get install -y lftp
fi

lftp -u "$CDN_USER","$CDN_PASS" "$CDN_HOST" <<EOF
mirror -R --only-newer --include-glob assets/** "$LOCAL_PATH" "$REMOTE_PATH"
bye
EOF

echo "✅ Upload complete! CDN synced at https://www.dsrt-artweb.online/game/"
