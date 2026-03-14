import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';
import express from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 4000;
const DOMAIN = 'https://territoryhimalaya.com';
const DIST_DIR = path.resolve(__dirname, '../dist');
const SITEMAP_PATH = path.join(DIST_DIR, 'sitemap.xml');

// Start a local express server serving the built assets
function startServer() {
  const app = express();

  // Serve static files from dist directory
  app.use(express.static(DIST_DIR));

  // SPA fallback for React Router - ALWAYS return index.html for unknown routes
  app.use((req, res) => {
    res.sendFile(path.join(DIST_DIR, 'index.html'));
  });

  return new Promise((resolve) => {
    const server = app.listen(PORT, () => resolve(server));
  });
}

async function runPrerender() {
  console.log('Starting Pre-rendering process for SEO...');

  // 1. Start dev server
  const server = await startServer();
  console.log(`Local server running at http://localhost:${PORT}`);

  try {
    // 2. Read Sitemap to find which URLs we need to pre-render
    let sitemapContent;
    try {
      sitemapContent = await fs.readFile(SITEMAP_PATH, 'utf-8');
    } catch (err) {
      throw new Error(`Could not find sitemap at ${SITEMAP_PATH}. Make sure to build first!`);
    }

    const urlsToRender = [];
    const regex = /<loc>([^<]+)<\/loc>/g;
    let match;
    while ((match = regex.exec(sitemapContent)) !== null) {
      let loc = match[1];
      // Only pre-render paths that belong to our domain
      if (loc.startsWith(DOMAIN)) {
        urlsToRender.push(loc.replace(DOMAIN, ''));
      } else if (loc.startsWith('/')) {
        urlsToRender.push(loc);
      }
    }

    // Default routes to render if sitemap had none
    if (urlsToRender.length === 0) {
      urlsToRender.push('/');
    }

    // De-duplicate URLs
    const uniquePaths = [...new Set(urlsToRender)];
    console.log(`Found ${uniquePaths.length} unique pages to pre-render.`);

    // 3. Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    for (const route of uniquePaths) {
      const page = await browser.newPage();

      // We don't need Google Analytics or heavy 3rd party scripts during prerender
      await page.setRequestInterception(true);
      page.on('request', req => {
        if (['image', 'media', 'font'].includes(req.resourceType()) || req.url().includes('googletagmanager')) {
          req.abort();
        } else {
          req.continue();
        }
      });

      const url = `http://localhost:${PORT}${route}`;
      console.log(`Pre-rendering: ${route}`);

      await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

      // Wait maximum 10 seconds for the loading spinner to disappear
      try {
        await page.waitForFunction(
          () => !document.querySelector('.animate-spin'),
          { timeout: 10000 }
        );
      } catch (e) {
        console.warn(`Warning: Loading spinner didn't disappear on ${route} after 10s.`);
      }

      // Extract fully rendered HTML
      const html = await page.content();

      // Clean up injected scripts from puppeteer if any
      const finalHtml = html.replace(/<script[^>]*>window\.localStorage[^<]*<\/script>/gi, '');

      // Create directories if they don't exist
      const filePath = route === '/'
        ? path.join(DIST_DIR, 'index.html')
        : path.join(DIST_DIR, route.endsWith('/') ? route : `${route}`, 'index.html');

      const dirPath = path.dirname(filePath);
      await fs.mkdir(dirPath, { recursive: true });

      // Save static HTML!
      await fs.writeFile(filePath, finalHtml);
      console.log(`Saved: ${filePath}`);

      await page.close();
    }

    await browser.close();
    console.log(' Pre-rendering complete!');

  } catch (error) {
    console.error('Error during pre-rendering:', error);
  } finally {
    server.close();
  }
}

runPrerender();
