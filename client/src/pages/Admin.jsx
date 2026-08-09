import { useEffect, useState } from 'react';
import api from '../api';


export default function Admin() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/posts/admin/stats')
      .then((r) => setStats(r.data))
      .catch((err) => setError(err.response?.data?.error || 'Failed to load stats'));
  }, []);

  if (error) return <div className="container"><p className="error">{error}</p></div>;
  if (!stats) return <div className="container"><p className="muted">Loading…</p></div>;

  return (
    <div className="container">
      <h2>Admin Dashboard</h2>

      <div className="stats-grid">
        <div className="card">
          <div className="muted">Total Users (MySQL)</div>
          <div className="stat-value">{stats.totalUsers}</div>
        </div>
        <div className="card">
          <div className="muted">Total Posts (MongoDB)</div>
          <div className="stat-value">{stats.totalPosts}</div>
        </div>
      </div>

      <div className="card">
        <h3>Posts per Author</h3>
        {stats.byAuthor.length === 0 && <p className="muted">No posts yet.</p>}
        <ul>
          {stats.byAuthor.map((a) => (
            <li key={a.authorId}>
              <b>{a.authorName}</b> (id #{a.authorId}) — {a.count} post(s)
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}


// import { useEffect, useState } from 'react';
// import api from '../api';

// export default function Admin() {
//   const [stats, setStats] = useState(null);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     api.get('/posts/admin/stats')
//       .then((r) => setStats(r.data))
//       .catch((err) => setError(err.response?.data?.error || 'Failed to load stats'));
//   }, []);

//   if (error) return <h2>⛔ {error}</h2>;
//   if (!stats) return <p className="muted">Loading…</p>;

//   return (
//     <div>
//       <h2>Admin Dashboard</h2>

//       <div style={{ display: 'flex', gap: 12 }}>
//         <div className="card" style={{ flex: 1 }}>
//           <div className="muted">Total Users (MySQL)</div>
//           <div style={{ fontSize: 30, fontWeight: 700 }}>{stats.totalUsers}</div>
//         </div>
//         <div className="card" style={{ flex: 1 }}>
//           <div className="muted">Total Posts (MongoDB)</div>
//           <div style={{ fontSize: 30, fontWeight: 700 }}>{stats.totalPosts}</div>
//         </div>
//       </div>

//       <div className="card">
//         <h3>Posts per Author</h3>
//         {stats.byAuthor.length === 0 && <p className="muted">No posts yet.</p>}
//         <ul>
//           {stats.byAuthor.map((a) => (
//             <li key={a.authorId}>
//               <b>{a.authorName}</b> (id #{a.authorId}) — {a.count} post(s)
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// }