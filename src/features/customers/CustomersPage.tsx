import { Link, useSearchParams } from 'react-router-dom';
import { ApiRequestError } from '@/services/apiTypes';
import type { CustomerStatus } from './types';
import { useCustomers } from './useCustomers';
import { useDebouncedValue } from './useDebouncedValue';

const statuses: readonly CustomerStatus[] = ['active', 'restricted', 'pending_review'];

function readPage(value: string | null): number {
  const page = Number(value);
  return Number.isSafeInteger(page) && page > 0 ? page : 1;
}

function readStatus(value: string | null): CustomerStatus | undefined {
  return statuses.find((status) => status === value);
}

export default function CustomersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchInput = searchParams.get('search') ?? '';
  const search = useDebouncedValue(searchInput, 300);
  const status = readStatus(searchParams.get('status'));
  const sort = searchParams.get('sort') === 'name_asc' ? 'name_asc' : 'joined_oldest';
  const page = readPage(searchParams.get('page'));
  const scenario = searchParams.get('demo') === 'error' ? 'unavailable' : 'normal';
  const query = useCustomers({ search, status, sort, page, pageSize: 5 }, scenario);
  const totalPages = Math.max(1, Math.ceil((query.data?.total ?? 0) / 5));

  function updateParams(key: string, value: string, resetPage = false) {
    setSearchParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        if (value) next.set(key, value);
        else next.delete(key);
        if (resetPage) next.delete('page');
        return next;
      },
      { replace: true }
    );
  }

  return (
    <div className="page-stack">
      <header className="page-heading">
        <p className="eyebrow">02 / Customers</p>
        <h1>Customer directory</h1>
        <p className="muted">
          Search and filter eight fictional records. All results come from an in-browser mock
          service.
        </p>
      </header>

      <section className="surface directory-panel" aria-label="Customer results">
        <div className="directory-controls">
          <div className="field-group">
            <label htmlFor="customer-search">Search customers</label>
            <input
              id="customer-search"
              type="search"
              value={searchInput}
              onChange={(event) => updateParams('search', event.target.value, true)}
              placeholder="Name or demo ID"
            />
          </div>
          <div className="field-group">
            <label htmlFor="customer-status">Status</label>
            <select
              id="customer-status"
              value={status ?? ''}
              onChange={(event) => updateParams('status', event.target.value, true)}
            >
              <option value="">All statuses</option>
              <option value="active">Active</option>
              <option value="restricted">Restricted</option>
              <option value="pending_review">Pending review</option>
            </select>
          </div>
          <div className="field-group">
            <label htmlFor="customer-sort">Sort</label>
            <select
              id="customer-sort"
              value={sort}
              onChange={(event) =>
                updateParams('sort', event.target.value === 'name_asc' ? 'name_asc' : '', true)
              }
            >
              <option value="joined_oldest">Joined: oldest first</option>
              <option value="name_asc">Name: A to Z</option>
            </select>
          </div>
        </div>
        <div className="directory-meta">
          <p role="status" aria-live="polite">
            {searchInput !== search || query.isFetching
              ? 'Updating fictional records…'
              : `${query.data?.total ?? 0} fictional customers`}
          </p>
          <button
            className="demo-action"
            type="button"
            onClick={() => updateParams('demo', scenario === 'normal' ? 'error' : '')}
          >
            {scenario === 'normal' ? 'Simulate service error' : 'Restore service'}
          </button>
        </div>

        {query.isPending && (
          <p className="query-message" role="status">
            Loading fictional customers…
          </p>
        )}
        {query.isError && (
          <div className="query-message" role="alert">
            <strong>Customer list unavailable</strong>
            <p>
              {query.error instanceof ApiRequestError
                ? query.error.message
                : 'An unexpected demo error occurred.'}
            </p>
            <button className="button button-primary" type="button" onClick={() => query.refetch()}>
              Try again
            </button>
          </div>
        )}
        {query.isSuccess && query.data.data.length === 0 && (
          <div className="query-message">
            <strong>No customers found</strong>
            <p>Try a different search or status.</p>
            <button
              className="demo-action"
              type="button"
              onClick={() => setSearchParams(new URLSearchParams(), { replace: true })}
            >
              Clear filters
            </button>
          </div>
        )}
        {query.isSuccess && query.data.data.length > 0 && (
          <>
            <div className="table-scroll">
              <table className="directory-table">
                <thead>
                  <tr>
                    <th scope="col">Customer</th>
                    <th scope="col">Demo ID</th>
                    <th scope="col">Status</th>
                    <th scope="col">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {query.data.data.map((customer) => (
                    <tr key={customer.id}>
                      <th scope="row">
                        <Link to={`/customers/${customer.id}`}>{customer.displayName}</Link>
                      </th>
                      <td>{customer.id}</td>
                      <td>
                        <span className={`status-pill status-${customer.status}`}>
                          {customer.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td>{customer.joinedAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="pagination">
              <span>
                Page {page} of {totalPages}
              </span>
              <div>
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => updateParams('page', String(page - 1))}
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => updateParams('page', String(page + 1))}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
