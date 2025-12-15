import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', {
    name: userData.username,
    email: userData.email,
    password: userData.password
  }),
};

export const matchesAPI = {
  getAll: () => api.get('/matches'),
  getById: (id) => api.get(`/matches/${id}`),
  create: (match) => api.post('/matches', match),
  update: (id, match) => api.put(`/matches/${id}`, match),
  delete: (id) => api.delete(`/matches/${id}`),
};

export const teamsAPI = {
  getAll: () => api.get('/teams'),
  create: (team) => api.post('/teams', team),
};

export const usersAPI = {
  getAll: () => api.get('/users'),
  update: (id, user) => api.put(`/users/${id}`, user),
  delete: (id) => api.delete(`/users/${id}`),
};

export const betsAPI = {
  getAll: () => api.get('/bets'),
  create: (bet) => api.post('/bets', bet),
};

export default api;