// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, useLocation } from 'react-router-dom';
import CustomersPage from './CustomersPage';

afterEach(cleanup);

function LocationProbe() {
  const location = useLocation();
  return <output data-testid="location">{location.search}</output>;
}

function renderPage() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/customers']}>
        <CustomersPage />
        <LocationProbe />
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe('customer directory', () => {
  it('shows fictional results and URL-backed pagination', async () => {
    const user = userEvent.setup();
    renderPage();
    expect(screen.getByText('Loading fictional customers…')).toBeTruthy();
    expect(await screen.findByRole('rowheader', { name: 'Avery Stone' })).toBeTruthy();
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(await screen.findByRole('rowheader', { name: 'Casey North' })).toBeTruthy();
    expect(screen.getByTestId('location').textContent).toContain('page=2');
  });

  it('debounces search and shows an empty state', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByRole('rowheader', { name: 'Avery Stone' });
    await user.type(screen.getByRole('searchbox', { name: 'Search customers' }), 'no match');
    expect(await screen.findByText('No customers found')).toBeTruthy();
    expect(screen.getByTestId('location').textContent).toContain('search=no+match');
  });

  it('shows a recoverable demo error', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByRole('rowheader', { name: 'Avery Stone' });
    await user.click(screen.getByRole('button', { name: 'Simulate service error' }));
    const alert = await screen.findByRole('alert');
    expect(within(alert).getByText('Customer list unavailable')).toBeTruthy();
    await user.click(screen.getByRole('button', { name: 'Restore service' }));
    expect(await screen.findByRole('rowheader', { name: 'Avery Stone' })).toBeTruthy();
  });
});
