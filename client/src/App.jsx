import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';

function Nav() {
  const { user, logout } = useAuth();
  if (!user) return null;

  return (
    <nav style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 20 }}>
      <Link to="/dashboard">Dashboard</Link>
      {user.role === 'admin' && <Link to="/admin">Admin</Link>}
      <span style={{ marginLeft: 'auto' }} className="muted">
        {user.name} · {user.role}
      </span>
      <button onClick={logout}>Logout</button>
    </nav>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <h1>📝 Blogapp</h1>
        <Nav />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
          />
          <Route
            path="/admin"
            element={<ProtectedRoute roles={['admin']}><Admin /></ProtectedRoute>}
          />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}