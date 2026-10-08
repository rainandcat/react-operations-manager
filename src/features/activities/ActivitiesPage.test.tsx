// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, useLocation } from 'react-router-dom';
import ActivitiesPage from './ActivitiesPage';

afterEach(cleanup);

function LocationProbe() {
  const location = useLocation();
  return <output data-testid="location">{location.search}</output>;
}

function renderPage(initialEntry = '/activities') {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <ActivitiesPage />
        <LocationProbe />
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe('manager activity records', () => {
  it('corrects a one-page filtered URL without clearing the filter', async () => {
    renderPage('/activities?kind=debit&page=2');
    expect(await screen.findByRole('rowheader', { name: 'A-0003' })).toBeTruthy();
    expect(screen.getByTestId('location').textContent).toBe('?kind=debit');
    expect(screen.queryByText('No records found')).toBeNull();
  });
  it('sorts and filters fictional records', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByRole('rowheader', { name: 'A-0001' });
    await user.selectOptions(screen.getByLabelText('Sort'), 'oldest');
    await screen.findByRole('rowheader', { name: 'A-0008' });
    await user.selectOptions(screen.getByLabelText('Type'), 'debit');
    await waitFor(() => expect(screen.queryByRole('rowheader', { name: 'A-0008' })).toBeNull());
    expect(screen.getByRole('rowheader', { name: 'A-0006' })).toBeTruthy();
  });

  it('shows an empty state and a recoverable service error', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByRole('rowheader', { name: 'A-0001' });
    await user.selectOptions(screen.getByLabelText('Type'), 'debit');
    await user.selectOptions(screen.getByLabelText('Status'), 'declined');
    expect(await screen.findByText('No records found')).toBeTruthy();
    await user.click(screen.getByRole('button', { name: 'Simulate service error' }));
    expect(await screen.findByRole('alert', {}, { timeout: 2000 })).toBeTruthy();
    await user.click(screen.getByRole('button', { name: 'Restore service' }));
    expect(await screen.findByText('No records found')).toBeTruthy();
  });
});
