import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import api, { setLogout } from "../../api"; // setLogout'u ekliyoruz

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState({});
    const [customerInfo, setCustomerInfo] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [splashLoading, setSplashLoading] = useState(false);

    const register = async (name, email, password) => {
        setIsLoading(true);
        try {
            const response = await axios.post('https://fermantest.free.beeceptor.com/register', {
                name,
                email,
                password,
            });

            const userInfo = response.data;
            if (userInfo) {
                setUserInfo(userInfo);
                AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
                Alert.alert('Kayıt Başarılı', `${JSON.stringify(userInfo)}`);
            } else {
                Alert.alert('Kayıt Başarısız', 'Kullanıcı kaydı sırasında bir hata oluştu.');
            }
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            const errorMessage = error.response ? error.response.data.message : error.message;
            Alert.alert('Kayıt Hatası', errorMessage || 'Bir hata oluştu. Lütfen tekrar deneyin.');
        }
    };

    const login = async (email, password) => {
        try {
            setIsLoading(true);
            const response = await api.post('auth/login', {
                "username": email,
                "password": password,
            });

            const userInfo = response.data;
            if (userInfo) {
                setUserInfo(userInfo);
                await AsyncStorage.setItem('access_token', userInfo.Token);
                await AsyncStorage.setItem('refresh_token', userInfo.RefreshToken);
                await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));

                const getActiveCustomerInfo = await api.post('customer/getActiveCustomerInfo', {});
                await AsyncStorage.setItem('customerInfo', JSON.stringify(getActiveCustomerInfo.data.customer));
                setCustomerInfo(getActiveCustomerInfo.data.customer);
                Alert.alert('Giriş Başarılı', `${JSON.stringify(getActiveCustomerInfo.data.customer.Username)}`);
            } else {
                Alert.alert('Giriş Başarısız', 'Giriş sırasında beklenmedik bir hata oluştu.');
            }
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            Alert.alert('Hata', `Beklenmedik bir hata oluştu.Lütfen daha sonra tekrar deneyin.`);
        }
    };

    const logout = async () => {
        try {
            // Sunucuya logout isteği gönder
            await api.post('/auth/logout');
        } catch (error) {
            // Eğer sunucuya erişilemiyorsa veya hata varsa bu kısmı çalıştır
            console.log('Logout sırasında sunucu hatası:', error);
        } finally {
            // Sunucu erişilse de erişilmese de local storage temizlenir ve kullanıcı bilgileri sıfırlanır
            await AsyncStorage.removeItem('access_token');
            await AsyncStorage.removeItem('refresh_token');
            await AsyncStorage.removeItem('userInfo');
            await AsyncStorage.removeItem('customerInfo');
            setUserInfo({});
            setCustomerInfo({});
        }
    };

    const isUserLoggedIn = async () => {
        try {
            setSplashLoading(true); 

            let userInfo = await AsyncStorage.getItem('userInfo');
            if (userInfo) {
                userInfo = JSON.parse(userInfo); 
                setUserInfo(userInfo);
            }

            let customerInfo = await AsyncStorage.getItem('customerInfo');
            if (customerInfo) {
                customerInfo = JSON.parse(customerInfo); 
                setCustomerInfo(customerInfo);
            }
        } catch (errorMessage) {
            Alert.alert('Hata', 'Kullanıcı durumu kontrol edilirken bir hata oluştu.' + JSON.stringify(errorMessage));
        } finally {
            setSplashLoading(false); 
        }
    };

    useEffect(() => {
        isUserLoggedIn();
        setLogout(logout); // logout fonksiyonunu api.js'deki setLogout fonksiyonuna iletin
    }, []);

    return (
        <AuthContext.Provider value={{ isLoading, userInfo, customerInfo, splashLoading, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
