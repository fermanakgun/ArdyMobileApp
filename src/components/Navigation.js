import React, { useContext } from 'react';
import { TouchableOpacity, View, StyleSheet, Text } from 'react-native';
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
        tabBarStyle: {
          height: 70,
          position: 'absolute',
          bottom: 0,
        },
        headerShown: false,
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
              onPress={() => navigation.navigate('OtherScreen')}
            />
          ),
        }}
      >
        {() => <View />}
      </Tab.Screen>
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator screenOptions={{ headerShown: true }}>
      <Drawer.Screen
        name="MainTab"
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
          headerTitleAlign: 'center',
        })}
      />
      <Drawer.Screen
        name="OtherScreen"
        component={OtherScreen}
        options={({ navigation }) => ({
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" size={30} color="#333" style={{ marginLeft: 15 }} />
            </TouchableOpacity>
          ),
          title: 'Diğer Ekran',
        })}
      />
    </Drawer.Navigator>
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
  shadow: {
    shadowColor: '#7F5DF0',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3f78e0',
  },
});

export default Navigation;
