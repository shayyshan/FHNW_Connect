import { useContext, useEffect, useMemo, useState } from 'react';
import { AuthContext } from '../services/AuthContext';
import { fetchActivities, fetchClubs, fetchProfile, joinActivity, leaveActivity } from '../services/api';
import { ActivityCard } from '../components/ActivityCard';
import { SearchBar } from '../components/SearchBar';

export function Home() {
  const { user } = useContext(AuthContext);
  const [activities, setActivities] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [search, setSearch] = useState('');
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchActivities({ search }).then(setActivities).catch(() => setMessage('Unable to load activities'));
    fetchClubs().then(setClubs).catch(() => setMessage('Unable to load clubs'));
    if (user) {
      fetchProfile().then((data) => setProfile(data)).catch(() => setMessage('Unable to load profile'));
    }
  }, [user, search]);

  const featured = useMemo(() => activities.slice(0, 4), [activities]);
  const upcoming = useMemo(() => activities.filter((activity) => new Date(activity.activity_date) >= new Date()).slice(0, 5), [activities]);
  const favoriteClubs = useMemo(() => profile?.favoriteClubs || [], [profile]);

  const handleJoinLeave = async (activity) => {
    try {
      if (activity.participant_count >= activity.max_slots) {
        return setMessage('This activity is full');
      }
      const isJoined = profile?.joinedActivities?.some((item) => item.id === activity.id);
      if (isJoined) {
        await leaveActivity(activity.id);
        setMessage('Left activity');
      } else {
        await joinActivity(activity.id);
        setMessage('Joined activity');
      }
      const results = await fetchActivities({ search });
      setActivities(results);
      if (user) {
        const data = await fetchProfile();
        setProfile(data);
      }
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="page-shell">
      <div className="home-hero">
        <div>
          <h2>Find campus activities, clubs, and events.</h2>
          <p>Browse upcoming programs and personalize your campus plan.</p>
        </div>
        <SearchBar value={search} onChange={setSearch} placeholder="Search activities, clubs, or locations" />
      </div>

      {message && <div className="alert">{message}</div>}

      <section className="section-grid">
        <div className="panel">
          <h3>Upcoming activities</h3>
          <div className="card-grid">
            {upcoming.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                actionLabel={user ? 'Join / Leave' : 'Login to join'}
                onAction={handleJoinLeave}
              />
            ))}
          </div>
        </div>
        <div className="panel">
          <h3>Favorites</h3>
          <div className="small-panel">
            <h4>Favorite clubs</h4>
            {favoriteClubs.length > 0 ? (
              favoriteClubs.map((club) => <p key={club.id}>{club.club_name}</p>)
            ) : (
              <p>Favorite a club to personalize your dashboard.</p>
            )}
          </div>
          <div className="small-panel">
            <h4>Suggested activities</h4>
            {featured.map((activity) => (
              <article key={activity.id} className="list-item">
                <strong>{activity.activity_title}</strong>
                <span>{activity.activity_category}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-full">
        <h3>All activities</h3>
        <div className="card-grid">
          {activities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              actionLabel={user ? 'Join / Leave' : 'Login to join'}
              onAction={handleJoinLeave}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
