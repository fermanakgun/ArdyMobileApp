import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import { View } from "react-native";
import { Snackbar, Provider as PaperProvider } from "react-native-paper";
import api, { setLogout } from "../../api";
import SplashScreen from "react-native-splash-screen";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState({});
    const [customerInfo, setCustomerInfo] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [splashLoading, setSplashLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ visible: false, message: "", color: "#007BFF" });

    const showMessage = (message, type = "success") => {
        const color = type === "error" ? "red" : "#007BFF";
        setSnackbar({ visible: true, message, color });
    };

    const register = async (name, lastName, email, password, navigation) => {
        setIsLoading(true);
        try {
            let response = await api.post("auth/register", {
                FirstName: name,
                LastName: lastName,
                Email: email,
                Password: password,
            });

            const responseData = response.data;
            console.log(JSON.stringify(responseData));
            setIsLoading(false);
            if (responseData.Token != undefined) {
                setUserInfo(responseData);
                await AsyncStorage.multiSet([
                    ["userInfo", JSON.stringify(responseData)],
                    ["access_token", responseData.Token],
                    ["refresh_token", responseData.RefreshToken],
                    ["lastEmail", email], // E-posta adresini kaydediyoruz
                ]);

                const getActiveCustomerInfo = await api.post("customer/getActiveCustomerInfo", {});
                await AsyncStorage.setItem("customerInfo", JSON.stringify(getActiveCustomerInfo.data.customer));
                setCustomerInfo(getActiveCustomerInfo.data.customer);
                showMessage(`Kayıt Başarılı: ${getActiveCustomerInfo.data.customer.Username}`, "success");
            } else {
                showMessage(responseData.Message || "Kayıt işlemi başarılı.", "success");
                navigation.navigate("Login");
            }
        } catch (error) {
            setIsLoading(false);
            showMessage(error.response?.data?.message || "Beklenmedik bir hata oluştu. Lütfen daha sonra tekrar deneyin.", "error");
        }
    };

    const login = async (email, password) => {
        try {
            setIsLoading(true);
            const response = await api.post("auth/login", { username: email, password: password }, { _isLoginRequest: true });

            const userInfo = response.data;
            if (userInfo) {
                setUserInfo(userInfo);
                await AsyncStorage.multiSet([
                    ["access_token", userInfo.Token],
                    ["refresh_token", userInfo.RefreshToken],
                    ["userInfo", JSON.stringify(userInfo)],
                    ["lastEmail", email], // E-posta adresini kaydediyoruz
                ]);

                const getActiveCustomerInfo = await api.post("customer/getActiveCustomerInfo", {});
                await AsyncStorage.setItem("customerInfo", JSON.stringify(getActiveCustomerInfo.data.customer));
                setCustomerInfo(getActiveCustomerInfo.data.customer);
                showMessage(`Giriş Başarılı: ${getActiveCustomerInfo.data.customer.Username}`, "success");
            } else {
                showMessage("Giriş sırasında beklenmedik bir hata oluştu.", "error");
            }
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            showMessage(error.response?.data?.message || "Beklenmedik bir hata oluştu. Lütfen daha sonra tekrar deneyin.", "error");
        }
    };
    const changeProfilePicture = async (newProfilePictureUri) => {
        try {
            setIsLoading(true);
            const formData = new FormData();
            formData.append("file", {
                uri: newProfilePictureUri,
                type: "image/jpeg",
                name: "profile.jpg",
            });
    
            const response = await api.post("customer/updateProfilePicture", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
    
            if (response.status === 200) {
                // Profil fotoğrafı başarıyla güncellendiyse, customerInfo'yu yeniden yüklüyoruz
                const updatedCustomerInfo = await api.post("customer/getActiveCustomerInfo", {});
                await AsyncStorage.setItem("customerInfo", JSON.stringify(updatedCustomerInfo.data.customer));
                setCustomerInfo(updatedCustomerInfo.data.customer);
                showMessage("Profil fotoğrafı başarıyla güncellendi.", "success");
            } else {
                showMessage("Profil fotoğrafı güncellenemedi.", "error");
            }
        } catch (error) {
            showMessage("Profil fotoğrafı güncellenirken bir hata oluştu.", "error");
        } finally {
            setIsLoading(false);
        }
    };
    
    const logout = async () => {
        try {
            await api.post("/auth/logout",{}, { _isLoginRequest: true });
        } catch (error) {
            console.log("Logout sırasında sunucu hatası:", error);
        } finally {
            // E-posta adresi hariç diğer verileri siliyoruz
            await AsyncStorage.multiRemove(["access_token", "refresh_token", "userInfo", "customerInfo"]);
            setUserInfo({});
            setCustomerInfo({});
        }
    };

    const changePassword = async (oldPassword, newPassword, confirmNewPassword) => {
        setIsLoading(true);
        try {
            const response = await api.post("customer/changePassword", {
                OldPassword: oldPassword,
                NewPassword: newPassword,
                ConfirmNewPassword: confirmNewPassword,
            });
    
            const { isSuccess, message } = response.data;
    
            if (isSuccess) {
                showMessage(message || "Parola başarıyla değiştirildi", "success");
                return true;
            } else {
                showMessage(message || "Parola değişikliği başarısız oldu.", "error");
                return false;
            }
        } catch (error) {
            showMessage(
                error.response?.data?.message || "Parola değişikliği sırasında bir hata oluştu. Lütfen tekrar deneyin.",
                "error"
            );
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const isUserLoggedIn = async () => {
        try {
            setSplashLoading(true);

            let userInfo = await AsyncStorage.getItem("userInfo");
            if (userInfo) {
                userInfo = JSON.parse(userInfo);
                setUserInfo(userInfo);
            }

            let customerInfo = await AsyncStorage.getItem("customerInfo");
            if (customerInfo) {
                customerInfo = JSON.parse(customerInfo);
                setCustomerInfo(customerInfo);
            }
        } catch (errorMessage) {
            showMessage("Kullanıcı durumu kontrol edilirken bir hata oluştu.", "error");
        } finally {
            setSplashLoading(false);
            SplashScreen.hide();
        }
    };

    useEffect(() => {
        isUserLoggedIn();
        setLogout(logout);
    }, []);

    return (
        <PaperProvider>
            <AuthContext.Provider value={{ isLoading, userInfo, customerInfo, splashLoading, register, login, logout, changePassword,changeProfilePicture }}>
                <View style={{ flex: 1 }}>
                    {children}
                    <Snackbar
                        visible={snackbar.visible}
                        onDismiss={() => setSnackbar({ ...snackbar, visible: false })}
                        duration={3000}
                        style={{ backgroundColor: snackbar.color }}
                    >
                        {snackbar.message}
                    </Snackbar>
                </View>
            </AuthContext.Provider>
        </PaperProvider>
    );
};
