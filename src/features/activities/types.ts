export type ActivityKind = 'credit' | 'debit' | 'transfer';
export type ActivityStatus = 'pending' | 'completed' | 'declined';

export interface Activity {
  id: string;
  customerId: string;
  kind: ActivityKind;
  status: ActivityStatus;
  amount: string;
  currencyCode: string;
  occurredAt: string;
}
