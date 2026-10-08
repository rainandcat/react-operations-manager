import { describe, expect, it } from 'vitest';
import { createReviewApi } from './reviewApi';

const signal = new AbortController().signal;

describe('fictional review API', () => {
  it('updates one case and rejects a repeated decision', async () => {
    const api = createReviewApi();
    expect(
      (await api.listCases(signal)).data.filter((item) => item.status === 'pending')
    ).toHaveLength(3);
    expect((await api.decideCase('R-1001', 'approve')).data.status).toBe('approved');
    expect(
      (await api.listCases(signal)).data.filter((item) => item.status === 'pending')
    ).toHaveLength(2);
    await expect(api.decideCase('R-1001', 'reject')).rejects.toMatchObject({ code: 'CONFLICT' });
  });

  it('keeps separate demo instances isolated and leaves failed decisions unchanged', async () => {
    const first = createReviewApi();
    const second = createReviewApi();
    await expect(first.decideCase('R-1002', 'reject', 'unavailable')).rejects.toMatchObject({
      code: 'UNAVAILABLE'
    });
    expect((await first.listCases(signal)).data.find((item) => item.id === 'R-1002')?.status).toBe(
      'pending'
    );
    await first.decideCase('R-1002', 'request_info');
    expect((await second.listCases(signal)).data.find((item) => item.id === 'R-1002')?.status).toBe(
      'pending'
    );
    await expect(first.decideCase('R-9999', 'approve')).rejects.toMatchObject({
      code: 'NOT_FOUND'
    });
  });
});
