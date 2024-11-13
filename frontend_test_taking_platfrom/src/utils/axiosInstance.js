import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000/',
});


axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.log('Session expired. Please log in again.');
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
