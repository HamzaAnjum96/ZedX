// What a visitor must be able to see: the two products and their roles in
// the hero, our promotional role, the comparison, the FAQ, only real screens,
// and a legal notice and privacy policy that match what the site does.
import { test, expect, isNarrow, PAGES, DOC_PAGES, WIP_NOTICE, DEMO_SITE, scrollThrough } from './fixtures';

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

test('the comparison covers five buyer questions for both apps', async ({ page }) => {
  await page.goto('index.html');
  const table = page.getByRole('table', { name: 'Group WorkStreams and Agile Sprints compared' });
  await expect(table.getByRole('columnheader')).toHaveText(['Group WorkStreams', 'Agile Sprints']);
  await expect(table.getByRole('rowheader')).toHaveText(['Who it suits', 'How work arrives', 'How it is planned', 'The board', 'How progress is reviewed']);
  await expect(table.getByRole('cell').filter({ hasText: /\w/ })).toHaveCount(10);
  const overflow = await table.evaluate((el) => el.scrollWidth - el.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
  if ((page.viewportSize()?.width ?? 1440) <= 760) {
    // Stacked on phones: each answer is labelled with its app.
    const label = await table.locator('tbody td').first().evaluate((td) => getComputedStyle(td, '::before').content);
    expect(label).toBe('"Group WorkStreams"');
  }
});

test('the FAQ answers who runs the site, what a demo request does and how to try ZedX', async ({ page }) => {
  await page.goto('index.html');
  const faq = page.locator('#faq');
  await expect(faq.locator('details')).toHaveCount(5);
  const who = faq.locator('details', { hasText: 'Who runs this website?' });
  await who.locator('summary').click();
  await expect(who).toHaveAttribute('open', '');
  await expect(who.locator('p')).toContainText('An independent promoter of ZedX');
  await expect(who.locator('p')).toContainText('Swiftpro Corporation Ltd develops and owns ZedX');
  const demo = faq.locator('details', { hasText: 'What happens when I request a demo?' });
  await demo.locator('summary').click();
  await expect(demo.locator('p')).toContainText('their form says they will get back to you');
  const tryIt = faq.locator('details', { hasText: 'Can I try ZedX on my own first?' });
  await tryIt.locator('summary').click();
  await expect(tryIt.getByRole('link', { name: 'ZedX demo' })).toHaveAttribute('href', DEMO_SITE);
  await expect(tryIt.locator('p')).toContainText('you don’t have to register');
});

test('leadership reporting is explained as periodic updates, not live task data', async ({ page }) => {
  await page.goto('index.html');
  const section = page.locator('#leadership');
  await expect(section).toContainText('monthly or quarterly');
  await expect(section).toContainText('The individual tasks stay on the team’s board');
  await expect(section).not.toContainText(/real[- ]time/i);
});

test('licensing lists the five official editions without prices', async ({ page }) => {
  await page.goto('index.html');
  const licensing = page.locator('#licensing');
  await expect(licensing.locator('dt')).toHaveText(['Home', 'Professional', 'Group', 'Corporate', 'Enterprise']);
  await expect(licensing).toContainText('SaaS editions are licensed per user');
  await expect(licensing).not.toContainText(/[£$€]/);
});

// Claims Swiftpro withdrew in its October 2026 site update (see "Withdrawn" in replica/claims.md).
const WITHDRAWN = /guest login|ZedX’s own sign-in|or a ZedX login|modules within|store inside ZedX|blocks of 10|own server|Swiftpro Digital|Oracle|SAP ERP|Tribal/i;
for (const path of [...PAGES, 'brochure.html']) {
  test(`${path} repeats no claim that Swiftpro has withdrawn`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator('main')).not.toContainText(WITHDRAWN);
  });
}

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
for (const path of [...PAGES, ...DOC_PAGES]) {
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

  test('opens with the work-in-progress notice', async ({ page }) => {
    await page.goto('no/such/page.html');
    await expect(page.locator('.site-header > :first-child')).toHaveText(WIP_NOTICE);
  });
});

test('printed pages keep the work-in-progress notice and drop the navigation', async ({ page }) => {
  await page.goto('index.html');
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('.wip-notice')).toBeVisible();
  await expect(page.locator('.header-inner')).toBeHidden();
});

test('the legal notice says who runs the site, that it is unfinished and who owns the names', async ({ page }) => {
  await page.goto('legal.html');
  const main = page.locator('main');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Legal notice');
  await expect(main).toContainText('Swiftpro Corporation Ltd, the company that develops and owns ZedX, does not run this site');
  await expect(main).toContainText('its content is not complete and may not be correct');
  await expect(main).toContainText('Agile Sprints and Project Portfolios are products of Swiftpro Corporation Ltd');
  await expect(main.getByRole('link', { name: 'Terms of Use' })).toHaveAttribute('href', 'https://www.zedxapps.com/WebsiteTerms.html');
  await expect(main.getByRole('link', { name: 'github.com/HamzaAnjum96/ZedX/issues' })).toHaveAttribute('href', 'https://github.com/HamzaAnjum96/ZedX/issues');
});

test('the privacy policy names what GitHub logs and where demo requests go', async ({ page }) => {
  await page.goto('privacy.html');
  const main = page.locator('main');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Privacy policy');
  await expect(main).toContainText('It sets no cookies, runs no analytics or tracking code and has no forms');
  await expect(main).toContainText('GitHub logs and stores the IP address of everyone who visits');
  await expect(main.getByRole('link', { name: 'GitHub General Privacy Statement' })).toHaveAttribute('href', /^https:\/\/docs\.github\.com\//);
  await expect(main.getByRole('link', { name: 'Swiftpro’s Privacy Policy' })).toHaveAttribute('href', 'https://www.zedxapps.com/PrivacyPolicy.html');
});

// The privacy policy promises no cookies, storage, forms or calls to other services. Hold every page to it.
for (const path of [...PAGES, ...DOC_PAGES]) {
  test(`${path} keeps the privacy policy's promises`, async ({ page, context }) => {
    const external: string[] = [];
    page.on('request', (req) => {
      if (/^https?:/.test(req.url()) && !req.url().startsWith('http://localhost')) external.push(req.url());
    });
    await page.goto(path);
    await scrollThrough(page);
    expect(external, 'requests to other sites').toEqual([]);
    expect(await context.cookies(), 'cookies').toEqual([]);
    expect(await page.evaluate(() => localStorage.length + sessionStorage.length), 'web storage').toBe(0);
    await expect(page.locator('form')).toHaveCount(0);
  });
}
