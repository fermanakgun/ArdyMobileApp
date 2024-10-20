import React, { useContext } from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { AuthContext } from '../context/AuthContext';

const HomeScreen = () => {
  const {userInfo,logout,isLoading,customerInfo} = useContext(AuthContext);
  return (
    <View
      style={styles.container}>
            <Spinner visible={isLoading} animation='fade'></Spinner>
            <Text style={styles.welcome}>Hoşgeldin {customerInfo.FirstName} {customerInfo.LastName}</Text>
            <Button title='Çıkış Yap'  onPress={logout}/>
    </View>
  );
};
const styles = StyleSheet.create({
  container:{
    flex:1,
    alignItems:'center',
    justifyContent:'center'
  },
  welcome:{
    fontSize:18,
    marginBottom:8
  }
})

export default HomeScreen;