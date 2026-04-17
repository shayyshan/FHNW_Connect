export function PostCard({ post, onEdit, onDelete, isOwner }) {
  return (
    <article className="card post-card">
      <div className="post-header">
        <div>
          <h3>{post.title}</h3>
          <p className="card-meta">{post.category} · {post.club?.club_name || 'Community'} · {new Date(post.created_at).toLocaleDateString()}</p>
        </div>
        {isOwner && (
          <div className="post-actions">
            <button className="button button-tertiary" onClick={() => onEdit(post)}>Edit</button>
            <button className="button button-danger" onClick={() => onDelete(post.id)}>Delete</button>
          </div>
        )}
      </div>
      <p>{post.description}</p>
      {post.keywords && <div className="tag-bar">{post.keywords.split(',').map((tag) => <span key={tag.trim()} className="tag">#{tag.trim()}</span>)}</div>}
    </article>
  );
}
