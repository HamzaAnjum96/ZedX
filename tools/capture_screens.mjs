#!/usr/bin/env node
// Capture real screens of Group Workstreams and Agile Sprints from the public
// ZedX demo (https://demo.zedx.net/) and write web-ready WebP images to
// docs/assets/img/screens/.
//
//   npm run screens                 capture + encode
//   npm run screens -- --encode-only   re-encode the last capture (tools/.screens-src/)
//
// Read-only: it presses the demo's own "Continue" and pre-filled "Login"
// buttons, opens each view and takes a screenshot. It never creates, edits or
// moves anything. Raw PNGs go to tools/.screens-src/ (git-ignored).

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { chromium } from '@playwright/test';

const DEMO = 'https://demo.zedx.net/';
const APP = 'https://ztd01.zedx.net/?c=_CollegeDemo01-z';
const SRC = 'tools/.screens-src';
const OUT = 'docs/assets/img/screens';
const VIEW = { width: 1600, height: 1000 };
const SCALE = 2;
const WIDTHS = [1200, 2000];
const QUALITY = 0.82;

// crop: x, y, w, h in CSS pixels of the 1600 x 1000 view (omit for the full view)
export const SHOTS = [
  { name: 'gw-board', hash: '#/a1/workflow-tasks/emVkeGFwcHNfNTJfemVkeGFwcHM=', alt: 'Group Workstreams board for the Complaints & Compliments Log workstream, with stages Outstanding, In Progress, Escalated, Response Issued and Closed' },
  { name: 'gw-board-catering', hash: '#/a1/workflow-tasks/emVkeGFwcHNfNDdfemVkeGFwcHM=', alt: 'Group Workstreams board for Catering & Vending Machine Issues, with its own stages: New Issue, In Progress and Completed' },
  { name: 'gw-workstreams', hash: '#/a1/workflows', alt: 'Group Workstreams list showing each workstream with its portfolio, active tasks, type and owners' },
  { name: 'gw-portfolios', hash: '#/a1/cwf-portfolios', crop: { x: 0, y: 0, w: 1600, h: 820 }, alt: 'Group Workstreams portfolios by function, such as HR, Accounts & Finance and Campus Operations, with workstream and task counts' },
  { name: 'gw-insights', hash: '#/a1/insights', wait: 7000, crop: { x: 0, y: 0, w: 960, h: 640 }, alt: 'Group Workstreams dashboard charting work items per workstream, split into critical and non-critical' },
  { name: 'as-sprint', hash: '#/a10/workflow-tasks/emVkeGFwcHNfNzVfemVkeGFwcHM=', alt: 'Agile Sprints current sprint board with stories in On Hold, Not Started, In Progress and Completed columns, each with epic, priority and story points' },
  { name: 'as-backlog', hash: '#/a10/workflow-tasks/emVkeGFwcHNfNzVfemVkeGFwcHM=', click: 'Backlog', alt: 'Agile Sprints backlog with stories moving from Ideas & Intake through Refinement Needed to Ready for Sprint' },
  { name: 'as-epics', hash: '#/a10/epics/emVkeGFwcHNfNzVfemVkeGFwcHM=', click: 'Show Gantt', crop: { x: 0, y: 0, w: 1600, h: 600 }, alt: 'Agile Sprints epics timeline laying out epics week by week from January to March' },
];

async function capture() {
  await mkdir(SRC, { recursive: true });
  const browser = await chromium.launch();
  const page = await (await browser.newContext({ viewport: VIEW, deviceScaleFactor: SCALE })).newPage();
  await page.goto(DEMO, { waitUntil: 'networkidle', timeout: 60000 });
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('button', { name: 'Login' }).click({ timeout: 30000 });
  await page.waitForFunction(() => document.body.innerText.includes('All Apps'), null, { timeout: 30000 });
  for (const shot of SHOTS) {
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
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const manifest = [];
  for (const shot of SHOTS) {
    const png = await readFile(`${SRC}/${shot.name}.png`);
    const crop = shot.crop || { x: 0, y: 0, w: VIEW.width, h: VIEW.height };
    const sizes = [];
    for (const width of WIDTHS) {
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
      }, { src: `data:image/png;base64,${png.toString('base64')}`, crop, scale: SCALE, outWidth, quality: QUALITY });
      const file = `${shot.name}-${outWidth}.webp`;
      await writeFile(`${OUT}/${file}`, Buffer.from(data.url.split(',')[1], 'base64'));
      sizes.push({ file, width: outWidth, height: data.outHeight });
    }
    manifest.push({ name: shot.name, alt: shot.alt, sizes });
    console.log(`encoded ${shot.name}: ${sizes.map((s) => `${s.file} (${s.width}x${s.height})`).join(', ')}`);
  }
  await writeFile(`${OUT}/screens.json`, `${JSON.stringify({ source: DEMO, captured: new Date().toISOString().slice(0, 10), screens: manifest }, null, 2)}\n`);
  await browser.close();
}

if (!process.argv.includes('--encode-only')) await capture();
if (!existsSync(`${SRC}/${SHOTS[0].name}.png`)) throw new Error(`no captures in ${SRC}: run without --encode-only`);
await encode();
