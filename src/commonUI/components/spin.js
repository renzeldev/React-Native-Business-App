import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

const spin = ({text}) => {
    return (
        <View style = {{flex:1, flexDirection:"row", alignItems:'center', backgroundColor:'rgba(0,0,0,0.4)', justifyContent:'center'}}>
            <ActivityIndicator 
                color = "#006688" 
                size = 'large'/>
                {/* <FastImage
                    source={spinner}
                    resizeMode={FastImage.resizeMode.contain}
                /> */}
            <Text style = {{color:'black'}}>
                {text}
            </Text>
        </View>
    )
}


export default spin;