export type ReviewStatus = 'pending' | 'approved' | 'needs_info' | 'rejected';
export type ReviewDecision = 'approve' | 'request_info' | 'reject';

export interface ReviewCase {
  id: string;
  customerId: string;
  status: ReviewStatus;
  summary: string;
  submittedAt: string;
  reviewedAt: string | null;
}
