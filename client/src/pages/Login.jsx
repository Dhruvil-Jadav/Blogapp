import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Login to Blogapp</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={submit}>
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={change} required />
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={change} required />
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in…' : 'Login'}
          </button>
        </form>
        <p className="muted">No account? <Link to="/register">Register</Link></p>
      </div>
    </div>
  );
}


//Old code for reference
// import { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// export default function Login() {
//   const [form, setForm] = useState({ email: '', password: '' });
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//   const submit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);
//     try {
//       await login(form.email, form.password);
//       navigate('/dashboard');
//     } catch (err) {
//       setError(err.response?.data?.error || 'Login failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="card">
//       <h2>Login to Blogapp</h2>
//       {error && <p className="error">{error}</p>}
//       <form onSubmit={submit}>
//         <input name="email" type="email" placeholder="Email" value={form.email} onChange={change} />
//         <input name="password" type="password" placeholder="Password"
//                value={form.password} onChange={change} />
//         <button type="submit" disabled={loading}>
//           {loading ? 'Logging in…' : 'Login'}
//         </button>
//       </form>
//       <p className="muted">No account? <Link to="/register">Register</Link></p>
//     </div>
//   );
// }