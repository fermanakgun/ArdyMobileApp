import React, { useContext } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import Spinner from 'react-native-loading-spinner-overlay';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { TextInput, Button, Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: '#007BFF',
    },
};

const ChangePasswordScreen = () => {
    const { changePassword, isLoading } = useContext(AuthContext);

    const validationSchema = Yup.object().shape({
        oldPassword: Yup.string().required('Eski parola gereklidir'),
        newPassword: Yup.string().min(6, 'Yeni parola en az 6 karakter olmalıdır').required('Yeni parola gereklidir'),
        confirmNewPassword: Yup.string()
            .oneOf([Yup.ref('newPassword'), null], 'Parolalar eşleşmiyor')
            .required('Parola doğrulaması gereklidir'),
    });

    const handleSubmit = (values) => {
        changePassword(values.oldPassword, values.newPassword, values.confirmNewPassword);
    };

    return (
        <PaperProvider theme={theme}>
            <KeyboardAwareScrollView contentContainerStyle={styles.container} enableOnAndroid={true}>
                <Spinner visible={isLoading} animation="fade" />
                <View style={styles.wrapper}>
                    <Text style={styles.title}>Parola Değiştir</Text>
                    <Formik
                        initialValues={{ oldPassword: '', newPassword: '', confirmNewPassword: '' }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                            <>
                                <TextInput
                                    mode="outlined"
                                    label="Eski Parola"
                                    placeholder="Eski Parola"
                                    secureTextEntry
                                    value={values.oldPassword}
                                    onChangeText={handleChange('oldPassword')}
                                    onBlur={handleBlur('oldPassword')}
                                    error={touched.oldPassword && errors.oldPassword}
                                    style={styles.input}
                                />
                                {touched.oldPassword && errors.oldPassword && (
                                    <Text style={styles.error}>{errors.oldPassword}</Text>
                                )}

                                <TextInput
                                    mode="outlined"
                                    label="Yeni Parola"
                                    placeholder="Yeni Parola"
                                    secureTextEntry
                                    value={values.newPassword}
                                    onChangeText={handleChange('newPassword')}
                                    onBlur={handleBlur('newPassword')}
                                    error={touched.newPassword && errors.newPassword}
                                    style={styles.input}
                                />
                                {touched.newPassword && errors.newPassword && (
                                    <Text style={styles.error}>{errors.newPassword}</Text>
                                )}

                                <TextInput
                                    mode="outlined"
                                    label="Yeni Parola (Tekrar)"
                                    placeholder="Yeni Parola (Tekrar)"
                                    secureTextEntry
                                    value={values.confirmNewPassword}
                                    onChangeText={handleChange('confirmNewPassword')}
                                    onBlur={handleBlur('confirmNewPassword')}
                                    error={touched.confirmNewPassword && errors.confirmNewPassword}
                                    style={styles.input}
                                />
                                {touched.confirmNewPassword && errors.confirmNewPassword && (
                                    <Text style={styles.error}>{errors.confirmNewPassword}</Text>
                                )}

                                <Button
                                    mode="contained"
                                    onPress={handleSubmit}
                                    style={styles.button}
                                    labelStyle={{ fontSize: 18, fontWeight: 'bold' }}
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Lütfen Bekleyin..." : "Parolayı Değiştir"}
                                </Button>
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
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
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
    error: {
        fontSize: 12,
        color: 'red',
        marginBottom: 10,
    },
});

export default ChangePasswordScreen;
