import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import { pipeline } from "node:stream/promises";
import * as tar from "tar";
import { log } from "./vite";

async function dirHasRealFiles(dir: string): Promise<boolean> {
  try {
    const entries = await fsp.readdir(dir);
    if (entries.length === 0) return false;
    
    // Check if any file is a Git LFS pointer
    for (const entry of entries.slice(0, 3)) { // Check first 3 files
      const filePath = path.join(dir, entry);
      try {
        const stats = await fsp.stat(filePath);
        if (stats.isFile() && stats.size < 200) { // LFS pointers are usually < 200 bytes
          const content = await fsp.readFile(filePath, 'utf-8');
          if (content.includes('git-lfs.github.com')) {
            log(`detected LFS pointer in ${dir}, will re-download`, "media");
            return false;
          }
        }
      } catch {}
    }
    
    return true;
  } catch {
    return false;
  }
}

async function downloadAndExtract(url: string, destDir: string, headers?: HeadersInit): Promise<void> {
  await fsp.mkdir(destDir, { recursive: true });
  const res = await fetch(url, {
    headers: headers || {
      'Accept': 'application/octet-stream',
      'User-Agent': 'FreakFest2/1.0'
    },
    redirect: 'follow'
  });
  if (!res.ok || !res.body) throw new Error(`Download failed: ${res.status}`);
  await pipeline(res.body as any, tar.x({ C: destDir }));
}

async function generateManifest(dir: string, type: "gallery" | "flyers"): Promise<void> {
  try {
    const entries = await fsp.readdir(dir);
    const files = entries
      .filter((e) => /\.(jpe?g|png|webp|avif)$/i.test(e))
      .sort();
    
    const manifest = type === "gallery" 
      ? { images: files }
      : { files: files };
    
    await fsp.writeFile(path.join(dir, "manifest.json"), JSON.stringify(manifest, null, 2));
    log(`wrote ${type} manifest.json with ${files.length} files`, "media");
  } catch (e: any) {
    log(`${type} manifest generation skipped: ${e?.message ?? e}`, "media");
  }
}

export async function ensureMediaAssets(): Promise<void> {
  const assetsRoot = path.resolve(import.meta.dirname, "public", "assets");
  const tag = process.env.MEDIA_RELEASE_TAG || "v0.1";
  const githubToken = process.env.GITHUB_TOKEN;
  const repoOwner = "Flufscut";
  const repoName = "FreakFest2";
  
  // Get release info from GitHub API
  let releaseData: any;
  try {
    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'FreakFest2/1.0'
    };
    if (githubToken) {
      headers['Authorization'] = `token ${githubToken}`;
    }
    
    const releaseRes = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/releases/tags/${tag}`, { headers });
    if (!releaseRes.ok) {
      throw new Error(`Failed to fetch release info: ${releaseRes.status}`);
    }
    releaseData = await releaseRes.json();
  } catch (e: any) {
    log(`failed to fetch release info: ${e?.message ?? e}`, "media");
    return;
  }
  
  const targets = [
    { dir: path.join(assetsRoot, "flyers"), file: "flyers.tar.gz" },
    { dir: path.join(assetsRoot, "gallery", "freakfest"), file: "gallery-freakfest.tar.gz" },
    { dir: path.join(assetsRoot, "venue"), file: "venue.tar.gz" },
  ];

  for (const t of targets) {
    const has = await dirHasRealFiles(t.dir);
    if (!has) {
      try {
        const asset = releaseData.assets.find((a: any) => a.name === t.file);
        if (!asset) {
          throw new Error(`Asset ${t.file} not found in release`);
        }
        
        log(`downloading ${t.file}...`, "media");
        
        // Use the API URL for private repo access
        const downloadHeaders: HeadersInit = {
          'Accept': 'application/octet-stream',
          'User-Agent': 'FreakFest2/1.0'
        };
        if (githubToken) {
          downloadHeaders['Authorization'] = `token ${githubToken}`;
        }
        
        await downloadAndExtract(asset.url, t.dir, downloadHeaders);
        log(`extracted ${t.file}`, "media");
      } catch (e: any) {
        log(`failed to fetch ${t.file}: ${e?.message ?? e}`, "media");
      }
    }
  }

  await generateManifest(path.join(assetsRoot, "gallery", "freakfest"), "gallery");
  await generateManifest(path.join(assetsRoot, "flyers"), "flyers");
}
