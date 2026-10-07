import { Link } from 'react-router-dom';

export default function CustomersPage() {
  return (
    <div className="page-stack">
      <header className="page-heading">
        <p className="eyebrow">02 / Customers</p>
        <h1>Customer directory</h1>
        <p className="muted">
          The route is in place. Search, filters, and records will use fictional mock data in M2.
        </p>
      </header>
      <section className="surface empty-state">
        <span className="eyebrow">Route preview</span>
        <h2>Explore a detail route</h2>
        <p>This sample identifier is a placeholder; no customer record is loaded yet.</p>
        <Link className="button button-primary" to="/customers/C-0001">
          Open C-0001
        </Link>
      </section>
    </div>
  );
}
