#!/usr/bin/env node
// Migration script: find items with avatar.rawFile.path and replace avatar.src with a data URL
// Usage: node scripts/migrate-images.js

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = path.resolve(__dirname, '..');
const API_URL = 'https://68d0487dec1a5ff33826f151.mockapi.io/items';

const mimeMap = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.bmp': 'image/bmp',
  '.tiff': 'image/tiff'
};

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch ${url} failed: ${res.status}`);
  return res.json();
}

async function findFileByName(root, name) {
  // simple recursive search but with pruning
  const entries = await fs.readdir(root, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(root, e.name);
    if (e.isFile() && e.name === name) return p;
    if (e.isDirectory() && e.name !== 'node_modules' && e.name !== '.git') {
      try {
        const found = await findFileByName(p, name);
        if (found) return found;
      } catch (e) {
        // ignore
      }
    }
  }
  return null;
}

async function toDataUrl(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const mime = mimeMap[ext] || 'application/octet-stream';
  const buf = await fs.readFile(filePath);
  const b64 = buf.toString('base64');
  return `data:${mime};base64,${b64}`;
}

async function run() {
  console.log('Fetching items from API...');
  const items = await fetchJson(API_URL);
  const blobItems = items.filter(item => (item?.avatar?.src && String(item.avatar.src).startsWith('blob:')) || (item?.avatar?.rawFile && item.avatar.rawFile.path));
  console.log(`Found ${blobItems.length} items with blob/rawFile references`);

  for (const item of blobItems) {
    const id = item.id;
    console.log('\nProcessing id=' + id + ' title=' + (item.title || ''));
    // try to extract filename from rawFile.path or avatar.src
    let filename = null;
    if (item.avatar?.rawFile?.path) {
      filename = path.basename(String(item.avatar.rawFile.path));
    }
    // if not, try to parse avatar.src last path segment
    if (!filename && item.avatar?.src) {
      try {
        const url = new URL(String(item.avatar.src));
        filename = path.basename(url.pathname) || null;
      } catch (e) {
        // ignore
      }
    }

    if (!filename) {
      console.log('  No filename to search for. Skipping.');
      continue;
    }

    console.log('  Looking for file named:', filename);
    const found = await findFileByName(WORKSPACE_ROOT, filename);
    if (!found) {
      console.log('  File not found in workspace. Skipping.');
      continue;
    }

    console.log('  Found file:', found, ' — copying to public/uploads and updating record...');
    try {
      const uploadsDir = path.join(WORKSPACE_ROOT, 'public', 'uploads');
      await fs.mkdir(uploadsDir, { recursive: true });

      // create a stable filename to avoid collisions: use id + original ext
      const ext = path.extname(found) || path.extname(filename) || '.png';
      const targetName = `item-${id}${ext}`;
      const targetPath = path.join(uploadsDir, targetName);

      // copy file into public/uploads
      await fs.copyFile(found, targetPath);

      // Public path accessible from the frontend
      const publicPath = `/uploads/${targetName}`;

      const smallPayload = { avatar: { src: publicPath, title: filename } };
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(smallPayload)
      });
      if (!res.ok) {
        console.error('  Failed to update item:', res.status, await res.text());
      } else {
        console.log('  Successfully updated item', id, '->', publicPath);
      }
    } catch (e) {
      console.error('  Error processing file:', e.message);
    }
  }

  console.log('\nDone');
}

run().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
