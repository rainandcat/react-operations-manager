import { Link } from 'react-router-dom';

export function AccessDeniedPage() {
  return (
    <section className="surface empty-state">
      <p className="eyebrow">Access limited</p>
      <h1>Reviewer access required.</h1>
      <p>This demo role can browse the workspace but cannot open the review queue.</p>
      <Link className="button button-primary" to="/overview">
        Back to overview
      </Link>
    </section>
  );
}
