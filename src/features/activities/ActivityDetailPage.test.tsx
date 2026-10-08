// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ActivityDetailPage from './ActivityDetailPage';

afterEach(cleanup);

function renderDetail(activityId: string) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[`/activities/${activityId}`]}>
        <Routes>
          <Route path="/activities/:activityId" element={<ActivityDetailPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe('manager activity detail', () => {
  it('loads a fictional record', async () => {
    renderDetail('A-0001');
    expect(await screen.findByRole('heading', { name: 'credit record' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'C-0001' })).toBeTruthy();
  });

  it('reports an unknown ID', async () => {
    renderDetail('A-9999');
    expect(await screen.findByRole('heading', { name: 'Activity not found' })).toBeTruthy();
  });
});
