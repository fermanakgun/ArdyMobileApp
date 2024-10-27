import React, { useContext, useState } from 'react';
import { TouchableOpacity, View, StyleSheet, Text, Modal } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DrawerActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import { AuthContext } from '../context/AuthContext';
import SplashScreen from '../screens/SplashScreen';
import SettingsScreen from '../screens/SettingsScreen';
import Icon from 'react-native-vector-icons/Ionicons';
import OtherScreen from '../screens/OtherScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';

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

const MainTabNavigator = ({ navigation }) => {
  return (
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
};

const DrawerNavigator = () => {
  const [isRightDrawerOpen, setIsRightDrawerOpen] = useState(false);

  return (
    <>
      <Drawer.Navigator screenOptions={{ headerShown: true }}>
        <Drawer.Screen
          name="Anasayfa"
          component={MainTabNavigator}
          options={({ navigation }) => ({
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
                <Icon name="menu" size={30} color="#333" style={{ marginLeft: 15 }} />
              </TouchableOpacity>
            ),
            headerTitle: () => (
              <Text style={styles.logoText}>Pratik Yönetim</Text>
            ),
            headerRight: () => (
              <TouchableOpacity onPress={() => setIsRightDrawerOpen(true)} style={{ marginRight: 15 }}>
                <Icon name="megaphone-outline" size={25} color="#333" />
              </TouchableOpacity>
            ),
          })}
        />
        <Drawer.Screen name="OtherScreen" component={OtherScreen} />
        <Drawer.Screen name="Şifre Değiştir" component={ChangePasswordScreen} />
      </Drawer.Navigator>

      <Modal
        visible={isRightDrawerOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsRightDrawerOpen(false)}
      >
        <RightDrawerContent onClose={() => setIsRightDrawerOpen(false)} />
      </Modal>
    </>
  );
};

const Navigation = () => {
  const { userInfo, splashLoading } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {splashLoading ? (
          <Stack.Screen name="SplashScreen" component={SplashScreen} />
        ) : userInfo.Token ? (
          <Stack.Screen name="Drawer" component={DrawerNavigator} />
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
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
