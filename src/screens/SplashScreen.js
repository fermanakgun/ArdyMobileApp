import React from "react";
import { ActivityIndicator, View } from "react-native";

const SplashScreen =()=>{
    return (<View style={{flex:1,justifyContent:'center',backgroundColor:'#ffffff'}}>
        <ActivityIndicator size='large' color="#007BFF"/>
    </View>)
}

export default SplashScreen;