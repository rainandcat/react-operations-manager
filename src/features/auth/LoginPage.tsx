import { useState, type FormEvent } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authenticateDemoManager } from './demoAuth';
import { useManagerSession } from './sessionStore';

interface LoginLocationState {
  from?: string;
}

export function LoginPage() {
  const [account, setAccount] = useState('reviewer@demo.invalid');
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const session = useManagerSession((state) => state.session);
  const signIn = useManagerSession((state) => state.signIn);
  const location = useLocation();
  const from = (location.state as LoginLocationState | null)?.from;
  const destination =
    from?.startsWith('/') && !from.startsWith('//') && from.split(/[?#]/)[0] !== '/login'
      ? from
      : '/overview';

  if (session) return <Navigate to={destination} replace />;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!account.trim() || !passcode.trim()) {
      setError('Enter a demo account and passcode.');
      return;
    }

    const nextSession = authenticateDemoManager(account, passcode);
    if (!nextSession) {
      setError('Those demo details do not match. Try an account shown below.');
      return;
    }

    signIn(nextSession);
  }

  return (
    <main className="login-shell">
      <section className="login-intro" aria-labelledby="login-title">
        <span className="eyebrow">Operations Suite / Manager</span>
        <h1 id="login-title">Work with clarity.</h1>
        <p>
          Explore a focused operations workspace built with React. Every account and workflow here
          is a demo.
        </p>
        <div className="login-note">
          <strong>Two demo roles</strong>
          <span>Operator can browse. Reviewer can also open the review queue.</span>
        </div>
      </section>

      <section className="login-panel" aria-label="Demo sign in">
        <p className="eyebrow">Demo access</p>
        <h2>Sign in</h2>
        <p className="muted">No real account or backend is used.</p>
        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="account">Demo account</label>
          <input
            id="account"
            name="account"
            type="email"
            autoComplete="username"
            value={account}
            onChange={(event) => {
              setAccount(event.target.value);
              setError('');
            }}
            aria-invalid={Boolean(error)}
          />
          <label htmlFor="passcode">Demo passcode</label>
          <input
            id="passcode"
            name="passcode"
            type="password"
            autoComplete="current-password"
            value={passcode}
            onChange={(event) => {
              setPasscode(event.target.value);
              setError('');
            }}
            aria-invalid={Boolean(error)}
          />
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <button className="button button-primary" type="submit">
            Open workspace
          </button>
        </form>
        <div className="demo-hint">
          <p>
            <strong>Reviewer:</strong> reviewer@demo.invalid
          </p>
          <p>
            <strong>Operator:</strong> operator@demo.invalid
          </p>
          <p>
            <strong>Passcode:</strong> demo123
          </p>
        </div>
      </section>
    </main>
  );
}
