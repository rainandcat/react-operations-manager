import { Link } from 'react-router-dom';
import { ApiRequestError } from '@/services/apiTypes';
import { useManagerSession } from '@/features/auth/sessionStore';
import { useDashboard } from './useDashboard';

export default function OverviewPage() {
  const query = useDashboard();
  const canReview = useManagerSession((state) =>
    Boolean(state.session?.permissions.includes('review_cases'))
  );

  return (
    <div className="page-stack">
      <header className="page-heading">
        <p className="eyebrow">01 / Overview</p>
        <h1>A calmer view of operations.</h1>
        <p className="muted">
          A snapshot of fictional customers, activity, and decisions. No real operational data is
          used.
        </p>
      </header>
      {query.isPending && (
        <p className="query-message" role="status">
          Loading fictional dashboard…
        </p>
      )}
      {query.isError && (
        <section className="surface empty-state" role="alert">
          <h2>Dashboard unavailable</h2>
          <p>
            {query.error instanceof ApiRequestError
              ? query.error.message
              : 'An unexpected demo error occurred.'}
          </p>
          <button className="button button-primary" type="button" onClick={() => query.refetch()}>
            Try again
          </button>
        </section>
      )}
      {query.isSuccess && (
        <>
          <section className="metric-grid" aria-label="Operational summary">
            <Link className="surface metric-card" to="/customers">
              <span>Customers</span>
              <strong>{query.data.data.summary.customerCount}</strong>
              <small>View fictional directory ↗</small>
            </Link>
            <Link className="surface metric-card" to="/activities">
              <span>Activity records</span>
              <strong>{query.data.data.summary.activityCount}</strong>
              <small>View fictional records ↗</small>
            </Link>
            {canReview && (
              <Link className="surface metric-card" to="/reviews">
                <span>Pending reviews</span>
                <strong>{query.data.data.summary.pendingReviewCount}</strong>
                <small>Open review queue ↗</small>
              </Link>
            )}
          </section>
          <section className="surface recent-panel">
            <div className="recent-heading">
              <div>
                <p className="eyebrow">Latest fictional records</p>
                <h2>Recent activity</h2>
              </div>
              <span>
                Updated {query.data.data.summary.updatedAt.slice(0, 16).replace('T', ' ')} UTC
              </span>
            </div>
            {query.data.data.recentActivity.length === 0 ? (
              <p>No recent activity in this snapshot.</p>
            ) : (
              <ul>
                {query.data.data.recentActivity.map((activity) => (
                  <li key={activity.id}>
                    <Link to={`/activities/${activity.id}`}>
                      {activity.id} · {activity.kind}
                    </Link>
                    <span>{activity.occurredAt.slice(0, 10)}</span>
                    <Link to={`/customers/${activity.customerId}`}>{activity.customerId}</Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
      <div className="preview-grid">
        <section className="surface feature-card">
          <span className="feature-number">01</span>
          <h2>Find a customer</h2>
          <p>Search, filter and inspect fictional customers.</p>
          <Link to="/customers">
            Open customers <span aria-hidden="true">↗</span>
          </Link>
        </section>
        <section className="surface feature-card">
          <span className="feature-number">02</span>
          <h2>Review activity</h2>
          <p>Filter fictional records and inspect their details.</p>
          <Link to="/activities">
            Open activity <span aria-hidden="true">↗</span>
          </Link>
        </section>
        {canReview && (
          <section className="surface feature-card">
            <span className="feature-number">03</span>
            <h2>Clear a queue</h2>
            <p>Review fictional cases with an explicit confirmation step.</p>
            <Link to="/reviews">
              Open review queue <span aria-hidden="true">↗</span>
            </Link>
          </section>
        )}
      </div>
      <section className="surface roadmap-strip">
        <span className="eyebrow">Current release</span>
        <strong>Mock data · Dashboard and review workflow</strong>
        <span>No live account or transaction data.</span>
      </section>
    </div>
  );
}
