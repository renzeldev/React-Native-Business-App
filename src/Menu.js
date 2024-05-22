import React, {Component} from 'react';
import {connect} from 'react-redux';
import {View, StyleSheet, Button, TouchableOpacity ,Image, Text, Alert, ImageBackground} from 'react-native';
import {Actions} from 'react-native-router-flux';
import setAuthToken from './store/utils/setAuthToken';
import { setCurrentUser } from './store/actions/authActions';
import FIcon from 'react-native-vector-icons/FontAwesome';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SERVER } from './config';
import { em } from './commonUI/base';

class Menu extends Component {
    constructor(props) {
        super(props);
    } 
    
    render() {
        const {user} = this.props.auth
        return (
            <View style={{ flex: 1 }}>
                {/* <Image source = {this.props.auth.isAuthenticated && this.props.auth.user.image?{uri: `data:${this.props.auth.user.image}`}:require('./commonUI/image/login_bg.png')} style = {{width:'100%', height:'30%'}}/> */}
                <View style = {{width:'100%', height: 250*em}}>
                    <ImageBackground source = {require('./commonUI/image/login_bg.png')} resizeMode = "cover" style = {{width:'100%', height:'100%'}}>
                        <Image source = {this.props.auth.isAuthenticated && user.image ? { uri: SERVER + '/avatar/' + user.image}:require('./commonUI/image/login_bg.png') } style = {{width:'100%', height:'100%'}} resizeMode = "contain" />
                    </ImageBackground>
                </View>
                <View style={styles.button} >
                    {!this.props.auth.isAuthenticated && (
                        <TouchableOpacity onPress = {() => this.props.onPress('login')}>
                        <View style = {{flexDirection:'row'}}>
                            {/* <Image source = {require('./commonUI/images/个人中心_图标_我的_选择状态.png')} style={{
                                    width: 40, height: 40, marginRight:20
                                }}/> */}
                            <Text 
                                style = {{fontSize:20, padding:10, color:'black'}}
                            ><MCIcon name = "login" size = {20} color = "#006688"/> Login/SignUp
                            </Text>
                        </View>
                        
                    </TouchableOpacity>
                    )}
                    
                </View>
                <View style={styles.button} >
                    <TouchableOpacity onPress = {() => {
                            if(!this.props.auth.isAuthenticated) {
                                Alert.alert(
                                    'Error', 
                                    'Please log in.', 
                                    [
                                        {
                                            text: 'Cancel',
                                            onPress: () => this.props.onPress('dashboard'),
                                            style: 'destructive'
                                        },
                                        {
                                            text: 'Login',
                                            // onPress: () => Actions.login()
                                            onPress: () => this.props.onPress('login')
                                        }
                                    ]
                                );
                            } else {
                                this.props.onPress('dashboard')
                            }
                        }}>
                        <View style = {{flexDirection:'row'}}>
                            {/* <Image source = {require('./commonUI/images/个人中心_图标_首页_选中状态.png')} style={{
                                    width: 40, height: 40, marginRight:20
                                }}/> */}
                            <Text 
                                style = {{fontSize:20, padding:10, color:'black'}}
                            ><MCIcon name = "view-dashboard" size = {20} color = "#006688"/> Dashboard
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={[styles.button, {display:this.props.auth.isAuthenticated? 'flex':'none', borderTopWidth:1, borderTopColor:'#ccc'}]} >
                    <TouchableOpacity onPress = {() => {
                            
                        }}>
                        <View style = {{flexDirection:'row'}}>
                            <Text 
                                style = {{fontSize:20, padding:10, color:'black'}}
                            ><MIcon name = 'schedule' size = {20} color = '#006688' /> Schedule
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress = {() => {
                            
                        }}>
                        <View style = {{flexDirection:'row'}}>
                            <Text 
                                style = {{fontSize:20, padding:10, color:'black'}}
                            ><MIcon name = 'edit' size = {20} color = '#006688' /> Task
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style = {[styles.button, {display:this.props.auth.isAuthenticated? 'flex' : 'none', borderTopWidth:1, borderTopColor:'#ccc'}]}>
                    <TouchableOpacity onPress = {() => {
                            this.props.setEboardDefault();
                            // Actions.eboard();
                            this.props.onPress('eboard');
                        }}>
                        <View style = {{flexDirection:'row'}}>
                            <Text 
                                style = {{fontSize:20, padding:10, color:'black'}}
                            ><MIcon name = 'dashboard' size = {20} color = '#006688' /> E-Board
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress = {() => {
                            // Actions.news();
                            this.props.onPress('news');
                        }}>
                        <View style = {{flexDirection:'row'}}>
                            <Text 
                                style = {{fontSize:20, padding:10, color:'black'}}
                            ><MCIcon name = 'new-box' size = {20} color = '#006688' /> News
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress = {() => {
                            
                        }}>
                        <View style = {{flexDirection:'row'}}>
                            <Text 
                                style = {{fontSize:20, padding:10, color:'black'}}
                            ><MIcon name = 'room-service' size = {20} color = '#006688' /> Service
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress = {() => {
                            // Actions.question();
                            this.props.onPress('question');
                        }}>
                        <View style = {{flexDirection:'row'}}>
                            <Text 
                                style = {{fontSize:20, padding:10, color:'black'}}
                            ><MIcon name = 'question-answer' size = {20} color = '#006688' /> Question
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress = {() => {
                            // Actions.friend();
                            this.props.onPress('friend');
                        }}>
                        <View style = {{flexDirection:'row'}}>
                            <Text 
                                style = {{fontSize:20, padding:10, color:'black'}}
                            ><MIcon name = 'group' size = {20} color = '#006688' /> Friend
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style = {[styles.button, {display:this.props.auth.isAuthenticated? 'flex' : 'none', borderTopWidth:1, borderTopColor:'#ccc'}]}>
                    <TouchableOpacity onPress = {() => {
                        setAuthToken(false);
                        this.props.setCurrentUser({});
                        this.props.onPress('login');    
                    }}>
                        <View style = {{flexDirection:'row'}}>
                            <Text 
                                style = {{fontSize:20, padding:10, color:'black'}}
                            ><FIcon name = 'sign-out' size = {20} color = '#006688' /> Logout
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

styles = StyleSheet.create({
    button: {
        margin: 10,
        marginBottom: 0,
        justifyContent:'center'
        // flexDirection: 'row',
    }
})

const mapStateToProps = (state) => ({
    eboard: state.eboard,
    auth: state.auth
})

const mapDispatchToProps = {
    setEboardDefault: () => { return { type: 'DEFAULT_SETTING' } },
    setCurrentUser: (userCredentials) => setCurrentUser(userCredentials),
}


export default connect(mapStateToProps, mapDispatchToProps)(Menu);

// export default connect(mapStateToProps)(Menu)