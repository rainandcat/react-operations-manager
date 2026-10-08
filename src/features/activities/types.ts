export type ActivityKind = 'credit' | 'debit' | 'transfer';
export type ActivityStatus = 'pending' | 'completed' | 'declined';
export type ActivitySort = 'newest' | 'oldest';

export interface Activity {
  id: string;
  customerId: string;
  kind: ActivityKind;
  status: ActivityStatus;
  amount: string;
  currencyCode: string;
  occurredAt: string;
}

export interface ActivitySearchParams {
  kind?: ActivityKind;
  status?: ActivityStatus;
  sort: ActivitySort;
  page: number;
  pageSize: number;
}
