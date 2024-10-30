import React, { useState, useEffect } from 'react';
import { View, Image, Button, ActivityIndicator } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import { Snackbar } from 'react-native-paper';
import api from '../../api';
import { launchImageLibrary } from 'react-native-image-picker';

const ProfilePictureScreen = () => {
    const [profilePicture, setProfilePicture] = useState(null);
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ visible: false, message: "", color: "#007BFF" });

    useEffect(() => {
        fetchProfilePicture();
    }, []);

    // Profil fotoğrafını sunucudan çekme
    const fetchProfilePicture = async () => {
        try {
            setLoading(true);
            const response = await api.get('/Customer/getProfilePicture');
            console.log(response.data.pictureUrl);
            setProfilePicture(response.data.pictureUrl);
        } catch (error) {
            showMessage('Profil fotoğrafı alınamadı.', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Profil fotoğrafını güncelleme
    const updateProfilePicture = async (uri) => {
        const formData = new FormData();
        formData.append('file', {
            uri,
            type: 'image/jpeg',
            name: 'profile.jpg',
        });

        try {
            setLoading(true);
            await api.post('/Customer/updateProfilePicture', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            showMessage('Profil fotoğrafı başarıyla güncellendi.');
            fetchProfilePicture(); // Yeni fotoğrafı günceller
        } catch (error) {
            showMessage('Profil fotoğrafı güncellenemedi.', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Snackbar mesajını gösterme fonksiyonu
    const showMessage = (message, type = "success") => {
        const color = type === "error" ? "red" : "#007BFF";
        setSnackbar({ visible: true, message, color });
    };

    // Fotoğraf seçme işlemi
    const selectProfilePicture = () => {
        launchImageLibrary({ mediaType: 'photo' }, (response) => {
            if (response.didCancel) {
                console.log('Kullanıcı fotoğraf seçimini iptal etti.');
            } else if (response.errorCode) {
                showMessage('Fotoğraf seçilirken bir hata oluştu.', 'error');
            } else {
                updateProfilePicture(response.assets[0].uri);
            }
        });
    };

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            {loading ? (
                <ActivityIndicator size="large" color="#007BFF" />
            ) : (
                <>
                    {profilePicture ? (
                        <Image
                            source={{ uri: profilePicture }}
                            style={{ width: 150, height: 150, borderRadius: 75 }}
                        />
                    ) : (
                        <View style={{ width: 150, height: 150, borderRadius: 75, backgroundColor: '#ccc' }} />
                    )}
                    <Button title="Fotoğraf Seç" onPress={selectProfilePicture} />
                </>
            )}
            <Snackbar
                visible={snackbar.visible}
                onDismiss={() => setSnackbar({ ...snackbar, visible: false })}
                style={{ backgroundColor: snackbar.color }}
                duration={3000}
            >
                {snackbar.message}
            </Snackbar>
        </View>
    );
};

export default ProfilePictureScreen;
