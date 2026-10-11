import { LanguageSelector } from '@/i18n/LanguageSelector';
import { translate, localize, useLocale } from '@/i18n';
import { Suspense } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useManagerSession } from '@/features/auth/sessionStore';
const links = [
  { to: '/overview', label: 'Overview', shortLabel: '01' },
  { to: '/customers', label: 'Customers', shortLabel: '02' },
  { to: '/activities', label: 'Activity', shortLabel: '03' },
  { to: '/reviews', label: 'Review queue', shortLabel: '04' }
] as const;
export function ManagerLayout() {
  useLocale();
  const session = useManagerSession((state) => state.session);
  const signOut = useManagerSession((state) => state.signOut);
  const navigate = useNavigate();
  function handleSignOut() {
    signOut();
    navigate('/login', { replace: true });
  }
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        {translate('Skip to content')}
      </a>
      <aside className="sidebar" aria-label={translate('Workspace navigation')}>
        <div className="brand">
          <span className="brand-mark">O</span>
          <span>
            Operations
            <br />
            Manager
          </span>
        </div>
        <p className="sidebar-caption">{translate('Workspace')}</p>
        <nav className="primary-nav" aria-label={translate('Primary')}>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `nav-link${isActive ? ' is-active' : ''}`}
            >
              <span className="nav-index" aria-hidden="true">
                {localize(link.shortLabel)}
              </span>
              {localize(link.label)}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-foot">
          {translate('Built for focused decisions')}
          <br />
          <span>{translate('Demo environment')}</span>
        </div>
      </aside>

      <div className="workspace">
        <header className="topbar">
          <div>
            <span className="eyebrow">{translate('Operations workspace')}</span>
            <strong>{translate('Manager console')}</strong>
          </div>
          <div className="topbar-actions">
            <LanguageSelector />
            <span className="identity">{localize(session?.displayName)}</span>
            <button className="button button-secondary" type="button" onClick={handleSignOut}>
              {translate('Sign out')}
            </button>
          </div>
        </header>
        <main id="main-content" className="workspace-content">
          <Suspense
            fallback={
              <div className="page-loading" role="status">
                {translate('Loading page\u2026')}
              </div>
            }
          >
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
