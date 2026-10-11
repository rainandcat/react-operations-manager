// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';
import { changeLocale, i18n, languages, localize, savedLocale, translate } from './index';

afterEach(async () => {
  localStorage.clear();
  await changeLocale('en', false);
});
describe('manager locale lifecycle', () => {
  it('defaults to English and does not support Arabic', async () => {
    localStorage.setItem('operations-manager-locale', 'ar');
    expect(savedLocale()).toBe('en');
    expect(languages.map((item) => item.value)).toEqual(['en', 'zh-TW', 'zh-CN']);
    await changeLocale('en', false);
    expect(translate('Review queue')).toBe('Review queue');
  });
  it('translates decisions and existing messages and persists the chosen locale', async () => {
    await changeLocale('zh-TW');
    expect(localize('R-1001 updated to approved.')).toBe('R-1001 已更新為 已核准。');
    expect(localize('Demo profile information needs a second look.')).toBe(
      '示範個人資料需要再次檢查。'
    );
    expect(document.documentElement.dir).toBe('ltr');
    expect(localStorage.getItem('operations-manager-locale')).toBe('zh-TW');
    await changeLocale('zh-CN');
    expect(translate('Review queue')).toBe('审核队列');
    expect(i18n.language).toBe('zh-CN');
  });
});
