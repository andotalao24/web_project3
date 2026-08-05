import { useState } from 'react';
import PropTypes from 'prop-types';
import { api } from '../api';
import './Login.css';

// Eight decorative floating icons. The emoji themselves live in Login.css so
// they are CSS decoration rather than page content — nothing for a screen
// reader to reach, and nothing that is "visible but hidden".
const FLOATER_COUNT = 8;

function Login({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function submit(e) {
    e.preventDefault();
    setError('');
    try {
      const path = mode === 'login' ? '/auth/login' : '/auth/register';
      onLogin(await api.post(path, { username, password }));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="login-page">
      {/* Decorative background, deliberately OUTSIDE <main>: it is not part
          of the page's primary content. The icons themselves are CSS. */}
      <div className="login-floaters">
        {Array.from({ length: FLOATER_COUNT }, (_, i) => (
          <span key={i} className={`floater floater-${i}`} />
        ))}
      </div>

      {/* <main> holds only the sign-in form — the unique content of this page. */}
      <main className="login-main">
        <form
          className="login-card card p-4 shadow"
          onSubmit={submit}
          aria-label={mode === 'login' ? 'Log in' : 'Create an account'}
        >
          <h1 className="login-title h3 text-center">PantryPal</h1>
          <p className="login-tagline text-center text-muted small mb-4">
            Track your food. Waste less. Shop smarter.
          </p>

          {/* Announces the switch between logging in and registering, which is
            otherwise only visible as changed button text. */}
          <p className="visually-hidden" aria-live="polite">
            {mode === 'login'
              ? 'Log in form shown.'
              : 'Create an account form shown.'}
          </p>

          <label className="form-label pp-field-label" htmlFor="login-username">
            Username
          </label>
          <input
            id="login-username"
            className="form-control mb-2"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <label className="form-label pp-field-label" htmlFor="login-password">
            Password
          </label>
          <input
            id="login-password"
            className="form-control mb-2"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <p className="text-danger small" role="alert">
              {error}
            </p>
          )}

          <button className="btn btn-success mb-2" type="submit">
            {mode === 'login' ? 'Log in' : 'Register'}
          </button>
          <button
            type="button"
            className="btn btn-link btn-sm"
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
          >
            {mode === 'login'
              ? 'Need an account? Register'
              : 'Have an account? Log in'}
          </button>
        </form>
      </main>
    </div>
  );
}

Login.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default Login;
