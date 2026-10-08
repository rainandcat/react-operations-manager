// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import CustomerDetailPage from './CustomerDetailPage';

afterEach(cleanup);

function renderDetail(customerId: string) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[`/customers/${customerId}`]}>
        <Routes>
          <Route path="/customers/:customerId" element={<CustomerDetailPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe('customer detail', () => {
  it('loads the fictional customer by ID', async () => {
    renderDetail('C-0001');
    expect(screen.getByText('Loading fictional customer…')).toBeTruthy();
    expect(await screen.findByRole('heading', { name: 'Avery Stone' })).toBeTruthy();
  });

  it('shows a useful not-found destination', async () => {
    renderDetail('C-9999');
    expect(await screen.findByRole('heading', { name: 'Customer not found' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Back to directory' })).toBeTruthy();
  });
});
