import { formatDate } from '@/i18n';
import { translate, localize, useLocale } from '@/i18n';
import { useEffect } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
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
  useLocale();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const kind = kinds.find((item) => item === searchParams.get('kind'));
  const status = statuses.find((item) => item === searchParams.get('status'));
  const sort: ActivitySort = searchParams.get('sort') === 'oldest' ? 'oldest' : 'newest';
  const page = readPage(searchParams.get('page'));
  const scenario = searchParams.get('demo') === 'error' ? 'unavailable' : 'normal';
  const query = useActivities({ kind, status, sort, page, pageSize: 5 }, scenario);
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
        <p className="eyebrow">{translate('03 / Activity')}</p>
        <h1>{translate('Activity records')}</h1>
        <p className="muted">
          {translate('Review fictional activity records by type, state and date order.')}
        </p>
      </header>

      <section className="surface directory-panel" aria-label={translate('Activity results')}>
        <div className="directory-controls">
          <div className="field-group">
            <label htmlFor="activity-kind">{translate('Type')}</label>
            <select
              id="activity-kind"
              value={kind ?? ''}
              onChange={(event) => updateParams('kind', event.target.value, true)}
            >
              <option value="">{translate('All types')}</option>
              {kinds.map((item) => (
                <option key={item} value={item}>
                  {localize(item)}
                </option>
              ))}
            </select>
          </div>
          <div className="field-group">
            <label htmlFor="activity-status">{translate('Status')}</label>
            <select
              id="activity-status"
              value={status ?? ''}
              onChange={(event) => updateParams('status', event.target.value, true)}
            >
              <option value="">{translate('All statuses')}</option>
              {statuses.map((item) => (
                <option key={item} value={item}>
                  {localize(item)}
                </option>
              ))}
            </select>
          </div>
          <div className="field-group">
            <label htmlFor="activity-sort">{translate('Sort')}</label>
            <select
              id="activity-sort"
              value={sort}
              onChange={(event) =>
                updateParams('sort', event.target.value === 'oldest' ? 'oldest' : '', true)
              }
            >
              <option value="newest">{translate('Newest first')}</option>
              <option value="oldest">{translate('Oldest first')}</option>
            </select>
          </div>
        </div>
        <div className="directory-meta">
          <p role="status" aria-live="polite">
            {localize(
              query.isFetching
                ? 'Updating fictional activity…'
                : `${query.data?.total ?? 0} fictional records`
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
            {translate('Loading fictional activity\u2026')}
          </p>
        )}
        {query.isError && (
          <div className="query-message" role="alert">
            <strong>{translate('Activity unavailable')}</strong>
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
            <strong>{translate('No records found')}</strong>
            <p>{translate('Try another type or status.')}</p>
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
                    <th scope="col">{translate('Activity')}</th>
                    <th scope="col">{translate('Customer')}</th>
                    <th scope="col">{translate('Type')}</th>
                    <th scope="col">{translate('Status')}</th>
                    <th scope="col">{translate('Date')}</th>
                  </tr>
                </thead>
                <tbody>
                  {query.data.data.map((activity) => (
                    <tr key={activity.id}>
                      <th scope="row">
                        <Link
                          to={`/activities/${activity.id}`}
                          state={{ listSearch: location.search }}
                        >
                          {localize(activity.id)}
                        </Link>
                      </th>
                      <td>
                        <Link to={`/customers/${activity.customerId}`}>
                          {localize(activity.customerId)}
                        </Link>
                      </td>
                      <td>{localize(activity.kind)}</td>
                      <td>
                        <span className="status-pill">{localize(activity.status)}</span>
                      </td>
                      <td>{localize(formatDate(activity.occurredAt))}</td>
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
