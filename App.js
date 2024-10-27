import React, { useEffect } from 'react';
import { StatusBar, Platform, Alert } from 'react-native';
import Navigation from './src/components/Navigation';
import { AuthProvider } from './src/context/AuthContext';
import PushNotification from 'react-native-push-notification';
import api from './api';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#007BFF', // Primary renginizi burada belirleyin
  },
};

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
        
        sendTokenToServer(token.token || token);
      },

      onNotification: function (notification) {
        console.log("NOTIFICATION:", notification);
        Alert.alert("Notification", notification.message || "Bildirim alındı!");
      },

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
      <PaperProvider
        theme={theme}
        settings={{
          icon: (props) => <Ionicons {...props} />,
        }}
      >
        <StatusBar backgroundColor="#06bcee" />
        <Navigation />
      </PaperProvider>
    </AuthProvider>
  );
};

export default App;
