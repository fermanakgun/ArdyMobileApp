import React, { useContext, useState } from 'react';
import { View, Image, Button, ActivityIndicator, StyleSheet } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { AuthContext } from '../context/AuthContext';

const ProfilePictureScreen = () => {
    const { customerInfo, changeProfilePicture, isLoading } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    const selectProfilePicture = () => {
        ImagePicker.openPicker({
            width: 300, // Kırpma işlemi için genişlik
            height: 300, // Kırpma işlemi için yükseklik
            cropping: true, // Kırpma özelliğini aktif et
            mediaType: 'photo'
        }).then(async (image) => {
            setLoading(true);
            await changeProfilePicture(image.path); // Profil fotoğrafını güncelle
            setLoading(false);
        }).catch((error) => {
            console.error("Image selection error:", error);
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                {(isLoading || loading) ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    customerInfo.ProfilePictureUrl ? (
                        <Image 
                            source={{ uri: customerInfo.ProfilePictureUrl }} 
                            style={styles.profileImage} 
                        />
                    ) : (
                        <View style={styles.placeholderImage} />
                    )
                )}
            </View>

            <Button title="Profil Fotoğrafını Değiştir" onPress={selectProfilePicture} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageContainer: {
        width: 150,
        height: 150,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    profileImage: {
        width: '100%',
        height: '100%',
        borderRadius: 75,
    },
    placeholderImage: {
        width: '100%',
        height: '100%',
        borderRadius: 75,
        backgroundColor: '#ccc',
    },
});

export default ProfilePictureScreen;
