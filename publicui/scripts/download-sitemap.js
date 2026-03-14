import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Convert import.meta.url to __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Using the backend URL from your .env
const BACKEND_SITEMAP_URL = 'https://backend.territoryhimalaya.com/sitemap.xml';
const PUBLIC_DIR = path.resolve(__dirname, '../public');
const SITEMAP_PATH = path.join(PUBLIC_DIR, 'sitemap.xml');

async function downloadSitemap() {
  console.log(` Fetching sitemap from backend: ${BACKEND_SITEMAP_URL}`);

  try {
    // 1. Ensure the public directory exists
    try {
      await fs.access(PUBLIC_DIR);
    } catch {
      console.log(`public directory doesn't exist. Creating it...`);
      await fs.mkdir(PUBLIC_DIR, { recursive: true });
    }

    // 2. Fetch the sitemap XML from the backend
    const response = await fetch(BACKEND_SITEMAP_URL);

    if (!response.ok) {
      throw new Error(`Failed to fetch sitemap: ${response.status} ${response.statusText}`);
    }

    const xmlText = await response.text();

    // 3. Save it to the public folder
    await fs.writeFile(SITEMAP_PATH, xmlText, 'utf-8');
    console.log(`successfully saved sitemap to ${SITEMAP_PATH}`);

  } catch (error) {
    console.error('Error downloading sitemap:', error.message);
    process.exit(1);
  }
}

downloadSitemap();
