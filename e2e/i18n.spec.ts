import { expect, test } from '@playwright/test';

test('language is available before sign-in and translates the full review flow', async ({
  page
}) => {
  await page.goto('/login');
  await expect(page.locator('.language-control option')).toHaveCount(3);
  await page.locator('.language-control select').selectOption('zh-TW');
  await page.getByLabel('示範密碼', { exact: true }).fill('demo123');
  await page.getByRole('button', { name: '進入工作空間' }).click();
  await expect(page.getByRole('heading', { name: '更清楚地掌握營運。' })).toBeVisible();
  await page.goto('/customers?q=Avery');
  await expect(page.getByText('Avery Stone')).toBeVisible();
  await page.locator('.language-control select').selectOption('zh-CN');
  await expect(page.getByRole('heading', { name: '客户列表' })).toBeVisible();
  await expect(page).toHaveURL(/customers\?q=Avery$/);
  await page.goto('/reviews');
  await expect(page.getByText('演示个人资料需要再次检查。')).toBeVisible();
  await page.getByRole('button', { name: '批准 R-1001', exact: true }).click();
  await page.getByRole('button', { name: '确认决策', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('R-1001 已更新为 已批准。');
  await page.locator('.language-control select').selectOption('zh-TW');
  await expect(page.getByRole('status')).toContainText('R-1001 已更新為 已核准。');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-TW');
  await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
});

test('saved Simplified Chinese loads one language chunk and rejects Arabic preference', async ({
  page
}) => {
  await page.addInitScript(() => localStorage.setItem('operations-manager-locale', 'zh-CN'));
  const bundles: string[] = [];
  page.on('request', (request) => {
    if (/\/(en|zh-TW|zh-CN|ar)-[^/]+\.js/.test(request.url())) bundles.push(request.url());
  });
  await page.goto('/login');
  await expect(page.getByRole('heading', { name: '登录', exact: true })).toBeVisible();
  expect(bundles).toHaveLength(1);
  expect(bundles[0]).toMatch(/\/zh-CN-/);
  expect(await page.locator('option[value="ar"]').count()).toBe(0);
});
