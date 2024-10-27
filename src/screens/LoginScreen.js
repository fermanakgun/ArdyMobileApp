import React, { useContext, useEffect } from 'react';
import { Text, View, StyleSheet, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import Spinner from 'react-native-loading-spinner-overlay';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { TextInput, Button, Provider as PaperProvider, DefaultTheme } from 'react-native-paper';

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

    const handleLogin = (values) => {
        login(values.email, values.password);
    };

    // Development ortamında otomatik doldurma
    const initialValues = __DEV__
        ? { email: 'fermanakgun@gmail.com', password: 'fermanakgun' }
        : { email: '', password: '' };

    useEffect(() => {
        if (__DEV__) {
            console.log("Development ortamında: Otomatik doldurma etkin.");
        }
    }, []);

    return (
        <PaperProvider theme={theme}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View style={styles.container}>
                    <Spinner visible={isLoading} animation="fade" />
                    <View style={styles.wrapper}>
                        <Text style={styles.title}>Giriş Yap</Text>

                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={handleLogin}
                        >
                            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                                <>
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
                                        <Button
                                            onPress={() => navigation.navigate('Register')}
                                            compact
                                            uppercase={false}
                                            labelStyle={styles.link}
                                        >
                                            Kayıt Ol
                                        </Button>
                                    </View>
                                </>
                            )}
                        </Formik>
                    </View>
                </View>
            </TouchableWithoutFeedback>
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
    input: {
        marginBottom: 15,
        backgroundColor: '#f9f9f9',
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
