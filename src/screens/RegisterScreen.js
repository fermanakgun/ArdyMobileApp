import React, { useContext, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native';
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

const RegisterScreen = ({ navigation }) => {
    const { isLoading, register } = useContext(AuthContext);

    // Validasyon şeması
    const validationSchema = Yup.object().shape({
        firstName: Yup.string().required('Adınızı girin'),
        lastName: Yup.string().required('Soyadınızı girin'),
        email: Yup.string().email('Geçerli bir e-posta adresi girin').required('E-posta adresi gerekli'),
        password: Yup.string().min(6, 'Şifre en az 6 karakter olmalıdır').required('Şifre gerekli'),
        rePassword: Yup.string().oneOf([Yup.ref('password'), null], 'Şifreler eşleşmiyor').required('Şifre tekrarı gerekli'),
    });

    // Development ortamında otomatik doldurulacak değerler
    const initialValues = __DEV__
        ? { firstName: 'Test', lastName: 'User', email: 'fermanakgun@gmail.com', password: 'fermanakgun', rePassword: 'fermanakgun' }
        : { firstName: '', lastName: '', email: '', password: '', rePassword: '' };

    const handleRegister = (values) => {
        register(values.firstName, values.lastName, values.email, values.password, navigation);
    };

    return (
        <PaperProvider theme={theme}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <Spinner visible={isLoading} animation="fade" />
                    <View style={styles.wrapper}>
                        <Text style={styles.title}>Kayıt Ol</Text>

                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={handleRegister}
                        >
                            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                                <>
                                    <TextInput
                                        mode="outlined"
                                        label="Adınızı Girin"
                                        placeholder="Adınızı Girin"
                                        value={values.firstName}
                                        onChangeText={handleChange('firstName')}
                                        onBlur={handleBlur('firstName')}
                                        error={touched.firstName && errors.firstName}
                                        style={styles.input}
                                    />
                                    {touched.firstName && errors.firstName && <Text style={styles.error}>{errors.firstName}</Text>}

                                    <TextInput
                                        mode="outlined"
                                        label="Soyadınızı Girin"
                                        placeholder="Soyadınızı Girin"
                                        value={values.lastName}
                                        onChangeText={handleChange('lastName')}
                                        onBlur={handleBlur('lastName')}
                                        error={touched.lastName && errors.lastName}
                                        style={styles.input}
                                    />
                                    {touched.lastName && errors.lastName && <Text style={styles.error}>{errors.lastName}</Text>}

                                    <TextInput
                                        mode="outlined"
                                        label="E-posta Girin"
                                        placeholder="E-posta Girin"
                                        value={values.email}
                                        onChangeText={handleChange('email')}
                                        onBlur={handleBlur('email')}
                                        error={touched.email && errors.email}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        style={styles.input}
                                    />
                                    {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}

                                    <TextInput
                                        mode="outlined"
                                        label="Şifre Girin"
                                        placeholder="Şifre Girin"
                                        secureTextEntry
                                        value={values.password}
                                        onChangeText={handleChange('password')}
                                        onBlur={handleBlur('password')}
                                        error={touched.password && errors.password}
                                        style={styles.input}
                                    />
                                    {touched.password && errors.password && <Text style={styles.error}>{errors.password}</Text>}

                                    <TextInput
                                        mode="outlined"
                                        label="Şifreyi Tekrar Girin"
                                        placeholder="Şifreyi Tekrar Girin"
                                        secureTextEntry
                                        value={values.rePassword}
                                        onChangeText={handleChange('rePassword')}
                                        onBlur={handleBlur('rePassword')}
                                        error={touched.rePassword && errors.rePassword}
                                        style={styles.input}
                                    />
                                    {touched.rePassword && errors.rePassword && <Text style={styles.error}>{errors.rePassword}</Text>}

                                    <Button
                                        mode="contained"
                                        onPress={handleSubmit}
                                        style={styles.button}
                                        labelStyle={{ fontSize: 18, fontWeight: 'bold' }}
                                    >
                                        Kayıt Ol
                                    </Button>

                                    <View style={styles.footer}>
                                        <Text style={styles.footerText}>Hesabınız var mı? </Text>
                                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                            <Text style={styles.footerLink}>Giriş Yap</Text>
                                        </TouchableOpacity>
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
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
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
        marginBottom: 10,
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
    footerLink: {
        fontSize: 16,
        color: '#007BFF',
        fontWeight: 'bold',
        marginLeft: 4,
    },
    error: {
        fontSize: 12,
        color: 'red',
        marginBottom: 10,
    },
});

export default RegisterScreen;
