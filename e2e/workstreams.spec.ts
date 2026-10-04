// F-B3: the Group WorkStreams board illustration.
import { test, expect } from './fixtures';

const column = (page, name) => page.locator('section.column', { has: page.getByRole('heading', { name, exact: true }) });
const card = (page, title) => page.getByRole('article', { name: title });

test.beforeEach(async ({ page }) => {
  await page.goto('workstreams.html#demo');
});

test('F-B3-H1 switches workstreams by mouse and by keyboard', async ({ page }) => {
  const tabs = page.getByRole('tablist', { name: 'Sample workstreams' });
  await expect(tabs.getByRole('tab')).toHaveCount(4);
  await expect(page.getByRole('tab', { name: /Staff onboarding/ })).toHaveAttribute('aria-selected', 'true');

  await page.getByRole('tab', { name: /IT requests/ }).click();
  await expect(page.getByRole('tab', { name: /IT requests/ })).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('heading', { name: 'Triage', exact: true })).toBeVisible();

  await page.keyboard.press('ArrowRight');
  const estates = page.getByRole('tab', { name: /Estates and facilities/ });
  await expect(estates).toHaveAttribute('aria-selected', 'true');
  await expect(estates).toBeFocused();
  await expect(page.getByRole('heading', { name: 'On site', exact: true })).toBeVisible();
});

test('F-B3-H2 moves a card with its buttons and announces the move', async ({ page }) => {
  const title = 'Laptop and accounts for new analyst';
  await expect(column(page, 'Requested').getByRole('article', { name: title })).toBeVisible();
  await page.getByRole('button', { name: `Move “${title}” on to In progress` }).click();
  await expect(column(page, 'In progress').getByRole('article', { name: title })).toBeVisible();
  await expect(column(page, 'In progress').locator('.count')).toContainText('3');
  await expect(page.getByRole('status')).toContainText(`Moved “${title}” to In progress`);
  await expect(page.getByRole('tab', { name: /Staff onboarding/ })).toContainText('7');
});

test('F-B3-H3 moves a card with the arrow keys and keeps focus on it', async ({ page }) => {
  const title = 'Induction timetable';
  await card(page, title).focus();
  await page.keyboard.press('ArrowRight');
  await expect(column(page, 'Waiting on others').getByRole('article', { name: title })).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect(column(page, 'Done').getByRole('article', { name: title })).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect(column(page, 'Done').getByRole('article', { name: title })).toBeVisible();
  await page.keyboard.press('ArrowLeft');
  await expect(column(page, 'Waiting on others').getByRole('article', { name: title })).toBeFocused();
});

test('F-B3-H4 moves a card by dragging it with a mouse', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Touch scrolls the page; touch users move cards with the buttons.');
  const source = card(page, 'Building pass and desk');
  const target = column(page, 'Done');
  await page.locator('[data-ws-demo] .board-wrap').scrollIntoViewIfNeeded();
  const from = await source.boundingBox();
  const to = await target.boundingBox();
  await page.mouse.move(from.x + 40, from.y + 20);
  await page.mouse.down();
  await page.mouse.move(from.x + 80, from.y + 40, { steps: 4 });
  await page.mouse.move(to.x + to.width / 2, to.y + 60, { steps: 12 });
  await page.mouse.up();
  await expect(column(page, 'Done').getByRole('article', { name: 'Building pass and desk' })).toBeVisible();
  await expect(column(page, 'Done').locator('.count')).toContainText('3');
});

test('F-B3-E1 a guest card says so to screen readers', async ({ page }) => {
  await expect(card(page, 'Pre-employment checks')).toContainText('Owner: Tia Vance, recruitment agency (guest)');
});

test('F-B3-E2 moves stay with their workstream when switching tabs', async ({ page }) => {
  const title = 'Building pass and desk';
  await page.getByRole('button', { name: `Move “${title}” on to In progress` }).click();
  await page.getByRole('tab', { name: /IT requests/ }).click();
  await page.getByRole('tab', { name: /Staff onboarding/ }).click();
  await expect(column(page, 'In progress').getByRole('article', { name: title })).toBeVisible();
});

test('F-B3-E3 reset restores the sample data', async ({ page }) => {
  const title = 'Building pass and desk';
  await page.getByRole('button', { name: `Move “${title}” on to In progress` }).click();
  await page.getByRole('button', { name: 'Reset the sample' }).click();
  await expect(column(page, 'Requested').getByRole('article', { name: title })).toBeVisible();
  await expect(page.getByRole('status')).toContainText('reset');
});

test('F-B3-E4 first and last columns cannot move further', async ({ page }) => {
  await expect(page.getByRole('button', { name: '“Laptop and accounts for new analyst” is in the first column' })).toBeDisabled();
  await expect(page.getByRole('button', { name: '“Contract signed” is in the last column' })).toBeDisabled();
});
