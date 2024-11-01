import React, { useEffect, useState } from 'react';
import { StatusBar, Platform, Alert } from 'react-native';
import Navigation from './src/components/Navigation';
import { AuthProvider } from './src/context/AuthContext';
import PushNotification from 'react-native-push-notification';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from 'react-native-splash-screen';
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#007BFF',
  },
};

const App = () => {
  useEffect(() => {
    //configurePushNotifications();
    //sendWelcomeNotification();
    //SplashScreen.hide();
  }, []);

  const configurePushNotifications = () => {
    // Bildirim kanalı oluşturma
    PushNotification.createChannel(
      {
        channelId: "default-channel-id", // Kanal ID'si
        channelName: "Genel Bildirimler", // Kanal adı
        channelDescription: "Genel uygulama bildirimleri için", 
        importance: 4, // Yüksek önem seviyesi
        vibrate: true, // Titreşim
      },
      (created) => console.log(`Kanal oluşturuldu mu? ${created}`)
    );
  
    PushNotification.configure({
      // Cihaz token alındığında çağrılır
      onRegister: function (token) {
        AsyncStorage.setItem("deviceToken", token.token);  // Token'ı kaydediyoruz
      },

      // Bildirim alındığında çağrılır
      onNotification: function (notification) {
        console.log("Notification:", notification);
        Alert.alert("Notification", notification.message || "Bildirim alındı!");
        
        //notification.finish(PushNotification.FetchResult.NoData);
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

  // Yerel bir hoş geldiniz bildirimi gönderme
  const sendWelcomeNotification = () => {
    PushNotification.localNotification({
      channelId: "default-channel-id",
      title: "Hoş Geldiniz!",
      message: "Uygulamayı açtığınız için teşekkürler!",
      playSound: true,
      soundName: "default",
    });
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
