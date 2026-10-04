// F-B1, F-B6, F-B7, F-B9: every page loads cleanly, is accessible, fits a
// phone, and every link and asset on it resolves.
import AxeBuilder from '@axe-core/playwright';
import { test, expect, PAGES } from './fixtures';

for (const path of PAGES) {
  test.describe(path, () => {
    test('F-B1-H1 loads with a title, a description and one h1', async ({ page }) => {
      await page.goto(path);
      await expect(page).toHaveTitle(/ZedX Apps/);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.{60,}/);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('html')).toHaveAttribute('lang', 'en-GB');
    });

    test('F-B6-E1 never scrolls sideways', async ({ page }) => {
      await page.goto(path);
      const { scroll, client } = await page.evaluate(() => ({
        scroll: document.documentElement.scrollWidth,
        client: document.documentElement.clientWidth,
      }));
      expect(scroll).toBeLessThanOrEqual(client);
    });

    test('F-B1-E2 has no axe violations (WCAG 2.2 A and AA)', async ({ page }) => {
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze();
      const summary = results.violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`);
      expect(summary).toEqual([]);
    });

    test('F-B1-E3 every local link, anchor and asset resolves', async ({ page, request }) => {
      await page.goto(path);
      const refs = await page.evaluate(() => {
        const urls = new Set<string>();
        document.querySelectorAll('a[href], link[href], script[src], use').forEach((node) => {
          const raw = node.getAttribute('href') || node.getAttribute('src');
          if (raw) urls.add(new URL(raw, document.baseURI).href);
        });
        return [...urls];
      });
      const local = refs.filter((url) => url.startsWith('http://localhost'));
      expect(local.length).toBeGreaterThan(5);

      const pages = new Map<string, string>();
      for (const url of local) {
        const [file, hash] = url.split('#');
        const res = await request.get(file);
        expect(res.status(), file).toBe(200);
        if (hash && !hash.startsWith('i-')) {
          if (!pages.has(file)) pages.set(file, await res.text());
          expect(pages.get(file), `#${hash} on ${file}`).toContain(`id="${hash}"`);
        }
        if (hash?.startsWith('i-')) {
          if (!pages.has(file)) pages.set(file, await res.text());
          expect(pages.get(file), `icon ${hash}`).toContain(`id="${hash}"`);
        }
      }
    });
  });
}

test('F-B7-H1 calls to action point at the official ZedX channels', async ({ page }) => {
  await page.goto('index.html');
  const demo = page.getByRole('link', { name: /^Book a demo/ }).first();
  await expect(demo).toHaveAttribute('href', 'https://www.zedxapps.com/index.html#formContact');
  await expect(page.getByRole('link', { name: /^Log in/, includeHidden: true }).first()).toHaveAttribute('href', 'https://zedx.net/');
  await expect(page.getByRole('link', { name: /Download the brochure/ })).toHaveAttribute('href', 'brochure.pdf');
});

test('F-B8-H1 the PDF brochure is served', async ({ request }) => {
  const res = await request.get('brochure.pdf');
  expect(res.status()).toBe(200);
  expect(res.headers()['content-type']).toContain('application/pdf');
  expect((await res.body()).subarray(0, 4).toString()).toBe('%PDF');
});

test.describe('404', () => {
  // The browser logs the 404 response of the page itself; that one is expected.
  test.use({ allowConsole: [/status of 404/] });

  test('F-B9-H1 an unknown address shows the 404 page with working links', async ({ page }) => {
    const res = await page.goto('no/such/page');
    expect(res?.status()).toBe(404);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(/not on the board/);
    await page.locator('main').getByRole('link', { name: 'Group WorkStreams' }).click();
    await expect(page).toHaveURL(/\/ZedX\/workstreams\.html$/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('flow of work');
  });
});

test.describe('brochure.html (print layout)', () => {
  test('F-B8-E1 has no axe violations and its links resolve', async ({ page, request, isMobile }) => {
    test.skip(isMobile, 'A4 print layout; checked at desktop width.');
    await page.goto('brochure.html');
    await page.waitForFunction(() => document.documentElement.dataset.ready === 'true');
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
    expect(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`)).toEqual([]);
    await expect(page.locator('section.sheet')).toHaveCount(4);
    for (const href of ['brochure.pdf', 'assets/css/brochure.css', 'assets/img/apple-touch-icon.png', 'assets/img/og-image.png']) {
      expect((await request.get(href)).status(), href).toBe(200);
    }
  });
});
