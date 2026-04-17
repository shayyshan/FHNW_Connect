import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../services/AuthContext';
import { fetchActivities, fetchProfile, joinActivity, leaveActivity } from '../services/api';
import { ActivityCard } from '../components/ActivityCard';

export function Sports() {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [eventsData, profileData] = await Promise.all([
          fetchActivities({ category: 'Sports' }),
          user ? fetchProfile() : Promise.resolve(null),
        ]);
        setEvents(eventsData);
        setProfile(profileData);
      } catch (error) {
        setMessage('Unable to load sports events');
      }
    };
    load();
  }, [user]);

  const handleToggle = async (activity) => {
    try {
      const joined = profile?.joinedActivities?.some((item) => item.id === activity.id);
      if (joined) {
        await leaveActivity(activity.id);
        setMessage('Left activity');
      } else {
        await joinActivity(activity.id);
        setMessage('Joined activity');
      }
      const [eventsData, profileData] = await Promise.all([fetchActivities({ category: 'Sports' }), fetchProfile()]);
      setEvents(eventsData);
      setProfile(profileData);
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="page-shell">
      <div className="section-full">
        <h2>Sports Planner</h2>
        <p>Track sports events and join the ones that match your schedule.</p>
        {message && <div className="alert">{message}</div>}
        <div className="card-grid">
          {events.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              actionLabel={user ? 'Join / Leave' : 'Login to join'}
              onAction={handleToggle}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
