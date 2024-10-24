import React, { useContext, useState } from 'react';
import { Button, StyleSheet, Text, View, Image } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { AuthContext } from '../context/AuthContext';
import { launchImageLibrary } from 'react-native-image-picker';
import { PhotoManipulator } from 'react-native-photo-manipulator';
import { ImageFilter } from 'react-native-image-filter-kit';
import Slider from '@react-native-community/slider';

const SettingsScreen = () => {
  const { userInfo, logout, isLoading, customerInfo } = useContext(AuthContext);

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
  image: {
    width: 300,
    height: 300,
    marginVertical: 20,
  },
  filteredImage: {
    width: 300,
    height: 300,
    marginVertical: 20,
  },
  slider: {
    width: 200,
    height: 40,
  },
  sliderContainer: {
    marginVertical: 10,
  },
  filterButtons: {
    marginVertical: 10,
  },
});

export default SettingsScreen;
