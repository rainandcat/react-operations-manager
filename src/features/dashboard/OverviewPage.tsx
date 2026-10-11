import { formatDate } from '@/i18n';
import { translate, localize, useLocale } from '@/i18n';
import { Link } from 'react-router-dom';
import { ApiRequestError } from '@/services/apiTypes';
import { useManagerSession } from '@/features/auth/sessionStore';
import { useDashboard } from './useDashboard';
export default function OverviewPage() {
  useLocale();
  const query = useDashboard();
  const canReview = useManagerSession((state) =>
    Boolean(state.session?.permissions.includes('review_cases'))
  );
  return (
    <div className="page-stack">
      <header className="page-heading">
        <p className="eyebrow">{translate('01 / Overview')}</p>
        <h1>{translate('A calmer view of operations.')}</h1>
        <p className="muted">
          {translate(
            'A snapshot of fictional customers, activity, and decisions. No real operational data is used.'
          )}
        </p>
      </header>
      {query.isPending && (
        <p className="query-message" role="status">
          {translate('Loading fictional dashboard\u2026')}
        </p>
      )}
      {query.isError && (
        <section className="surface empty-state" role="alert">
          <h2>{translate('Dashboard unavailable')}</h2>
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
        </section>
      )}
      {query.isSuccess && (
        <>
          <section className="metric-grid" aria-label={translate('Operational summary')}>
            <Link className="surface metric-card" to="/customers">
              <span>{translate('Customers')}</span>
              <strong>{localize(query.data.data.summary.customerCount)}</strong>
              <small>{translate('View fictional directory \u2197')}</small>
            </Link>
            <Link className="surface metric-card" to="/activities">
              <span>{translate('Activity records')}</span>
              <strong>{localize(query.data.data.summary.activityCount)}</strong>
              <small>{translate('View fictional records \u2197')}</small>
            </Link>
            {canReview && (
              <Link className="surface metric-card" to="/reviews">
                <span>{translate('Pending reviews')}</span>
                <strong>{localize(query.data.data.summary.pendingReviewCount)}</strong>
                <small>{translate('Open review queue \u2197')}</small>
              </Link>
            )}
          </section>
          <section className="surface recent-panel">
            <div className="recent-heading">
              <div>
                <p className="eyebrow">{translate('Latest fictional records')}</p>
                <h2>{translate('Recent activity')}</h2>
              </div>
              <span>
                {translate('Updated {{v0}} UTC', {
                  v0: localize(query.data.data.summary.updatedAt.slice(0, 16).replace('T', ' '))
                })}
              </span>
            </div>
            {query.data.data.recentActivity.length === 0 ? (
              <p>{translate('No recent activity in this snapshot.')}</p>
            ) : (
              <ul>
                {query.data.data.recentActivity.map((activity) => (
                  <li key={activity.id}>
                    <Link to={`/activities/${activity.id}`}>
                      {translate('{{v0}} \u00B7 {{v1}}', {
                        v0: localize(activity.id),
                        v1: localize(activity.kind)
                      })}
                    </Link>
                    <span>{localize(formatDate(activity.occurredAt))}</span>
                    <Link to={`/customers/${activity.customerId}`}>
                      {localize(activity.customerId)}
                    </Link>
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
          <h2>{translate('Find a customer')}</h2>
          <p>{translate('Search, filter and inspect fictional customers.')}</p>
          <Link to="/customers">
            {translate('Open customers')}
            <span aria-hidden="true">↗</span>
          </Link>
        </section>
        <section className="surface feature-card">
          <span className="feature-number">02</span>
          <h2>{translate('Review activity')}</h2>
          <p>{translate('Filter fictional records and inspect their details.')}</p>
          <Link to="/activities">
            {translate('Open activity')}
            <span aria-hidden="true">↗</span>
          </Link>
        </section>
        {canReview && (
          <section className="surface feature-card">
            <span className="feature-number">03</span>
            <h2>{translate('Clear a queue')}</h2>
            <p>{translate('Review fictional cases with an explicit confirmation step.')}</p>
            <Link to="/reviews">
              {translate('Open review queue')}
              <span aria-hidden="true">↗</span>
            </Link>
          </section>
        )}
      </div>
      <section className="surface roadmap-strip">
        <span className="eyebrow">{translate('Current release')}</span>
        <strong>{translate('Mock data \u00B7 Dashboard and review workflow')}</strong>
        <span>{translate('No live account or transaction data.')}</span>
      </section>
    </div>
  );
}
