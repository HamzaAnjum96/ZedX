#!/usr/bin/env node
// Render preview screenshots of the site into previews/ (not published).
//   node tools/previews.mjs
// Top-of-page views at device scale 2, full pages as JPEG at scale 1.

import { spawn } from 'node:child_process';
import { chromium } from '@playwright/test';

const PORT = 4175;
const BASE = `http://localhost:${PORT}/ZedX/`;
const server = spawn(process.execPath, ['tools/serve.mjs', '--port', String(PORT)], { stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 800));

const VIEWS = [
  { name: 'desktop-1440', width: 1440, height: 900 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'mobile-390', width: 390, height: 844, mobile: true },
];
const PAGES = [['home', ''], ['workstreams', 'workstreams.html'], ['agile-sprints', 'agile-sprints.html'], ['legal', 'legal.html'], ['privacy', 'privacy.html']];

async function loadImages(page) {
  const imgs = page.locator('main img');
  for (let i = 0; i < await imgs.count(); i += 1) {
    const img = imgs.nth(i);
    if (!(await img.isVisible())) continue;
    await img.scrollIntoViewIfNeeded();
    await page.waitForFunction((el) => el.complete && el.naturalWidth > 0, await img.elementHandle());
  }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
}

try {
  const browser = await chromium.launch();
  for (const view of VIEWS) {
    for (const [name, path] of PAGES) {
      if (view.name === 'tablet-768' && name !== 'home') continue;
      for (const scale of view.name === 'tablet-768' ? [1] : [2, 1]) {
        const context = await browser.newContext({ viewport: { width: view.width, height: view.height }, deviceScaleFactor: scale, isMobile: !!view.mobile, hasTouch: !!view.mobile });
        const page = await context.newPage();
        await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle' });
        await loadImages(page);
        if (scale === 2) {
          await page.screenshot({ path: `previews/${view.name}-${name}-top.png` });
        } else {
          await page.screenshot({ path: `previews/${view.name}-${name}-full.jpg`, fullPage: true, type: 'jpeg', quality: 80 });
        }
        await context.close();
      }
    }
  }
  await browser.close();
  console.log('wrote previews/');
} finally {
  server.kill();
}
