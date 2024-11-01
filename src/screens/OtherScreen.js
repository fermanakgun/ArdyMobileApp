import React, { useContext, useState } from 'react';
import { Button, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { AuthContext } from '../context/AuthContext';
import { launchImageLibrary } from 'react-native-image-picker';
import { PhotoManipulator } from 'react-native-photo-manipulator';
import { ImageFilter } from 'react-native-image-filter-kit';
import Slider from '@react-native-community/slider';

const OtherScreen = ({ navigation }) => {
  


  return (
    <View style={styles.container}>
    
      

      <Text style={styles.welcome}>
        Test ekranı
      </Text>
      
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
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginVertical: 10,
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

export default OtherScreen;
