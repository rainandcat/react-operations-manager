// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { ReviewApiProvider } from './ReviewApiProvider';
import ReviewsPage from './ReviewsPage';

afterEach(cleanup);

function renderPage() {
  render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
    >
      <ReviewApiProvider>
        <MemoryRouter>
          <ReviewsPage />
        </MemoryRouter>
      </ReviewApiProvider>
    </QueryClientProvider>
  );
}

describe('review queue', () => {
  it('requires confirmation and then removes a decided case from pending actions', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('R-1001');
    await user.click(screen.getByRole('button', { name: 'Approve R-1001' }));
    const confirmation = screen.getByRole('group', { name: 'Confirm decision for R-1001' });
    expect(within(confirmation).getByText(/Confirm approve/)).toBeTruthy();
    await user.click(within(confirmation).getByRole('button', { name: 'Cancel' }));
    expect(screen.queryByRole('group', { name: 'Confirm decision for R-1001' })).toBeNull();
    await user.click(screen.getByRole('button', { name: 'Approve R-1001' }));
    await user.click(
      within(screen.getByRole('group', { name: 'Confirm decision for R-1001' })).getByRole(
        'button',
        { name: 'Confirm decision' }
      )
    );
    expect(await screen.findByText('R-1001 updated to approved.')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Approve R-1001' })).toBeNull();
  });

  it('shows a recoverable error without changing the case', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('R-1002');
    await user.click(screen.getByRole('checkbox', { name: 'Simulate decision failure' }));
    await user.click(screen.getByRole('button', { name: 'Reject R-1002' }));
    await user.click(screen.getByRole('button', { name: 'Confirm decision' }));
    expect(await screen.findByRole('alert')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Reject R-1002' })).toBeTruthy();
  });
});
