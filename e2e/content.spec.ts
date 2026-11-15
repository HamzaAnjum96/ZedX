// What a visitor must be able to see: the two products and their roles in
// the hero, our referral partner role, the comparison, the FAQ, only real screens,
// and a legal notice and privacy policy that match what the site does.
import { test, expect, PAGES, DOC_PAGES, WIP_NOTICE, DEMO_SITE, DEMO_FORM, scrollThrough } from './fixtures';

test('the hero names both products, their roles and one main action', async ({ page }) => {
  await page.goto('index.html');
  const hero = page.locator('.hero');
  await expect(hero.getByRole('heading', { level: 1 })).toHaveText('Kanban boards for everyday work. Sprints for delivery teams.');
  await expect(hero.locator('.hero-lead')).toContainText('Group WorkStreams');
  await expect(hero.locator('.hero-lead')).toContainText('Agile Sprints');
  await expect(hero.locator('.btn')).toHaveCount(1);
  await expect(hero.locator('.btn')).toHaveText('Request a demo');
  await expect(hero.getByRole('link', { name: 'See both apps' })).toHaveAttribute('href', '#apps');
  await expect(hero.locator('.hero-note')).toContainText('This site comes from a ZedX referral partner');
  await expect(hero.locator('.hero-note')).toContainText('Swiftpro Corporation Ltd, the company that makes ZedX');
  await expect(hero.locator('figure')).toHaveCount(2);
});

test('the headline, explanation and main action come before the screenshots', async ({ page }) => {
  await page.goto('index.html');
  const title = await page.locator('.hero h1').boundingBox();
  const cta = await page.locator('.hero .btn').boundingBox();
  const shot = await page.locator('.hero figure').first().boundingBox();
  expect(title!.y).toBeLessThan(cta!.y);
  expect(cta!.y + cta!.height).toBeLessThan(shot!.y);
  if ((page.viewportSize()?.width ?? 1440) >= 1100) {
    // Wide screens set the offer beside the headline, as an editorial two-column head.
    expect(cta!.x).toBeGreaterThan(title!.x + title!.width * 0.5);
  }
});

test('phones get a readable detail crop instead of the whole board', async ({ page }) => {
  await page.goto('index.html');
  const src = await page.locator('.hero figure img').first().evaluate((img) => (img as HTMLImageElement).currentSrc);
  const width = page.viewportSize()!.width;
  if (width <= 640) expect(src).toMatch(/-sm-\d+\.webp$/);
  else expect(src).toMatch(/-strip-\d+\.webp$/);
});

test('the comparison covers six buyer questions for both apps', async ({ page }) => {
  await page.goto('index.html');
  const table = page.getByRole('table', { name: 'Group WorkStreams and Agile Sprints compared' });
  await expect(table.getByRole('columnheader')).toHaveText(['Group WorkStreams', 'Agile Sprints']);
  await expect(table.getByRole('rowheader')).toHaveText(['Who it suits', 'How work arrives', 'How it is planned', 'Board views', 'How progress is reviewed', 'Editions']);
  await expect(table.getByRole('cell').filter({ hasText: /\w/ })).toHaveCount(12);
  const overflow = await table.evaluate((el) => el.scrollWidth - el.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
  if ((page.viewportSize()?.width ?? 1440) <= 760) {
    // Stacked on phones: each answer is labelled with its app.
    const label = await table.locator('tbody td').first().evaluate((td) => getComputedStyle(td, '::before').content);
    expect(label).toBe('"Group WorkStreams"');
  }
});

const qa = (scope, question: string) => scope.locator('.qa').filter({ has: scope.page().getByRole('heading', { level: 3, name: question, exact: true }) });

test('the FAQ answers who runs the site, what a demo request does and how to try ZedX', async ({ page }) => {
  await page.goto('index.html');
  const faq = page.locator('#faq');
  // Every answer is open to read, with its question as a heading.
  await expect(faq.locator('.qa')).toHaveCount(8);
  await expect(faq.locator('.qa h3')).toHaveCount(8);
  await expect(faq.locator('details')).toHaveCount(0);
  const who = qa(faq, 'Who runs this website?');
  await expect(who.locator('p')).toContainText('A ZedX referral partner');
  await expect(who.locator('p')).toContainText('Swiftpro Corporation Ltd develops and owns ZedX');
  await expect(who.locator('p')).toContainText('we may be rewarded when an introduction becomes a customer');
  const demo = qa(faq, 'What happens when I request a demo?');
  await expect(demo.locator('p')).toContainText('their form says they will get back to you');
  const tryIt = qa(faq, 'Can I try ZedX on my own first?');
  await expect(tryIt.getByRole('link', { name: 'ZedX demo' })).toHaveAttribute('href', DEMO_SITE);
  await expect(tryIt.locator('p')).toContainText('creates an account for you automatically');
  await expect(tryIt.locator('p')).toContainText('No credit card is needed');
  // The trial has no public sign-up page yet, so the answer must not pretend to link one.
  await expect(tryIt.getByRole('link')).toHaveCount(1);
  const editions = qa(faq, 'Which edition includes both apps?');
  await expect(editions.locator('p')).toContainText('Professional and Group currently include Group WorkStreams, Agile Sprints and Cloe AI');
  await expect(editions.locator('p')).toContainText('Home includes Group WorkStreams but not Agile Sprints');
  const ai = qa(faq, 'Do the apps include AI?');
  await expect(ai.locator('p')).toContainText('OpenAI technology');
  const host = qa(faq, 'Can we host it ourselves?');
  await expect(host.locator('p')).toContainText('Microsoft Azure subscription');
});

test('the steps switch between the two apps as tabs', async ({ page }) => {
  await page.goto('index.html');
  const how = page.locator('#how');
  const tabs = how.getByRole('tab');
  await expect(tabs).toHaveText(['Group WorkStreams', 'Agile Sprints']);
  await expect(how.getByRole('tablist')).toHaveAttribute('aria-label', 'Choose an app');
  await expect(tabs.first()).toHaveAttribute('aria-selected', 'true');
  await expect(how.locator('#how-ws')).toBeVisible();
  await expect(how.locator('#how-as')).toBeHidden();
  await tabs.nth(1).click();
  await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
  await expect(how.locator('#how-as')).toBeVisible();
  await expect(how.locator('#how-ws')).toBeHidden();
  await tabs.nth(1).press('ArrowLeft');
  await expect(tabs.first()).toBeFocused();
  await expect(tabs.first()).toHaveAttribute('aria-selected', 'true');
  await expect(how.locator('#how-ws li')).toHaveCount(3);
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('both sets of steps show, one after the other', async ({ page }) => {
    await page.goto('index.html');
    await expect(page.locator('#how-ws')).toBeVisible();
    await expect(page.locator('#how-as')).toBeVisible();
    await expect(page.locator('#how [role="tablist"], #how [data-tab-list]:visible')).toHaveCount(0);
  });
});

// Project Portfolios is out of this site's scope: the two apps only.
for (const path of [...PAGES, ...DOC_PAGES, 'brochure.html']) {
  test(`${path} sticks to the two apps`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator('body')).not.toContainText('Project Portfolios');
  });
}

// zedxapps.com is reached only through the demo request link, so referrals can be tracked.
for (const path of [...PAGES, ...DOC_PAGES, 'brochure.html']) {
  test(`${path} links to zedxapps.com only through the demo request`, async ({ page }) => {
    await page.goto(path);
    const hrefs = await page.locator('a[href*="zedxapps.com"]').evaluateAll((links) => links.map((a) => a.getAttribute('href')));
    for (const href of hrefs) expect(href).toBe(DEMO_FORM);
    // Source notes belong in the legal notice only.
    if (path !== 'legal.html') await expect(page.locator('body')).not.toContainText(/checked on|official ZedX website/i);
  });
}

test('licensing lists the six official editions without prices', async ({ page }) => {
  await page.goto('index.html');
  const licensing = page.locator('#licensing');
  await expect(licensing.locator('dt')).toHaveText(['Home', 'Professional', 'Group', 'Corporate', 'Enterprise', 'Enterprise Plus']);
  await expect(licensing.locator('dd').filter({ hasText: 'Licensed per user' })).toHaveCount(3);
  await expect(licensing.locator('div', { hasText: 'Enterprise Plus' }).locator('dd')).toContainText('no usage limits');
  await expect(licensing).not.toContainText(/[£$€]/);
});

// Which editions include each app comes from the official Editions page (claims W21 and A19).
for (const [path, included, excluded] of [
  ['workstreams.html', 'Home, Professional and Group editions', null],
  ['agile-sprints.html', 'Professional and Group editions', 'The Home edition doesn’t include it'],
] as const) {
  test(`${path} answers which editions include the app, and links to the comparison`, async ({ page }) => {
    await page.goto(path);
    const answer = qa(page.locator('#faq'), 'Which editions include it?');
    await expect(answer.locator('p')).toContainText(included);
    if (excluded) await expect(answer.locator('p')).toContainText(excluded);
    await expect(answer.getByRole('link', { name: 'Compare the editions' })).toHaveAttribute('href', './#licensing');
    await expect(page.locator('#faq .qa h3', { hasText: 'include AI?' })).toHaveCount(1);
  });
}

// Claims Swiftpro withdrew or replaced in its 2026 site updates (see "Withdrawn or replaced" in replica/claims.md).
// "Five editions" was replaced in November 2026, when Swiftpro added Enterprise Plus.
const WITHDRAWN = /guest login|ZedX’s own sign-in|or a ZedX login|modules within|store inside ZedX|blocks of 10|own server|Swiftpro Digital|Oracle|SAP ERP|Tribal|five editions/i;
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
      await expect(figures.nth(i).locator('.shot-text')).toContainText(/Group WorkStreams|Agile Sprints/);
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
  await expect(main).toContainText('This website is run by a ZedX referral partner');
  await expect(main).toContainText('may be rewarded by Swiftpro when an introduction made through this site leads to a sale');
  await expect(main).toContainText('Group WorkStreams and Agile Sprints are products of Swiftpro Corporation Ltd');
  // The one place that dates the source of the product information.
  await expect(main).toContainText('as it was on 8 November 2026');
  await expect(main.getByRole('link', { name: 'github.com/HamzaAnjum96/ZedX/issues' })).toHaveAttribute('href', 'https://github.com/HamzaAnjum96/ZedX/issues');
});

test('the privacy policy names what GitHub logs and where demo requests go', async ({ page }) => {
  await page.goto('privacy.html');
  const main = page.locator('main');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Privacy policy');
  await expect(main).toContainText('It sets no cookies, runs no analytics or tracking code and has no forms');
  await expect(main).toContainText('GitHub logs and stores the IP address of everyone who visits');
  await expect(main.getByRole('link', { name: 'GitHub General Privacy Statement' })).toHaveAttribute('href', /^https:\/\/docs\.github\.com\//);
  await expect(main).toContainText('This site is run by a ZedX referral partner, not by Swiftpro Corporation Ltd');
  await expect(main).toContainText('covered by Swiftpro’s Privacy Policy');
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
