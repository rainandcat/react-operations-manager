import { describe, expect, it } from 'vitest';
import { authenticateDemoManager } from './demoAuth';

describe('demo manager authentication', () => {
  it('gives reviewers review permission', () => {
    expect(authenticateDemoManager(' REVIEWER@DEMO.INVALID ', 'demo123')?.permissions).toContain(
      'review_cases'
    );
  });

  it('does not give operators review permission', () => {
    expect(authenticateDemoManager('operator@demo.invalid', 'demo123')?.permissions).not.toContain(
      'review_cases'
    );
  });

  it('rejects an incorrect passcode or unknown account', () => {
    expect(authenticateDemoManager('reviewer@demo.invalid', 'wrong')).toBeNull();
    expect(authenticateDemoManager('other@demo.invalid', 'demo123')).toBeNull();
  });
});
