export type CustomerStatus = 'active' | 'restricted' | 'pending_review';

export interface Customer {
  id: string;
  displayName: string;
  status: CustomerStatus;
  joinedAt: string;
  lastActiveAt: string | null;
}

export interface CustomerSearchParams {
  search?: string;
  status?: CustomerStatus;
  page: number;
  pageSize: number;
}
