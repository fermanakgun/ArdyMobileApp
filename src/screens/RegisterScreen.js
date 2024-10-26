import React, { useContext, useState,useEffect } from 'react';
import { Text, TextInput, TouchableOpacity, View, StyleSheet, Alert,TouchableWithoutFeedback, Keyboard } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import Spinner from 'react-native-loading-spinner-overlay';

const RegisterScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const { isLoading, register } = useContext(AuthContext);

    const handleRegister = () => {
        // Tüm alanların doldurulması kontrolü
        if (!email || !firstName || !lastName || !password || !rePassword) {
            Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
            return;
        }

        // E-posta formatı kontrolü
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert('Hata', 'Geçerli bir e-posta adresi girin.');
            return;
        }

        // Şifre uzunluğu kontrolü
        if (password.length < 6) {
            Alert.alert('Hata', 'Şifre en az 6 karakter uzunluğunda olmalıdır.');
            return;
        }

        // Şifrelerin eşleşme kontrolü
        if (password !== rePassword) {
            Alert.alert('Hata', 'Şifreler eşleşmiyor.');
            return;
        }

        // Kayıt işlemi
        register(firstName,lastName, email, password,navigation);
    };

    const pageload= async ()=>{
        if (__DEV__) {
            setEmail("fermanakgun@hotmail.com.tr");
            setPassword("fermanakgun");
            setRePassword("fermanakgun");
            setLastName("Test");
            setFirstName("Deneme");
          }
    
    }

    useEffect(()=>{
        pageload();
    },[]);
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
            <Spinner visible={isLoading} animation='fade' />
            <View style={styles.wrapper}>
                <Text style={styles.title}>Kayıt Ol</Text>

                <TextInput
                    style={styles.input}
                    placeholder='Adınızı Girin'
                    value={firstName}
                    onChangeText={setFirstName}
                />
                <TextInput
                    style={styles.input}
                    placeholder='Soyadınızı Girin'
                    value={lastName}
                    onChangeText={setLastName}
                />
                <TextInput
                    style={styles.input}
                    placeholder='Email Girin'
                    autoCapitalize='none'
                    value={email}
                    onChangeText={setEmail}
                    keyboardType='email-address'
                />
                <TextInput
                    style={styles.input}
                    placeholder='Şifre Girin'
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />
                <TextInput
                    style={styles.input}
                    placeholder='Şifreyi Tekrar Girin'
                    secureTextEntry
                    value={rePassword}
                    onChangeText={setRePassword}
                />

                <TouchableOpacity style={styles.button} onPress={handleRegister}>
                    <Text style={styles.buttonText}>Kayıt Ol</Text>
                </TouchableOpacity>

                <View style={styles.footer}>
                    <Text>Hesabınız var mı? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.link}>Giriş Yap</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
        </TouchableWithoutFeedback>

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
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#bbb',
        borderRadius: 5,
        paddingHorizontal: 14,
        padding: 10,
        backgroundColor: '#f0f0f0',
        fontSize: 16,
    },
    button: {
        backgroundColor: '#007BFF',
        padding: 12,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    footer: {
        flexDirection: 'row',
        marginTop: 20,
        justifyContent: 'center',
    },
    link: {
        color: '#007BFF',
        fontWeight: 'bold',
    },
});

export default RegisterScreen;
