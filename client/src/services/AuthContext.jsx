import { createContext, useEffect, useState } from 'react';
import { fetchMe, login as apiLogin, signup as apiSignup, saveToken, removeToken } from './api';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('fhnw_token');
    if (token) {
      fetchMe()
        .then((data) => setUser(data.user))
        .catch(() => removeToken())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const data = await apiLogin(email, password);
    saveToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const signup = async (username, email, password) => {
    const data = await apiSignup(username, email, password);
    saveToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    removeToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
