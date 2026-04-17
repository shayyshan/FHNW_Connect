import { Link } from 'react-router-dom';

export function ActivityCard({ activity, onAction, actionLabel, favoriteAction, isFavorite }) {
  return (
    <article className="card activity-card">
      <div className="card-image" style={{ backgroundImage: `url(${activity.image_path || 'https://images.unsplash.com/photo-1516387938699-a93567ec168e?auto=format&fit=crop&w=800&q=80'})` }} />
      <div className="card-content">
        <div className="card-meta">{activity.activity_category} · {activity.activity_location}</div>
        <h3>{activity.activity_title}</h3>
        <p>{activity.activity_description}</p>
        <div className="card-footer">
          <small>{new Date(activity.activity_date).toLocaleDateString()} {activity.start_time}</small>
          <span>{activity.participant_count}/{activity.max_slots} joined</span>
        </div>
        <div className="card-actions">
          <Link className="button button-primary" to={`/activities/${activity.id}`}>Details</Link>
          {actionLabel && <button className="button button-secondary" onClick={() => onAction(activity)}>{actionLabel}</button>}
          {favoriteAction && <button className={`icon-button ${isFavorite ? 'favored' : ''}`} onClick={() => favoriteAction(activity)}>{isFavorite ? '★' : '☆'}</button>}
        </div>
      </div>
    </article>
  );
}
