import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchClub } from '../services/api';
import { ActivityCard } from '../components/ActivityCard';

export function ClubDetail() {
  const { id } = useParams();
  const [club, setClub] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchClub(id).then(setClub).catch(() => setMessage('Unable to load club details'));
  }, [id]);

  if (!club) {
    return <div className="page-shell">Loading...</div>;
  }

  return (
    <div className="page-shell">
      <div className="detail-header">
        <div>
          <h2>{club.club_name}</h2>
          <p>{club.club_description}</p>
        </div>
      </div>
      <section className="section-full">
        <h3>Club activities</h3>
        <div className="card-grid">
          {club.activities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      </section>
      {message && <div className="alert">{message}</div>}
    </div>
  );
}
