import { Link } from 'react-router-dom';

export default function ActivitiesPage() {
  return (
    <div className="page-stack">
      <header className="page-heading">
        <p className="eyebrow">03 / Activity</p>
        <h1>Activity records</h1>
        <p className="muted">
          A future mock service will provide searchable activity states and detail pages.
        </p>
      </header>
      <section className="surface empty-state">
        <span className="eyebrow">Route preview</span>
        <h2>Explore a detail route</h2>
        <p>This sample identifier demonstrates dynamic routing; no activity data is loaded yet.</p>
        <Link className="button button-primary" to="/activities/A-0001">
          Open A-0001
        </Link>
      </section>
    </div>
  );
}
