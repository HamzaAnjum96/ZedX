// The screenshot viewer: an accessible modal that opens the full screen,
// traps focus, closes with Escape or its button and returns focus.
import { test, expect, isNarrow } from './fixtures';

for (const path of ['index.html', 'workstreams.html', 'agile-sprints.html']) {
  test(`${path}: "View full screen" opens the full screenshot in a modal`, async ({ page }) => {
    await page.goto(path);
    const link = page.locator('a[data-viewer]').first();
    const title = await link.getAttribute('data-title');
    await link.scrollIntoViewIfNeeded();
    await link.click();

    const dialog = page.getByRole('dialog', { name: title! });
    await expect(dialog).toBeVisible();
    const close = dialog.getByRole('button', { name: 'Close' });
    await expect(close).toBeFocused();

    const img = dialog.locator('img');
    await expect(img).toHaveAttribute('alt', /.{30,}/);
    await expect.poll(() => img.evaluate((el) => (el as HTMLImageElement).complete && (el as HTMLImageElement).naturalWidth > 0)).toBe(true);
    expect(await img.evaluate((el) => (el as HTMLImageElement).currentSrc)).toMatch(/-full-(1600|2400)\.webp$/);
    await expect(dialog.locator('.viewer-caption')).toContainText('ZedX demo environment');

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(link).toBeFocused();
  });
}

test('the page behind the viewer cannot take focus, and the close button works', async ({ page }) => {
  await page.goto('index.html');
  const link = page.locator('a[data-viewer="as-sprint"]');
  await link.click();
  const dialog = page.locator('dialog[open]');
  await expect(dialog).toBeVisible();
  const reached = new Set<string>();
  for (let i = 0; i < 8; i += 1) {
    await page.keyboard.press('Tab');
    // A modal dialog makes the page inert: focus is in the dialog, or has left for the browser itself.
    const where = await page.evaluate(() => {
      const active = document.activeElement;
      if (!active || active === document.body) return 'browser';
      return active.closest('dialog') ? active.className || active.tagName : 'PAGE';
    });
    expect(where).not.toBe('PAGE');
    reached.add(where);
  }
  expect([...reached].some((name) => name.includes('viewer-btn'))).toBe(true);
  await dialog.getByRole('button', { name: 'Close' }).click();
  await expect(dialog).toBeHidden();
  await expect(link).toBeFocused();
});

test('the zoom button switches between fitting the screen and actual size', async ({ page }) => {
  await page.goto('workstreams.html');
  await page.locator('a[data-viewer="gw-board"]').click();
  const dialog = page.locator('dialog[open]');
  const zoom = dialog.locator('[data-viewer-zoom]');
  // Narrow screens start at actual size, because a fitted full screen is unreadable there.
  const startsActual = (page.viewportSize()?.width ?? 1440) <= 900;
  await expect(zoom).toHaveText(startsActual ? 'Fit to screen' : 'Actual size');
  await zoom.click();
  await expect(zoom).toHaveText(startsActual ? 'Actual size' : 'Fit to screen');
  const width = await dialog.locator('img').evaluate((el) => el.getBoundingClientRect().width);
  if (startsActual) expect(width).toBeLessThanOrEqual(page.viewportSize()!.width);
  else expect(width).toBeGreaterThanOrEqual(1200);
});

test('clicking the screenshot itself opens the viewer', async ({ page }) => {
  await page.goto('index.html');
  await page.locator('.hero .shot-frame').first().click();
  await expect(page.getByRole('dialog', { name: /Catering/ })).toBeVisible();
});

test('the page behind the viewer does not scroll sideways on small screens', async ({ page }) => {
  test.skip(!isNarrow(page), 'Small screens only.');
  await page.goto('agile-sprints.html');
  await page.locator('a[data-viewer="as-sprint"]').click();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});
