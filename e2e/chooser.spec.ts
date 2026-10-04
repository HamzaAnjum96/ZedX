// F-B2: the "Which app fits?" chooser gives a straight answer.
import { test, expect } from './fixtures';

test.beforeEach(async ({ page }) => {
  await page.goto('index.html#choose');
});

const verdict = (page) => page.locator('[data-verdict] h3');

test('F-B2-H1 continuous, request-driven work gets Group WorkStreams', async ({ page }) => {
  await page.getByRole('radio', { name: 'A steady stream of requests' }).check();
  await page.getByRole('radio', { name: 'No, we work continuously' }).check();
  await page.getByRole('radio', { name: 'Not really' }).check();
  await expect(verdict(page)).toHaveText('Group WorkStreams');
  await expect(page.locator('[data-verdict]')).toContainText('Our suggestion');
  await expect(page.locator('[data-verdict]').getByRole('link', { name: 'See Group WorkStreams' })).toHaveAttribute('href', 'workstreams.html');
});

test('F-B2-H2 planned, time-boxed, estimated work gets Agile Sprints', async ({ page }) => {
  await page.getByRole('radio', { name: 'A planned body of work' }).check();
  await page.getByRole('radio', { name: 'Yes, in sprints' }).check();
  await page.getByRole('radio', { name: 'Yes, in story points' }).check();
  await expect(verdict(page)).toHaveText('Agile Sprints');
});

test('F-B2-H3 a mix of both gets both apps', async ({ page }) => {
  await page.getByRole('radio', { name: 'A bit of both' }).check();
  await expect(verdict(page)).toHaveText('Both, side by side');
  await expect(page.locator('[data-verdict]')).toContainText('Based on your answers so far');
});

test('F-B2-E1 conflicting answers suggest both rather than guessing', async ({ page }) => {
  await page.getByRole('radio', { name: 'A steady stream of requests' }).check();
  await page.getByRole('radio', { name: 'Yes, in sprints' }).check();
  await expect(verdict(page)).toHaveText('Both, side by side');
});

test('F-B2-E2 leaders across teams get the Project Portfolios note', async ({ page }) => {
  await page.getByRole('radio', { name: 'Leaders across several teams' }).check();
  await expect(page.locator('[data-verdict]')).toContainText('Project Portfolios');
  await page.getByRole('radio', { name: 'A planned body of work' }).check();
  await expect(page.locator('[data-verdict]')).toContainText('Project Portfolios');
});

test('F-B2-E3 the chooser works from the keyboard alone', async ({ page }) => {
  const first = page.getByRole('radio', { name: 'A steady stream of requests' });
  await first.focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('radio', { name: 'A planned body of work' })).toBeChecked();
  await expect(verdict(page)).toHaveText('Agile Sprints');
});
