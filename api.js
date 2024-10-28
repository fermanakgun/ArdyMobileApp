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
const getDeviceToken = async () => await AsyncStorage.getItem('deviceToken'); // Device token'ı almak için yeni fonksiyon
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

// Interceptor: istekten önce token ve deviceToken ekleme
api.interceptors.request.use(
  async (config) => {
    const accessToken = await getAccessToken();
    const deviceToken = await getDeviceToken();  // deviceToken'ı alıyoruz
    if (accessToken) config.headers['Authorization'] = `Bearer ${accessToken}`;
    if (deviceToken) config.headers['DeviceToken'] = deviceToken;  // deviceToken'ı header olarak ekliyoruz
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor: 401 durumunda refresh token kullanarak yeni access token alma
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Eğer 401 durum kodu dönerse ve istek bir login değilse
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      // Eğer istek login değilse refreshToken kullan
      if (!originalRequest._isLoginRequest) {
        originalRequest._retry = true;

        try {
          const newAccessToken = await refreshToken();
          const deviceToken = await getDeviceToken();  // deviceToken'ı alıyoruz
          axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
          axios.defaults.headers.common['DeviceToken'] = deviceToken;

          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          originalRequest.headers['DeviceToken'] = deviceToken;
          return api(originalRequest); // İsteği yeni token ile tekrar gönder
        } catch (err) {
          console.log("Error after RefreshToken:", err);
          await clearTokens();

          // Eğer logout fonksiyonu mevcutsa çağır
          if (logoutFunction) logoutFunction();

          return Promise.reject(err);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
