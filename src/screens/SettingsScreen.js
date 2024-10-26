import React, { useContext, useState, useEffect } from 'react';
import { Button, StyleSheet, Text, View, Alert } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { AuthContext } from '../context/AuthContext';
import api from '../../api';

const SettingsScreen = () => {

  const { userInfo, logout, isLoading, customerInfo } = useContext(AuthContext);

  useEffect(() => {
    fermandeneme();
  }, []);

  const fermandeneme = async () => {
    try {
      const response = await api.post('/customer/getActiveCustomerInfo');

      if (response.data && response.data.customer) {
        Alert.alert('Bilgiler yeniden çekildi.', `${response.data.customer.Username}`);
      } else {
        Alert.alert('Hata', 'Müşteri bilgileri alınamadı.');
      }

    } catch (error) {      
      if (error.response) {
        // API'den gelen yanıt varsa
        Alert.alert('Hata', `API Hatası: ${error.response.data}`);
      } else if (error.request) {
        // İstek gönderilmiş ama yanıt alınamamışsa
        Alert.alert('Hata', `API ile bağlantı kurulamadı.: ${error.request}`);
      } else {
        // Diğer hatalar
        Alert.alert('Hata', `Hata: ${error.message}`);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Spinner visible={isLoading} animation="fade" />
      <Text style={styles.welcome}>
        Settings Sayfası {customerInfo?.FirstName} {customerInfo?.LastName}
      </Text>
      <Button title="Çıkış Yap" onPress={logout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcome: {
    fontSize: 18,
    marginBottom: 8,
  },
});

export default SettingsScreen;
