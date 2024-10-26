import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

// API base URL (API'nizin URL'sini girin)
let API_URL = 'https://pratikyonetim.com/api';

if (__DEV__ && false) {
  API_URL = 'http://localhost:40647/api';
}

// Axios instance oluşturma
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Access ve refresh token'ları AsyncStorage'dan alıyoruz
const getAccessToken = async () => {
  return await AsyncStorage.getItem('access_token');
};

const getRefreshToken = async () => {
  return await AsyncStorage.getItem('refresh_token');
};

// Access token'ı AsyncStorage'a kaydetme
const setAccessToken = async (token) => {
  await AsyncStorage.setItem('access_token', token);
};

// Refresh token'ı AsyncStorage'a kaydetme
const setRefreshToken = async (token) => {
  await AsyncStorage.setItem('refresh_token', token);
};

// Access token ve refresh token'ları temizlemek için logout işlemi
const clearTokens = async () => {
  await AsyncStorage.removeItem('access_token');
  await AsyncStorage.removeItem('refresh_token');
};

// Access token süresi dolduğunda refresh token ile yeni bir token alıyoruz
const refreshToken = async () => {
  try {
    const refresh_token = await getRefreshToken();
    const response = await axios.post(`${API_URL}/auth/refresh-token`, {
      refreshToken: refresh_token,
    });

    const { Token: newAccessToken, RefreshToken: newRefreshToken } = response.data;

    // Yeni access ve refresh token'ları kaydet
    await setAccessToken(newAccessToken);
    await setRefreshToken(newRefreshToken);

    return newAccessToken;
  } catch (error) {
    console.log("Error refreshing token:", error); // Console log
    // Alert.alert("Error refreshing token", JSON.stringify(error));
    throw error; // Token yenilenmezse hata fırlatıyoruz
  }
};

// Axios interceptor ile istekten önce access token ekleme
api.interceptors.request.use(
  async (config) => {
    const accessToken = await getAccessToken();
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Axios interceptor ile hatalı yanıt durumunda refresh token kullanarak yeni access token alma
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Eğer access token süresi dolmuşsa ve yanıt 401 ise
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Bu isteği tekrar göndermeyi işaretliyoruz

      try {
        const newAccessToken = await refreshToken();
        axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        return api(originalRequest); // İsteği yeni token ile tekrar gönder
      } catch (err) {
        console.log("Error after RefreshToken:", err); // Console log
        // Alert.alert("RefreshTokenSonrasında", JSON.stringify(err));
        
        // Refresh token süresi dolmuşsa veya başka bir hata varsa token'ları temizliyoruz
        await clearTokens();
        return Promise.reject(err);
      }
    }

    return Promise.reject(error); // Diğer hatalar için reddet
  }
);

export default api;
