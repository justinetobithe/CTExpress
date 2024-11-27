import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
    baseURL: process.env.APP_URL || 'https://ctexpress.online',
    // baseURL: process.env.APP_URL || 'http://localhost:8000',

    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('userInfo');
        if (token) {
            const parsedToken = JSON.parse(token);
            config.headers.Authorization = `Bearer ${parsedToken.token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API error: ', error);
        return Promise.reject(error);
    }
);

export default api;
