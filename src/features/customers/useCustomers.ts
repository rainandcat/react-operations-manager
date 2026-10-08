import { keepPreviousData, useQuery } from '@tanstack/react-query';
import type { MockScenario } from '@/services/mockTransport';
import { retryMockQuery } from '@/services/queryRetry';
import { listCustomers } from './customerApi';
import type { CustomerSearchParams } from './types';

export function useCustomers(params: CustomerSearchParams, scenario: MockScenario) {
  return useQuery({
    queryKey: [
      'customers',
      params.search ?? '',
      params.status ?? 'all',
      params.sort,
      params.page,
      params.pageSize,
      scenario
    ],
    queryFn: ({ signal }) => listCustomers(params, signal, scenario),
    placeholderData: keepPreviousData,
    retry: retryMockQuery,
    retryDelay: 0
  });
}
