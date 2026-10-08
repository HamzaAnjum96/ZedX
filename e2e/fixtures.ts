import { test as base, expect, type Page } from '@playwright/test';

export const PAGES = ['index.html', 'workstreams.html', 'agile-sprints.html'];
// Text-only pages: no screenshots, same header and footer.
export const DOC_PAGES = ['legal.html', 'privacy.html'];
export const WIP_NOTICE = 'This site is a work in progress. The content is not complete and may not be correct.';
export const DEMO_FORM = 'https://www.zedxapps.com/index.html#formContact';
export const LOGIN = 'https://zedx.net/';
// The public, self-guided ZedX demo. Swiftpro promotes it on zedxapps.com and the login page.
export const DEMO_SITE = 'https://demo.zedx.net/';

// Every test fails on console errors or warnings, uncaught exceptions,
// 5xx responses and failed requests to the local site.
// A test that expects a message (the 404 page logs its own 404) lists it in allowConsole.
export const test = base.extend<{ guard: void; allowConsole: RegExp[] }>({
  allowConsole: [[], { option: true }],
  guard: [async ({ page, allowConsole }, use) => {
    const problems: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() !== 'error' && msg.type() !== 'warning') return;
      if (allowConsole.some((pattern) => pattern.test(msg.text()))) return;
      problems.push(`${msg.type()}: ${msg.text()}`);
    });
    page.on('pageerror', (err) => problems.push(`pageerror: ${err.message}`));
    page.on('response', (res) => {
      if (res.status() >= 500) problems.push(`${res.status()} on ${res.url()}`);
    });
    page.on('requestfailed', (req) => {
      if (req.url().startsWith('http://localhost')) problems.push(`request failed: ${req.url()}`);
    });
    await use();
    expect(problems, 'console errors, page errors or failed requests').toEqual([]);
  }, { auto: true }],
});

// Bring every visible image into view so lazy images load, then return to the top.
// Images in hidden figures (for example the secondary figure dropped on phones) are skipped.
export async function scrollThrough(page: Page) {
  const images = page.locator('main img:not([data-viewer-img])');
  const count = await images.count();
  for (let i = 0; i < count; i += 1) {
    const img = images.nth(i);
    if (!(await img.isVisible())) continue;
    await img.scrollIntoViewIfNeeded();
    await expect.poll(() => img.evaluate((el) => (el as HTMLImageElement).complete && (el as HTMLImageElement).naturalWidth > 0)).toBe(true);
  }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
}

export const isNarrow = (page: Page) => (page.viewportSize()?.width ?? 1440) < 1100;

export { expect };
