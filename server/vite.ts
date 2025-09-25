import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

async function downloadLFSFile(lfsContent: string, filePath: string): Promise<boolean> {
  try {
    // Parse LFS pointer
    const oidMatch = lfsContent.match(/oid sha256:([a-f0-9]+)/);
    const sizeMatch = lfsContent.match(/size (\d+)/);
    
    if (!oidMatch || !sizeMatch) {
      return false;
    }

    // Determine which archive this file belongs to based on path
    let archiveName = '';
    if (filePath.includes('/flyers/')) {
      archiveName = 'flyers.tar.gz';
    } else if (filePath.includes('/gallery/')) {
      archiveName = 'gallery-freakfest.tar.gz';
    } else if (filePath.includes('/venue/')) {
      archiveName = 'venue.tar.gz';
    } else {
      return false;
    }

    // Download and extract the archive
    const response = await fetch(`https://github.com/Flufscut/FreakFest2/releases/latest/download/${archiveName}`);
    if (!response.ok) {
      log(`Failed to download ${archiveName}: ${response.status}`, "media");
      return false;
    }

    const tar = await import('tar');
    const buffer = Buffer.from(await response.arrayBuffer());
    
    // Extract to the directory containing the LFS file
    const extractDir = path.dirname(filePath);
    await tar.extract({
      buffer,
      cwd: extractDir,
      gzip: true,
    });

    log(`Extracted ${archiveName} to ${extractDir}`, "media");
    return true;
  } catch (error) {
    log(`Error processing LFS file ${filePath}: ${error}`, "media");
    return false;
  }
}

function isLFSPointer(content: string): boolean {
  return content.startsWith('version https://git-lfs.github.com/spec/v1');
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html",
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(import.meta.dirname, "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  // Custom middleware to handle LFS files
  app.use(async (req, res, next) => {
    const requestPath = req.path;
    
    // Only process asset files that might be LFS pointers
    if (requestPath.startsWith('/assets/') && (requestPath.endsWith('.png') || requestPath.endsWith('.jpg') || requestPath.endsWith('.jpeg') || requestPath.endsWith('.gif') || requestPath.endsWith('.webp'))) {
      const filePath = path.join(distPath, requestPath);
      
      try {
        if (fs.existsSync(filePath)) {
          const content = await fs.promises.readFile(filePath, 'utf-8');
          
          if (isLFSPointer(content)) {
            log(`Detected LFS pointer in ${requestPath}, downloading actual file...`, "media");
            
            const success = await downloadLFSFile(content, filePath);
            if (success) {
              // File should now be replaced, let express.static handle it
              log(`Successfully replaced LFS pointer for ${requestPath}`, "media");
            } else {
              log(`Failed to replace LFS pointer for ${requestPath}`, "media");
              return res.status(404).send('Media file not available');
            }
          }
        }
      } catch (error) {
        log(`Error checking LFS for ${requestPath}: ${error}`, "media");
      }
    }
    
    next();
  });

  app.use(express.static(distPath, {
    setHeaders: (res, filePath) => {
      if (filePath.includes("/assets/")) {
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      } else if (filePath.endsWith("index.html")) {
        res.setHeader("Cache-Control", "no-store");
      }
    }
  }));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}