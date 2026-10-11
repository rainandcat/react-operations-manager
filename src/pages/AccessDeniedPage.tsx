import { translate, useLocale } from '@/i18n';
import { Link } from 'react-router-dom';
export function AccessDeniedPage() {
  useLocale();
  return (
    <section className="surface empty-state">
      <p className="eyebrow">{translate('Access limited')}</p>
      <h1>{translate('Reviewer access required.')}</h1>
      <p>
        {translate('This demo role can browse the workspace but cannot open the review queue.')}
      </p>
      <Link className="button button-primary" to="/overview">
        {translate('Back to overview')}
      </Link>
    </section>
  );
}
