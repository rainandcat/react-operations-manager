import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { MockScenario } from '@/services/mockTransport';
import type { ReviewDecision } from './types';
import { useReviewApi } from './ReviewApiProvider';

export function useReviews() {
  const api = useReviewApi();
  return useQuery({ queryKey: ['reviews'], queryFn: ({ signal }) => api.listCases(signal) });
}

export function useReviewDecision() {
  const api = useReviewApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      caseId,
      decision,
      scenario = 'normal'
    }: {
      caseId: string;
      decision: ReviewDecision;
      scenario?: MockScenario;
    }) => api.decideCase(caseId, decision, scenario),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['reviews'] }),
        queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      ]);
    }
  });
}
