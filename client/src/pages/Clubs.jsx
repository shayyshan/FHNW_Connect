import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../services/AuthContext';
import { fetchClubs, favoriteClub, fetchProfile, unfavoriteClub } from '../services/api';
import { ClubCard } from '../components/ClubCard';

export function Clubs() {
  const { user } = useContext(AuthContext);
  const [clubs, setClubs] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchClubs().then((data) => {
      setClubs(data);
    }).catch(() => setMessage('Unable to load clubs'));
    if (user) {
      fetchProfile().then((data) => setFavorites(data.favoriteClubs || [])).catch(() => {});
    }
  }, [user]);

  const handleFavorite = async (club) => {
    if (!user) {
      return setMessage('Login to favorite clubs');
    }
    try {
      const isFavorite = favorites.some((item) => item.id === club.id);
      if (isFavorite) {
        await unfavoriteClub(club.id);
      } else {
        await favoriteClub(club.id);
      }
      const profile = await fetchProfile();
      setFavorites(profile.favoriteClubs || []);
      setMessage(isFavorite ? 'Removed from favorites' : 'Club favorited');
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="page-shell">
      <div className="section-full">
        <h2>Clubs</h2>
        {message && <div className="alert">{message}</div>}
        <div className="card-grid">
          {clubs.map((club) => (
            <ClubCard
              key={club.id}
              club={club}
              onFavorite={handleFavorite}
              isFavorite={favorites.some((item) => item.id === club.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
