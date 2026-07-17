import { useEffect, useState } from 'react';
import Login from './components/Login';
import Pantry from './components/Pantry';
import Grocery from './components/Grocery';
import Suggestions from './components/Suggestions';
import { api } from './api';
import './App.css';

// Top-level component: holds auth state and the current page.
function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('pantry');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/user', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
        setUser(null);
      } finally {
        setReady(true);
      }
    };

    fetchUser();
  }, []);

  async function logout() {
    await api.post('/auth/logout');
    setUser(null);
  }

  if (!ready) return <p className="container mt-4">Loading…</p>;
  if (!user) return <Login onLogin={setUser} />;

  const tab = (key, label) => (
    <button
      className={`btn btn-sm me-2 ${
        page === key ? 'btn-light' : 'btn-outline-light'
      }`}
      onClick={() => setPage(key)}
    >
      {label}
    </button>
  );

  return (
    <div className="app d-flex flex-column min-vh-100">
      <nav className="app-nav navbar navbar-dark bg-success px-3">
        <span className="navbar-brand mb-0">🥫 PantryPal</span>
        <div className="d-flex align-items-center">
          {tab('pantry', 'Pantry')}
          {tab('grocery', 'Grocery')}
          {tab('suggestions', 'Suggestions')}
          <button className="btn btn-sm btn-danger ms-2" onClick={logout}>
            Log out ({user.username})
          </button>
        </div>
      </nav>

      <main className="app-main container my-4 flex-grow-1">
        {page === 'pantry' && <Pantry />}
        {page === 'grocery' && <Grocery />}
        {page === 'suggestions' && <Suggestions />}
      </main>

      <footer className="app-footer text-center text-muted py-3">
        © {new Date().getFullYear()} PantryPal. All rights reserved.
      </footer>
    </div>
  );
}

export default App;
