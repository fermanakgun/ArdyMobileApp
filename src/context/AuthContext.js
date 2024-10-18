import axios from "axios";
import React, { createContext } from "react";
import { Alert } from "react-native";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const register = async (name, email, password) => {
        try {
            const response = await axios.post('https://fermantest.free.beeceptor.com/register', {
                name,
                email,
                password,
            });

            const userInfo = response.data;

            // Kullanıcı kaydı başarılı ise
            if (userInfo) {
                Alert.alert('Kayıt Başarılı', `Kullanıcı başarıyla kaydedildi: ${JSON.stringify(userInfo)}`);
            } else {
                Alert.alert('Kayıt Başarısız', 'Kullanıcı kaydı sırasında bir hata oluştu.');
            }
        } catch (error) {
            const errorMessage = error.response ? error.response.data.message : error.message;
            console.error("Registration error:", errorMessage);
            Alert.alert('Kayıt Hatası', errorMessage || 'Bir hata oluştu. Lütfen tekrar deneyin.');
        }
    };

    return (
        <AuthContext.Provider value={{ register }}>
            {children}
        </AuthContext.Provider>
    );
};
