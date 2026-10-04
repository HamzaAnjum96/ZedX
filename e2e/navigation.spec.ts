// Moving around the site: navigation, the phone menu, preserved anchors,
// the vendor destinations, the brochure and the 404 page.
import { test, expect, DEMO_FORM, LOGIN, isNarrow } from './fixtures';

const mainNav = (page) => page.getByRole('navigation', { name: 'Main' });

async function openMenuIfNeeded(page) {
  if (isNarrow(page)) await page.getByRole('button', { name: 'Menu' }).click();
}

test('the main navigation reaches both app pages and back home', async ({ page }) => {
  await page.goto('index.html');
  await openMenuIfNeeded(page);
  await mainNav(page).getByRole('link', { name: 'Group WorkStreams' }).click();
  await expect(page).toHaveURL(/workstreams\.html$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Group WorkStreams');

  await openMenuIfNeeded(page);
  await expect(mainNav(page).getByRole('link', { name: 'Group WorkStreams' })).toHaveAttribute('aria-current', 'page');
  await mainNav(page).getByRole('link', { name: 'Agile Sprints' }).click();
  await expect(page).toHaveURL(/agile-sprints\.html$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Agile Sprints');

  await page.locator('.brand').click();
  await expect(page).toHaveURL(/\/ZedX\/$/);
});

test('Compare and Adoption in the menu land on their sections from an app page', async ({ page }) => {
  await page.goto('agile-sprints.html');
  await openMenuIfNeeded(page);
  await mainNav(page).getByRole('link', { name: 'Compare' }).click();
  await expect(page).toHaveURL(/\/ZedX\/#compare$/);
  await expect(page.locator('#compare')).toBeInViewport();

  await openMenuIfNeeded(page);
  await mainNav(page).getByRole('link', { name: 'Adoption' }).click();
  await expect(page).toHaveURL(/#adoption$/);
  await expect(page.locator('#adoption')).toBeInViewport();
});

test('anchors used by earlier links still exist', async ({ page }) => {
  await page.goto('index.html');
  for (const id of ['apps', 'workstreams', 'sprints', 'compare', 'leadership', 'adoption', 'platform', 'licensing', 'faq']) {
    await expect(page.locator(`#${id}`), `#${id}`).toHaveCount(1);
  }
});

test('"Explore the apps" scrolls to the two products', async ({ page }) => {
  await page.goto('index.html');
  await page.getByRole('link', { name: 'Explore the apps' }).click();
  await expect(page).toHaveURL(/#apps$/);
  await expect(page.getByRole('heading', { name: 'Continuous work, organised by function' })).toBeInViewport();
});

test('the phone and tablet menu opens, closes with Escape and returns focus', async ({ page }) => {
  await page.goto('index.html');
  const toggle = page.getByRole('button', { name: 'Menu' });
  if (!isNarrow(page)) {
    await expect(toggle).toBeHidden();
    await expect(mainNav(page).getByRole('link', { name: 'Compare' })).toBeVisible();
    return;
  }
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(mainNav(page).getByRole('link', { name: 'Compare' })).toBeHidden();
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(mainNav(page).getByRole('link', { name: 'Compare' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toBeFocused();
  await expect(mainNav(page).getByRole('link', { name: 'Compare' })).toBeHidden();
});

test('the skip link jumps to the content', async ({ page }) => {
  await page.goto('workstreams.html');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Skip to content' });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
  await skip.press('Enter');
  await expect(page).toHaveURL(/#main$/);
});

for (const path of ['index.html', 'workstreams.html', 'agile-sprints.html']) {
  test(`${path}: every demo button opens the vendor's contact form, login goes to ZedX`, async ({ page }) => {
    await page.goto(path);
    const demo = page.locator('a', { hasText: 'Request a demo' });
    expect(await demo.count()).toBeGreaterThanOrEqual(3);
    for (const href of await demo.evaluateAll((links) => links.map((a) => a.getAttribute('href')))) {
      expect(href).toBe(DEMO_FORM);
    }
    const login = page.locator('a', { hasText: /Log in to ZedX/ });
    for (const href of await login.evaluateAll((links) => links.map((a) => a.getAttribute('href')))) {
      expect(href).toBe(LOGIN);
    }
    // The page explains where a demo request goes: to the vendor, not a calendar.
    await expect(page.locator('main')).toContainText('Swiftpro');
    await expect(page.locator('main')).not.toContainText(/book(ed)? (a|your) (slot|time)|calendar/i);
  });
}

test('the brochure downloads as a four-page PDF', async ({ page, request }) => {
  await page.goto('index.html');
  const link = page.locator('.closing a[href="brochure.pdf"]');
  await expect(link).toHaveAttribute('download', '');
  const res = await request.get('brochure.pdf');
  expect(res.status()).toBe(200);
  expect(res.headers()['content-type']).toBe('application/pdf');
  const body = await res.body();
  expect(body.subarray(0, 5).toString()).toBe('%PDF-');
  expect(body.toString('latin1').match(/\/Type\s*\/Page[^s]/g)?.length).toBe(4);
});

test.describe('404', () => {
  test.use({ allowConsole: [/404 \(Not Found\)/] });

  test('a missing deep address shows the 404 page with working links', async ({ page }) => {
    const res = await page.goto('no/such/page.html');
    expect(res?.status()).toBe(404);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page not found');
    await page.locator('.notfound-links').getByRole('link', { name: 'Agile Sprints', exact: true }).click();
    await expect(page).toHaveURL(/\/ZedX\/agile-sprints\.html$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Agile Sprints');
  });
});
