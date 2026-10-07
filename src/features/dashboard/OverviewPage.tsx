import { Link } from 'react-router-dom';

export default function OverviewPage() {
  return (
    <div className="page-stack">
      <header className="page-heading">
        <p className="eyebrow">01 / Overview</p>
        <h1>A calmer view of operations.</h1>
        <p className="muted">
          The navigation and access flows are ready. Summary data will arrive with the local mock
          API.
        </p>
      </header>
      <div className="preview-grid">
        <section className="surface feature-card">
          <span className="feature-number">01</span>
          <h2>Find a customer</h2>
          <p>Search and filtering join this workspace in the next milestone.</p>
          <Link to="/customers">
            Open customers <span aria-hidden="true">↗</span>
          </Link>
        </section>
        <section className="surface feature-card">
          <span className="feature-number">02</span>
          <h2>Review activity</h2>
          <p>A typed mock service will power activity records and details.</p>
          <Link to="/activities">
            Open activity <span aria-hidden="true">↗</span>
          </Link>
        </section>
        <section className="surface feature-card">
          <span className="feature-number">03</span>
          <h2>Clear a queue</h2>
          <p>Reviewer access is already demonstrated; decisions follow later.</p>
          <Link to="/reviews">
            Open review queue <span aria-hidden="true">↗</span>
          </Link>
        </section>
      </div>
      <section className="surface roadmap-strip">
        <span className="eyebrow">Current release</span>
        <strong>M1 · Navigation & demo access</strong>
        <span>No live account or transaction data.</span>
      </section>
    </div>
  );
}
