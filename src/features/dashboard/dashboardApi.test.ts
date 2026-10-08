import { describe, expect, it } from 'vitest';
import { createReviewApi } from '@/features/reviews/reviewApi';
import { getDashboard } from './dashboardApi';

describe('dashboard snapshot', () => {
  it('includes review counts only for reviewers and reflects decisions', async () => {
    const api = createReviewApi();
    const signal = new AbortController().signal;
    const operator = await getDashboard(api, signal, false);
    expect(operator.data.summary.pendingReviewCount).toBe(0);
    expect(operator.data.recentActivity).toHaveLength(3);
    const reviewer = await getDashboard(api, signal, true);
    expect(reviewer.data.summary.pendingReviewCount).toBe(3);
    await api.decideCase('R-1001', 'approve');
    const updated = await getDashboard(api, signal, true);
    expect(updated.data.summary.pendingReviewCount).toBe(2);
  });
});
