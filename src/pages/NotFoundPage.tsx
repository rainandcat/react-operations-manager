import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <main className="not-found-shell">
      <p className="eyebrow">404 / No matching page</p>
      <h1>That route is not in this workspace.</h1>
      <Link className="button button-primary" to="/overview">
        Go to overview
      </Link>
    </main>
  );
}
