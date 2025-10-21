/**
 * DSRT Game Metadata Generator
 * -----------------------------
 * Membuat metadata.json otomatis untuk setiap game di folder /game/
 * Metadata mencakup judul, kategori, deskripsi, developer, rating, dan link.
 */

import fs from "fs";
import path from "path";
import crypto from "crypto";

const config = JSON.parse(fs.readFileSync("./dsrt.config.json", "utf-8"));
const { repo, categories } = config;

function randomRating() {
  return (Math.random() * (4.9 - 3.0) + 3.0).toFixed(1);
}

for (const cat of categories) {
  const catPath = path.join("./game", cat);
  if (!fs.existsSync(catPath)) continue;

  const games = fs.readdirSync(catPath, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  for (const game of games) {
    const metaPath = path.join(catPath, game, "metadata.json");

    const metadata = {
      id: crypto.randomBytes(6).toString("hex"),
      title: game.replace(/[-_]/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
      category: cat,
      developer: "DSRT Studio",
      rating: randomRating(),
      description: `Mainkan ${game.replace(/[-_]/g, " ")} — game ${cat} seru yang bisa kamu mainkan langsung di browser.`,
      play_url: `${repo}/${cat}/${game}/index.html`,
      thumbnail: `${repo}/public/thumbnails/${cat}-${game}.jpg`
    };

    fs.writeFileSync(metaPath, JSON.stringify(metadata, null, 2));
    console.log(`✅ metadata.json dibuat: ${cat}/${game}`);
  }
}

console.log("🎮 Semua metadata berhasil dibuat!");
