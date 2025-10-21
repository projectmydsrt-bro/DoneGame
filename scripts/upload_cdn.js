// scripts/upload_cdn.js
import fs from "fs";
import path from "path";
import ftp from "basic-ftp";
import dotenv from "dotenv";

dotenv.config();

const {
  CDN_HOST,
  CDN_USER,
  CDN_PASS,
  CDN_PATH,
  CDN_URL,
  THUMBNAIL_DIR,
  METADATA_DIR,
} = process.env;

const client = new ftp.Client();
client.ftp.verbose = false;

async function uploadDir(localDir, remoteDir) {
  if (!fs.existsSync(localDir)) {
    console.warn(`⚠️ Folder ${localDir} tidak ditemukan.`);
    return;
  }

  const files = fs.readdirSync(localDir);
  console.log(`📁 Mengupload ${files.length} file dari ${localDir} → ${remoteDir}`);

  await client.ensureDir(remoteDir);

  for (const file of files) {
    const localFile = path.join(localDir, file);
    const remoteFile = path.join(remoteDir, file);

    try {
      await client.uploadFrom(localFile, remoteFile);
      console.log(`✅ ${file}`);
    } catch (err) {
      console.error(`❌ Gagal upload ${file}: ${err.message}`);
    }
  }
}

async function uploadAll() {
  try {
    await client.access({
      host: CDN_HOST,
      user: CDN_USER,
      password: CDN_PASS,
      secure: false,
    });

    console.log("🌐 Terhubung ke CDN");

    await uploadDir(THUMBNAIL_DIR, path.join(CDN_PATH, "thumbnails"));
    await uploadDir(METADATA_DIR, path.join(CDN_PATH, "metadata"));

    console.log("🎉 Semua file berhasil diupload!");
    console.log(`🔗 Cek: ${CDN_URL}`);
  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    client.close();
  }
}

uploadAll();
