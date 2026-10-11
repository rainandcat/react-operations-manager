import { translate, useLocale } from '@/i18n';
import { Link } from 'react-router-dom';
export function NotFoundPage() {
  useLocale();
  return (
    <main className="not-found-shell">
      <p className="eyebrow">{translate('404 / No matching page')}</p>
      <h1>{translate('That route is not in this workspace.')}</h1>
      <Link className="button button-primary" to="/overview">
        {translate('Go to overview')}
      </Link>
    </main>
  );
}
