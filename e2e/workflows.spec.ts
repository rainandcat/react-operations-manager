import { test, expect, type Page } from '@playwright/test';

async function signIn(page: Page, account = 'reviewer@demo.invalid') {
  await expect(page.getByRole('button', { name: 'Open workspace' })).toBeVisible();
  await page.getByLabel('Demo account').fill(account);
  await page.getByLabel('Demo passcode').fill('demo123');
  await page.getByRole('button', { name: 'Open workspace' }).click();
}

test('protected deep link, filter return, page correction and sign out', async ({ page }) => {
  await page.goto('/customers?status=active&sort=name_asc&page=99');
  await expect(page).toHaveURL(/\/login$/);
  await signIn(page);
  await expect(page.getByRole('rowheader', { name: 'Avery Stone' })).toBeVisible();
  await expect(page).toHaveURL(/\/customers\?status=active&sort=name_asc$/);
  await expect
    .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth))
    .toBe(true);
  const listUrl = page.url();
  await page.getByRole('link', { name: 'Avery Stone' }).click();
  await expect(page.getByRole('heading', { name: 'Avery Stone' })).toBeVisible();
  await page.reload();
  await page.getByRole('link', { name: '← Customer directory' }).click();
  await expect(page).toHaveURL(listUrl);
  await expect(page.getByLabel('Status')).toHaveValue('active');
  await page.getByRole('button', { name: 'Sign out' }).click();
  await page.goto('/customers');
  await expect(page).toHaveURL(/\/login$/);
});

test('review confirmation, failure recovery and dashboard invalidation', async ({
  page
}, testInfo) => {
  await page.goto('/overview');
  await signIn(page);
  const pending = page.getByRole('link', { name: /Pending reviews/ });
  await expect(pending.locator('strong')).toHaveText('3');
  await page.screenshot({ path: testInfo.outputPath('overview.png'), fullPage: true });
  await pending.click();
  await page.getByRole('checkbox', { name: 'Simulate decision failure' }).check();
  await page.getByRole('button', { name: 'Approve R-1001', exact: true }).click();
  await page.getByRole('button', { name: 'Confirm decision', exact: true }).click();
  await expect(page.getByRole('alert')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Approve R-1001', exact: true })).toBeEnabled();
  await page.getByRole('checkbox', { name: 'Simulate decision failure' }).uncheck();
  await page.getByRole('button', { name: 'Confirm decision', exact: true }).click();
  await expect(page.getByText('R-1001 updated to approved.')).toBeVisible();
  await page
    .getByRole('navigation', { name: 'Primary' })
    .getByRole('link', { name: 'Overview' })
    .click();
  await expect(pending.locator('strong')).toHaveText('2');
  await expect
    .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth))
    .toBe(true);
});

test('operator is denied review access and unknown routes show 404', async ({ page }) => {
  await page.goto('/reviews');
  await signIn(page, 'operator@demo.invalid');
  await expect(page.getByRole('heading', { name: 'Reviewer access required.' })).toBeVisible();
  await page.goto('/does-not-exist');
  await expect(page.getByText('404 / No matching page')).toBeVisible();
  await page.getByRole('link', { name: 'Go to overview' }).click();
  await expect(page.getByRole('heading', { name: 'A calmer view of operations.' })).toBeVisible();
});
