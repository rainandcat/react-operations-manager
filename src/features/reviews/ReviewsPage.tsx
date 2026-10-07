export default function ReviewsPage() {
  return (
    <div className="page-stack">
      <header className="page-heading">
        <p className="eyebrow">04 / Review queue</p>
        <h1>Decisions, with context.</h1>
        <p className="muted">
          Reviewer-only navigation works now. Fictional cases and decisions will be added after the
          mock API.
        </p>
      </header>
      <section className="surface empty-state">
        <span className="eyebrow">Reviewer workspace</span>
        <h2>No cases in this release</h2>
        <p>
          The queue is a navigation and permission preview. No review mutation is available yet.
        </p>
      </section>
    </div>
  );
}
