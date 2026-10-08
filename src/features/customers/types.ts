export type CustomerStatus = 'active' | 'restricted' | 'pending_review';
export type CustomerSort = 'joined_oldest' | 'name_asc';

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
  sort: CustomerSort;
  page: number;
  pageSize: number;
}
