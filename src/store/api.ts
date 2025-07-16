import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add request interceptor to include authorization token
api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    
    // If it's a 401 error, clear token and redirect to login
    if (error.response?.status === 401) {
      console.log('Unauthorized - token expired, redirecting to login');
      
      // Clear the token and user data
      Cookies.remove('token');
      localStorage.removeItem('user');
      
      // Redirect to login page
      window.location.href = '/login';
      
      return Promise.reject(error);
    }
    
    return Promise.reject(error);
  }
);

export default api; 