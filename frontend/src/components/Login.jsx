import { useState } from 'react';
import PropTypes from 'prop-types';
import { api } from '../api';
import './Login.css';

// Decorative floating food icons for the login backdrop.
const FLOATERS = ['🥕', '🍞', '🧀', '🍅', '🥚', '🥦', '🍎', '🥫'];

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
      {/* floating background icons (decorative only) */}
      <div className="login-floaters" aria-hidden="true">
        {FLOATERS.map((f, i) => (
          <span key={i} className={`floater floater-${i}`}>
            {f}
          </span>
        ))}
      </div>

      <form className="login-card card p-4 shadow" onSubmit={submit}>
        <div className="login-logo">🥫</div>
        <h1 className="login-title h3 text-center">PantryPal</h1>
        <p className="login-tagline text-center text-muted small mb-4">
          Track your food. Waste less. Shop smarter.
        </p>

        <input
          className="form-control mb-2"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          className="form-control mb-2"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="text-danger small">{error}</p>}

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
    </div>
  );
}

Login.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default Login;
