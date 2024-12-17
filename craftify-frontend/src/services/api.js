import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/', // URL of the API from the backend
});

// With JWT tokens, here is where I add the headers after login
// Example:
// api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

export default api;