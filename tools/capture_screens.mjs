#!/usr/bin/env node
// Capture real screens of Group WorkStreams, Agile Sprints and Project
// Portfolios from the public ZedX demo (https://demo.zedx.net/) and write
// web-ready WebP crops to docs/assets/img/screens/.
//
//   npm run screens                        capture every screen, then encode
//   npm run screens -- --only pp-insights  capture just these screens, then encode all
//   npm run screens -- --encode-only       re-encode the last capture (tools/.screens-src/)
//
// Read-only: it presses the demo's own "Continue" and pre-filled "Login"
// buttons, opens each view and takes a screenshot. It never creates, edits or
// moves anything. Raw PNGs go to tools/.screens-src/ (git-ignored).
//
// Each screen is captured at 1600 x 1000 CSS px (device scale 2). Crops are
// given in those CSS px and always cut one contiguous area of the real screen.
// Every crop is written at 1x and 2x its CSS width: <screen>-<crop>-<width>.webp.

import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { chromium } from '@playwright/test';

const DEMO = 'https://demo.zedx.net/';
const APP = 'https://ztd01.zedx.net/?c=_CollegeDemo01-z';
const SRC = 'tools/.screens-src';
const OUT = 'docs/assets/img/screens';
const VIEW = { width: 1600, height: 1000 };
const SCALE = 2;
const FULL = { x: 0, y: 0, w: 1600, h: 1000, widths: [1600, 2400], quality: 0.8 };

export const SHOTS = [
  {
    name: 'gw-board',
    app: 'Group WorkStreams',
    view: 'Complaints & Compliments Log workstream board (Current Stages)',
    hash: '#/a1/workflow-tasks/emVkeGFwcHNfNTJfemVkeGFwcHM=',
    crops: {
      full: FULL,
      wide: { x: 238, y: 52, w: 1362, h: 508 },
      sm: { x: 238, y: 150, w: 302, h: 186 },
    },
  },
  {
    name: 'gw-board-catering',
    app: 'Group WorkStreams',
    view: 'Catering & Vending Machine Issues workstream board (Current Stages)',
    hash: '#/a1/workflow-tasks/emVkeGFwcHNfNDdfemVkeGFwcHM=',
    crops: {
      full: FULL,
      strip: { x: 238, y: 52, w: 772, h: 274 },
      board: { x: 238, y: 52, w: 893, h: 545 },
      sm: { x: 238, y: 150, w: 302, h: 180 },
    },
  },
  {
    name: 'gw-workstreams',
    app: 'Group WorkStreams',
    view: 'Workstreams list',
    hash: '#/a1/workflows',
    crops: {
      full: FULL,
      list: { x: 240, y: 52, w: 840, h: 452 },
      sm: { x: 240, y: 52, w: 370, h: 452 },
    },
  },
  {
    name: 'gw-insights',
    app: 'Group WorkStreams',
    view: 'Insights: Group Workstreams Dashboard',
    hash: '#/a1/insights',
    wait: 7000,
    crops: {
      full: FULL,
      chart: { x: 236, y: 56, w: 708, h: 562 },
    },
  },
  {
    name: 'as-sprint',
    app: 'Agile Sprints',
    view: 'Current Sprint board (sprint 3, Attendance Capture)',
    hash: '#/a10/workflow-tasks/emVkeGFwcHNfNzVfemVkeGFwcHM=',
    crops: {
      full: FULL,
      strip: { x: 238, y: 52, w: 772, h: 274 },
      wide: { x: 238, y: 52, w: 1362, h: 508 },
      sm: { x: 845, y: 150, w: 288, h: 172 },
    },
  },
  {
    name: 'as-backlog',
    app: 'Agile Sprints',
    view: 'Backlogs board',
    hash: '#/a10/workflow-tasks/emVkeGFwcHNfNzVfemVkeGFwcHM=',
    click: 'Backlog',
    crops: {
      full: FULL,
      board: { x: 238, y: 52, w: 893, h: 378 },
      refine: { x: 540, y: 150, w: 597, h: 280 },
      sm: { x: 845, y: 150, w: 292, h: 280 },
    },
  },
  {
    name: 'as-epics',
    app: 'Agile Sprints',
    view: 'Epics timeline (Gantt)',
    hash: '#/a10/epics/emVkeGFwcHNfNzVfemVkeGFwcHM=',
    click: 'Show Gantt',
    crops: {
      full: FULL,
      timeline: { x: 238, y: 52, w: 1362, h: 388 },
      start: { x: 238, y: 52, w: 662, h: 310 },
    },
  },
  {
    name: 'pp-insights',
    app: 'Project Portfolios',
    view: 'Insights: Project Portfolios Dashboard A',
    hash: '#/a2/insights',
    wait: 7000,
    crops: {
      full: FULL,
      chart: { x: 234, y: 60, w: 562, h: 568 },
    },
  },
];

function argList(flag) {
  const i = process.argv.indexOf(flag);
  return i === -1 ? null : (process.argv[i + 1] || '').split(',').filter(Boolean);
}

async function capture(names) {
  await mkdir(SRC, { recursive: true });
  const browser = await chromium.launch();
  const page = await (await browser.newContext({ viewport: VIEW, deviceScaleFactor: SCALE })).newPage();
  await page.goto(DEMO, { waitUntil: 'networkidle', timeout: 60000 });
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('button', { name: 'Login' }).click({ timeout: 30000 });
  await page.waitForFunction(() => document.body.innerText.includes('All Apps'), null, { timeout: 30000 });
  for (const shot of SHOTS.filter((s) => !names || names.includes(s.name))) {
    await page.goto(`${APP}${shot.hash}`, { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {});
    await page.waitForTimeout(shot.wait || 5000);
    if (shot.click) {
      await page.getByText(shot.click, { exact: true }).first().click();
      await page.waitForTimeout(4500);
    }
    await page.mouse.move(5, VIEW.height - 5);
    await page.screenshot({ path: `${SRC}/${shot.name}.png` });
    console.log(`captured ${shot.name}`);
  }
  await browser.close();
}

async function encode() {
  await mkdir(OUT, { recursive: true });
  for (const file of await readdir(OUT)) {
    if (file.endsWith('.webp')) await rm(`${OUT}/${file}`);
  }
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const manifest = [];
  for (const shot of SHOTS) {
    const png = await readFile(`${SRC}/${shot.name}.png`);
    const src = `data:image/png;base64,${png.toString('base64')}`;
    const crops = {};
    for (const [id, crop] of Object.entries(shot.crops)) {
      const widths = crop.widths || [crop.w, crop.w * 2];
      const files = [];
      for (const width of widths) {
        const outWidth = Math.min(width, crop.w * SCALE);
        const data = await page.evaluate(async ({ src, crop, scale, outWidth, quality }) => {
          const img = new Image();
          img.src = src;
          await img.decode();
          const outHeight = Math.round((crop.h / crop.w) * outWidth);
          const canvas = document.createElement('canvas');
          canvas.width = outWidth;
          canvas.height = outHeight;
          const ctx = canvas.getContext('2d');
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, crop.x * scale, crop.y * scale, crop.w * scale, crop.h * scale, 0, 0, outWidth, outHeight);
          return { url: canvas.toDataURL('image/webp', quality), outHeight };
        }, { src, crop, scale: SCALE, outWidth, quality: crop.quality || 0.86 });
        const file = `${shot.name}-${id}-${outWidth}.webp`;
        const bytes = Buffer.from(data.url.split(',')[1], 'base64');
        await writeFile(`${OUT}/${file}`, bytes);
        files.push({ file, width: outWidth, height: data.outHeight, kb: Math.round(bytes.length / 1024) });
      }
      crops[id] = { area: { x: crop.x, y: crop.y, w: crop.w, h: crop.h }, files };
      console.log(`${shot.name}-${id}: ${files.map((f) => `${f.width}x${f.height} ${f.kb}KB`).join(', ')}`);
    }
    manifest.push({ name: shot.name, app: shot.app, view: shot.view, demo: `${APP}${shot.hash}`, crops });
  }
  await writeFile(`${OUT}/screens.json`, `${JSON.stringify({ source: DEMO, captured: new Date().toISOString().slice(0, 10), view: VIEW, screens: manifest }, null, 2)}\n`);
  await browser.close();
}

if (!process.argv.includes('--encode-only')) await capture(argList('--only'));
for (const shot of SHOTS) {
  if (!existsSync(`${SRC}/${shot.name}.png`)) throw new Error(`no capture of ${shot.name} in ${SRC}: run with --only ${shot.name}`);
}
await encode();
