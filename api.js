import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

let API_URL = 'https://pratikyonetim.com/api';
if (__DEV__) {
  API_URL = 'http://localhost:40647/api';
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let logoutFunction = null; // Başlangıçta null, daha sonra AuthContext ile set edilecek

// AuthContext'ten logout fonksiyonunu almak için
export const setLogout = (logout) => {
  logoutFunction = logout;
};

// Access ve refresh token işlemleri
const getAccessToken = async () => await AsyncStorage.getItem('access_token');
const getRefreshToken = async () => await AsyncStorage.getItem('refresh_token');
const setAccessToken = async (token) => await AsyncStorage.setItem('access_token', token);
const setRefreshToken = async (token) => await AsyncStorage.setItem('refresh_token', token);
const clearTokens = async () => {
  await AsyncStorage.removeItem('access_token');
  await AsyncStorage.removeItem('refresh_token');
};

const refreshToken = async () => {
  try {
    const refresh_token = await getRefreshToken();
    const response = await axios.post(`${API_URL}/auth/refresh-token`, {
      refreshToken: refresh_token,
    });

    const { Token: newAccessToken, RefreshToken: newRefreshToken } = response.data;
    await setAccessToken(newAccessToken);
    await setRefreshToken(newRefreshToken);
    return newAccessToken;
  } catch (error) {
    console.log("Error refreshing token:", error);
    throw error;
  }
};

// Interceptor: istekten önce token ekleme
api.interceptors.request.use(
  async (config) => {
    const accessToken = await getAccessToken();
    if (accessToken) config.headers['Authorization'] = `Bearer ${accessToken}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor: 401 durumunda refresh token kullanarak yeni access token alma
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Eğer access token süresi dolmuşsa ve yanıt 401 ise
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshToken();
        axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return api(originalRequest); // İsteği yeni token ile tekrar gönder
      } catch (err) {
        console.log("Error after RefreshToken:", err);
        await clearTokens();

        // Eğer logout fonksiyonu mevcutsa çağır
        if (logoutFunction) logoutFunction();
        
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
