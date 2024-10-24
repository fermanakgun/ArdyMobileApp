import React, { useEffect } from 'react';
import { StatusBar, Platform, Alert } from 'react-native';
import Navigation from './src/components/Navigation';
import { AuthProvider } from './src/context/AuthContext';
import PushNotification from 'react-native-push-notification';
import api from './api';

const App = () => {

  // Push bildirimlerini yapılandırma ve izni alma
  useEffect(() => {
    configurePushNotifications();
  }, []);

  const configurePushNotifications = () => {
    // Bildirim izinlerini isteme
    PushNotification.configure({
      onRegister: function (token) {
        Alert.alert("DeviceToken", JSON.stringify(token));
        console.log("DEVICE TOKEN:", token);
        // Token'in doğru şekilde string olduğundan emin olun
        
        // Eğer token.token yerine sadece token kullanılıyorsa değiştirin
        sendTokenToServer(token.token || token);
      },

      onNotification: function (notification) {
        console.log("NOTIFICATION:", notification);
        // Kullanıcıya bildirimi gösterebilirsiniz
        Alert.alert("Notification", notification.message || "Bildirim alındı!");
      },

      // İzinler
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      popInitialNotification: true,
      requestPermissions: Platform.OS === 'ios',
    });
  };

  const sendTokenToServer = async (token) => {
    try {
      let response = await api.post('/customer/sendToken', {
        deviceToken: token
      });
      console.log("Token başarıyla sunucuya gönderildi:", response.data);
    } catch (error) {
      console.error("Token sunucuya gönderilirken hata oluştu:", error);
    }
  };

  return (
    <AuthProvider>
      <StatusBar backgroundColor="#06bcee" />
      <Navigation />
    </AuthProvider>
  );
};

export default App;
