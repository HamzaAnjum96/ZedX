// F-B1, F-B6: moving around the site, on a phone and without JavaScript.
import { test, expect } from './fixtures';

test('F-B1-H2 the main navigation reaches both app pages and back', async ({ page, isMobile }) => {
  await page.goto('index.html');
  if (isMobile) await page.getByRole('button', { name: 'Menu' }).click();
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Group WorkStreams' }).click();
  await expect(page).toHaveURL(/workstreams\.html$/);

  if (isMobile) await page.getByRole('button', { name: 'Menu' }).click();
  await expect(page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Group WorkStreams' })).toHaveAttribute('aria-current', 'page');
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Agile Sprints' }).click();
  await expect(page).toHaveURL(/agile-sprints\.html$/);

  await page.getByRole('link', { name: /home/ }).first().click();
  await expect(page).toHaveURL(/\/ZedX\/$/);
});

test('F-B6-H1 the phone menu opens, closes with Escape and returns focus', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'The menu button only shows below 900px.');
  await page.goto('index.html');
  const toggle = page.getByRole('button', { name: 'Menu' });
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Group WorkStreams' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toBeFocused();
  await expect(page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Group WorkStreams' })).toBeHidden();
});

test('F-B6-E2 the skip link jumps to the content', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Keyboard flow is checked on desktop.');
  await page.goto('agile-sprints.html');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Skip to content' });
  await expect(skip).toBeFocused();
  await skip.press('Enter');
  await expect(page).toHaveURL(/#main$/);
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('F-B1-E4 content and fallbacks still render', async ({ page }) => {
    await page.goto('index.html');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Kanban for the everyday');
    await expect(page.locator('[data-verdict]')).toContainText('Flow or time-box?');
    await page.goto('workstreams.html');
    await expect(page.getByText('This interactive illustration needs JavaScript.')).toBeVisible();
    await page.goto('agile-sprints.html');
    await expect(page.getByText(/This interactive illustration needs JavaScript\. It shows a sprint board/)).toBeVisible();
  });
});
