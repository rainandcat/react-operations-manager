import type { ApiResponse } from '@/services/apiTypes';
import { listCustomers } from '@/features/customers/customerApi';
import { listActivities } from '@/features/activities/activityApi';
import type { ReviewApi } from '@/features/reviews/reviewApi';
import type { DashboardData } from './types';

export async function getDashboard(
  reviewApi: ReviewApi,
  signal: AbortSignal,
  includeReviews: boolean
): Promise<ApiResponse<DashboardData>> {
  const [customers, activities, reviews] = await Promise.all([
    listCustomers({ sort: 'joined_oldest', page: 1, pageSize: 1 }, signal),
    listActivities({ sort: 'newest', page: 1, pageSize: 3 }, signal),
    includeReviews ? reviewApi.listCases(signal) : Promise.resolve(null)
  ]);

  const updatedAt =
    reviews && reviews.updatedAt > activities.updatedAt ? reviews.updatedAt : activities.updatedAt;
  return {
    data: {
      summary: {
        customerCount: customers.total,
        activityCount: activities.total,
        pendingReviewCount: reviews?.data.filter((item) => item.status === 'pending').length ?? 0,
        updatedAt
      },
      recentActivity: activities.data
    },
    updatedAt
  };
}
