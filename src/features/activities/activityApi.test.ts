import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getActivity, listActivities } from './activityApi';

const signal = () => new AbortController().signal;
const params = { sort: 'newest' as const, page: 1, pageSize: 5 };

describe('fictional manager activity API', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('filters, sorts and paginates', async () => {
    const filtered = listActivities({ ...params, kind: 'transfer', status: 'pending' }, signal());
    const oldest = listActivities({ ...params, sort: 'oldest' }, signal());
    const secondPage = listActivities({ ...params, page: 2 }, signal());
    await vi.advanceTimersByTimeAsync(350);
    expect((await filtered).data.map((item) => item.id)).toEqual(['A-0002']);
    expect((await oldest).data[0]?.id).toBe('A-0008');
    expect((await secondPage).data).toHaveLength(3);
  });

  it('resolves a detail and rejects an unknown ID', async () => {
    const detail = getActivity('A-0001', signal());
    const missing = getActivity('A-9999', signal());
    const assertion = expect(missing).rejects.toMatchObject({ code: 'NOT_FOUND' });
    await vi.advanceTimersByTimeAsync(350);
    expect((await detail).data.customerId).toBe('C-0001');
    await assertion;
  });
});
