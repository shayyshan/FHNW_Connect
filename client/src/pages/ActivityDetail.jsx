import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchActivity, joinActivity, leaveActivity } from '../services/api';

export function ActivityDetail() {
  const { id } = useParams();
  const [activity, setActivity] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchActivity(id).then(setActivity).catch(() => setMessage('Unable to load activity'));
  }, [id]);

  const handleToggle = async () => {
    try {
      if (!activity) return;
      await joinActivity(activity.id);
      setMessage('Joined activity');
    } catch (error) {
      setMessage(error.message);
    }
  };

  if (!activity) {
    return <div className="page-shell">Loading...</div>;
  }

  return (
    <div className="page-shell">
      <div className="detail-header">
        <div>
          <h2>{activity.activity_title}</h2>
          <p>{activity.activity_description}</p>
          <div className="detail-meta">
            <span>{activity.activity_category}</span>
            <span>{new Date(activity.activity_date).toLocaleDateString()}</span>
            <span>{activity.start_time} - {activity.end_time}</span>
            <span>{activity.activity_location}</span>
          </div>
        </div>
        <div className="detail-panel">
          <div><strong>Club:</strong> {activity.club.club_name}</div>
          <div><strong>Participants:</strong> {activity.participant_count}/{activity.max_slots}</div>
          <button className="button button-primary" onClick={handleToggle}>Join activity</button>
        </div>
      </div>
      {message && <div className="alert">{message}</div>}
    </div>
  );
}
