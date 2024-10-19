import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { createContext,useEffect,useState } from "react";
import { Alert } from "react-native";
import { ApiClient } from "../../api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const[userInfo,setUserInfo]=useState({});
const[isLoading,setIsLoading]=useState(false);
const[splashLoading,setSplashLoading] = useState(false);

    const register = async (name, email, password) => {

var apiClient= new ApiClient();

apiClient.get('/example-endpoint', null)
  .then(response => {
    // Handle the successful response
    console.log('API Response:', response.data);
  })
  .catch(error => {
    // Handle errors, including token-related errors
    console.error('API Error:', error);
  });

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
            const response = await axios.post('https://fermantest.free.beeceptor.com/login', {
                email,
                password,
            });
            const userInfo = response.data;
    
            // Kullanıcı kaydı başarılı ise
            if (userInfo) {
                setUserInfo(userInfo);
                AsyncStorage.setItem('userInfo',JSON.stringify(userInfo));
                Alert.alert('Giriş Başarılı', `${JSON.stringify(userInfo)}`);
            } else {
                Alert.alert('Giriş Başarısız', 'Giriş sırasında beklenmedik bir hata oluştu.');
            }
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            const errorMessage = error.response ? error.response.data.message : error.message;
            console.error("Registration error:", errorMessage);
            Alert.alert('Kayıt Hatası', errorMessage || 'Bir hata oluştu. Lütfen tekrar deneyin.');
        }
       
    }

    const logout = async()=>{
        setIsLoading(true);
        const response = await axios.post('https://fermantest.free.beeceptor.com/logout', {},{
            headers:{
                Authorization:`Bearer ${userInfo.access_token}`,
            }
        }).then(res=>{
            Alert.alert('Çıkış Başarılı', `${JSON.stringify(userInfo)}`);
            AsyncStorage.removeItem('userInfo');
            setUserInfo({});
            setIsLoading(false);
        }).catch(errorMessage=>{
            console.error("Logout error:", errorMessage);
        });    
    }

    const isUserLoggedIn= async ()=>{
        try {
            setSplashLoading(true);
            let userInfo = await AsyncStorage.getItem('userInfo');
            userInfo=JSON.parse(userInfo);
            if(userInfo){
                setUserInfo(userInfo);
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
        <AuthContext.Provider value={{ isLoading,userInfo,splashLoading,register,login,logout }}>
            {children}
        </AuthContext.Provider>
    );
};
