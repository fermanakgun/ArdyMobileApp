import React, { useContext } from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';

import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import SplashScreen from '../screens/SplashScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { AuthContext } from '../context/AuthContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const CustomTabBarButton = ({ children, onPress }) => (
    <TouchableOpacity
        style={{
            top: 0,
            justifyContent: 'center',
            alignItems: 'center',
            ...styles.shadow,
        }}
        onPress={onPress}
    >
        <View
            style={{
                width: 70,
                height: 70,
                borderRadius: 35,
                backgroundColor: '#3f78e0',
            }}
        >
            {children}
        </View>
    </TouchableOpacity>
);

const MainTabNavigator = ({ navigation }) => (
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
            tabBarStyle: {
                height: 70,
                position: 'absolute',
                bottom: 0,
            },
        })}
    >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen
            name="AddButton"
            options={{
                tabBarIcon: ({ focused }) => (
                    <Icon name="add" size={40} color="white" />
                ),
                tabBarButton: (props) => (
                    <CustomTabBarButton
                        {...props}
                        onPress={() => navigation.navigate('Add')}
                    />
                ),
            }}
        >
            {() => null}
        </Tab.Screen>
        <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
);

// Drawer Menüsü: Parola değiştirme ve ayarlar için menüler ekleyin
const DrawerNavigator = () => (
    <Drawer.Navigator initialRouteName="Anasayfa">
        <Drawer.Screen name="Anasayfa" component={MainTabNavigator} options={{ headerShown: false }} />
        <Drawer.Screen name="Parola Değiştir" component={SettingsScreen} />
        <Drawer.Screen name="Ayarlar" component={SettingsScreen} />
    </Drawer.Navigator>
);

const Navigation = () => {
    const { userInfo, splashLoading } = useContext(AuthContext);

    return (
        <NavigationContainer>
            <Stack.Navigator>
                {splashLoading ? (
                    <Stack.Screen
                        name="SplashScreen"
                        component={SplashScreen}
                        options={{ headerShown: false }}
                    />
                ) : userInfo.Token ? (
                    <Stack.Screen
                        name="Drawer"
                        component={DrawerNavigator}
                        options={{ headerShown: false }}
                    />
                ) : (
                    <>
                        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

const styles = StyleSheet.create({
    shadow: {
        shadowColor: '#7F5DF0',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5,
    },
});

export default Navigation;
