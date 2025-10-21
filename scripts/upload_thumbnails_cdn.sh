#!/bin/bash
# Upload semua thumbnail ke CDN
# Gunakan variable environment agar aman: CDN_HOST, CDN_USER, CDN_PASS

LOCAL_PATH="./public/thumbnails"
REMOTE_PATH="/game/thumbnails"

lftp -u "$CDN_USER","$CDN_PASS" "$CDN_HOST" <<EOF
mirror -R --only-newer --verbose "$LOCAL_PATH" "$REMOTE_PATH"
bye
EOF

echo "✅ Semua thumbnail berhasil diupload ke CDN!"
