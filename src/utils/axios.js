import axios from 'axios';
// import store from '../store';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000',
});

// axiosInstance.interceptors.request.use(
//   (config) => {
//     const { token } = store.state.auth;

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

export default axiosInstance;