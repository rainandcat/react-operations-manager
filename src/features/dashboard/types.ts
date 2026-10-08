export interface DashboardSummary {
  customerCount: number;
  activityCount: number;
  pendingReviewCount: number;
  updatedAt: string;
}

export interface DashboardData {
  summary: DashboardSummary;
  recentActivity: readonly Activity[];
}
import type { Activity } from '@/features/activities/types';
