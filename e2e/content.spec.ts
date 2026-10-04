// What a visitor must be able to see: the two products and their roles in
// the hero, our promotional role, the comparison, the FAQ, and only real screens.
import { test, expect, isNarrow } from './fixtures';

test('the hero names both products, their roles and one main action', async ({ page }) => {
  await page.goto('index.html');
  const hero = page.locator('.hero');
  await expect(hero.getByRole('heading', { level: 1 })).toHaveText('Workflows for everyday work. Sprints for planned delivery.');
  await expect(hero.locator('.hero-lead')).toContainText('Group WorkStreams');
  await expect(hero.locator('.hero-lead')).toContainText('Agile Sprints');
  await expect(hero.locator('.btn')).toHaveCount(1);
  await expect(hero.locator('.btn')).toHaveText('Request a demo');
  await expect(hero.getByRole('link', { name: 'See both apps' })).toHaveAttribute('href', '#apps');
  await expect(hero.locator('.hero-note')).toContainText('An independent promoter of ZedX runs this site');
  await expect(hero.locator('.hero-note')).toContainText('Swiftpro Corporation Ltd');
  await expect(hero.locator('figure')).toHaveCount(2);
});

test('on small screens the explanation and main action come before the screenshots', async ({ page }) => {
  await page.goto('index.html');
  const cta = await page.locator('.hero .btn').boundingBox();
  const shot = await page.locator('.hero figure').first().boundingBox();
  if (isNarrow(page)) expect(cta!.y + cta!.height).toBeLessThan(shot!.y);
  else expect(shot!.x).toBeGreaterThan(cta!.x + cta!.width);
});

test('phones get a readable detail crop instead of the whole board', async ({ page }) => {
  await page.goto('index.html');
  const src = await page.locator('.hero figure img').first().evaluate((img) => (img as HTMLImageElement).currentSrc);
  const width = page.viewportSize()!.width;
  if (width <= 640) expect(src).toMatch(/-sm-\d+\.webp$/);
  else expect(src).toMatch(/-strip-\d+\.webp$/);
});

test('the comparison covers four buyer questions for both apps', async ({ page }) => {
  await page.goto('index.html');
  const table = page.getByRole('table', { name: 'Group WorkStreams and Agile Sprints compared' });
  await expect(table.getByRole('columnheader')).toHaveText(['Group WorkStreams', 'Agile Sprints']);
  await expect(table.getByRole('rowheader')).toHaveText(['How work arrives', 'How it is planned', 'The board', 'How progress is reviewed']);
  await expect(table.getByRole('cell').filter({ hasText: /\w/ })).toHaveCount(8);
  const overflow = await table.evaluate((el) => el.scrollWidth - el.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
  if ((page.viewportSize()?.width ?? 1440) <= 760) {
    // Stacked on phones: each answer is labelled with its app.
    const label = await table.locator('tbody td').first().evaluate((td) => getComputedStyle(td, '::before').content);
    expect(label).toBe('"Group WorkStreams"');
  }
});

test('the FAQ answers who runs the site and what a demo request does', async ({ page }) => {
  await page.goto('index.html');
  const faq = page.locator('#faq');
  await expect(faq.locator('details')).toHaveCount(4);
  const who = faq.locator('details', { hasText: 'Who runs this website?' });
  await who.locator('summary').click();
  await expect(who).toHaveAttribute('open', '');
  await expect(who.locator('p')).toContainText('An independent promoter of ZedX');
  await expect(who.locator('p')).toContainText('Swiftpro Corporation Ltd develops and owns ZedX');
  const demo = faq.locator('details', { hasText: 'What happens when I request a demo?' });
  await demo.locator('summary').click();
  await expect(demo.locator('p')).toContainText('doesn’t book a time');
});

test('leadership reporting is explained as periodic updates, not live task data', async ({ page }) => {
  await page.goto('index.html');
  const section = page.locator('#leadership');
  await expect(section).toContainText('monthly or quarterly');
  await expect(section).toContainText('The individual tasks stay on the team’s board');
  await expect(section).not.toContainText(/real[- ]time/i);
});

test('licensing lists the four official options without prices', async ({ page }) => {
  await page.goto('index.html');
  const licensing = page.locator('#licensing');
  await expect(licensing.locator('dt')).toHaveCount(4);
  await expect(licensing).not.toContainText('£');
});

for (const path of ['index.html', 'workstreams.html', 'agile-sprints.html']) {
  test(`${path} shows only real screens, each captioned with its app`, async ({ page }) => {
    await page.goto(path);
    const figures = page.locator('main figure');
    const count = await figures.count();
    expect(count).toBeGreaterThanOrEqual(3);
    for (let i = 0; i < count; i += 1) {
      await expect(figures.nth(i).locator('.shot-text')).toContainText(/Group WorkStreams|Agile Sprints|Project Portfolios/);
      await expect(figures.nth(i).locator('img')).toHaveAttribute('src', /^assets\/img\/screens\//);
    }
    // No drawn or simulated product UI anywhere.
    await expect(page.locator('main svg:not(.icon)')).toHaveCount(0);
    await expect(page.locator('canvas')).toHaveCount(0);
  });
}

async function expectNoEyebrowsOrMono(page) {
  await expect(page.locator('.eyebrow, .kicker')).toHaveCount(0);
  const mono = await page.evaluate(() => [...document.querySelectorAll('body *')]
    .filter((el) => el.childNodes.length && /mono/i.test(getComputedStyle(el).fontFamily))
    .map((el) => el.tagName));
  expect(mono).toEqual([]);
}

// Mono eyebrow labels and kickers above headings read as templated design, so none are left.
for (const path of ['index.html', 'workstreams.html', 'agile-sprints.html']) {
  test(`${path} has no eyebrow labels or monospace type`, async ({ page }) => {
    await page.goto(path);
    await expectNoEyebrowsOrMono(page);
  });
}

test.describe('404 page', () => {
  test.use({ allowConsole: [/404 \(Not Found\)/] });

  test('has no eyebrow labels or monospace type', async ({ page }) => {
    await page.goto('no/such/page.html');
    await expectNoEyebrowsOrMono(page);
  });
});
