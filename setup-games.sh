#!/bin/bash
set -e

echo "🎮 DSRT DoneGame Setup Started"

# --- Step 1: Struktur kategori lengkap ---
mkdir -p game/{action,adventure,arcade,board,card,casual,education,music,puzzle,racing,roleplaying,simulation,sports,strategy,survival,horror,multiplayer,platformer,sandbox,shooter,visualnovel,mmorpg,battle,anime}

# --- Step 2: Clone beberapa sumber game open source ---
git clone --depth 1 https://github.com/photonstorm/phaser-examples.git temp/phaser
git clone --depth 1 https://github.com/mutfakoyun/html5-game-collection.git temp/construct
git clone --depth 1 https://github.com/js13kGames/2024.git temp/js13k

# --- Step 3: Pindahkan game berdasarkan jenis ---
find temp/phaser -name "*.html" -exec cp {} game/arcade/ \;
find temp/construct -name "*.html" -exec cp {} game/casual/ \;
find temp/js13k -name "*.html" -exec cp {} game/puzzle/ \;

# --- Step 4: Hapus folder sementara ---
rm -rf temp

# --- Step 5: Buat file placeholder agar Git mendeteksi semua kategori ---
find game -type d -empty -exec touch {}/.gitkeep \;

# --- Step 6: Commit & push ke GitHub ---
git add .
git commit -m "Initialize DoneGame with open-source playable HTML games"
git push origin main

echo "✅ Semua game berhasil dimasukkan ke dalam kategori!"
echo "🌐 Aktifkan GitHub Pages di Settings > Pages untuk memainkannya online."
