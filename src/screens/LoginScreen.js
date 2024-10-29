import React, { useContext, useEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../context/AuthContext';
import Spinner from 'react-native-loading-spinner-overlay';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { TextInput, Button, Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: '#007BFF',
    },
};

// Validasyon şeması
const validationSchema = Yup.object().shape({
    email: Yup.string()
        .email('Geçerli bir e-posta adresi girin')
        .required('E-posta adresi gerekli'),
    password: Yup.string()
        .min(6, 'Şifre en az 6 karakter olmalıdır')
        .required('Şifre gerekli'),
});

const LoginScreen = ({ navigation }) => {
    const { isLoading, login } = useContext(AuthContext);
    const [initialEmail, setInitialEmail] = useState('');

    useEffect(() => {
        // Uygulama açıldığında son kullanılan e-posta adresini almak için AsyncStorage'i kontrol edin
        const getEmail = async () => {
            try {
                const savedEmail = await AsyncStorage.getItem('lastEmail');
                if (savedEmail) setInitialEmail(savedEmail);
            } catch (error) {
                console.log("E-posta alma hatası:", error);
            }
        };
        getEmail();
    }, []);

    const handleLogin = async (values) => {
        await login(values.email, values.password);
    };

    const clearEmail = async (setFieldValue) => {
        // E-posta verisini AsyncStorage'den sil ve form değerini boşalt
        try {
            await AsyncStorage.removeItem('lastEmail');
            setInitialEmail(''); // initialEmail state'ini temizle
            setFieldValue('email', ''); // Formik içindeki email alanını temizle
        } catch (error) {
            console.log("E-posta silme hatası:", error);
        }
    };

    return (
        <PaperProvider theme={theme}>
            <KeyboardAwareScrollView contentContainerStyle={styles.container} enableOnAndroid={true}>
                <Spinner visible={isLoading} animation="fade" />
                <View style={styles.wrapper}>
                    <Text style={styles.title}>Giriş Yap</Text>

                    <Formik
                        initialValues={{ email: initialEmail, password: '' }}
                        validationSchema={validationSchema}
                        onSubmit={handleLogin}
                        enableReinitialize
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
                            <>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        mode="outlined"
                                        label="Email Girin"
                                        placeholder="Email Girin"
                                        value={values.email}
                                        onChangeText={handleChange('email')}
                                        onBlur={handleBlur('email')}
                                        autoCapitalize="none"
                                        keyboardType="email-address"
                                        style={styles.input}
                                        error={touched.email && errors.email}
                                    />
                                    {values.email ? (
                                        <MaterialCommunityIcons
                                            name="close-circle"
                                            size={24}
                                            color="gray"
                                            style={styles.clearIcon}
                                            onPress={() => clearEmail(setFieldValue)}
                                        />
                                    ) : null}
                                </View>
                                {touched.email && errors.email && (
                                    <Text style={styles.error}>{errors.email}</Text>
                                )}

                                <TextInput
                                    mode="outlined"
                                    label="Şifre Girin"
                                    placeholder="Şifre Girin"
                                    value={values.password}
                                    onChangeText={handleChange('password')}
                                    onBlur={handleBlur('password')}
                                    secureTextEntry
                                    style={styles.input}
                                    error={touched.password && errors.password}
                                />
                                {touched.password && errors.password && (
                                    <Text style={styles.error}>{errors.password}</Text>
                                )}

                                <Button
                                    mode="contained"
                                    onPress={handleSubmit}
                                    style={styles.button}
                                    labelStyle={{ fontSize: 18, fontWeight: 'bold' }}
                                >
                                    Giriş Yap
                                </Button>

                                <View style={styles.footer}>
                                    <Text style={styles.footerText}>Hesabınız yok mu? </Text>
                                    <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                                        <Text style={styles.link}>Kayıt Ol</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
                    </Formik>
                </View>
            </KeyboardAwareScrollView>
        </PaperProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
        alignItems: 'center',
        justifyContent: 'center',
    },
    wrapper: {
        width: '90%',
        padding: 20,
        borderRadius: 10,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 6.84,
        elevation: 5,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#007BFF',
    },
    inputContainer: {
        position: 'relative',
        width: '100%',
    },
    input: {
        marginBottom: 15,
        backgroundColor: '#f9f9f9',
    },
    clearIcon: {
        position: 'absolute',
        right: 10,
        top: '50%', // Yarıya yerleştir
        transform: [{ translateY: -15 }], // İkonun yüksekliğinin yarısını çıkararak ortalar
    },
    button: {
        marginTop: 20,
        paddingVertical: 5,
        borderRadius: 5,
    },
    footer: {
        flexDirection: 'row',
        marginTop: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    footerText: {
        fontSize: 16,
        color: '#555',
    },
    link: {
        fontSize: 16,
        color: '#007BFF',
        fontWeight: 'bold',
    },
    error: {
        fontSize: 12,
        color: 'red',
        marginBottom: 10,
    },
});


export default LoginScreen;
