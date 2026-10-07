import { Link, useParams } from 'react-router-dom';

export default function CustomerDetailPage() {
  const { customerId } = useParams();
  return (
    <div className="page-stack">
      <Link className="back-link" to="/customers">
        ← Customer directory
      </Link>
      <section className="surface empty-state">
        <p className="eyebrow">Customer route / {customerId}</p>
        <h1>Detail view foundation</h1>
        <p>Customer data and not-found handling arrive with the mock API in M2.</p>
      </section>
    </div>
  );
}
