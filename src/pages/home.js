import React, {Component} from 'react';
import {Alert, AsyncStorage, StyleSheet, View, Text, Image, TouchableOpacity, TouchableHighlight, DrawerLayoutAndroid, ImageBackground, ScrollView, BackHandler} from 'react-native';
import Menu from '../Menu';
import {em} from '../commonUI/base';
import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';
import { NormalTextButton } from '../commonUI/components/buttons';
import Toast from 'react-native-root-toast';
import { ShowToast } from '../commonUI/components/elements';
import { setCurrentUser } from '../store/actions/authActions';
import { getErrors } from '../store/actions/errorActions';
import SplashScreen from 'react-native-smart-splash-screen'
    


// const myIcon = ()

class Home extends Component {

    static navigationOptions = {
		headerStyle: {
			display: 'none'
		}
	}
    constructor(props) {
        super(props) ;
        this.handleBackBtnClick = this.handleBackBtnClick.bind(this);
        this.isCheckEnd = false;
    }

    componentDidMount() {
        // SplashScreen.close({
        //     animationType: SplashScreen.animationType.scale,
        //     duration: 850,
        //     delay: 500,
        //  })
        this.props.navigation.addListener('willFocus', async () => {
            this.backHandler = BackHandler.addEventListener(
                'hardwareBackPress',
                this.handleBackBtnClick
            )
        })

        this.props.navigation.addListener('willBlur', () => {
            if(this.backHandler != null) {
                this.backHandler.remove();
            }
        })
    }


    handleBackBtnClick() {
        if(!this.isCheckEnd) {
            this.isCheckEnd = !this.isCheckEnd;
            setTimeout(() => {
                this.isCheckEnd = false;
            }, 2000);
            this.toast = Toast.show("Press here or back button again to exit.", {
				duration: 2000,
				position: 0,
				shadow: true,
				animation: true,
				hideOnPress: true,
				delay: 500,
				backgroundColor: 'black',
				shadowColor: '#ccc',
				textColor: 'white',
				onPress: () => {
				  BackHandler.exitApp();
				},
				onHidden: () => {
					this.toast.destroy();
					this.toast = null;
				}
			});
            return false;
        } else {
            BackHandler.exitApp();
        }
    }
    render() {
        return (
            
            <ImageBackground source={require('../commonUI/image/header.jpg')} style={{flex:1, width:'100%', height:'100%', resizeMode: 'cover'}}>
                <View style = {{flex:8, justifyContent:'center'}}>
                    <Text style = {{textAlign:'left', fontSize: 50*em, color:'white', paddingLeft:20}}>
                        Welcome to 
                    </Text>
                    <Text style = {{textAlign:'right', fontSize: 40*em, color:'white', paddingRight:20}}>
                        React Native App.
                    </Text>
                </View>
                
                    {!this.props.auth.isAuthenticated ? (
                    <View style = {{flex:1, flexDirection:'row', position:'absolute', bottom:0}}>
                        <View style = {{flex:1,  justifyContent:'center'}}>
                            <NormalTextButton 
                                onPress  = {() => {
                                    Actions.login();
                                    // Actions.jump('login');
                                    // this.props.navigation.navigate('login');
                                }} 
                                title = "Login" 
                                style = {{fontSize:40*em, borderWidth:0, height:'100%', backgroundColor:'#0bd', borderRightWidth:1, marginRight:0, marginLeft:0}}
                            /> 
                        </View>
                        <View style = {{flex:1, justifyContent:'center'}}>
                            <NormalTextButton 
                                onPress = {() => {Actions.signup()}} 
                                title = "Sign Up" 
                                style = {{fontSize:40*em, borderWidth:0, height:'100%', backgroundColor:'#0bd', marginRight:0, marginLeft:0 }}
                            />
                        </View>
                    </View>
                    ):(
                        <View style = {{flex:1,width:'100%',  position:'absolute', bottom:0, justifyContent:'center'}}>
                            <NormalTextButton 
                                onPress  = {() => {
                                    // Actions.dashboard();
                                    Actions.jump('dashboard');
                                }} 
                                title = "Dashboard" 
                                style = {{ fontSize:40*em, borderWidth:0, height:'100%', backgroundColor:'#0bd', borderRightWidth:1, marginRight:0, marginLeft:0}}
                            /> 
                        </View>
                    )}
                
            </ImageBackground>
        )
    }
}

class ImageSide extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            
                <View style = {[styles.imageside, this.props.style]}>
                    <TouchableOpacity onPress = {this.props.onPress}>
                        <View style = {[ { alignItems:'center'}]}>
                            <Image source = {this.props.source} style = {{ resizeMode:'cover', borderRadius:5}} />
                        </View>
                    
                        {this.props.title ? (
                            <Text style = {[{color:'white', marginTop:5, textAlign:'center'}, this.props.titlestyle]}>
                                {this.props.title}
                            </Text>
                        ) : (
                            null
                        )}
                    </TouchableOpacity>
                </View>
            
        )
    }
}

const styles = StyleSheet.create({
	container: {
      flex: 1,
	  // justifyContent: 'center',
	  // backgroundColor: '#F5FCFF'
	},
	instructions: {
        fontSize:25, 
        color:'white', 
        justifyContent:'center', 
        padding:20, 
        marginTop:50, 
        marginBottom:50
    },
    
    imageside: {
        flex:1,
        marginTop:30,
        marginBottom:30,
        alignItems:'center',
        flexDirection:'column'
        // width:'20%',
        // height: 100,
        // padding:'auto',
    },
  
	inputform: {
	  marginTop: 50*em,
	  flex:1,
	  justifyContent:'center'
	}, 
  
	buttontext: {
	  textAlign:'center', 
	  margin:5, 
	  padding:3, 
	  color:'white', 
	  borderWidth:1, 
	  borderColor:'#ccc' ,
	  alignItems:'center'
	}
});

const mapStateToProps = (state) => ({
    auth:state.auth
})

const mapDispatchToProps = {
    setCurrentUser : (data) => setCurrentUser(data),
    getErrors : (errors) => getErrors(errors)
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);