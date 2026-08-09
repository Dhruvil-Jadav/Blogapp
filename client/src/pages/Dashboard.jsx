import { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({ title: '', content: '', tags: '' });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const { data } = await api.get('/posts');
      setPosts(data);
    } catch {
      setMsg('Could not load posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const create = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      await api.post('/posts', {
        title: form.title,
        content: form.content,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      });
      setForm({ title: '', content: '', tags: '' });
      load();
    } catch (err) {
      setMsg(err.response?.data?.error || 'Failed to create post');
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this post?')) return;
    setMsg('');
    try {
      await api.delete(`/posts/${id}`);
      load();
    } catch (err) {
      setMsg(err.response?.data?.error || 'Delete failed');
    }
  };

  return (
    <div>
      <h2>Welcome, {user.name} 👋</h2>

      <div className="card">
        <h3>Create a post</h3>
        <form onSubmit={create}>
          <input placeholder="Title" value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <textarea placeholder="Content" rows={4} value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })} />
          <input placeholder="Tags (comma separated)" value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })} />
          <button type="submit">Publish</button>
        </form>
      </div>

      {msg && <p className="error">{msg}</p>}

      <h3>All posts {loading ? '' : `(${posts.length})`}</h3>
      {loading && <p className="muted">Loading…</p>}
      {!loading && posts.length === 0 && <p className="muted">No posts yet.</p>}

      {posts.map((p) => {
        const canDelete = p.authorId === user.sub || user.role === 'admin';
        return (
          <div key={p._id} className="card">
            <h4 style={{ margin: '0 0 6px' }}>{p.title}</h4>
            <p style={{ margin: '0 0 8px' }}>{p.content}</p>
            <div className="muted">
              by <b>{p.authorName}</b> · {new Date(p.createdAt).toLocaleString()}
              {p.tags?.length > 0 && ' · ' + p.tags.map((t) => '#' + t).join(' ')}
            </div>
            {canDelete && (
              <button style={{ marginTop: 10, background: '#dc2626' }}
                      onClick={() => remove(p._id)}>
                🗑 Delete
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}