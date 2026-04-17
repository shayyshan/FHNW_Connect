import { Link } from 'react-router-dom';

export function ClubCard({ club, onFavorite, isFavorite }) {
  return (
    <article className="card club-card">
      <div className="club-image" style={{ backgroundImage: `url(${club.image_path || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80'})` }} />
      <div className="card-content">
        <div className="club-header">
          <h3>{club.club_name}</h3>
          <button className={`icon-button ${isFavorite ? 'favored' : ''}`} onClick={() => onFavorite(club)}>{isFavorite ? '★' : '☆'}</button>
        </div>
        <p>{club.club_description}</p>
        <div className="card-footer">{club.activity_count} activities</div>
        <Link className="button button-primary" to={`/clubs/${club.id}`}>View club</Link>
      </div>
    </article>
  );
}
