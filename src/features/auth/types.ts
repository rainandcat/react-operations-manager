export type ManagerPermission = 'view_customers' | 'view_activities' | 'review_cases';

export interface MockManagerSession {
  actorId: string;
  displayName: string;
  permissions: readonly ManagerPermission[];
}
