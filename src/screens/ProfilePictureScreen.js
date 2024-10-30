import React, { useContext, useState } from 'react';
import { View, Image, Button, ActivityIndicator, StyleSheet } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { AuthContext } from '../context/AuthContext';

const ProfilePictureScreen = () => {
    const { customerInfo, changeProfilePicture, isLoading } = useContext(AuthContext);
    const [loading, setLoading] = useState(false); // Yükleme durumunu göstermek için

    const selectProfilePicture = () => {
        launchImageLibrary({ mediaType: 'photo' }, async (response) => {
            if (response.assets && response.assets.length > 0) {
                setLoading(true); // Yükleme durumunu başlatıyoruz
                await changeProfilePicture(response.assets[0].uri); // Profil fotoğrafını güncelle
                setLoading(false); // Yükleme durumunu durduruyoruz
            }
        });
    };

    return (
        <View style={styles.container}>
            {/* Mevcut profil fotoğrafı */}
            {customerInfo.ProfilePictureUrl ? (
                <Image 
                    source={{ uri: customerInfo.ProfilePictureUrl }} 
                    style={styles.profileImage} 
                />
            ) : (
                <View style={styles.placeholderImage} /> // Varsayılan görünüm
            )}

            {/* Fotoğraf değiştirme butonu */}
            <Button title="Profil Fotoğrafını Değiştir" onPress={selectProfilePicture} />

            {/* Yükleme animasyonu */}
            {(isLoading || loading) && <ActivityIndicator size="large" color="#0000ff" />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileImage: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: 20,
    },
    placeholderImage: {
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: '#ccc',
        marginBottom: 20,
    },
});

export default ProfilePictureScreen;
