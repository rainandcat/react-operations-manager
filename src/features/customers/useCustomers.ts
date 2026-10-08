import { keepPreviousData, useQuery } from '@tanstack/react-query';
import type { MockScenario } from '@/services/mockTransport';
import { listCustomers } from './customerApi';
import type { CustomerSearchParams } from './types';

export function useCustomers(params: CustomerSearchParams, scenario: MockScenario) {
  return useQuery({
    queryKey: [
      'customers',
      params.search ?? '',
      params.status ?? 'all',
      params.page,
      params.pageSize,
      scenario
    ],
    queryFn: ({ signal }) => listCustomers(params, signal, scenario),
    placeholderData: keepPreviousData,
    retry: false
  });
}
