import { Link, useParams } from 'react-router-dom';
import { ApiRequestError } from '@/services/apiTypes';
import { useActivity } from './useActivities';

export default function ActivityDetailPage() {
  const { activityId } = useParams();
  const query = useActivity(activityId ?? '');
  const notFound = query.error instanceof ApiRequestError && query.error.code === 'NOT_FOUND';
  return (
    <div className="page-stack">
      <Link className="back-link" to="/activities">
        ← Activity records
      </Link>
      {query.isPending && (
        <p className="query-message" role="status">
          Loading fictional activity…
        </p>
      )}
      {query.isError && (
        <section className="surface empty-state" role="alert">
          <p className="eyebrow">Activity / {activityId}</p>
          <h1>{notFound ? 'Activity not found' : 'Activity unavailable'}</h1>
          <p>
            {query.error instanceof ApiRequestError
              ? query.error.message
              : 'An unexpected demo error occurred.'}
          </p>
          {notFound ? (
            <Link className="button button-primary" to="/activities">
              Back to activity
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
          <p className="eyebrow">Activity / {query.data.data.id}</p>
          <h1>{query.data.data.kind} record</h1>
          <dl className="record-grid">
            <div>
              <dt>Status</dt>
              <dd>{query.data.data.status}</dd>
            </div>
            <div>
              <dt>Amount</dt>
              <dd>
                {query.data.data.amount} {query.data.data.currencyCode}
              </dd>
            </div>
            <div>
              <dt>Occurred</dt>
              <dd>{query.data.data.occurredAt.slice(0, 10)}</dd>
            </div>
            <div>
              <dt>Customer</dt>
              <dd>
                <Link to={`/customers/${query.data.data.customerId}`}>
                  {query.data.data.customerId}
                </Link>
              </dd>
            </div>
          </dl>
          <p className="muted">This activity is fictional and cannot trigger a real transaction.</p>
        </section>
      )}
    </div>
  );
}
