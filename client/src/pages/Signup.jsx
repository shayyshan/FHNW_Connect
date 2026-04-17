import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../services/AuthContext';

export function Signup() {
  const { signup } = useContext(AuthContext);
  const [username, setUsername] = useState('student');
  const [email, setEmail] = useState('student@example.com');
  const [password, setPassword] = useState('Password123');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await signup(username, email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page-shell">
      <div className="auth-panel">
        <h2>Sign Up</h2>
        {error && <div className="alert">{error}</div>}
        <form onSubmit={handleSubmit}>
          <label>
            Username
            <input value={username} onChange={(e) => setUsername(e.target.value)} required />
          </label>
          <label>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label>
            Password
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          <button className="button button-primary" type="submit">Create account</button>
        </form>
      </div>
    </div>
  );
}
