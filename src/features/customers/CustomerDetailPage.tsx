import { formatDate } from '@/i18n';
import { translate, localize, useLocale } from '@/i18n';
import { Link, useLocation, useParams } from 'react-router-dom';
import { ApiRequestError } from '@/services/apiTypes';
import { useCustomer } from './useCustomer';
export default function CustomerDetailPage() {
  useLocale();
  const { customerId } = useParams();
  const location = useLocation();
  const listSearch = (
    location.state as {
      listSearch?: string;
    } | null
  )?.listSearch;
  const backTo = listSearch?.startsWith('?') ? `/customers${listSearch}` : '/customers';
  const query = useCustomer(customerId ?? '');
  const notFound = query.error instanceof ApiRequestError && query.error.code === 'NOT_FOUND';
  return (
    <div className="page-stack">
      <Link className="back-link" to={backTo}>
        {translate('\u2190 Customer directory')}
      </Link>
      {query.isPending && (
        <p className="query-message" role="status">
          {translate('Loading fictional customer\u2026')}
        </p>
      )}
      {query.isError && (
        <section className="surface empty-state" role="alert">
          <p className="eyebrow">{translate('Customer / {{v0}}', { v0: localize(customerId) })}</p>
          <h1>{localize(notFound ? 'Customer not found' : 'Customer unavailable')}</h1>
          <p>
            {localize(
              query.error instanceof ApiRequestError
                ? query.error.message
                : 'An unexpected demo error occurred.'
            )}
          </p>
          {notFound ? (
            <Link className="button button-primary" to={backTo}>
              {translate('Back to directory')}
            </Link>
          ) : (
            <button className="button button-primary" type="button" onClick={() => query.refetch()}>
              {translate('Try again')}
            </button>
          )}
        </section>
      )}
      {query.isSuccess && (
        <section className="surface record-detail">
          <p className="eyebrow">
            {translate('Customer / {{v0}}', { v0: localize(query.data.data.id) })}
          </p>
          <h1>{localize(query.data.data.displayName)}</h1>
          <dl className="record-grid">
            <div>
              <dt>{translate('Status')}</dt>
              <dd>{localize(query.data.data.status.replace('_', ' '))}</dd>
            </div>
            <div>
              <dt>{translate('Joined')}</dt>
              <dd>{localize(query.data.data.joinedAt)}</dd>
            </div>
            <div>
              <dt>{translate('Last active')}</dt>
              <dd>{localize(query.data.data.lastActiveAt ?? 'No activity yet')}</dd>
            </div>
            <div>
              <dt>{translate('Snapshot updated')}</dt>
              <dd>{localize(formatDate(query.data.updatedAt))}</dd>
            </div>
          </dl>
          <p className="muted">
            {translate(
              'All details are fictional. Use the activity directory to explore the demo records.'
            )}
          </p>
          <Link className="button button-primary" to="/activities">
            {translate('Browse activity records')}
          </Link>
        </section>
      )}
    </div>
  );
}
