import { ApiRequestError, type ApiResponse } from '@/services/apiTypes';
import { runMockRequest, type MockScenario } from '@/services/mockTransport';
import type { ReviewCase, ReviewDecision, ReviewStatus } from './types';

const initialCases: readonly ReviewCase[] = [
  {
    id: 'R-1001',
    customerId: 'C-0002',
    status: 'pending',
    summary: 'Demo profile information needs a second look.',
    submittedAt: '2026-01-15T09:20:00.000Z',
    reviewedAt: null
  },
  {
    id: 'R-1002',
    customerId: 'C-0006',
    status: 'pending',
    summary: 'A fictional account change is waiting for review.',
    submittedAt: '2026-01-14T14:05:00.000Z',
    reviewedAt: null
  },
  {
    id: 'R-1003',
    customerId: 'C-0005',
    status: 'pending',
    summary: 'Demo activity context requires a decision.',
    submittedAt: '2026-01-13T11:45:00.000Z',
    reviewedAt: null
  },
  {
    id: 'R-1004',
    customerId: 'C-0003',
    status: 'needs_info',
    summary: 'Additional fictional details were requested earlier.',
    submittedAt: '2026-01-12T08:10:00.000Z',
    reviewedAt: '2026-01-12T10:00:00.000Z'
  }
];

const decisionStatus: Record<ReviewDecision, ReviewStatus> = {
  approve: 'approved',
  request_info: 'needs_info',
  reject: 'rejected'
};

export interface ReviewApi {
  listCases: (signal: AbortSignal) => Promise<ApiResponse<readonly ReviewCase[]>>;
  decideCase: (
    caseId: string,
    decision: ReviewDecision,
    scenario?: MockScenario
  ) => Promise<ApiResponse<ReviewCase>>;
}

export function createReviewApi(): ReviewApi {
  let cases = initialCases.map((item) => ({ ...item }));
  let updatedAt = '2026-01-15T12:00:00.000Z';

  return {
    async listCases(signal) {
      await runMockRequest(signal);
      return { data: cases.map((item) => ({ ...item })), updatedAt };
    },
    async decideCase(caseId, decision, scenario = 'normal') {
      await runMockRequest(new AbortController().signal, scenario);
      const current = cases.find((item) => item.id === caseId);
      if (!current)
        throw new ApiRequestError('NOT_FOUND', 'This fictional review case does not exist.');
      if (current.status !== 'pending')
        throw new ApiRequestError('CONFLICT', 'This case has already been decided.');
      const decisionTime = new Date().toISOString();
      const next: ReviewCase = {
        ...current,
        status: decisionStatus[decision],
        reviewedAt: decisionTime
      };
      cases = cases.map((item) => (item.id === caseId ? next : item));
      updatedAt = decisionTime;
      return { data: { ...next }, updatedAt };
    }
  };
}
