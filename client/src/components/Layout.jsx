import { NavLink, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../services/AuthContext';

export function Layout() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">FHNWConnect</div>
        <nav>
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>Home</NavLink>
          <NavLink to="/clubs" className={({ isActive }) => (isActive ? 'active' : '')}>Clubs</NavLink>
          <NavLink to="/sports" className={({ isActive }) => (isActive ? 'active' : '')}>Sports</NavLink>
          <NavLink to="/community" className={({ isActive }) => (isActive ? 'active' : '')}>Community</NavLink>
        </nav>
      </aside>
      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <h1>FHNWConnect</h1>
            <p>Discover campus activities and connect with student clubs.</p>
          </div>
          <div className="topbar-actions">
            {user ? (
              <>
                <span className="user-chip">{user.username}</span>
                <button className="button button-secondary" onClick={logout}>Logout</button>
              </>
            ) : (
              <div className="auth-links">
                <NavLink to="/login">Login</NavLink>
                <NavLink to="/signup">Sign Up</NavLink>
              </div>
            )}
          </div>
        </header>
        <Outlet />
      </main>
    </div>
  );
}
