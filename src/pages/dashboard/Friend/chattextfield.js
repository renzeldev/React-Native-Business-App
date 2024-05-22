
import React, { useState, useRef, useMemo } from 'react';
import { StyleSheet, View, Text, FlatList, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { em } from '../../../commonUI/base';
import FIcon from 'react-native-vector-icons/FontAwesome';
import PhotoField from './photofield';
import AudioField from './audiofield';



const ChatTextField = ({chatRef, texts, curUser, targetUser, refreshing, getFriendHistory, fontsize, fontSizeBigger, fontSizeSmaller, ...props}) => {

    // const [text, setText] = useState('');
    const fontRef = useRef();
    // const [refreshing, setRefreshing] = useState(false);

    const _renderItem = ({item, index}) => {
        if(item.sender == targetUser || item.receiver == targetUser) {
            switch(item.type) {
                case 'photo':
                    return (
                        <PhotoField item = {item} curUser = {curUser} targetUser = {targetUser}/>
                    )
                case 'video':
                    return (
                        <View>

                        </View>
                    )
                case 'voice':
                    return (
                        <AudioField item = {item} curUser = {curUser} targetUser = {targetUser} />
                    )
                default:
                    return (
                        <View style = {[item.sender == curUser ? styles.myStyle: styles.yourStyle, styles.text]}>
                            <Text ref = { fontRef } style = {{ color: 'white', fontSize: fontsize*em }}>
                                {item.text}
                            </Text>
                            <Text style = {[ item.sender == curUser ? styles.myStyle: styles.yourStyle, styles.date]}>
                                {new Date(Number(item.date)).toLocaleString()}
                            </Text>
                        </View>
                    )
            }
            
        }
    }

    const scrollToEnd = () => {
        chatRef.current.scrollToEnd({animated: true});
    }

    

    const onRefresh = () => {
        getFriendHistory();
    }

    return (
        <View style = {{flex: 1, margin:10, borderWidth:2, borderColor:"#ccc", borderRadius:10}}>
            
                <ScrollView 
                        ref  = {chatRef}  
                        onContentSizeChange={scrollToEnd} 
                        refreshControl = { 
                            <RefreshControl 
                                refreshing = { refreshing }
                                onRefresh = { onRefresh }
                            /> 
                        }
                    >
                        {/* { useMemo (
                            () =>  */}
                        <FlatList 
                            // data = {props.discuss.chatTextData[targetUser] ? props.discuss.chatTextData[targetUser] : []}
                            data = {texts[targetUser]}
                            keyExtractor = {(item => item.date)}
                            renderItem = {_renderItem}
                            
                            vertical = {true}
                        />
                        {/* ), [ fontsize ] } */}
                    </ScrollView>
                
            
            <View style = {{ backgroundColor:'white', position:'absolute', bottom:10, right:10,  flexDirection:'row', alignSelf:'flex-end', borderRadius:10}}>
                <View style = {{marginLeft:5, borderRightWidth:1}}>   
                    <TouchableOpacity onPress = { fontSizeBigger }>
                        <FIcon name = 'search-plus' size = {40*em} color = '#006688'>        
                        </FIcon>
                    </TouchableOpacity>
                </View>
                <View style = {{marginRight:5, borderLeftWidth:1}}>   
                    <TouchableOpacity onPress = { fontSizeSmaller }>
                        <FIcon name = 'search-minus' size = {40*em} color = '#006688'>        
                        </FIcon>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    text: {
        flex:1, 
        // width:400*em, 
         
         
        borderRadius:10,
        padding:5,
        margin:10,
        flexDirection:'column',
        // fontSize:25*em
    },

    myStyle: {
        alignSelf:'flex-end',
        backgroundColor:'#rgba(0,255,0,0.8)',
    }, 

    yourStyle: {
        alignSelf:'flex-start', 
        backgroundColor:'#rgba(255,0,0,0.8)',
    },

    date: {
        backgroundColor:'#rgba(0,0,0,0.8)',
        marginTop:10,
        padding:2,
        color:'white',
        fontSize:15*em,
        borderRadius:10
    }
})

export default ChatTextField;