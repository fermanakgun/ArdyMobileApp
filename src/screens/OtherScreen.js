import React, { useContext, useState } from 'react';
import { Button, StyleSheet, Text, View, ScrollView, Image } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { AuthContext } from '../context/AuthContext';
import { launchImageLibrary } from 'react-native-image-picker';
import Slider from '@react-native-community/slider';
import { ImageFilter } from 'react-native-image-filter-kit';

const OtherScreen = () => {
  const { userInfo, logout, isLoading, customerInfo } = useContext(AuthContext);
  const [filterIntensity, setFilterIntensity] = useState(1); // Filtre yoğunluğu
  const [imageUri, setImageUri] = useState(null); // Seçilen fotoğrafın URI'si
  const [loading, setLoading] = useState(false); // Yüklenme durumu
  const [selectedFilter, setSelectedFilter] = useState('None'); // Seçilen filtre

  // Fotoğraf seçme fonksiyonu
  const selectImage = async () => {
    setLoading(true); // Yükleme başlatıldığında spinner gösterilir
    try {
      const response = await launchImageLibrary({ mediaType: 'photo' });
      console.log(response); // Gelen yanıtı incelemek için
      if (!response.didCancel && !response.error && response.assets && response.assets.length > 0) {
        setImageUri(response.assets[0].uri); // Fotoğraf URI'sini kaydet
      } else if (response.didCancel) {
        console.log('Fotoğraf seçme işlemi iptal edildi.');
      } else if (response.error) {
        console.log('Fotoğraf seçme hatası:', response.error);
      } else {
        console.log('Fotoğraf bulunamadı veya başka bir hata oluştu.');
      }
    } catch (error) {
      console.error('Bir hata oluştu:', error);
    } finally {
      setLoading(false); // İşlem tamamlandığında spinner kaldırılır
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Spinner visible={isLoading || loading} animation="fade" />
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Other Sayfası {customerInfo?.FirstName} {customerInfo?.LastName}
        </Text>
        <Button title="Çıkış Yap" onPress={logout} />

        {/* Fotoğraf Seçme */}
        <Button title="Fotoğraf Seç" onPress={selectImage} />

        {/* Seçilen fotoğraf gösterimi */}
        {imageUri && (
          <View style={styles.imageContainer}>
            <ImageFilter
              image={<Image source={{ uri: imageUri }} style={styles.image} />}
              config={filters[selectedFilter]}
            />
          </View>
        )}

        {/* Filtre Yoğunluğu Ayarı */}
        {imageUri && selectedFilter !== 'None' && (
          <View style={styles.sliderContainer}>
            <Text>Filtre Yoğunluğu: {Math.round(filterIntensity * 100)}%</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={1}
              step={0.01}
              value={filterIntensity}
              onValueChange={setFilterIntensity}
            />
          </View>
        )}

        {/* Filtre Seçim Butonları */}
        {imageUri && (
          <View style={styles.filterButtons}>
            <Button title="Sepia" onPress={() => setSelectedFilter('Sepia')} />
            <Button title="Grayscale" onPress={() => setSelectedFilter('Grayscale')} />
            <Button title="Brightness" onPress={() => setSelectedFilter('Brightness')} />
            <Button title="Filtreyi Kaldır" onPress={() => setSelectedFilter('None')} />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  welcome: {
    fontSize: 18,
    marginBottom: 8,
  },
  imageContainer: {
    marginVertical: 20,
  },
  image: {
    width: 300,
    height: 300,
  },
  sliderContainer: {
    marginVertical: 10,
  },
  slider: {
    width: 300,
    height: 40,
  },
  filterButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
});

export default OtherScreen;
