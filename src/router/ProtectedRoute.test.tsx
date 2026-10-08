// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { authenticateDemoManager } from '@/features/auth/demoAuth';
import { useManagerSession } from '@/features/auth/sessionStore';
import { ProtectedRoute, RequirePermission } from './ProtectedRoute';

afterEach(() => {
  cleanup();
  useManagerSession.getState().signOut();
});

function LoginProbe() {
  const location = useLocation();
  return <p>Return to {(location.state as { from?: string } | null)?.from}</p>;
}

function renderProtected() {
  render(
    <MemoryRouter initialEntries={['/reviews?sort=newest']}>
      <Routes>
        <Route path="/login" element={<LoginProbe />} />
        <Route
          path="/reviews"
          element={
            <ProtectedRoute>
              <RequirePermission permission="review_cases">
                <h1>Review queue</h1>
              </RequirePermission>
            </ProtectedRoute>
          }
        />
      </Routes>
    </MemoryRouter>
  );
}

describe('manager route protection', () => {
  it('redirects a signed-out visitor and remembers the requested URL', async () => {
    useManagerSession.getState().signOut();
    renderProtected();
    expect(await screen.findByText('Return to /reviews?sort=newest')).toBeTruthy();
  });

  it('limits the review queue to the reviewer demo role', () => {
    useManagerSession
      .getState()
      .signIn(authenticateDemoManager('operator@demo.invalid', 'demo123')!);
    const { unmount } = render(
      <MemoryRouter>
        <RequirePermission permission="review_cases">
          <h1>Review queue</h1>
        </RequirePermission>
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: 'Reviewer access required.' })).toBeTruthy();
    unmount();
    useManagerSession
      .getState()
      .signIn(authenticateDemoManager('reviewer@demo.invalid', 'demo123')!);
    render(
      <MemoryRouter>
        <RequirePermission permission="review_cases">
          <h1>Review queue</h1>
        </RequirePermission>
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: 'Review queue' })).toBeTruthy();
  });
});
