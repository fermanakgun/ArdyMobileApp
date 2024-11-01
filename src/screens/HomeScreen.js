import React, { useContext, useState } from 'react';
import { Button, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { AuthContext } from '../context/AuthContext';
import { launchImageLibrary } from 'react-native-image-picker';
import { PhotoManipulator } from 'react-native-photo-manipulator';
import { ImageFilter } from 'react-native-image-filter-kit';
import Slider from '@react-native-community/slider';

const HomeScreen = ({ navigation }) => {
  const { userInfo, logout, isLoading, customerInfo } = useContext(AuthContext);

  const [imageUri, setImageUri] = useState(null); // Seçilen fotoğrafın URI'si
  const [brightness, setBrightness] = useState(1); // Parlaklık ayarı
  const [contrast, setContrast] = useState(1); // Kontrast ayarı
  const [currentFilter, setCurrentFilter] = useState('Sepia'); // Default filter
  const [filteredImageUri, setFilteredImageUri] = useState(null); // Filtrelenmiş fotoğrafın URI'si

  // Fotoğraf seçimi
  const selectImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.assets && response.assets.length > 0) {
        setImageUri(response.assets[0].uri);
        setFilteredImageUri(null); // Filtreyi sıfırla
      }
    });
  };

  // Filtre uygula
  const applyFilter = () => {
    setFilteredImageUri(imageUri); // Filtrelenecek görüntü ayarlanıyor
  };

  // Kullanıcı slider'ları ile parlaklık ve kontrast ayarlarını günceller
  const editImage = async () => {
    if (imageUri) {
      try {
        const editedImage = await PhotoManipulator.batch(
          [
            { type: 'brightness', value: brightness },
            { type: 'contrast', value: contrast }
          ],
          imageUri
        );
        setFilteredImageUri(editedImage); // Düzenlenmiş fotoğrafı yeni state'e set ediyoruz
      } catch (error) {
        console.log('Photo Manipulator Error:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Spinner visible={isLoading} animation="fade" />
      
      {/* Profil Fotoğrafı */}
      {customerInfo?.ProfilePictureUrl && (
        <TouchableOpacity onPress={() => navigation.navigate('ProfilePictureScreen')}>
          <Image 
            source={{ uri: customerInfo.ProfilePictureUrl }}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      )}

      <Text style={styles.welcome}>
        Hoşgeldin {customerInfo?.FirstName} {customerInfo?.LastName}
      </Text>
      
      <Button title="Çıkış Yap" onPress={logout} />

      {imageUri && (
        <>
          <Image source={{ uri: imageUri }} style={styles.image} />
          <View style={styles.sliderContainer}>
            <Text>Parlaklık: {brightness}</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={2}
              value={brightness}
              onValueChange={(value) => setBrightness(value)}
            />
          </View>
          <View style={styles.sliderContainer}>
            <Text>Kontrast: {contrast}</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={2}
              value={contrast}
              onValueChange={(value) => setContrast(value)}
            />
          </View>

          <Button title="Fotoğrafı Düzenle (Parlaklık ve Kontrast)" onPress={editImage} />
          <Button title="Filtre Uygula" onPress={applyFilter} />

          {filteredImageUri && (
            <ImageFilter
              image={{ uri: filteredImageUri }}
              config={{ name: currentFilter }}
              style={styles.filteredImage}
            />
          )}
        </>
      )}
      {filteredImageUri && (
        <View style={styles.filterButtons}>
          <Button title="Sepia Filtre" onPress={() => setCurrentFilter('Sepia')} />
          <Button title="Grayscale Filtre" onPress={() => setCurrentFilter('Grayscale')} />
          <Button title="Saturate Filtre" onPress={() => setCurrentFilter('Saturate')} />
        </View>
      )}
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

export default HomeScreen;
