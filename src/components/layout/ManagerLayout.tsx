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
        Skip to content
      </a>
      <aside className="sidebar" aria-label="Workspace navigation">
        <div className="brand">
          <span className="brand-mark">O</span>
          <span>
            Operations
            <br />
            Manager
          </span>
        </div>
        <p className="sidebar-caption">Workspace</p>
        <nav className="primary-nav" aria-label="Primary">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `nav-link${isActive ? ' is-active' : ''}`}
            >
              <span className="nav-index" aria-hidden="true">
                {link.shortLabel}
              </span>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-foot">
          Built for focused decisions
          <br />
          <span>Demo environment</span>
        </div>
      </aside>

      <div className="workspace">
        <header className="topbar">
          <div>
            <span className="eyebrow">Operations workspace</span>
            <strong>Manager console</strong>
          </div>
          <div className="topbar-actions">
            <span className="identity">{session?.displayName}</span>
            <button className="button button-secondary" type="button" onClick={handleSignOut}>
              Sign out
            </button>
          </div>
        </header>
        <main id="main-content" className="workspace-content">
          <Suspense
            fallback={
              <div className="page-loading" role="status">
                Loading page…
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
