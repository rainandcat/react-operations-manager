import { ApiRequestError, type PaginatedResponse } from '@/services/apiTypes';
import {
  requireMockService,
  waitForMockResponse,
  type MockScenario
} from '@/services/mockTransport';
import type { Customer, CustomerSearchParams } from './types';

const customers: readonly Customer[] = [
  {
    id: 'C-0001',
    displayName: 'Avery Stone',
    status: 'active',
    joinedAt: '2025-04-11',
    lastActiveAt: '2026-01-12'
  },
  {
    id: 'C-0002',
    displayName: 'Jordan Park',
    status: 'pending_review',
    joinedAt: '2025-05-07',
    lastActiveAt: null
  },
  {
    id: 'C-0003',
    displayName: 'Morgan Reed',
    status: 'restricted',
    joinedAt: '2025-06-18',
    lastActiveAt: '2025-12-02'
  },
  {
    id: 'C-0004',
    displayName: 'Taylor Quinn',
    status: 'active',
    joinedAt: '2025-07-22',
    lastActiveAt: '2026-01-14'
  },
  {
    id: 'C-0005',
    displayName: 'Riley Chen',
    status: 'active',
    joinedAt: '2025-08-03',
    lastActiveAt: '2026-01-11'
  },
  {
    id: 'C-0006',
    displayName: 'Casey North',
    status: 'pending_review',
    joinedAt: '2025-09-16',
    lastActiveAt: null
  },
  {
    id: 'C-0007',
    displayName: 'Sam Ellis',
    status: 'restricted',
    joinedAt: '2025-10-04',
    lastActiveAt: '2025-11-20'
  },
  {
    id: 'C-0008',
    displayName: 'Robin Vale',
    status: 'active',
    joinedAt: '2025-11-28',
    lastActiveAt: '2026-01-15'
  }
];

export async function listCustomers(
  params: CustomerSearchParams,
  signal: AbortSignal,
  scenario: MockScenario = 'normal'
): Promise<PaginatedResponse<Customer>> {
  if (
    !Number.isInteger(params.page) ||
    params.page < 1 ||
    !Number.isInteger(params.pageSize) ||
    params.pageSize < 1
  ) {
    throw new ApiRequestError('VALIDATION_ERROR', 'Page and page size must be positive integers.');
  }

  await waitForMockResponse(signal);
  requireMockService(scenario);

  const search = params.search?.trim().toLocaleLowerCase() ?? '';
  const filtered = customers.filter(
    (customer) =>
      (!params.status || customer.status === params.status) &&
      (!search ||
        customer.displayName.toLocaleLowerCase().includes(search) ||
        customer.id.toLocaleLowerCase().includes(search))
  );
  const start = (params.page - 1) * params.pageSize;

  return {
    data: filtered.slice(start, start + params.pageSize),
    page: params.page,
    pageSize: params.pageSize,
    total: filtered.length,
    updatedAt: '2026-01-15T12:00:00.000Z'
  };
}
