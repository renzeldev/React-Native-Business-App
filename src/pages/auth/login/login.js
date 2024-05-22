import React, {Component} from 'react';
import { View, Text, TextInput, ImageBackground, StyleSheet, Image, TouchableOpacity, KeyboardAvoidingView, Alert} from 'react-native';
import {connect} from 'react-redux'
import {W, em, colors, fontSizes} from '../../../commonUI/base';
import {CheckField, InputField, InputSingleTextFormWithImage} from '../../../commonUI/components/inputs';
import {TextButton, PrimaryButton, NormalTextButton} from '../../../commonUI/components/buttons';
import {setCurrentUser, setProfileLoading} from '../../../store/actions/authActions';
import {getErrors} from '../../../store/actions/errorActions';
import setAuthToken from '../../../store/utils/setAuthToken';
import axios from 'axios';
import {SERVER_URL} from '../../../config'
import {Actions} from 'react-native-router-flux';
import Toast from 'react-native-root-toast'; 
import { ShowToast } from '../../../commonUI/components/elements';
import isEmpty from '../../../store/validation/is-empty';
import Spin from '../../../commonUI/components/spin';
import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-community/async-storage';


const storage = new Storage({
	// maximum capacity, default 1000
	size: 10000,
  
	// Use AsyncStorage for RN apps, or window.localStorage for web apps.
	// If storageBackend is not set, data will be lost after reload.
	storageBackend: AsyncStorage, // for web: window.localStorage
	defaultExpires: null,
	// cache data in the memory. default is true.
	enableCache: true,
	// if data was not found in storage or expired data was found,
	// the corresponding sync method will be invoked returning
	// the latest data.
	sync: {
	  // we'll talk about the details later.
	}
});


class Scene extends Component {
	static navigationOptions = {
		headerStyle: {
			display: 'none'
		}
	}

	constructor(props) {
		super(props);
		this.state = {
		  handle:'',
		  password:'',
		  autoSave: false,
		}
	  }
	
	onChangeText(name, value) {
		this.setState({[name]:value})
	}

	onChangeTextField(field, value) {
		//   Alert.alert(field, value);
		  this.setState({[field]:value});
	}

	componentDidMount() {
		storage.load({
			key: 'autoSave',
			id: '1001',
			autoSync: true,
			syncInBackground: true,
			syncParams: {
				extraFetchOptions: {
				  // blahblah
				},
				someFlag: true
			}
		})
		.then(res => {
			if(res) {
				this.setState({autoSave: true});
				const data = JSON.parse(res);
				this.setState({handle: data.handle, password: data.password});
			}
		})
		.catch(err => console.log(err));
	}

	login(user_info) {
		axios.post(SERVER_URL + '/api/users/login', user_info)
		.then(res => {	
			if(this.state.autoSave) {
				storage.save({
					key: 'autoSave', // Note: Do not use underscore("_") in key!
					id: '1001', // Note: Do not use underscore("_") in id!
					data: JSON.stringify({ handle: this.state.handle, password: this.state.password}),
					expires: 1000 * 60
				  });
			} else {
				storage.remove({
					key: 'autoSave',
					id: '1001'
				});
			}		
			const {token} = res.data;
			setAuthToken(token);
			this.props.setCurrentUser(res.data.payload);
			ShowToast({type: 'success', title: 'Login Success', duration: 2000});
			Actions.dashboard();

		})
		.catch(err => {
			if(err.response.data) {
				this.props.getErrors(err.response.data);
				
			} else {
				Alert.alert('Whoops', 'Please check your network state.')
			}
		});
	}
	
	onPress() {
		this.login({handle: this.state.handle, password:this.state.password});
	}
	componentWillReceiveProps = (nextProps) => {
	  	if(nextProps.error.errors) {
			if(nextProps.error.errors.handle) {
				ShowToast({ type: 'warning', title: 'Invalid handle or input.', duration: 2000});
			} else if (nextProps.error.errors.password) {
		  		ShowToast({ type: 'warning', title: 'Incorrect password or input', duration: 2000});
			}
			
	  	}
	};
	
	
	render() {

		return (
			<ImageBackground source={require('../../../commonUI/image/header.jpg')} style={{flex:1, width:'100%', height:'100%', resizeMode: 'cover'}}>
				 <View style={styles.container}>
					<View style = {styles.inputform}>
						<View style = {{flexDirection:'row', marginBottom:20}}>
							<Image source = {require('../../../commonUI/image/icon_account.png')} style={{
								width: 54*em, height: 60*em, marginRight:10,
							}}/>
							<TextInput 
								placeholder = "Input your handle." 
								placeholderTextColor = 'white' 
								onChangeText = {this.onChangeText.bind(this, 'handle')}
								value = {this.state.handle}
								style = {{borderBottomWidth: 1, borderBottomColor: '#ccc', width: 300*em, height: 60*em, color:'white'}}
							/>
						</View>
						<InputSingleTextFormWithImage 
							ImageUrl = {require('../../../commonUI/image/icon_pw.png')}
							placeholder = "Input your password."
							placeholderTextColor = "white"
							onChangeText = {this.onChangeTextField.bind(this)}
							fontColor = "white"
							isSecure = {true}
							field = "password"
							value = {this.state.password}
						/>
						<NormalTextButton 
							onPress = {this.onPress.bind(this)}
							style = {styles.buttontext}
							title = 'Log In'
						/>
						<TouchableOpacity onPress={() => {Actions.signup()}} style={{}}>
							<Text style = {styles.buttontext}>
								Sign Up
							</Text>
						</TouchableOpacity>
						<CheckField 
							active = {true}
							label = "Save your info." 
							onChange = {() => { this.setState({autoSave : !this.state.autoSave}); }} 
							checked = { this.state.autoSave } 
							textStyle = {{marginTop:20*em, marginBottom:20*em}} 
							imageStyle = {{marginTop:20*em}} 
						/>
						<Text style={styles.welcome}>To get started, please log in.</Text>
						<Text style={styles.instructions}>If you cannot, please sign up.</Text>
					</View>	
				</View>
			</ImageBackground>
		)
	}
}




const styles = StyleSheet.create({
	container: {
	  flex: 1,
	  // justifyContent: 'center',
	  alignItems: 'center',
	  // backgroundColor: '#F5FCFF'
	},
	welcome: {
	  fontSize: 20,
	  textAlign: 'center',
	  margin: 10,
	  color: 'white'
	},
	instructions: {
	  textAlign: 'center',
	  color: 'white',
	  marginBottom: 5,
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
	auth: state.auth,
	error: state.errorReducer
})

const mapDispatchToProps = {
	setCurrentUser: (userCredentials) => setCurrentUser(userCredentials),
	getErrors: (errors) => getErrors(errors),
	setProfileLoading: () => setProfileLoading()
}

// export default connect(mapStateToProps, (dispatch) => ({
// 	setCurrentUser: (userCredentials) => dispatch(setCurrentUser(userCredentials)),
// 	getErrors: (errors) => dispatch(getErrors(errors))
// }))(Scene)

export default connect(mapStateToProps, mapDispatchToProps)(Scene);

