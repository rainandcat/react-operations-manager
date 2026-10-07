import type { MockManagerSession } from './types';

const demoAccounts: Record<string, MockManagerSession> = {
  'operator@demo.invalid': {
    actorId: 'OP-001',
    displayName: 'Demo Operator',
    permissions: ['view_customers', 'view_activities']
  },
  'reviewer@demo.invalid': {
    actorId: 'RV-001',
    displayName: 'Demo Reviewer',
    permissions: ['view_customers', 'view_activities', 'review_cases']
  }
};

export function authenticateDemoManager(
  account: string,
  passcode: string
): MockManagerSession | null {
  if (passcode !== 'demo123') return null;
  return demoAccounts[account.trim().toLowerCase()] ?? null;
}
