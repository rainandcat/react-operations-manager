import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getCustomer, listCustomers } from './customerApi';

const signal = () => new AbortController().signal;
const params = { page: 1, pageSize: 5, sort: 'joined_oldest' as const };

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

  it('sorts names and resolves a detail ID', async () => {
    const sorted = listCustomers({ ...params, sort: 'name_asc' }, signal());
    const detail = getCustomer('C-0001', signal());
    await vi.advanceTimersByTimeAsync(350);
    expect((await sorted).data[1]?.displayName).toBe('Casey North');
    expect((await detail).data.id).toBe('C-0001');
  });

  it('reports an unknown detail ID', async () => {
    const request = getCustomer('C-9999', signal());
    const assertion = expect(request).rejects.toMatchObject({ code: 'NOT_FOUND' });
    await vi.advanceTimersByTimeAsync(350);
    await assertion;
  });
});
