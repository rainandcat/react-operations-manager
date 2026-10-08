import { useQuery } from '@tanstack/react-query';
import { getCustomer } from './customerApi';
import { retryMockQuery } from '@/services/queryRetry';

export function useCustomer(customerId: string) {
  return useQuery({
    queryKey: ['customer', customerId],
    queryFn: ({ signal }) => getCustomer(customerId, signal),
    enabled: Boolean(customerId),
    retry: retryMockQuery,
    retryDelay: 0
  });
}
