import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ApiRequestError } from '@/services/apiTypes';
import type { ReviewDecision } from './types';
import { useReviewDecision, useReviews } from './useReviews';

const actions: readonly { decision: ReviewDecision; label: string }[] = [
  { decision: 'approve', label: 'Approve' },
  { decision: 'request_info', label: 'Request information' },
  { decision: 'reject', label: 'Reject' }
];

export default function ReviewsPage() {
  const query = useReviews();
  const mutation = useReviewDecision();
  const [selection, setSelection] = useState<{ caseId: string; decision: ReviewDecision } | null>(
    null
  );
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
        <p className="eyebrow">04 / Review queue</p>
        <h1>Decisions, with context.</h1>
        <p className="muted">
          A reviewer-only demo workflow. Every case and decision is fictional and resets when the
          application reloads.
        </p>
      </header>
      <section className="surface review-panel" aria-label="Fictional review cases">
        <div className="review-toolbar">
          <p className="eyebrow">Queue / mock data only</p>
          <label>
            <input
              type="checkbox"
              checked={simulateFailure}
              onChange={(event) => setSimulateFailure(event.target.checked)}
            />{' '}
            Simulate decision failure
          </label>
        </div>
        {message && (
          <p className="review-success" role="status">
            {message}
          </p>
        )}
        {mutation.isError && (
          <p className="review-error" role="alert">
            {mutation.error instanceof ApiRequestError
              ? mutation.error.message
              : 'An unexpected demo error occurred.'}
          </p>
        )}
        {query.isPending && (
          <p className="query-message" role="status">
            Loading fictional review cases…
          </p>
        )}
        {query.isError && (
          <div className="query-message" role="alert">
            <strong>Review queue unavailable</strong>
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
          <p className="query-message">No fictional cases to review.</p>
        )}
        {query.isSuccess && query.data.data.length > 0 && (
          <ul className="review-list">
            {query.data.data.map((item) => (
              <li key={item.id} className="review-case">
                <div className="review-case-heading">
                  <div>
                    <span className="eyebrow">{item.id}</span>
                    <h2>{item.summary}</h2>
                  </div>
                  <span className={`status-pill status-${item.status}`}>
                    {item.status.replace('_', ' ')}
                  </span>
                </div>
                <p>
                  <Link to={`/customers/${item.customerId}`}>Customer {item.customerId}</Link> ·
                  Submitted {item.submittedAt.slice(0, 10)}
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
                          {action.label} {item.id}
                        </button>
                      ))}
                    </div>
                    {selection?.caseId === item.id && (
                      <div
                        className="review-confirm"
                        role="group"
                        aria-label={`Confirm decision for ${item.id}`}
                      >
                        <p>
                          Confirm{' '}
                          {actions
                            .find((action) => action.decision === selection.decision)
                            ?.label.toLowerCase()}{' '}
                          for {item.id}? This changes only fictional demo data.
                        </p>
                        <button
                          className="button button-primary"
                          type="button"
                          autoFocus
                          disabled={mutation.isPending}
                          onClick={confirmDecision}
                        >
                          {mutation.isPending ? 'Saving decision…' : 'Confirm decision'}
                        </button>
                        <button
                          type="button"
                          disabled={mutation.isPending}
                          onClick={() => setSelection(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="muted">
                    Decision recorded {item.reviewedAt?.slice(0, 10)}. This case is no longer
                    pending.
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
