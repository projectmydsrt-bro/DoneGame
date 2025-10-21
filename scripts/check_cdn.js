// scripts/check_cdn.js
import fs from "fs";
import https from "https";
import dotenv from "dotenv";

dotenv.config();

const cdn = process.env.CDN_URL;
if (!cdn) {
  console.error("❌ CDN_URL tidak ditemukan di file .env");
  process.exit(1);
}

console.log(`🌐 Mengecek koneksi ke CDN: ${cdn}`);

const testFilePath = "./cdn_test.txt";
const testContent = `CDN connection test - ${new Date().toISOString()}`;

// Buat file dummy
fs.writeFileSync(testFilePath, testContent);
console.log("✅ File dummy dibuat:", testFilePath);

// Tes akses domain CDN
https
  .get(cdn, (res) => {
    console.log(`📡 Status respon dari CDN: ${res.statusCode}`);
    if (res.statusCode === 200) {
      console.log("✅ CDN dapat diakses dengan baik!");
    } else {
      console.warn("⚠️ CDN merespons tapi tidak 200 OK");
    }
  })
  .on("error", (err) => {
    console.error("❌ Gagal menghubungi CDN:", err.message);
  });

// Tambahan: log isi file dummy
console.log("\n🧾 Isi file dummy:");
console.log(fs.readFileSync(testFilePath, "utf8"));
