import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/', // URL of the API from the backend
});

// After login:
const token = localStorage.getItem('token');
api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

export default api;