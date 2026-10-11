import { translate, localize, useLocale } from '@/i18n';
import { useEffect } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
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
  useLocale();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchInput = searchParams.get('search') ?? '';
  const search = useDebouncedValue(searchInput, 300);
  const status = readStatus(searchParams.get('status'));
  const sort = searchParams.get('sort') === 'name_asc' ? 'name_asc' : 'joined_oldest';
  const page = readPage(searchParams.get('page'));
  const scenario = searchParams.get('demo') === 'error' ? 'unavailable' : 'normal';
  const query = useCustomers({ search, status, sort, page, pageSize: 5 }, scenario);
  const totalPages = Math.max(1, Math.ceil((query.data?.total ?? 0) / 5));
  const pageOutOfRange = query.isSuccess && !query.isPlaceholderData && page > totalPages;
  useEffect(() => {
    if (!pageOutOfRange) return;
    setSearchParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        if (totalPages === 1) next.delete('page');
        else next.set('page', String(totalPages));
        return next;
      },
      { replace: true }
    );
  }, [pageOutOfRange, setSearchParams, totalPages]);
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
        <p className="eyebrow">{translate('02 / Customers')}</p>
        <h1>{translate('Customer directory')}</h1>
        <p className="muted">
          {translate(
            'Search and filter eight fictional records. All results come from an in-browser mock service.'
          )}
        </p>
      </header>

      <section className="surface directory-panel" aria-label={translate('Customer results')}>
        <div className="directory-controls">
          <div className="field-group">
            <label htmlFor="customer-search">{translate('Search customers')}</label>
            <input
              id="customer-search"
              type="search"
              value={searchInput}
              onChange={(event) => updateParams('search', event.target.value, true)}
              placeholder={translate('Name or demo ID')}
            />
          </div>
          <div className="field-group">
            <label htmlFor="customer-status">{translate('Status')}</label>
            <select
              id="customer-status"
              value={status ?? ''}
              onChange={(event) => updateParams('status', event.target.value, true)}
            >
              <option value="">{translate('All statuses')}</option>
              <option value="active">{translate('Active')}</option>
              <option value="restricted">{translate('Restricted')}</option>
              <option value="pending_review">{translate('Pending review')}</option>
            </select>
          </div>
          <div className="field-group">
            <label htmlFor="customer-sort">{translate('Sort')}</label>
            <select
              id="customer-sort"
              value={sort}
              onChange={(event) =>
                updateParams('sort', event.target.value === 'name_asc' ? 'name_asc' : '', true)
              }
            >
              <option value="joined_oldest">{translate('Joined: oldest first')}</option>
              <option value="name_asc">{translate('Name: A to Z')}</option>
            </select>
          </div>
        </div>
        <div className="directory-meta">
          <p role="status" aria-live="polite">
            {localize(
              searchInput !== search || query.isFetching
                ? 'Updating fictional records…'
                : `${query.data?.total ?? 0} fictional customers`
            )}
          </p>
          <button
            className="demo-action"
            type="button"
            onClick={() => updateParams('demo', scenario === 'normal' ? 'error' : '')}
          >
            {localize(scenario === 'normal' ? 'Simulate service error' : 'Restore service')}
          </button>
        </div>

        {query.isPending && (
          <p className="query-message" role="status">
            {translate('Loading fictional customers\u2026')}
          </p>
        )}
        {query.isError && (
          <div className="query-message" role="alert">
            <strong>{translate('Customer list unavailable')}</strong>
            <p>
              {localize(
                query.error instanceof ApiRequestError
                  ? query.error.message
                  : 'An unexpected demo error occurred.'
              )}
            </p>
            <button className="button button-primary" type="button" onClick={() => query.refetch()}>
              {translate('Try again')}
            </button>
          </div>
        )}
        {pageOutOfRange && (
          <p role="status">{translate('Moving to the last available page\u2026')}</p>
        )}
        {query.isSuccess && !pageOutOfRange && query.data.data.length === 0 && (
          <div className="query-message">
            <strong>{translate('No customers found')}</strong>
            <p>{translate('Try a different search or status.')}</p>
            <button
              className="demo-action"
              type="button"
              onClick={() => setSearchParams(new URLSearchParams(), { replace: true })}
            >
              {translate('Clear filters')}
            </button>
          </div>
        )}
        {query.isSuccess && !pageOutOfRange && query.data.data.length > 0 && (
          <>
            <div className="table-scroll">
              <table className="directory-table">
                <thead>
                  <tr>
                    <th scope="col">{translate('Customer')}</th>
                    <th scope="col">{translate('Demo ID')}</th>
                    <th scope="col">{translate('Status')}</th>
                    <th scope="col">{translate('Joined')}</th>
                  </tr>
                </thead>
                <tbody>
                  {query.data.data.map((customer) => (
                    <tr key={customer.id}>
                      <th scope="row">
                        <Link
                          to={`/customers/${customer.id}`}
                          state={{ listSearch: location.search }}
                        >
                          {localize(customer.displayName)}
                        </Link>
                      </th>
                      <td>{localize(customer.id)}</td>
                      <td>
                        <span className={`status-pill status-${customer.status}`}>
                          {localize(customer.status.replace('_', ' '))}
                        </span>
                      </td>
                      <td>{localize(customer.joinedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="pagination">
              <span>
                {translate('Page {{v0}} of {{v1}}', {
                  v0: localize(page),
                  v1: localize(totalPages)
                })}
              </span>
              <div>
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => updateParams('page', String(page - 1))}
                >
                  {translate('Previous')}
                </button>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => updateParams('page', String(page + 1))}
                >
                  {translate('Next')}
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
