const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

function getToken() {
  return localStorage.getItem('fhnw_token');
}

function request(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return fetch(`${API_BASE}${path}`, { ...options, headers }).then(async (response) => {
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }
    return data;
  });
}

export async function login(email, password) {
  return request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
}

export async function signup(username, email, password) {
  return request('/auth/signup', { method: 'POST', body: JSON.stringify({ username, email, password }) });
}

export async function fetchMe() {
  return request('/auth/me');
}

export async function fetchActivities(params = {}) {
  const query = new URLSearchParams(params).toString();
  return request(`/activities?${query}`, { method: 'GET' });
}

export async function fetchActivity(id) {
  return request(`/activities/${id}`);
}

export async function joinActivity(id) {
  return request(`/activities/${id}/join`, { method: 'POST' });
}

export async function leaveActivity(id) {
  return request(`/activities/${id}/leave`, { method: 'POST' });
}

export async function favoriteClub(id) {
  return request(`/clubs/${id}/favorite`, { method: 'POST' });
}

export async function unfavoriteClub(id) {
  return request(`/clubs/${id}/favorite`, { method: 'DELETE' });
}

export async function fetchClubs() {
  return request('/clubs', { method: 'GET' });
}

export async function fetchClub(id) {
  return request(`/clubs/${id}`);
}

export async function fetchPosts(params = {}) {
  const query = new URLSearchParams(params).toString();
  return request(`/posts?${query}`, { method: 'GET' });
}

export async function createPost(data) {
  return request('/posts', { method: 'POST', body: JSON.stringify(data) });
}

export async function updatePost(id, data) {
  return request(`/posts/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export async function deletePost(id) {
  return request(`/posts/${id}`, { method: 'DELETE' });
}

export async function fetchProfile() {
  return request('/users/me');
}

export async function favoriteActivity(id) {
  return request(`/activities/${id}/favorite`, { method: 'POST' });
}

export async function unfavoriteActivity(id) {
  return request(`/activities/${id}/favorite`, { method: 'DELETE' });
}

export function saveToken(token) {
  localStorage.setItem('fhnw_token', token);
}

export function removeToken() {
  localStorage.removeItem('fhnw_token');
}
