import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: 'https://algotradexmind.com/server/api',
});

// Add request interceptor to include the token
api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default {
  // Strategy endpoints
  createStrategy(data) {
    return api.post('/user/strategies', data);
  },
  getStrategies(params = {}) {
    return api.get('/user/my-strategies', { params });
  },
  getStrategyById(id) {
    return api.get(`/user/strategies/${id}`);
  },
  updateStrategyStatus(id, status) {
    return api.patch(`/user/strategies/status/${id}`, `status=${status}`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  },
  // Add other API calls as needed
};