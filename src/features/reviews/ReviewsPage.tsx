import { formatDate } from '@/i18n';
import { translate, localize, useLocale } from '@/i18n';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ApiRequestError } from '@/services/apiTypes';
import type { ReviewDecision } from './types';
import { useReviewDecision, useReviews } from './useReviews';
const actions: readonly {
  decision: ReviewDecision;
  label: string;
}[] = [
  { decision: 'approve', label: 'Approve' },
  { decision: 'request_info', label: 'Request information' },
  { decision: 'reject', label: 'Reject' }
];
export default function ReviewsPage() {
  useLocale();
  const query = useReviews();
  const mutation = useReviewDecision();
  const [selection, setSelection] = useState<{
    caseId: string;
    decision: ReviewDecision;
  } | null>(null);
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [message, setMessage] = useState('');
  async function confirmDecision() {
    if (!selection) return;
    try {
      const result = await mutation.mutateAsync({
        ...selection,
        scenario: simulateFailure ? 'unavailable' : 'normal'
      });
      setMessage(`${result.data.id} updated to ${result.data.status.replace('_', ' ')}.`);
      setSelection(null);
    } catch {
      setMessage('');
    }
  }
  return (
    <div className="page-stack">
      <header className="page-heading">
        <p className="eyebrow">{translate('04 / Review queue')}</p>
        <h1>{translate('Decisions, with context.')}</h1>
        <p className="muted">
          {translate(
            'A reviewer-only demo workflow. Every case and decision is fictional and resets when the application reloads.'
          )}
        </p>
      </header>
      <section className="surface review-panel" aria-label={translate('Fictional review cases')}>
        <div className="review-toolbar">
          <p className="eyebrow">{translate('Queue / mock data only')}</p>
          <label>
            <input
              type="checkbox"
              checked={simulateFailure}
              onChange={(event) => setSimulateFailure(event.target.checked)}
            />
            {translate('Simulate decision failure')}
          </label>
        </div>
        {message && (
          <p className="review-success" role="status">
            {localize(message)}
          </p>
        )}
        {mutation.isError && (
          <p className="review-error" role="alert">
            {localize(
              mutation.error instanceof ApiRequestError
                ? mutation.error.message
                : 'An unexpected demo error occurred.'
            )}
          </p>
        )}
        {query.isPending && (
          <p className="query-message" role="status">
            {translate('Loading fictional review cases\u2026')}
          </p>
        )}
        {query.isError && (
          <div className="query-message" role="alert">
            <strong>{translate('Review queue unavailable')}</strong>
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
        {query.isSuccess && query.data.data.length === 0 && (
          <p className="query-message">{translate('No fictional cases to review.')}</p>
        )}
        {query.isSuccess && query.data.data.length > 0 && (
          <ul className="review-list">
            {query.data.data.map((item) => (
              <li key={item.id} className="review-case">
                <div className="review-case-heading">
                  <div>
                    <span className="eyebrow">{localize(item.id)}</span>
                    <h2>{localize(item.summary)}</h2>
                  </div>
                  <span className={`status-pill status-${item.status}`}>
                    {localize(item.status.replace('_', ' '))}
                  </span>
                </div>
                <p>
                  <Link to={`/customers/${item.customerId}`}>
                    {translate('Customer {{v0}}', { v0: localize(item.customerId) })}
                  </Link>
                  {translate('\u00B7 Submitted {{v0}}', {
                    v0: localize(formatDate(item.submittedAt))
                  })}
                </p>
                {item.status === 'pending' ? (
                  <>
                    <div className="review-actions">
                      {actions.map((action) => (
                        <button
                          key={action.decision}
                          type="button"
                          disabled={mutation.isPending}
                          onClick={() => {
                            mutation.reset();
                            setMessage('');
                            setSelection({ caseId: item.id, decision: action.decision });
                          }}
                        >
                          {translate('{{v0}} {{v1}}', {
                            v0: localize(action.label),
                            v1: localize(item.id)
                          })}
                        </button>
                      ))}
                    </div>
                    {selection?.caseId === item.id && (
                      <div
                        className="review-confirm"
                        role="group"
                        aria-label={localize(`Confirm decision for ${item.id}`)}
                      >
                        <p>
                          {translate(
                            'Confirm {{v0}} for {{v1}}? This changes only fictional demo data.',
                            {
                              v0: localize(
                                actions
                                  .find((action) => action.decision === selection.decision)
                                  ?.label.toLowerCase()
                              ),
                              v1: localize(item.id)
                            }
                          )}
                        </p>
                        <button
                          className="button button-primary"
                          type="button"
                          autoFocus
                          disabled={mutation.isPending}
                          onClick={confirmDecision}
                        >
                          {localize(mutation.isPending ? 'Saving decision…' : 'Confirm decision')}
                        </button>
                        <button
                          type="button"
                          disabled={mutation.isPending}
                          onClick={() => setSelection(null)}
                        >
                          {translate('Cancel')}
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="muted">
                    {translate('Decision recorded {{v0}}. This case is no longer pending.', {
                      v0: localize(item.reviewedAt?.slice(0, 10))
                    })}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
