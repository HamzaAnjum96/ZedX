#!/usr/bin/env node
// Serve docs/ the way GitHub Pages will: under /ZedX/, with docs/404.html
// (and a 404 status) for anything missing. No dependencies.
//
//   node tools/serve.mjs            -> http://localhost:4173/ZedX/
//   node tools/serve.mjs --port 8080

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('../docs', import.meta.url)));
const BASE = '/ZedX/';
const portArg = process.argv.indexOf('--port');
const PORT = portArg > -1 ? Number(process.argv[portArg + 1]) : 4173;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain; charset=utf-8',
  '.json': 'application/json',
};

async function fileFor(urlPath) {
  if (!urlPath.startsWith(BASE)) return null;
  let rel = decodeURIComponent(urlPath.slice(BASE.length));
  if (rel === '' || rel.endsWith('/')) rel += 'index.html';
  const full = normalize(join(ROOT, rel));
  if (full !== ROOT && !full.startsWith(ROOT + sep)) return null;
  try {
    const info = await stat(full);
    if (info.isDirectory()) return fileFor(`${urlPath.replace(/\/?$/, '/')}`);
    return full;
  } catch {
    return null;
  }
}

const server = createServer(async (req, res) => {
  const { pathname } = new URL(req.url, 'http://localhost');
  if (pathname === '/') {
    res.writeHead(302, { Location: BASE });
    res.end();
    return;
  }
  const file = await fileFor(pathname);
  const status = file ? 200 : 404;
  const path = file || join(ROOT, '404.html');
  const body = await readFile(path);
  res.writeHead(status, {
    'Content-Type': TYPES[extname(path)] || 'application/octet-stream',
    'Cache-Control': 'no-store',
  });
  res.end(req.method === 'HEAD' ? undefined : body);
});

server.listen(PORT, () => {
  console.log(`Serving docs/ at http://localhost:${PORT}${BASE}`);
});
