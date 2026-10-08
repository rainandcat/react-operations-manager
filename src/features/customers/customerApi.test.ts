import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { listCustomers } from './customerApi';

const signal = () => new AbortController().signal;
const params = { page: 1, pageSize: 5 };

describe('fictional customer API', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('filters by name and status', async () => {
    const request = listCustomers({ ...params, search: 'avery', status: 'active' }, signal());
    await vi.advanceTimersByTimeAsync(350);
    expect((await request).data.map((customer) => customer.id)).toEqual(['C-0001']);
  });

  it('paginates and returns an empty result for an unmatched search', async () => {
    const secondPage = listCustomers({ ...params, page: 2 }, signal());
    const empty = listCustomers({ ...params, search: 'no match' }, signal());
    await vi.advanceTimersByTimeAsync(350);
    expect((await secondPage).data).toHaveLength(3);
    expect((await empty).total).toBe(0);
  });

  it('exposes a repeatable error scenario', async () => {
    const request = listCustomers(params, signal(), 'unavailable');
    const assertion = expect(request).rejects.toMatchObject({ code: 'UNAVAILABLE' });
    await vi.advanceTimersByTimeAsync(350);
    await assertion;
  });

  it('cancels the pending delay without returning a UI error', async () => {
    const controller = new AbortController();
    const request = listCustomers(params, controller.signal);
    const assertion = expect(request).rejects.toMatchObject({ name: 'AbortError' });
    controller.abort();
    await assertion;
  });
});
