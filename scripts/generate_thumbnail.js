/**
 * DSRT Thumbnail Auto Generator
 * ------------------------------
 * Membuka setiap game (index.html) dan ambil screenshot otomatis.
 */

import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

const config = JSON.parse(fs.readFileSync("./dsrt.config.json", "utf-8"));
const { repo, categories } = config;

const OUTPUT_DIR = "./public/thumbnails";
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

(async () => {
  const browser = await puppeteer.launch({ headless: true, defaultViewport: { width: 1280, height: 720 } });
  const page = await browser.newPage();

  for (const cat of categories) {
    const catPath = path.join("./game", cat);
    if (!fs.existsSync(catPath)) continue;

    const games = fs.readdirSync(catPath, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name);

    for (const game of games) {
      const gameURL = `${repo}/${cat}/${game}/index.html`;
      const outPath = path.join(OUTPUT_DIR, `${cat}-${game}.jpg`);

      console.log(`📸 Membuat thumbnail: ${cat}/${game}`);
      try {
        await page.goto(gameURL, { waitUntil: "networkidle2", timeout: 60000 });
        await page.screenshot({ path: outPath, type: "jpeg", quality: 80 });
      } catch (e) {
        console.log(`⚠️ Gagal screenshot ${gameURL}: ${e.message}`);
      }
    }
  }

  await browser.close();
  console.log("✅ Semua thumbnail berhasil dibuat!");
})();
