import { useEffect, useState } from 'react';
import Login from './components/Login';
import Pantry from './components/Pantry';
import Grocery from './components/Grocery';
import Recipes from './components/Recipes';
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

  // A single-page app never reloads, so the document title has to be kept in
  // step by hand. Screen readers announce it on every view change, and it is
  // what labels the browser tab.
  useEffect(() => {
    const titles = {
      pantry: 'Pantry',
      grocery: 'Shopping Cart',
      recipes: 'Recipes',
    };
    document.title = user
      ? `${titles[page]} · PantryPal`
      : 'Log in · PantryPal — track your food and shopping list';
  }, [page, user]);

  async function logout() {
    await api.post('/auth/logout');
    setUser(null);
  }

  if (!ready) return <p className="container mt-4">Loading…</p>;
  if (!user) return <Login onLogin={setUser} />;

  const tab = (key, label) => (
    <button
      className={`app-tab btn btn-sm ${page === key ? 'is-active' : ''}`}
      aria-current={page === key ? 'page' : undefined}
      onClick={() => setPage(key)}
    >
      {label}
    </button>
  );

  return (
    <div className="app d-flex flex-column min-vh-100">
      {/* First tab stop: lets keyboard users jump past the nav. */}
      <a className="skip-link" href="#main">
        Skip to main content
      </a>

      <nav className="app-nav navbar px-3">
        <span className="app-brand navbar-brand mb-0">PantryPal</span>
        <div className="d-flex align-items-center">
          {tab('pantry', 'Pantry')}
          {tab('grocery', 'Shopping Cart')}
          {tab('recipes', 'Recipes')}
          <button className="app-logout btn btn-sm ms-3" onClick={logout}>
            Log out
            <span className="app-username">{user.username}</span>
          </button>
        </div>
      </nav>

      <main
        id="main"
        className="app-main container my-4 flex-grow-1"
        tabIndex={-1}
      >
        {page === 'pantry' && <Pantry />}
        {page === 'grocery' && <Grocery />}
        {page === 'recipes' && <Recipes />}
      </main>

      <footer className="app-footer text-center text-muted py-3">
        © {new Date().getFullYear()} PantryPal. All rights reserved.
      </footer>
    </div>
  );
}

export default App;
