import axios from 'axios';
import Cookies from 'js-cookie';

let isRefreshing = false;
let refreshFailed = false;

// Configure Axios instance
const axiosInstance = axios.create({
  baseURL: 'https://127.0.0.1:8000/api', // API base URL
  withCredentials: true, // To handle credentials like cookies
});

// Request Interceptor to check if isAuthed cookie present
axiosInstance.interceptors.request.use(
  async (config) => {
    const isAuthed = Cookies.get('isAuthedC'); // Or we can use global auth state instead of cookie
    if (isAuthed) refreshFailed = false;
    if (refreshFailed) {
      return Promise.reject({ message: 'Login required', config });
    }

    if (!isAuthed && !refreshFailed) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          await axios.post(
            'https://127.0.0.1:8000/api/auth/token/refresh/',
            {},
            {
              withCredentials: true,
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );

          var inThirtyMinutes = new Date(new Date().getTime() + 29 * 60 * 1000); // Actualy in 29 minutes to be sure
          Cookies.set('isAuthedC', 't', { expires: inThirtyMinutes });
          refreshFailed = false;
        } catch (error) {
          refreshFailed = true;
          console.error('Failed to refresh token:', error);
        } finally {
          isRefreshing = false;
        }
      }
      if (refreshFailed) {
        return Promise.reject({ message: 'Login required', config });
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Export a function for making API requests
export const fetcher = async (url, method = 'GET', data = null, isFormData = false) => {
  try {
    const headers = isFormData ? { 'Content-Type': 'multipart/form-data' } : { 'Content-Type': 'application/json' };

    const response = await axiosInstance({
      url,
      method,
      ...(data && { data }),
      headers,
    });
    return response;
  } catch (error) {
    if (error.message === 'Login required') {
      // You can redirect to the login page or return a specific error
      alert('Login required.');
      // Optionally, redirect to login or handle failed refresh
      // window.location.href = '/login';
      throw new Error('Login required');
    }
    throw error;
  }
};
