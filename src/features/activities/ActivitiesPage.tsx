import { Link, useSearchParams } from 'react-router-dom';
import { ApiRequestError } from '@/services/apiTypes';
import type { ActivityKind, ActivitySort, ActivityStatus } from './types';
import { useActivities } from './useActivities';

const kinds: readonly ActivityKind[] = ['credit', 'debit', 'transfer'];
const statuses: readonly ActivityStatus[] = ['pending', 'completed', 'declined'];

function readPage(value: string | null): number {
  const page = Number(value);
  return Number.isSafeInteger(page) && page > 0 ? page : 1;
}

export default function ActivitiesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const kind = kinds.find((item) => item === searchParams.get('kind'));
  const status = statuses.find((item) => item === searchParams.get('status'));
  const sort: ActivitySort = searchParams.get('sort') === 'oldest' ? 'oldest' : 'newest';
  const page = readPage(searchParams.get('page'));
  const scenario = searchParams.get('demo') === 'error' ? 'unavailable' : 'normal';
  const query = useActivities({ kind, status, sort, page, pageSize: 5 }, scenario);
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
        <p className="eyebrow">03 / Activity</p>
        <h1>Activity records</h1>
        <p className="muted">Review fictional activity records by type, state and date order.</p>
      </header>

      <section className="surface directory-panel" aria-label="Activity results">
        <div className="directory-controls">
          <div className="field-group">
            <label htmlFor="activity-kind">Type</label>
            <select
              id="activity-kind"
              value={kind ?? ''}
              onChange={(event) => updateParams('kind', event.target.value, true)}
            >
              <option value="">All types</option>
              {kinds.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div className="field-group">
            <label htmlFor="activity-status">Status</label>
            <select
              id="activity-status"
              value={status ?? ''}
              onChange={(event) => updateParams('status', event.target.value, true)}
            >
              <option value="">All statuses</option>
              {statuses.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div className="field-group">
            <label htmlFor="activity-sort">Sort</label>
            <select
              id="activity-sort"
              value={sort}
              onChange={(event) =>
                updateParams('sort', event.target.value === 'oldest' ? 'oldest' : '', true)
              }
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </div>
        </div>
        <div className="directory-meta">
          <p role="status" aria-live="polite">
            {query.isFetching
              ? 'Updating fictional activity…'
              : `${query.data?.total ?? 0} fictional records`}
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
            Loading fictional activity…
          </p>
        )}
        {query.isError && (
          <div className="query-message" role="alert">
            <strong>Activity unavailable</strong>
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
            <strong>No records found</strong>
            <p>Try another type or status.</p>
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
                    <th scope="col">Activity</th>
                    <th scope="col">Customer</th>
                    <th scope="col">Type</th>
                    <th scope="col">Status</th>
                    <th scope="col">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {query.data.data.map((activity) => (
                    <tr key={activity.id}>
                      <th scope="row">
                        <Link to={`/activities/${activity.id}`}>{activity.id}</Link>
                      </th>
                      <td>
                        <Link to={`/customers/${activity.customerId}`}>{activity.customerId}</Link>
                      </td>
                      <td>{activity.kind}</td>
                      <td>
                        <span className="status-pill">{activity.status}</span>
                      </td>
                      <td>{activity.occurredAt.slice(0, 10)}</td>
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
