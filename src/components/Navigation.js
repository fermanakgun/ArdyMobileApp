import React, { useContext } from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import { AuthContext } from '../context/AuthContext';
import SplashScreen from '../screens/SplashScreen';
import SettingsScreen from '../screens/SettingsScreen';
import Icon from 'react-native-vector-icons/Ionicons'; // İkonlar için
import OtherScreen from '../screens/OtherScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Özel + buton bileşeni
const CustomTabBarButton = ({ children, onPress }) => (
  <TouchableOpacity
    style={{
      top: 0, // Butonun yukarıda görünmesi için
      justifyContent: 'center',
      alignItems: 'center',
      ...styles.shadow, // Gölge efekti
    }}
    onPress={onPress}
  >
    <View
      style={{
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#3f78e0', // Butonun arka plan rengi
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

          // Ionicons'tan ikonları dönüyoruz
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3f78e0', // Seçili olan tabın rengi
        tabBarInactiveTintColor: 'gray', // Seçili olmayan tabın rengi
        tabBarShowLabel: false, // Tab etiketlerini gizle
        tabBarStyle: {
          height: 70, // Tab bar yüksekliği artırıldı
          position: 'absolute',
          bottom: 0,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      
      {/* + Butonunu ekliyoruz */}
      <Tab.Screen
        name="AddButton"
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon name="add" size={40} color="white" />
          ),
          tabBarButton: (props) => (
            <CustomTabBarButton
              {...props}
              onPress={() => navigation.navigate('Add')} // + butonuna basılınca "Add" ekranına yönlendiriyoruz
            />
          ),
        }}
      >
        {/* Tab içeriği boş, sadece bir buton */}
        {() => null}
      </Tab.Screen>

      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

const Navigation = () => {
  const { userInfo, splashLoading } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {splashLoading ? (
          <Stack.Screen
            name="Splash Screen"
            component={SplashScreen}
            options={{ headerShown: false }}
          />
        ) : userInfo.Token ? (
          <>
            <Stack.Screen
              name="Anasayfa"
              component={MainTabNavigator}
              options={{ headerShown: false }}
            />
            {/* + Butonuna basılınca açılacak yeni ekran */}
            <Stack.Screen
              name="Add"
              component={OtherScreen} // Bu ekran yeni bir sayfa olarak gösterilecek
              options={{ headerShown: true, title: 'Yeni Oluştur' }} // İsteğe bağlı header
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ headerShown: false }}
            />
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
    elevation: 5, // Android için gölge
  },
});

export default Navigation;
