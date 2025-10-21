/**
 * DSRT Homepage Generator
 * -----------------------------------
 * Membaca folder /game/, ambil setiap game, dan buat index.html
 * dengan tampilan grid + preview.
 */

import fs from "fs";
import path from "path";

const config = JSON.parse(fs.readFileSync("./dsrt.config.json", "utf-8"));
const { cdn, repo, categories, title, description } = config;

const GAME_DIR = "./game";
let cards = [];

for (const cat of categories) {
  const catPath = path.join(GAME_DIR, cat);
  if (!fs.existsSync(catPath)) continue;

  const games = fs.readdirSync(catPath, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  for (const game of games) {
    const gameURL = `${repo}/${cat}/${game}/index.html`;
    const thumb = `${cdn}/${cat}/${game}/assets/thumb.jpg`;

    cards.push(`
      <div class="game-card">
        <img src="${thumb}" alt="${game}" onerror="this.src='https://via.placeholder.com/300x180?text=${game}'"/>
        <div class="game-info">
          <h3>${game.replace(/-/g, " ")}</h3>
          <p>${cat.toUpperCase()}</p>
          <a href="${gameURL}" target="_blank" class="play-btn">Play</a>
        </div>
      </div>
    `);
  }
}

const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@3.3.2/dist/tailwind.min.css" rel="stylesheet">
  <style>
    body { background: #0e0e10; color: #fff; font-family: 'Inter', sans-serif; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1.5rem; }
    .game-card { background: #1a1a1e; border-radius: 1rem; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.5); transition: transform 0.2s; }
    .game-card:hover { transform: scale(1.05); }
    .game-card img { width: 100%; height: 160px; object-fit: cover; }
    .game-info { padding: 0.8rem; text-align: center; }
    .play-btn { background: #4f46e5; padding: 0.4rem 1.2rem; border-radius: 0.5rem; display: inline-block; margin-top: 0.4rem; color: #fff; text-decoration: none; }
    .play-btn:hover { background: #4338ca; }
  </style>
</head>
<body>
  <header class="text-center py-8">
    <h1 class="text-4xl font-bold mb-2">${title}</h1>
    <p class="text-gray-400">${description}</p>
  </header>

  <main class="max-w-6xl mx-auto p-6">
    <div class="grid">
      ${cards.join("\n")}
    </div>
  </main>

  <footer class="text-center text-gray-600 py-8 text-sm">
    © 2025 DSRT Artweb. All rights reserved.
  </footer>
</body>
</html>
`;

fs.writeFileSync("./index.html", html);
console.log("✅ Poki-style index.html berhasil dibuat!");
