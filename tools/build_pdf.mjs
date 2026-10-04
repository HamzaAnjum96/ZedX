#!/usr/bin/env node
// Render the print layout to docs/brochure.pdf, the social card to
// docs/assets/img/og-image.png and the touch icon, with headless Chromium.
//
//   npm run pdf        (needs: npm install)

import { spawn } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';

const PORT = 4174;
const BASE = `http://localhost:${PORT}/ZedX/`;

const server = spawn(process.execPath, ['tools/serve.mjs', '--port', String(PORT)], { stdio: 'ignore' });
const stop = () => server.kill();

async function waitForServer() {
  for (let i = 0; i < 50; i += 1) {
    try {
      const res = await fetch(BASE);
      if (res.ok) return;
    } catch { /* not up yet */ }
    await new Promise((r) => setTimeout(r, 100));
  }
  throw new Error('server did not start');
}

try {
  await waitForServer();
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const problems = [];
  page.on('console', (msg) => { if (['error', 'warning'].includes(msg.type())) problems.push(msg.text()); });
  page.on('pageerror', (err) => problems.push(err.message));

  // 1. The brochure
  await page.goto(`${BASE}brochure.html`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => [...document.images].every((img) => img.complete && img.naturalWidth > 0));
  await page.evaluate(() => document.fonts.ready);
  await page.emulateMedia({ media: 'print' });
  await page.pdf({ path: 'docs/brochure.pdf', format: 'A4', printBackground: true, preferCSSPageSize: true, tagged: true, outline: true });
  console.log('wrote docs/brochure.pdf');

  // 2. The social card (1200 x 630)
  await page.emulateMedia({ media: 'screen' });
  await page.setViewportSize({ width: 1200, height: 630 });
  await page.goto(`${BASE}404.html`);
  await page.setContent(await readFile('tools/og-template.html', 'utf8'), { waitUntil: 'networkidle' });
  await page.waitForFunction(() => [...document.images].every((img) => img.complete && img.naturalWidth > 0));
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: 'docs/assets/img/og-image.png' });
  console.log('wrote docs/assets/img/og-image.png');

  // 3. Touch icon (iOS home screen), from the SVG favicon
  await page.setViewportSize({ width: 180, height: 180 });
  await page.setContent(`<body style="margin:0"><img src="${BASE}assets/img/favicon.svg" width="180" height="180" style="display:block"></body>`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'docs/assets/img/apple-touch-icon.png' });
  console.log('wrote docs/assets/img/apple-touch-icon.png');

  await browser.close();
  if (problems.length) {
    console.error('Problems while rendering:\n' + problems.join('\n'));
    process.exitCode = 1;
  }
} finally {
  stop();
}
