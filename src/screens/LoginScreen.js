import React, { useContext, useState,useEffect } from 'react';
import { Text, TextInput, TouchableOpacity, View, StyleSheet, Alert,TouchableWithoutFeedback, Keyboard } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import Spinner from 'react-native-loading-spinner-overlay';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { isLoading,login } = useContext(AuthContext);

    const handleLogin = () => {
        if (!email || !password) {
            Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
            return;
        }

        login(email, password);

    };

    const pageload= async ()=>{
        if (__DEV__) {
            setEmail("fermanakgun@hotmail.com.tr");
            setPassword("fermanakgun");
          }
    
    }

    useEffect(()=>{
        pageload();
    },[]);
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
            <Spinner visible={isLoading} animation='fade'></Spinner>
            <View style={styles.wrapper}>
                <Text style={styles.title}>Giriş Yap</Text>
                <View style={styles.inputContainer}>
                    <TextInput 
                        style={styles.input} 
                        placeholder='Email Girin' 
                        autoCapitalize='none' 
                        value={email} 
                        onChangeText={setEmail} 
                    />
                </View>
                <View style={styles.inputContainer}>
                    <TextInput 
                        style={styles.input} 
                        placeholder='Şifre Girin' 
                        secureTextEntry 
                        value={password} 
                        onChangeText={setPassword} 
                    />
                </View>
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Giriş Yap</Text>
                </TouchableOpacity>
                <View style={styles.footer}>
                    <Text>Hesabınız yok mu? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                        <Text style={styles.link}>Kayıt Ol</Text>
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
        color: '#007BFF', // Başlık rengi
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#bbb',
        borderRadius: 5,
        marginBottom: 12,
        backgroundColor: '#f9f9f9',
        padding: 10,
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
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

export default LoginScreen;
