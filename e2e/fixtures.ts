import { test as base, expect } from '@playwright/test';

export const PAGES = ['index.html', 'workstreams.html', 'agile-sprints.html'];

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

export { expect };
