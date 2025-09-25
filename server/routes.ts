import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import path from "node:path";
import fs from "node:fs/promises";
import sharp from "sharp";
import { log } from "./vite";

const fsp = fs;

// Simple in-memory cache to avoid re-fetching the sheet too often in dev
type CachedArtists = { fetchedAt: number; data: any[] } | null;
let artistsCache: CachedArtists = null;

function parseCsv(text: string): Record<string, string>[] {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];
  
  const headers = lines[0].split(',').map(h => h.trim());
  const rows = lines.slice(1);
  
  return rows.map(row => {
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < row.length; i++) {
      const char = row[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    values.push(current.trim());
    
    const record: Record<string, string> = {};
    headers.forEach((header, index) => {
      record[header] = values[index] || '';
    });
    
    return record;
  });
}

function cleanArtistName(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special characters
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim()
    .toLowerCase();
}

function getInstagramHandle(name: string): string {
  return cleanArtistName(name)
    .replace(/\s+/g, '') // Remove all spaces for handle
    .slice(0, 30); // Instagram handle max length
}

function getUnavatarUrl(name: string): string {
  const handle = getInstagramHandle(name);
  return `https://unavatar.io/instagram/${handle}`;
}

async function fetchArtists(): Promise<any[]> {
  const now = Date.now();
  const cacheExpiry = 5 * 60 * 1000; // 5 minutes
  
  if (artistsCache && (now - artistsCache.fetchedAt) < cacheExpiry) {
    return artistsCache.data;
  }
  
  try {
    const sheetId = '1BVmOJzZl-wQGVEO9OwJAhX4_gXiWmVfHIZKZZPuWQkE';
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=0`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }
    
    const csvText = await response.text();
    const records = parseCsv(csvText);
    
    const artists = records.map(record => ({
      name: record['Artist Name'] || '',
      day: record['Day'] || '',
      stage: record['Stage'] || '',
      time: record['Time'] || '',
      instagram: record['Instagram'] || getInstagramHandle(record['Artist Name'] || ''),
      avatar: getUnavatarUrl(record['Artist Name'] || '')
    })).filter(artist => artist.name); // Filter out empty names
    
    artistsCache = { fetchedAt: now, data: artists };
    return artists;
  } catch (error) {
    console.error('Failed to fetch artists:', error);
    return [];
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Resolve assets root depending on environment
  const assetsRoot = path.resolve(
    import.meta.dirname,
    app.get("env") === "development" ? "../client/public" : "public",
  );
  // API Routes
  app.get("/api/artists", async (_req, res) => {
    try {
      const artists = await fetchArtists();
      res.json(artists);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch artists" });
    }
  });

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.post("/api/subscribe", async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email || typeof email !== 'string') {
        return res.status(400).json({ message: "Email is required" });
      }
      
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }
      
      // Store in database
      const result = await storage.insertSubscriber(email);
      
      if (result.success) {
        res.json({ message: "Successfully subscribed!" });
      } else {
        if (result.error?.includes('duplicate') || result.error?.includes('UNIQUE')) {
          res.status(409).json({ message: "Email already subscribed" });
        } else {
          res.status(500).json({ message: "Failed to subscribe" });
        }
      }
    } catch (error) {
      console.error('Subscription error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Gallery manifest endpoint
  app.get('/api/gallery-manifest', async (_req, res) => {
    try {
      const manifestPath = path.resolve(assetsRoot, 'assets', 'gallery', 'freakfest', 'manifest.json');
      
      // Check if manifest exists
      try {
        await fsp.access(manifestPath);
        const manifestData = await fsp.readFile(manifestPath, 'utf-8');
        const manifest = JSON.parse(manifestData);
        res.json(manifest);
      } catch {
        // If no manifest, scan directory for images
        const galleryDir = path.resolve(assetsRoot, 'assets', 'gallery', 'freakfest');
        
        try {
          const files = await fsp.readdir(galleryDir);
          const images = files
            .filter(file => /\.(jpg|jpeg|png|webp|avif)$/i.test(file))
            .filter(file => !file.startsWith('._'))
            .sort();
          
          res.json({ images });
        } catch {
          res.json({ images: [] });
        }
      }
    } catch (error) {
      console.error('Gallery manifest error:', error);
      res.status(500).json({ message: 'Failed to load gallery manifest' });
    }
  });

  // Gallery thumbnail endpoint
  app.get('/api/gallery-thumb', async (req: Request, res: Response) => {
    try {
      const { f: filename, w = '400', q = '85', square = '0', fmt = 'jpeg' } = req.query;
      
      // Validate filename
      if (!filename || typeof filename !== 'string' || !/^[a-zA-Z0-9._-]+\.(jpg|jpeg|png|webp)$/i.test(filename)) {
        return res.status(400).json({ message: 'Invalid filename' });
      }
      
      // Validate parameters
      const width = parseInt(w as string, 10);
      const quality = parseInt(q as string, 10);
      const isSquare = square === '1';
      
      if (isNaN(width) || width < 50 || width > 2000) {
        return res.status(400).json({ message: 'Invalid width parameter' });
      }
      
      if (isNaN(quality) || quality < 10 || quality > 100) {
        return res.status(400).json({ message: 'Invalid quality parameter' });
      }
      
      // Construct file path
      const imagePath = path.resolve(assetsRoot, 'assets', 'gallery', 'freakfest', filename);
      
      // Check if file exists
      try {
        await fsp.access(imagePath);
      } catch {
        return res.status(404).json({ message: 'Image not found' });
      }
      
      // Generate thumbnail
      let sharpInstance = sharp(imagePath);
      
      if (isSquare) {
        sharpInstance = sharpInstance.resize(width, width, {
          fit: 'cover',
          position: 'center'
        });
      } else {
        sharpInstance = sharpInstance.resize(width, undefined, {
          fit: 'inside',
          withoutEnlargement: true
        });
      }
      
      const outputFormat = fmt === 'auto' ? 'jpeg' : (fmt as string);
      let buffer: Buffer;
      let contentType: string;
      
      switch (outputFormat) {
        case 'webp':
          buffer = await sharpInstance.webp({ quality }).toBuffer();
          contentType = 'image/webp';
          break;
        case 'png':
          buffer = await sharpInstance.png({ quality: Math.round(quality / 10) }).toBuffer();
          contentType = 'image/png';
          break;
        case 'jpeg':
        default:
          buffer = await sharpInstance.jpeg({ quality }).toBuffer();
          contentType = 'image/jpeg';
          break;
      }
      
      // Set appropriate headers
      res.set({
        'Content-Type': contentType,
        'Content-Length': buffer.length,
        'Cache-Control': 'public, max-age=86400' // 24 hours
      });
      
      res.send(buffer);
    } catch (err: any) {
      return res.status(500).json({ message: err?.message ?? "Failed to generate thumbnail" });
    }
  });

  // Gallery image serving with thumbnail generation (legacy endpoint - keeping for compatibility)
  app.get('/api/gallery/:filename', async (req: Request, res: Response) => {
    try {
      const { filename } = req.params;
      const { size = '400' } = req.query;
      
      // Validate filename
      if (!filename || !/^[a-zA-Z0-9._-]+\.(jpg|jpeg|png|webp)$/i.test(filename)) {
        return res.status(400).json({ message: 'Invalid filename' });
      }
      
      // Validate size
      const sizeNum = parseInt(size as string, 10);
      if (isNaN(sizeNum) || sizeNum < 50 || sizeNum > 2000) {
        return res.status(400).json({ message: 'Invalid size parameter' });
      }
      
      // Construct file path
      const imagePath = path.resolve(assetsRoot, 'assets', 'gallery', 'freakfest', filename);
      
      // Check if file exists
      try {
        await fsp.access(imagePath);
      } catch {
        return res.status(404).json({ message: 'Image not found' });
      }
      
      // Generate thumbnail
      const thumbnail = await sharp(imagePath)
        .resize(sizeNum, sizeNum, {
          fit: 'cover',
          position: 'center'
        })
        .jpeg({ quality: 85 })
        .toBuffer();
      
      // Set appropriate headers
      res.set({
        'Content-Type': 'image/jpeg',
        'Content-Length': thumbnail.length,
        'Cache-Control': 'public, max-age=86400' // 24 hours
      });
      
      res.send(thumbnail);
    } catch (err: any) {
      return res.status(500).json({ message: err?.message ?? "Failed to generate thumbnail" });
    }
  });

  // Image proxy route to handle missing flyer images
  app.get('/assets/flyers/:filename', async (req, res) => {
    const filename = req.params.filename;
    const filePath = path.resolve(assetsRoot, "assets", "flyers", filename);
    
    try {
      // Check if file exists and is accessible
      await fsp.access(filePath);
      res.sendFile(filePath);
    } catch (error) {
      log(`Failed to serve flyer ${filename}: ${error}`, "media");
      
      // Serve a placeholder image or redirect to a fallback
      // For now, return a 1x1 transparent PNG as placeholder
      const placeholder = Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAI9jU77yQAAAABJRU5ErkJggg==',
        'base64'
      );
      
      res.set({
        'Content-Type': 'image/png',
        'Content-Length': placeholder.length,
        'Cache-Control': 'no-cache'
      });
      
      res.send(placeholder);
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}