import React, { useContext, useState, useEffect, useRef } from 'react';
import { TouchableOpacity, View, StyleSheet, Text, Modal, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DrawerActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import PushNotification from 'react-native-push-notification';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import SplashScreen from '../screens/SplashScreen';
import SettingsScreen from '../screens/SettingsScreen';
import OtherScreen from '../screens/OtherScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import MessageDetailScreen from '../screens/MessageDetailScreen';
import { AuthContext } from '../context/AuthContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const dummyData = [
    { id: '1', title: 'Duyuru 1' },
    { id: '2', title: 'Duyuru 2' },
    { id: '3', title: 'Duyuru 3' },
];

const RightDrawerContent = ({ onClose }) => (
    <View style={styles.rightDrawerContainer}>
        <Text style={styles.rightDrawerTitle}>Duyurular</Text>
        {dummyData.map(item => (
            <Text key={item.id} style={styles.rightDrawerItem}>{item.title}</Text>
        ))}
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Kapat</Text>
        </TouchableOpacity>
    </View>
);

const MainTabNavigator = () => (
    <Tab.Navigator
        screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                if (route.name === 'Home') {
                    iconName = focused ? 'home' : 'home-outline';
                } else if (route.name === 'Settings') {
                    iconName = focused ? 'settings' : 'settings-outline';
                }

                return <Icon name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#3f78e0',
            tabBarInactiveTintColor: 'gray',
            tabBarShowLabel: false,
            headerShown: false,
        })}
    >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
);

const DrawerNavigator = ({ setIsRightDrawerOpen }) => (
    <Drawer.Navigator>
        <Drawer.Screen
            name="Main"
            component={MainTabNavigator}
            options={({ navigation }) => ({
                headerLeft: () => (
                    <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
                        <Icon name="menu" size={30} color="#333" style={{ marginLeft: 15 }} />
                    </TouchableOpacity>
                ),
                headerTitle: () => <Text style={styles.logoText}>Pratik Yönetim</Text>,
                headerRight: () => (
                    <TouchableOpacity onPress={() => setIsRightDrawerOpen(true)} style={{ marginRight: 15 }}>
                        <Icon name="megaphone-outline" size={25} color="#333" />
                    </TouchableOpacity>
                ),
            })}
        />
        <Drawer.Screen name="OtherScreen" component={OtherScreen} />
        <Drawer.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} />
    </Drawer.Navigator>
);

const Navigation = () => {
    const { userInfo, splashLoading } = useContext(AuthContext);
    const navigationRef = useRef();
    const [isRightDrawerOpen, setIsRightDrawerOpen] = useState(false);

    useEffect(() => {
        PushNotification.configure({
            onRegister: function (token) {
                AsyncStorage.setItem("deviceToken", token.token); 
            },
            onNotification: function (notification) {
                const { page, pageParameter } = notification.data?.data || {};


                if (page === 'ViewNotificationDetailPage') {
                    navigationRef.current?.navigate('MessageDetailScreen', {
                        page: 'mypagenamedeğişkensetlenecek',
                        pageParameter: 'mypageParameterdeğişkensetlenecek',
                        message: 'Bildirim içeriği burada',
                        title: notification.title,
                        body: notification.message,
                    });
                }
            },
            permissions: {
                alert: true,
                badge: true,
                sound: true,
            },
            popInitialNotification: true,
            requestPermissions: Platform.OS === 'ios',
        });
    }, []);

    return (
        <NavigationContainer ref={navigationRef}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {splashLoading ? (
                    <Stack.Screen name="SplashScreen" component={SplashScreen} />
                ) : userInfo.Token ? (
                    <>
                        <Stack.Screen name="Drawer">
                            {() => <DrawerNavigator setIsRightDrawerOpen={setIsRightDrawerOpen} />}
                        </Stack.Screen>
                        <Stack.Screen 
                            name="MessageDetailScreen" 
                            component={MessageDetailScreen} 
                            options={{ headerShown: true, headerBackTitle: "Geri" }} 
                        />
                    </>
                ) : (
                    <>
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="Register" component={RegisterScreen} />
                    </>
                )}
            </Stack.Navigator>

            <Modal
                visible={isRightDrawerOpen}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setIsRightDrawerOpen(false)}
            >
                <RightDrawerContent onClose={() => setIsRightDrawerOpen(false)} />
            </Modal>
        </NavigationContainer>
    );
};

const styles = StyleSheet.create({
    logoText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#3f78e0',
    },
    rightDrawerContainer: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
        marginTop: 50,
    },
    rightDrawerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    rightDrawerItem: {
        fontSize: 16,
        paddingVertical: 10,
        borderBottomWidth: 0.5,
        borderBottomColor: '#ddd',
    },
    closeButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#3f78e0',
        borderRadius: 5,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default Navigation;
