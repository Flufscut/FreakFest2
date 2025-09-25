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
  
  // Determine strip level based on the archive type
  let stripLevel = 1; // Default for most archives
  
  // Gallery archive has nested structure: gallery/freakfest/files
  // We need to strip 2 levels to get files directly in the target directory
  if (url.includes('gallery-freakfest.tar.gz')) {
    stripLevel = 2;
  }
  
  await pipeline(res.body as any, tar.x({ 
    C: destDir,
    strip: stripLevel
  }));
  
  log(`files extracted to ${destDir}`, "media");
}

async function generateGalleryManifest(galleryDir: string): Promise<void> {
  try {
    const entries = await fsp.readdir(galleryDir);
    const images = entries
      .filter((e) => /\.(jpe?g|png|webp|avif)$/i.test(e))
      .filter((e) => !e.startsWith("._")) // Filter out macOS resource fork files
      .sort();
    const manifest = { images };
    await fsp.writeFile(path.join(galleryDir, "manifest.json"), JSON.stringify(manifest, null, 2));
    log(`wrote gallery manifest.json with ${images.length} images`, "media");
  } catch (e: any) {
    log(`gallery manifest generation skipped: ${e?.message ?? e}`, "media");
  }
}

function normalizeFileName(filename: string): string {
  // Remove file extension and convert to lowercase
  const withoutExt = filename.replace(/\.[^.]+$/, '').toLowerCase();
  
  // Normalize date formats and punctuation
  return withoutExt
    // Convert various date formats to consistent format
    .replace(/(\d{1,2})\s*[-:]\s*(\d{1,2})/g, '$1-$2')
    // Remove extra spaces and normalize separators
    .replace(/\s+/g, ' ')
    .replace(/[-_\s]+/g, '-')
    // Remove common prefixes/suffixes that might vary
    .replace(/^(\d+\s*-\s*)?/, '')
    .trim();
}

function deduplicateFiles(files: string[]): string[] {
  const seen = new Map<string, string>();
  
  for (const file of files) {
    const normalized = normalizeFileName(file);
    
    if (!seen.has(normalized)) {
      seen.set(normalized, file);
    } else {
      // If we have a duplicate, prefer the shorter filename (usually cleaner)
      const existing = seen.get(normalized)!;
      if (file.length < existing.length) {
        seen.set(normalized, file);
      }
    }
  }
  
  return Array.from(seen.values()).sort();
}

async function generateFlyersManifest(flyersDir: string): Promise<void> {
  try {
    const entries = await fsp.readdir(flyersDir);
    let files = entries
      .filter((e) => /\.(jpe?g|png|webp|avif)$/i.test(e))
      .filter((e) => !e.startsWith("._")) // Filter out macOS resource fork files
      .sort();
    
    // Strict list of expected flyers in desired order — exactly one of each
    const preferredOrder = [
      '1 - 10-16 - Main Stage.png',
      '2 - 10-17 - Main Stage.png',
      '3 - 10-17 - Club Stage.png',
      '4 - 10-17 - Playhouse Stage.png',
      '5 - 10-18 - Main Stage.png',
      '6 - 10-18 - Club Stage.png',
      '7 - 10-19 - Main Stage.png',
      '8 - Full Festival Flyer.png',
    ];

    // First pass: pick exact matches only (hyphenated dates, no variants)
    let chosen: string[] = preferredOrder.filter((name) => files.includes(name));

    // If some files are missing in the archive, try to map obvious variants
    if (chosen.length < preferredOrder.length) {
      const variants = new Map<string, RegExp>([
        ['1 - 10-16 - Main Stage.png', /^1\s*-\s*10[:\-]16\s*-\s*Main\s*Stage\.png$/i],
        ['2 - 10-17 - Main Stage.png', /^2\s*-\s*10[:\-]17\s*-\s*Main\s*Stage\.png$/i],
        ['3 - 10-17 - Club Stage.png', /^3\s*-\s*10[:\-]17\s*-\s*Club\s*Stage\.png$/i],
        ['4 - 10-17 - Playhouse Stage.png', /^4\s*-\s*10[:\-]17\s*-\s*Playhouse\s*Stage\.png$/i],
        ['5 - 10-18 - Main Stage.png', /^5\s*-\s*10[:\-]18\s*-\s*Main\s*Stage\.png$/i],
        ['6 - 10-18 - Club Stage.png', /^6\s*-\s*10[:\-]18\s*-\s*Club\s*Stage\.png$/i],
        ['7 - 10-19 - Main Stage.png', /^7\s*-\s*10[:\-]19\s*-\s*Main\s*Stage\.png$/i],
        ['8 - Full Festival Flyer.png', /^8\s*-\s*Full\s*Festival\s*Flyer\.png$/i],
      ]);

      const remaining = new Set(preferredOrder.filter((n) => !chosen.includes(n)));
      for (const file of files) {
        for (const key of remaining) {
          const re = variants.get(key)!;
          if (re.test(file)) {
            chosen.push(key);
            remaining.delete(key);
            break;
          }
        }
        if (remaining.size === 0) break;
      }
    }

    // Ensure stable order and no duplicates
    chosen = preferredOrder.filter((n) => new Set(chosen).has(n));

    const manifest = { files: chosen };
    await fsp.writeFile(path.join(flyersDir, "manifest.json"), JSON.stringify(manifest, null, 2));
    log(`wrote flyers manifest.json with ${manifest.files.length} files`, "media");
  } catch (e: any) {
    log(`flyers manifest generation skipped: ${e?.message ?? e}`, "media");
  }
}

export async function ensureMediaAssets(): Promise<void> {
  const assetsRoot = path.resolve(import.meta.dirname, "public", "assets");
  const tag = process.env.MEDIA_RELEASE_TAG || "v1.0.1";
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
