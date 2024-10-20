import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { createContext,useEffect,useState } from "react";
import { Alert } from "react-native";
import api from "../../api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const[userInfo,setUserInfo]=useState({});
    const[customerInfo,setCustomerInfo]=useState({});
const[isLoading,setIsLoading]=useState(false);
const[splashLoading,setSplashLoading] = useState(false);

    const register = async (name, email, password) => {

//var apiClient= new ApiClient();

// apiClient.get('/example-endpoint', null)
//   .then(response => {
//     // Handle the successful response
//     console.log('API Response:', response.data);
//   })
//   .catch(error => {
//     // Handle errors, including token-related errors
//     console.error('API Error:', error);
//   });

        setIsLoading(true);
        try {
            const response = await axios.post('https://fermantest.free.beeceptor.com/register', {
                name,
                email,
                password,
            });

            const userInfo = response.data;

            // Kullanıcı kaydı başarılı ise
            if (userInfo) {
                setUserInfo(userInfo);
                AsyncStorage.setItem('userInfo',JSON.stringify(userInfo));
                Alert.alert('Kayıt Başarılı', `${JSON.stringify(userInfo)}`);
            } else {
                Alert.alert('Kayıt Başarısız', 'Kullanıcı kaydı sırasında bir hata oluştu.');
            }
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            const errorMessage = error.response ? error.response.data.message : error.message;
            console.error("Registration error:", errorMessage);
            Alert.alert('Kayıt Hatası', errorMessage || 'Bir hata oluştu. Lütfen tekrar deneyin.');
        }
    };

    const login = async(email,password)=>{
        try{
            setIsLoading(true);
            const response = await api.post('auth/login', {
                "username":email,
                "password":password,
            });

            const userInfo = response.data;
    
            // Kullanıcı kaydı başarılı ise
            if (userInfo) {
                setUserInfo(userInfo);
                await AsyncStorage.setItem('access_token', userInfo.Token);
                await AsyncStorage.setItem('refresh_token', userInfo.RefreshToken);
                await AsyncStorage.setItem('userInfo',JSON.stringify(userInfo));

                const getActiveCustomerInfo = await api.post('customer/getActiveCustomerInfo', {});
                await AsyncStorage.setItem('customerInfo',JSON.stringify(getActiveCustomerInfo.data.customer));
                setCustomerInfo(getActiveCustomerInfo.data.customer);
                Alert.alert('Giriş Başarılı', `${JSON.stringify(getActiveCustomerInfo.data.customer.Username)}`);
            } else {
                Alert.alert('Giriş Başarısız', 'Giriş sırasında beklenmedik bir hata oluştu.');
            }
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            if (error.response) {
                console.log('API Error Response:', error.response);
                Alert.alert('Hata', `API Yanıt Hatası: ${error.response.data.message}`);
            } else if (error.request) {
                console.log('API Error Request:', error.request);
                Alert.alert('Hata', 'API ile bağlantı kurulamadı.');
            } else {
                console.log('General Error:', error.message);
                Alert.alert('Hata', `Genel Hata: ${error.message}`);
            }
        }
       
    }

    const logout = async () => {
        try {
            const response =await api.post('/auth/logout'); // API üzerinde logout çağırma
          //await api.clearTokens(); // Localdeki token'ları temizleme
          AsyncStorage.removeItem('userInfo');
          setUserInfo({});
        } catch (error) {
          console.error('Logout error', error);
        }
      };

    const isUserLoggedIn= async ()=>{
        try {
            setSplashLoading(true);
            let userInfo = await AsyncStorage.getItem('userInfo');
            userInfo=JSON.parse(userInfo);
            if(userInfo){
                setUserInfo(userInfo);
            }
            let customerInfo = await AsyncStorage.getItem('customerInfo');
            customerInfo=JSON.parse(customerInfo);
            if(customerInfo){
                setCustomerInfo(customerInfo);
            }
            setSplashLoading(false);
        } catch (errorMessage) {
            setSplashLoading(false);
            console.error("isUserLoggedIn error:", errorMessage);
        }
    }

    useEffect(()=>{
        isUserLoggedIn();
    },[]);

    return (
        <AuthContext.Provider value={{ isLoading,userInfo,customerInfo,splashLoading,register,login,logout }}>
            {children}
        </AuthContext.Provider>
    );
};
