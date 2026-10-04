// F-B4, F-B5: the runnable sample sprint and the charts.
import { test, expect } from './fixtures';

const column = (page, name) => page.locator('section.column', { has: page.getByRole('heading', { name, exact: true }) });
const demo = (page) => page.locator('[data-sprint-demo]');
const standup = (page) => page.locator('[data-standup]');

test.beforeEach(async ({ page }) => {
  await page.goto('agile-sprints.html#demo');
});

test('F-B4-H1 opens on day 6 with 21 of 31 points left', async ({ page }) => {
  await expect(demo(page).getByText('Day 6 of 10')).toBeVisible();
  await expect(demo(page)).toContainText('31 of 34 points planned');
  await expect(demo(page)).toContainText('10 of 31 points done');
  await expect(page.locator('[data-burndown] .value-label')).toHaveText('21 left');
  await expect(standup(page)).toContainText('Nothing finished since the last stand-up yet.');
  await expect(standup(page)).toContainText('Blocked: Host notified when a visitor arrives.');
});

test('F-B4-H2 finishing a story updates progress, burndown and stand-up', async ({ page }) => {
  await page.getByRole('button', { name: 'Move “Reception check-in screen” on to Done' }).click();
  await expect(column(page, 'Done').getByRole('article', { name: 'Reception check-in screen' })).toBeVisible();
  await expect(demo(page)).toContainText('18 of 31 points done');
  await expect(page.locator('[data-burndown] .value-label')).toHaveText('13 left');
  await expect(standup(page)).toContainText('Done since the last stand-up: Reception check-in screen (8).');
});

test('F-B4-H3 blocking a story is reflected on the card and in the stand-up', async ({ page }) => {
  const block = page.getByRole('button', { name: 'Blocked: Badge printing' });
  await expect(block).toHaveAttribute('aria-pressed', 'false');
  await block.click();
  await expect(page.getByRole('button', { name: 'Blocked: Badge printing' })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('button', { name: 'Blocked: Badge printing' })).toBeFocused();
  await expect(standup(page)).toContainText('Blocked: Badge printing, Host notified when a visitor arrives.');
});

test('F-B4-H4 ending each day runs the sprint to a summary with carried-over work', async ({ page }) => {
  await page.getByRole('button', { name: 'Move “Badge printing” on to In review' }).click();
  for (const day of [6, 7, 8, 9]) {
    await page.getByRole('button', { name: `End day ${day}` }).click();
    await expect(demo(page).getByText(`Day ${day + 1} of 10`)).toBeVisible();
  }
  await page.getByRole('button', { name: 'End the sprint' }).click();
  await expect(demo(page).getByText('Sprint finished')).toBeVisible();
  await expect(standup(page)).toContainText('Completed 10 of 31 points (3 stories).');
  await expect(standup(page)).toContainText('Carried over:');
  await expect(standup(page)).toContainText('(21 points)');
  await expect(page.getByRole('button', { name: 'Blocked: Badge printing' })).toBeDisabled();

  await page.getByRole('button', { name: 'Run the sprint again' }).click();
  await expect(demo(page).getByText('Day 6 of 10')).toBeVisible();
  await expect(demo(page)).toContainText('10 of 31 points done');
});

test('F-B4-E1 a blocked story that reaches Done is no longer blocked', async ({ page }) => {
  const title = 'Host notified when a visitor arrives';
  await page.getByRole('button', { name: `Move “${title}” on to In review` }).click();
  await page.getByRole('button', { name: `Move “${title}” on to Done` }).click();
  await expect(column(page, 'Done').getByRole('article', { name: title })).not.toContainText('Blocked');
  await expect(standup(page)).toContainText('Nothing is blocked.');
});

test('F-B4-E2 moving a story back is reported in the stand-up', async ({ page }) => {
  await page.getByRole('button', { name: 'Move “Reception check-in screen” back to In progress' }).click();
  await expect(standup(page)).toContainText('Moved back: Reception check-in screen.');
});

test('F-B4-E3 reset restores day 6', async ({ page }) => {
  await page.getByRole('button', { name: 'End day 6' }).click();
  await page.getByRole('button', { name: 'Reset the sprint' }).click();
  await expect(demo(page).getByText('Day 6 of 10')).toBeVisible();
});

test('F-B5-H1 the burndown can be read with the keyboard', async ({ page }) => {
  const chart = page.getByRole('group', { name: /Sprint 7 burndown/ });
  await chart.focus();
  const tip = page.locator('[data-burndown] .tooltip');
  await expect(tip).toBeVisible();
  await expect(tip).toContainText('Day 6');
  await page.keyboard.press('ArrowLeft');
  await expect(tip).toContainText('Day 5');
  await expect(tip).toContainText('21');
});

test('F-B5-H2 the burndown and velocity charts have table views', async ({ page }) => {
  const burndown = page.locator('[data-burndown]');
  await burndown.getByText('Show the numbers').click();
  await expect(burndown.locator('tbody tr')).toHaveCount(11);

  const velocity = page.locator('[data-velocity]');
  await velocity.getByText('Show the numbers').click();
  await expect(velocity.locator('tbody tr')).toHaveCount(6);
  await expect(velocity.locator('tbody tr').first()).toContainText('Sprint 1');
});

test('F-B5-H3 velocity bars explain themselves on focus', async ({ page }) => {
  const bar = page.getByRole('img', { name: 'Sprint 3: 27 of 28 points completed, 1 carried over' });
  await bar.focus();
  await expect(page.locator('[data-velocity] .tooltip')).toContainText('27');
});

test('F-B4-E4 a finished sprint cannot be changed until it is run again', async ({ page }) => {
  for (const day of [6, 7, 8, 9]) await page.getByRole('button', { name: `End day ${day}` }).click();
  await page.getByRole('button', { name: 'End the sprint' }).click();
  await expect(page.getByRole('button', { name: 'Move “Badge printing” on to In review' })).toBeDisabled();
  const story = page.getByRole('article', { name: 'Badge printing' });
  await story.focus();
  await page.keyboard.press('ArrowRight');
  await expect(column(page, 'In progress').getByRole('article', { name: 'Badge printing' })).toBeVisible();
  await page.getByRole('button', { name: 'Run the sprint again' }).click();
  await expect(page.getByRole('button', { name: 'Move “Badge printing” on to In review' })).toBeEnabled();
});
