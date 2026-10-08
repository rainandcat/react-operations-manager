import { useQuery } from '@tanstack/react-query';
import { retryMockQuery } from '@/services/queryRetry';
import { useReviewApi } from '@/features/reviews/ReviewApiProvider';
import { useManagerSession } from '@/features/auth/sessionStore';
import { getDashboard } from './dashboardApi';

export function useDashboard() {
  const reviewApi = useReviewApi();
  const canReview = useManagerSession((state) =>
    Boolean(state.session?.permissions.includes('review_cases'))
  );
  return useQuery({
    queryKey: ['dashboard', canReview],
    queryFn: ({ signal }) => getDashboard(reviewApi, signal, canReview),
    retry: retryMockQuery,
    retryDelay: 0
  });
}
