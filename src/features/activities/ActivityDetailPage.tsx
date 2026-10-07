import { Link, useParams } from 'react-router-dom';

export default function ActivityDetailPage() {
  const { activityId } = useParams();
  return (
    <div className="page-stack">
      <Link className="back-link" to="/activities">
        ← Activity records
      </Link>
      <section className="surface empty-state">
        <p className="eyebrow">Activity route / {activityId}</p>
        <h1>Detail view foundation</h1>
        <p>Typed activity data and error states arrive in M2.</p>
      </section>
    </div>
  );
}
