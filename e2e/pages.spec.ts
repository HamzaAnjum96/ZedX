// Every page loads cleanly, is accessible, fits the screen, names its
// promotional role, and every link, image and asset on it resolves.
import AxeBuilder from '@axe-core/playwright';
import { test, expect, PAGES, scrollThrough } from './fixtures';

for (const path of PAGES) {
  test.describe(path, () => {
    test('loads with a title, a description, one h1 and British English', async ({ page }) => {
      await page.goto(path);
      await expect(page).toHaveTitle(/Independent ZedX promotional site/);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.{60,}/);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('html')).toHaveAttribute('lang', 'en-GB');
    });

    test('never scrolls sideways', async ({ page }) => {
      await page.goto(path);
      await scrollThrough(page);
      const { scroll, client } = await page.evaluate(() => ({
        scroll: document.documentElement.scrollWidth,
        client: document.documentElement.clientWidth,
      }));
      expect(scroll).toBeLessThanOrEqual(client);
    });

    test('has no axe violations (WCAG 2.2 A and AA)', async ({ page }) => {
      await page.goto(path);
      await scrollThrough(page);
      await page.evaluate(() => document.fonts.ready);
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze();
      const summary = results.violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`);
      expect(summary).toEqual([]);
    });

    test('every local link, anchor, image and asset resolves', async ({ page, request }) => {
      await page.goto(path);
      const refs = await page.evaluate(() => {
        const urls = new Set<string>();
        const add = (raw: string | null) => { if (raw) urls.add(new URL(raw, document.baseURI).href); };
        document.querySelectorAll('a[href], link[href], script[src], use, img[src]').forEach((node) => {
          add(node.getAttribute('href') || node.getAttribute('src'));
        });
        document.querySelectorAll('[srcset]').forEach((node) => {
          node.getAttribute('srcset')!.split(',').forEach((candidate) => add(candidate.trim().split(' ')[0]));
        });
        return [...urls];
      });
      const local = refs.filter((url) => url.startsWith('http://localhost'));
      expect(local.length).toBeGreaterThan(20);

      const bodies = new Map<string, string>();
      for (const url of local) {
        const [file, hash] = url.split('#');
        const res = await request.get(file);
        expect(res.status(), file).toBe(200);
        if (hash) {
          if (!bodies.has(file)) bodies.set(file, await res.text());
          expect(bodies.get(file), `#${hash} in ${file}`).toContain(`id="${hash}"`);
        }
      }
    });

    test('screenshots load, keep their proportions and have alt text', async ({ page }) => {
      await page.goto(path);
      await scrollThrough(page);
      const images = await page.$$eval('main img', (imgs) => imgs.map((img) => {
        const el = img as HTMLImageElement;
        const box = el.getBoundingClientRect();
        return {
          src: el.currentSrc,
          alt: el.alt,
          visible: box.width > 0,
          natural: el.naturalWidth / el.naturalHeight,
          shown: box.width / box.height,
        };
      }));
      expect(images.length).toBeGreaterThan(1);
      for (const img of images.filter((i) => i.visible)) {
        expect(img.src, 'served from the real screen set').toContain('/assets/img/screens/');
        expect(img.alt.length, `alt text for ${img.src}`).toBeGreaterThan(30);
        expect(Math.abs(img.natural - img.shown), `not stretched: ${img.src}`).toBeLessThan(0.02);
      }
    });

    test('says it is an independent promotional site, near the top and in the footer', async ({ page }) => {
      await page.goto(path);
      await expect(page.locator('.brand-note')).toHaveText('Independent promotional site');
      await expect(page.locator('.brand-note')).toBeVisible();
      await expect(page.locator('.site-footer')).toContainText('Swiftpro Corporation Ltd does not run this site');
      await expect(page.locator('.site-footer')).toContainText('products of Swiftpro Corporation Ltd');
    });
  });
}

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  for (const path of PAGES) {
    test(`${path} shows its navigation and links screenshots to the full image`, async ({ page, request }) => {
      await page.goto(path);
      await expect(page.locator('#site-nav')).toBeVisible();
      await expect(page.getByRole('link', { name: 'Agile Sprints' }).first()).toBeVisible();
      const zoom = page.locator('a[data-viewer]').first();
      const href = await zoom.getAttribute('href');
      expect(href).toMatch(/\.webp$/);
      const res = await request.get(new URL(href!, page.url()).href);
      expect(res.status()).toBe(200);
      expect(res.headers()['content-type']).toContain('image/webp');
    });
  }
});
