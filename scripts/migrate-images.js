/*
 Migrate existing items' avatar to production-friendly format.
 - Detects avatars pointing to http://localhost:3001/uploads/... or /uploads/...
 - Downloads from your local upload server and converts small images to base64 data URLs
 - Updates MockAPI records so images render on both localhost and production

 Usage:
 1) Ensure the local upload server is running (and that it has the images present):
    node server/upload.js
 2) Run this script:
    node scripts/migrate-images.js

 Notes:
 - To avoid 413 on MockAPI, only images <= ~260KB are converted to data URLs.
 - Larger images are skipped with a warning; re-upload them via Admin with the new uploader
   (or resize them) so they are compressed and saved as data URLs or uploaded to a public host.
*/

const API_URL = 'https://68d0487dec1a5ff33826f151.mockapi.io/items';
const LOCAL_UPLOAD_BASE = 'http://localhost:3001';
const MAX_INLINE_BYTES = 260 * 1024; // ~260KB

// Basic delay helper
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

function extractAvatarUrl(avatar) {
  if (!avatar) return null;
  // JSON string -> parse
  if (typeof avatar === 'string') {
    const str = avatar.trim();
    try {
      if ((str.startsWith('{') && str.endsWith('}')) || (str.startsWith('[') && str.endsWith(']'))) {
        const parsed = JSON.parse(str);
        return extractAvatarUrl(parsed);
      }
    } catch (_) {
      // keep as-is
    }
    return str;
  }
  // object shapes
  if (avatar.src) return avatar.src;
  if (avatar.url) return avatar.url;
  if (avatar.fileUrl) return avatar.fileUrl;
  if (avatar.path) return avatar.path;
  if (avatar.imageUrl) return avatar.imageUrl;
  return null;
}

function needsMigration(url) {
  if (!url) return false;
  if (url.startsWith('data:')) return false;
  if (url.startsWith('blob:')) return false; // transient
  if (url.startsWith('http://localhost:3001')) return true;
  if (url.startsWith('/uploads/')) return true;
  return false;
}

function guessMimeFromUrl(url) {
  const u = url.toLowerCase();
  if (u.endsWith('.jpg') || u.endsWith('.jpeg')) return 'image/jpeg';
  if (u.endsWith('.png')) return 'image/png';
  if (u.endsWith('.webp')) return 'image/webp';
  if (u.endsWith('.gif')) return 'image/gif';
  if (u.endsWith('.svg')) return 'image/svg+xml';
  return 'application/octet-stream';
}

function getFilename(url) {
  try {
    const pathname = url.includes('://') ? new URL(url).pathname : url;
    const parts = pathname.split('/');
    return parts[parts.length - 1] || 'image';
  } catch {
    return 'image';
  }
}

async function fetchBuffer(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
  const ab = await res.arrayBuffer();
  return Buffer.from(ab);
}

async function run() {
  console.log('Fetching items from MockAPI...');
  const res = await fetch(API_URL);
  if (!res.ok) {
    throw new Error(`Failed to fetch items: ${res.status} ${res.statusText}`);
  }
  const items = await res.json();
  console.log(`Total items: ${items.length}`);

  let migrated = 0;
  let skipped = 0;
  let unchanged = 0;

  for (const item of items) {
    const current = extractAvatarUrl(item.avatar);
    if (!needsMigration(current)) {
      unchanged++;
      continue;
    }

    // Resolve local URL
    let localUrl = current;
    if (current.startsWith('/uploads/')) {
      localUrl = LOCAL_UPLOAD_BASE + current;
    }

    const filename = getFilename(localUrl);

    try {
      const buf = await fetchBuffer(localUrl);
      if (buf.byteLength > MAX_INLINE_BYTES) {
        console.warn(`Skipping item ${item.id}: ${filename} is too large (${Math.round(buf.byteLength/1024)}KB) for inline storage`);
        skipped++;
        continue;
      }

      const mime = guessMimeFromUrl(localUrl);
      const base64 = buf.toString('base64');
      const dataUrl = `data:${mime};base64,${base64}`;

      const payload = {
        avatar: { src: dataUrl, title: filename },
        updatedAt: new Date().toISOString(),
      };

      const putRes = await fetch(`${API_URL}/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!putRes.ok) {
        throw new Error(`PUT failed: ${putRes.status} ${putRes.statusText}`);
      }

      migrated++;
      console.log(`Migrated item ${item.id}: ${filename} -> inline data URL`);

      // gentle pacing to avoid rate limits
      await sleep(200);
    } catch (e) {
      console.error(`Error migrating item ${item.id} (${filename}):`, e.message);
      skipped++;
    }
  }

  console.log('Done. Summary:');
  console.log(`  Migrated: ${migrated}`);
  console.log(`  Skipped:  ${skipped}`);
  console.log(`  Unchanged:${unchanged}`);
}

// Node 18+ provides global fetch; if not present, try to polyfill via node-fetch dynamically
(async () => {
  if (typeof fetch === 'undefined') {
    try {
      const { default: nodeFetch } = await import('node-fetch');
      global.fetch = nodeFetch;
    } catch (e) {
      console.error('Fetch is not available and node-fetch is not installed. Please use Node 18+ or install node-fetch.');
      process.exit(1);
    }
  }
  try {
    await run();
  } catch (e) {
    console.error('Migration failed:', e);
    process.exit(1);
  }
})();
