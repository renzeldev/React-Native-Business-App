import React from 'react';
import {View, StyleSheet, TouchableOpacity, Text, FlatList, ScrollView} from 'react-native';
import { em } from '../../../commonUI/base';
import FIcon from 'react-native-vector-icons/FontAwesome';

const FriendsOnlineStatus = ({onPress, friends, newMsg, targetUser, ...props}) => {

    const _renderItem = ({item, index}) => {

        return (
            <TouchableOpacity onPress = {() => {
                onPress(item.handle);
            }}>
            <View style = {{flexDirection:'row', borderBottomWidth:1, backgroundColor: item.handle == targetUser ? '#rgba(0,255,0, 0.6)' : '#rgba(0,0,0,0.2)' }}>
                
                    <View style = {{flex:1, alignItems:'center', justifyContent:'center'}}>
                        {item.gender == 'male' ? (
                            <FIcon name = "male" size = {25} color = "#006688"/>
                        ) : (
                            <FIcon name = "female" size = {25} color = "#006688"/>
                        )}
                    </View>
                    <View style = {{flex:4}}>
                        <Text style = {{padding:15, justifyContent:'center'}}>
                            {item.handle}
                        </Text>
                    </View>
                    <View style = {{flex:1, alignItems:'center', justifyContent:'center'}}>
                        {/* {item.status && (<FIcon name = "rss" size = {25} color = "#006688"/>)} */}
                        {newMsg.map(mem => mem).indexOf(item.handle) != -1 && (<FIcon name = "commenting-o" size = {25} color = "#006688"/>)}
                    </View>
                    <View style = {{flex:1, alignItems:'center', justifyContent:'center'}}>
                        {/* {item.status && (<FIcon name = "rss" size = {25} color = "#006688"/>)} */}
                        {props.discuss.loginFriends.map(mem => mem).indexOf(item.handle) != -1 && (<FIcon name = "rss" size = {25} color = "#006688"/>)}
                    </View>
                
            </View>
            </TouchableOpacity>
        )
        
    }

    return (
        <View style={{ flex: 1 }}>
            <Text style = {{textAlign:'center', fontSize: 30*em, color:'black'}}>
                Online Status
            </Text>
            <View style = {{flex:1, flexDirection:'column', margin:5, borderTopWidth:1, borderBottomWidth:1}}>
                <ScrollView>
                    <FlatList 
                        data = {friends}
                        keyExtractor = {(item => item._id)}
                        renderItem = {_renderItem}
                        vertical = {true}
                    />
                </ScrollView>
            </View>        
        </View>
    )
}

styles = StyleSheet.create({
    button: {
        margin: 10,
        marginBottom: 0,
        justifyContent:'center'
        // flexDirection: 'row',
    }
})




export default FriendsOnlineStatus;

// export default connect(mapStateToProps)(Menu)