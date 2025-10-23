import axios from 'axios';
import { getCookie } from '../utils/cookieUtils';

const apiClient = axios.create({
  // baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  baseURL: process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = getCookie('authToken');

    if (token && !config.headers['Authorization']) {
      config.headers['Authorization'] = `${token}`;
    }

    if (config.data instanceof FormData && typeof FormData !== 'undefined') {
      if (config.headers) {
        delete config.headers['Content-Type'];
        delete config.headers['content-type'];
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
