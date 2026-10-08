import { Link, useLocation, useParams } from 'react-router-dom';
import { ApiRequestError } from '@/services/apiTypes';
import { useCustomer } from './useCustomer';

export default function CustomerDetailPage() {
  const { customerId } = useParams();
  const location = useLocation();
  const listSearch = (location.state as { listSearch?: string } | null)?.listSearch;
  const backTo = listSearch?.startsWith('?') ? `/customers${listSearch}` : '/customers';
  const query = useCustomer(customerId ?? '');
  const notFound = query.error instanceof ApiRequestError && query.error.code === 'NOT_FOUND';

  return (
    <div className="page-stack">
      <Link className="back-link" to={backTo}>
        ← Customer directory
      </Link>
      {query.isPending && (
        <p className="query-message" role="status">
          Loading fictional customer…
        </p>
      )}
      {query.isError && (
        <section className="surface empty-state" role="alert">
          <p className="eyebrow">Customer / {customerId}</p>
          <h1>{notFound ? 'Customer not found' : 'Customer unavailable'}</h1>
          <p>
            {query.error instanceof ApiRequestError
              ? query.error.message
              : 'An unexpected demo error occurred.'}
          </p>
          {notFound ? (
            <Link className="button button-primary" to={backTo}>
              Back to directory
            </Link>
          ) : (
            <button className="button button-primary" type="button" onClick={() => query.refetch()}>
              Try again
            </button>
          )}
        </section>
      )}
      {query.isSuccess && (
        <section className="surface record-detail">
          <p className="eyebrow">Customer / {query.data.data.id}</p>
          <h1>{query.data.data.displayName}</h1>
          <dl className="record-grid">
            <div>
              <dt>Status</dt>
              <dd>{query.data.data.status.replace('_', ' ')}</dd>
            </div>
            <div>
              <dt>Joined</dt>
              <dd>{query.data.data.joinedAt}</dd>
            </div>
            <div>
              <dt>Last active</dt>
              <dd>{query.data.data.lastActiveAt ?? 'No activity yet'}</dd>
            </div>
            <div>
              <dt>Snapshot updated</dt>
              <dd>{query.data.updatedAt.slice(0, 10)}</dd>
            </div>
          </dl>
          <p className="muted">
            All details are fictional. Use the activity directory to explore the demo records.
          </p>
          <Link className="button button-primary" to="/activities">
            Browse activity records
          </Link>
        </section>
      )}
    </div>
  );
}
