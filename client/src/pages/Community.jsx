import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../services/AuthContext';
import { createPost, deletePost, fetchPosts, fetchProfile, updatePost } from '../services/api';
import { PostCard } from '../components/PostCard';

export function Community() {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', category: '', keywords: '' });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchPosts();
        setPosts(data);
        if (user) {
          const profileData = await fetchProfile();
          setProfile(profileData);
        }
      } catch (error) {
        setMessage('Unable to load community posts');
      }
    };
    load();
  }, [user]);

  const refreshPosts = async () => {
    const data = await fetchPosts();
    setPosts(data);
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      if (!user) {
        return setMessage('Login to post');
      }
      if (editingId) {
        await updatePost(editingId, form);
        setEditingId(null);
      } else {
        await createPost(form);
      }
      setForm({ title: '', description: '', category: '', keywords: '' });
      setMessage('Post saved');
      refreshPosts();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleEdit = (post) => {
    setEditingId(post.id);
    setForm({ title: post.title, description: post.description, category: post.category, keywords: post.keywords });
  };

  const handleDelete = async (id) => {
    try {
      await deletePost(id);
      refreshPosts();
      setMessage('Post deleted');
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="page-shell">
      <div className="section-full">
        <h2>Community Board</h2>
        <p>See announcements, discussions, and club updates from across campus.</p>
        {message && <div className="alert">{message}</div>}
        {user ? (
          <form className="post-form" onSubmit={handleSubmit}>
            <label>
              Title
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </label>
            <label>
              Category
              <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            </label>
            <label>
              Description
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </label>
            <label>
              Keywords
              <input value={form.keywords} onChange={(e) => setForm({ ...form, keywords: e.target.value })} placeholder="art, event, club" />
            </label>
            <button className="button button-primary" type="submit">{editingId ? 'Update Post' : 'Create Post'}</button>
          </form>
        ) : (
          <div className="alert">Login to create community posts.</div>
        )}
        <div className="card-grid">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              isOwner={user?.id === post.user_id}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
