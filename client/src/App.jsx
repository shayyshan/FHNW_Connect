import { Navigate, Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home';
import { Clubs } from './pages/Clubs';
import { Sports } from './pages/Sports';
import { Community } from './pages/Community';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { ActivityDetail } from './pages/ActivityDetail';
import { ClubDetail } from './pages/ClubDetail';
import { Layout } from './components/Layout';
import { useContext } from 'react';
import { AuthContext } from './services/AuthContext';

function PrivateRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div className="page-shell">Loading...</div>;
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="clubs" element={<Clubs />} />
        <Route path="clubs/:id" element={<ClubDetail />} />
        <Route path="sports" element={<Sports />} />
        <Route path="community" element={<Community />} />
        <Route path="activities/:id" element={<ActivityDetail />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
