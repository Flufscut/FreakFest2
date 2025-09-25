import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import { pipeline } from "node:stream/promises";
import * as tar from "tar";
import { log } from "./vite";

async function dirHasFiles(dir: string): Promise<boolean> {
  try {
    const entries = await fsp.readdir(dir);
    return entries.length > 0;
  } catch {
    return false;
  }
}

async function clearDirectory(dir: string): Promise<void> {
  try {
    await fsp.rm(dir, { recursive: true, force: true });
    log(`cleared directory ${dir}`, "media");
  } catch (e: any) {
    log(`failed to clear directory ${dir}: ${e?.message ?? e}`, "media");
  }
}

async function downloadAndExtract(url: string, destDir: string): Promise<void> {
  await fsp.mkdir(destDir, { recursive: true });
  const res = await fetch(url);
  if (!res.ok || !res.body) throw new Error(`Download failed: ${res.status}`);
  await pipeline(res.body as any, tar.x({ C: destDir }));
}

async function generateGalleryManifest(galleryDir: string): Promise<void> {
  try {
    const entries = await fsp.readdir(galleryDir);
    const images = entries
      .filter((e) => /\.(jpe?g|png|webp|avif)$/i.test(e))
      .sort();
    const manifest = { images };
    await fsp.writeFile(path.join(galleryDir, "manifest.json"), JSON.stringify(manifest, null, 2));
    log(`wrote gallery manifest.json with ${images.length} images`, "media");
  } catch (e: any) {
    log(`gallery manifest generation skipped: ${e?.message ?? e}`, "media");
  }
}

async function generateFlyersManifest(flyersDir: string): Promise<void> {
  try {
    const entries = await fsp.readdir(flyersDir);
    const files = entries
      .filter((e) => /\.(jpe?g|png|webp|avif)$/i.test(e))
      .sort();
    const manifest = { files };
    await fsp.writeFile(path.join(flyersDir, "manifest.json"), JSON.stringify(manifest, null, 2));
    log(`wrote flyers manifest.json with ${files.length} files`, "media");
  } catch (e: any) {
    log(`flyers manifest generation skipped: ${e?.message ?? e}`, "media");
  }
}

export async function ensureMediaAssets(): Promise<void> {
  const assetsRoot = path.resolve(import.meta.dirname, "public", "assets");
  const tag = process.env.MEDIA_RELEASE_TAG || "v1.0.0";
  const base = `https://github.com/Flufscut/FreakFest2/releases/download/${encodeURIComponent(tag)}`;
  const targets = [
    { dir: path.join(assetsRoot, "flyers"), file: "flyers.tar.gz" },
    { dir: path.join(assetsRoot, "gallery", "freakfest"), file: "gallery-freakfest.tar.gz" },
    { dir: path.join(assetsRoot, "venue"), file: "venue.tar.gz" },
  ];

  for (const t of targets) {
    try {
      log(`ensuring media for ${t.file}...`, "media");
      
      // Always clear and re-extract to ensure we get real files, not LFS pointers
      await clearDirectory(t.dir);
      
      log(`downloading ${t.file}...`, "media");
      await downloadAndExtract(`${base}/${t.file}`, t.dir);
      log(`extracted ${t.file}`, "media");
    } catch (e: any) {
      log(`failed to fetch ${t.file}: ${e?.message ?? e}`, "media");
    }
  }

  await generateGalleryManifest(path.join(assetsRoot, "gallery", "freakfest"));
  await generateFlyersManifest(path.join(assetsRoot, "flyers"));
}
