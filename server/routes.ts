import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import path from "node:path";
import fs from "node:fs/promises";
import sharp from "sharp";

// Simple in-memory cache to avoid re-fetching the sheet too often in dev
type CachedArtists = { fetchedAt: number; data: any[] } | null;
let artistsCache: CachedArtists = null;

function parseCsv(text: string): Record<string, string>[] {
  const rows: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const next = text[i + 1];
    if (c === '"') {
      if (inQuotes && next === '"') { current += '"'; i++; }
      else { inQuotes = !inQuotes; }
    } else if (c === '\n' && !inQuotes) { rows.push(current); current = ""; }
    else { current += c; }
  }
  if (current.length > 0) rows.push(current);
  const splitRow = (row: string) => {
    const cols: string[] = []; let cell = ""; let quoted = false;
    for (let i = 0; i < row.length; i++) {
      const ch = row[i]; const nx = row[i + 1];
      if (ch === '"') { if (quoted && nx === '"') { cell += '"'; i++; } else { quoted = !quoted; } }
      else if (ch === ',' && !quoted) { cols.push(cell); cell = ""; }
      else { cell += ch; }
    }
    cols.push(cell);
    return cols.map((v) => v.trim());
  };
  if (rows.length === 0) return [];
  const header = splitRow(rows[0]).map((h) => h.toLowerCase());
  const out: Record<string, string>[] = [];
  for (let i = 1; i < rows.length; i++) {
    if (!rows[i]) continue;
    const values = splitRow(rows[i]);
    const obj: Record<string, string> = {};
    for (let j = 0; j < header.length; j++) { obj[header[j]] = values[j] ?? ""; }
    out.push(obj);
  }
  return out;
}

function pickFirstKey(obj: Record<string, any>, keys: string[]): string | undefined {
  for (const k of keys) { const key = Object.keys(obj).find((h) => h === k || h.includes(k)); if (key && obj[key]) return String(obj[key]); }
  return undefined;
}

async function fetchArtistsFromSheet(): Promise<any[]> {
  const SHEET_ID = "1olXuQXZWpPCC87JLfS3P94gvZ5YRh2YoOJuSYa1RaYQ";
  const GID = "1711871810";
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID}`;
  const res = await fetch(url, { headers: { "cache-control": "no-cache" } });
  if (!res.ok) throw new Error(`Failed to fetch artists sheet: ${res.status}`);
  const csvText = await res.text();
  const rows = parseCsv(csvText);
  const normalized = rows.map((row) => {
    const name = pickFirstKey(row, ["artist","name","band","act"]);
    let instagram = pickFirstKey(row, ["instagram","ig","instagram handle","instagram_username","instagram user","insta"]);
    if (instagram) { instagram = instagram.replace(/^https?:\/\/www\.instagram\.com\//i, "").replace(/^https?:\/\/instagram\.com\//i, "").replace(/\/$/, "").replace(/^@/, ""); }
    let profileImageUrl: string | undefined = undefined;
    for (const [, v] of Object.entries(row)) {
      if (typeof v === "string" && /(instagram|cdninstagram)\.com\/.+\.(jpg|jpeg|png)/i.test(v)) { profileImageUrl = v; break; }
      if (typeof v === "string" && /\.(jpg|jpeg|png)$/i.test(v) && v.includes("http")) { profileImageUrl = v; break; }
    }
    if (!name) return null;
    return { id: `${name}-${instagram ?? ""}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""), name, instagramHandle: instagram ?? "", instagramUrl: instagram ? `https://instagram.com/${instagram}` : "", profileImageUrl };
  }).filter((a): a is NonNullable<typeof a> => !!a);
  return normalized;
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/artists", async (req: Request, res: Response) => {
    try {
      const now = Date.now();
      const forceRefresh = String((req.query.refresh as string) || "") === "1" || /no-cache/i.test(String(req.headers["cache-control"] || ""));
      if (!forceRefresh && artistsCache && now - artistsCache.fetchedAt < 15 * 60 * 1000) { return res.json({ artists: artistsCache.data, cached: true }); }
      const artists = await fetchArtistsFromSheet();
      artistsCache = { fetchedAt: now, data: artists };
      return res.json({ artists, cached: false });
    } catch (err: any) { return res.status(500).json({ message: err?.message ?? "Failed to load artists" }); }
  });

  app.get("/api/instagram-image", async (req: Request, res: Response) => {
    try {
      const rawUrl = String(req.query.u || ""); if (!rawUrl) { return res.status(400).json({ message: "Missing 'u' query param" }); }
      const targetUrl = decodeURIComponent(rawUrl);
      const upstream = await fetch(targetUrl, { headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36", Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8", Referer: "https://instagram.com/", }, });
      if (!upstream.ok) { return res.status(502).json({ message: `Upstream error: ${upstream.status}` }); }
      const contentType = upstream.headers.get("content-type") || "image/jpeg";
      res.setHeader("Content-Type", contentType);
      res.setHeader("Cache-Control", "public, max-age=86400, s-maxage=86400, immutable");
      const buf = Buffer.from(await upstream.arrayBuffer());
      return res.end(buf);
    } catch (err: any) { return res.status(500).json({ message: err?.message ?? "Failed to proxy image" }); }
  });

  app.get("/api/instagram-avatar", async (req: Request, res: Response) => {
    try {
      const handle = String(req.query.handle || "").replace(/^@/, ""); if (!handle) return res.status(400).json({ message: "Missing 'handle'" });
      const url = `https://unavatar.io/instagram/${encodeURIComponent(handle)}`;
      const upstream = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36", Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8", }, });
      if (!upstream.ok) { return res.status(502).json({ message: `Upstream error: ${upstream.status}` }); }
      const contentType = upstream.headers.get("content-type") || "image/jpeg";
      res.setHeader("Content-Type", contentType);
      res.setHeader("Cache-Control", "public, max-age=86400, s-maxage=86400, immutable");
      const buf = Buffer.from(await upstream.arrayBuffer());
      return res.end(buf);
    } catch (err: any) { return res.status(500).json({ message: err?.message ?? "Failed to fetch avatar" }); }
  });

  // Gallery manifest for both dev and prod
  app.get("/api/gallery-manifest", async (_req: Request, res: Response) => {
    try {
      const devDir = path.resolve(process.cwd(), "client/public/assets/gallery/freakfest");
      const prodDir = path.resolve(process.cwd(), "dist/public/assets/gallery/freakfest");
      let galleryDir = prodDir;
      try { await fs.readdir(galleryDir); } catch { galleryDir = devDir; }
      const entries = await fs.readdir(galleryDir);
      const images = entries.filter((e) => /\.(jpe?g|png|webp|avif)$/i.test(e)).sort();
      return res.json({ images });
    } catch { return res.json({ images: [] }); }
  });

  app.get("/api/gallery-thumb", async (req: Request, res: Response) => {
    try {
      const rawFile = String(req.query.f || ""); if (!rawFile) return res.status(400).json({ message: "Missing 'f' (filename)" });
      if (!/^[A-Za-z0-9._-]+$/.test(rawFile)) { return res.status(400).json({ message: "Invalid filename" }); }
      const width = Math.min(Math.max(parseInt(String(req.query.w || "480"), 10) || 480, 64), 2048);
      const quality = Math.min(Math.max(parseInt(String(req.query.q || "60"), 10) || 60, 30), 95);
      const fmtParam = String(req.query.fmt || "auto").toLowerCase();
      const accept = String(req.headers["accept"] || "");
      const prefersAvif = /image\/(avif|\*)/i.test(accept);
      const prefersWebp = /image\/(webp|\*)/i.test(accept);
      let fmt: "avif" | "webp" | "jpeg" = "webp";
      if (fmtParam === "avif" || (fmtParam === "auto" && prefersAvif)) fmt = "avif"; else if (fmtParam === "jpeg") fmt = "jpeg"; else if (fmtParam === "webp" || (fmtParam === "auto" && prefersWebp)) fmt = "webp";
      const baseDev = path.resolve(process.cwd(), "client/public/assets/gallery/freakfest");
      const baseProd = path.resolve(process.cwd(), "dist/public/assets/gallery/freakfest");
      const BASE_DIR = process.env.NODE_ENV === 'production' ? baseProd : baseDev;
      const fullPath = path.resolve(BASE_DIR, rawFile);
      if (!fullPath.startsWith(BASE_DIR)) { return res.status(400).json({ message: "Invalid path" }); }
      await fs.access(fullPath);
      const square = String(req.query.square || "0") === "1";
      let pipeline = sharp(fullPath);
      if (square) {
        const meta = await pipeline.metadata();
        const side = Math.min(meta.width || width, meta.height || width);
        const left = Math.max(0, Math.floor(((meta.width || side) - side) / 2));
        const top = Math.max(0, Math.floor(((meta.height || side) - side) / 2));
        pipeline = pipeline.extract({ left, top, width: side, height: side }).resize({ width, height: width, fit: "fill" });
      } else {
        pipeline = pipeline.resize({ width, withoutEnlargement: true, fit: "inside" });
      }
      let buffer: Buffer; let contentType = "image/webp";
      if (fmt === "avif") { buffer = await pipeline.avif({ quality, effort: 4 }).toBuffer(); contentType = "image/avif"; }
      else if (fmt === "jpeg") { buffer = await pipeline.jpeg({ quality, mozjpeg: true }).toBuffer(); contentType = "image/jpeg"; }
      else { buffer = await pipeline.webp({ quality }).toBuffer(); contentType = "image/webp"; }
      res.setHeader("Content-Type", contentType);
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      return res.end(buffer);
    } catch (err: any) { return res.status(500).json({ message: err?.message ?? "Failed to generate thumbnail" }); }
  });

  const httpServer = createServer(app);
  return httpServer;
}
