import React, {Component} from 'react'
import {View, Text, TextInput, ScrollView, Image, Alert, Animated, TouchableOpacity, PanResponder} from 'react-native'
import {connect} from 'react-redux';

import {em, H} from '../../../commonUI/base'
import {TopBar} from '../../../commonUI/components/topbar'
import {formStyles, actionButtonStyles} from '../../../commonUI/styles'
import {PrimaryButton, SecondaryButton, ImageButton, NormalTextButton} from '../../../commonUI/components/buttons'
import {InputField, InputMultipleTextFormWithTitle, InputSingleTextFormWithTitle, DateField, CheckField} from '../../../commonUI/components/inputs'
import {Actions} from 'react-native-router-flux';
import axios from 'axios';
import {SERVER_URL} from '../../../config';

import {getErrors} from '../../../store/actions/errorActions';

import ImagePicker from 'react-native-image-crop-picker';
import isEmpty from '../../../store/validation/is-empty';
import ModalComponent from '../../../commonUI/components/modal';
import { ProgressBarComponent } from '../../../commonUI/components/progress';
import Spin from '../../../commonUI/components/spin';

class Scene extends Component {
	static navigationOptions = {
		headerStyle: {
			display: 'none'
		}
	}

	constructor(props) {
		super(props);
		this.state = {
			side: 0,
			name:'',
			handle:'',
			password:'',
			password2:'',
			gender:'male',
			birthday:'2023-01-01',
			work:'',
			citizen_card:'',
			phone_number:'',
			others:'',
			image:null,
			checked:false,
			animatedHeight:new Animated.Value(0),
			isProgressVisible: false,
			progress: 0,
			loading: false,
		}
	}

	goBack() {
		// this.props.navigation.goBack();
		Actions.pop();		
	}
	onSubmit() {
		this.props.navigation.navigate('signup-id_card_upload')
	}

	changeSide(value) {
		this.setState({side: value});
		Animated.sequence([
			Animated.timing(
				this.state.animatedHeight,
				{
					toValue: -100,
					duration: 100
				}
			),
			Animated.timing(
				this.state.animatedHeight,
				{
					toValue: 0,
					duration: 500
				}
			),
		]).start();
		
		// this.setState({animatedHeight: new Animated.Value(-800)});
	}

	componentDidMount() {
		// Alert.alert(new Date().getDate());
	}

	componentDidUpdate() {
		
	}

	componentWillUnmount() {
		ImagePicker.clean().then(() => {
			
		}).catch(e => {
			alert(e);
		});
	}

	canSubmit() {
		if(this.state.name && this.state.handle && this.state.password && this.state.password2) {
			return true;
		} else {
			return false;
		}
	}

	onChangeTextField(field, value) {
		this.setState({[field]:value});
	}

	changeGender() {
		this.setState({gender: this.state.gender == 'male' ? 'female' : 'male'});
	}

	uploadAvatar() {
		this.setState({ progress:0 });
		let formData = new FormData();
		
		// Alert.alert(photo.path);
		let file = {
			// name: photo.path.split('/')[photo.path.split('/').length-1],
			// name: this.state.handle + '.' + this.state.image.mime.split('/')[1],
			name: this.state.handle + '.png',
			type: this.state.image.mime,
			uri: this.state.image.path
			// uri: `data:${photo.mime};base64,${photo.data}`
		}
		formData.append('file', file);
		this.setState({isProgressVisible : true});
		axios.request({
			method:'post',
			url: SERVER_URL + '/api/users/avatar',
			data: formData,
			headers: {
				'Content-Type' :'multipart/form-data',
			},
			onUploadProgress: (p) => {
				this.setState({progress: p.loaded/p.total});
			}
		}).then((res) => {
			this.setState({ progress:1 });
			this.setState({ isProgressVisible : false });
			
			this.setState({ loading: false });
			Actions.login();
		})
	}

	onSignUp() {
		if(this.state.password != this.state.password2) {
			Alert.alert('Error', "Please confirm your password.");
		} else {
			var filename;
			// if(this.state.image != null) {
			// 	filename = this.uploadAvatar();
			// }
			this.setState({loading: true});
			axios.post(SERVER_URL + '/api/users/register', {...this.state, image: this.state.image && this.state.handle + '.png'})
			.then(result => {
				if(this.state.image != null) {
					this.uploadAvatar();
					// Actions.login();
				} else {
					this.setState({loading: false});
					Actions.login();
				}	
			})
			.catch(err => this.props.getErrors(err.response.data));
			// Actions.login();
		}
	}
	render() {
		
		return (
			<View style = {{flex:1}}>
				<TopBar title="Sign Up" onBack={this.goBack.bind(this)}  />
				<ProgressBarComponent isVisible = {this.state.isProgressVisible} progress = {this.state.progress} />
				{this.state.loading ? (
					<Spin text = 'Waiting during signing up.'/>
				) : (
					<View style = {{flex:1}}>
						<Animated.View style = {{flex:8, justifyContent:'center', alignItems:'center', transform:[{translateY:this.state.animatedHeight}]}}>
						
							{this.state.side == 0 ? (
								<FirstSignPage 
									onChangeTextField = {this.onChangeTextField.bind(this)} 
									changeGender = {this.changeGender.bind(this)} 
									state = {this.state} 
								/>
							) : (
								<SecondSignPage 
									setImage = {(image) => {
										if(image == null) {
											this.setState({image:null});
										} else {
											this.setState({image:image})
										}	
									// this.setState({image:image})
									}
									} 
									onChangeTextField = {this.onChangeTextField.bind(this)} 
									changeGender = {this.changeGender.bind(this)} 
									state = {this.state} 
								/>
							)}
						</Animated.View>
						<View style = {{flex:2, flexDirection:'row', justifyContent:'center'}}>		
							<ImageButton ImageUrl = {require('../../../commonUI/image/left_arrow.png')}
								onPress = {() => {this.changeSide(0)}}
								disabled = {this.state.side == 0 ? (true) : (false)}
							/>
							<ImageButton ImageUrl = {require('../../../commonUI/image/right_arrow.png')}
								onPress = {() => {this.changeSide(1)}}
								disabled = {this.state.side == 1 ? (true):(false)}
							/>
						</View>
						<View style = {{flex:1, justifyContent:'center', alignItems:'center'}}>
							<NormalTextButton 
								onPress = {this.onSignUp.bind(this)}
								style = {{width: 400*em, backgroundColor: '#0bd', opacity: this.canSubmit() ? 1:0.2}}
								title = 'Sign Up'
								disabled = {!this.canSubmit()}
							/>
						</View>
					</View>
				)}
				
				
				{/* <Form onSubmit={this.onSubmit.bind(this)}/> */}
			</View>
		)
	}
}

const mapStateToProps = (state) => ({
	error: state.errorReducer
})

const mapDispatchToProps = {
	getErrors: (errors) => getErrors(errors)
}

export default connect(mapStateToProps, mapDispatchToProps)(Scene);

class FirstSignPage extends Component {

	onChangeTextField(field, value) {
		//   Alert.alert(field, value);
		this.props.onChangeTextField(field, value);
		// this.setState({[field]:value});
	}
	render() {
		const {state} = this.props
		return (
			<View>
				<InputSingleTextFormWithTitle 
					title = 'Name*'
					placeholder = "Input your name."
					placeholderTextColor = "grey"
					onChangeText = {this.onChangeTextField.bind(this)}
					fontColor = "black"
					isSecure = {false}
					field = "name" 
					value = {state.name}
				/>

				<View style = {{flexDirection:'row', marginBottom:20}}>
				
					<Text style = {{fontSize: 20*em, margin:20*em, width:120*em}}>Gender</Text>
					<CheckField label = "Male" onChange = {this.props.changeGender} checked = {state.gender == 'male'} textStyle = {{marginTop:20*em, marginBottom:20*em}} imageStyle = {{marginTop:20*em}} />
					<CheckField label = "Female" onChange = {this.props.changeGender} checked = {state.gender == 'female'} textStyle = {{marginTop:20*em, marginBottom:20*em}} imageStyle = {{marginTop:20*em}} />
				</View>

				<InputSingleTextFormWithTitle 
					title = 'Handle*'
					placeholder = "Input your handle."
					placeholderTextColor = "grey"
					onChangeText = {this.onChangeTextField.bind(this)}
					fontColor = "black"
					isSecure = {false}
					field = "handle"
					value = {state.handle}
				/>

				<InputSingleTextFormWithTitle 
					title = 'Password*'
					placeholder = "Input your password."
					placeholderTextColor = "grey"
					onChangeText = {this.onChangeTextField.bind(this)}
					fontColor = "black"
					isSecure = {true}
					field = "password"
					value = {state.password}
				/>

				<InputSingleTextFormWithTitle 
					title = 'Confirm*'
					placeholder = "Confirm your password."
					placeholderTextColor = "grey"
					onChangeText = {this.onChangeTextField.bind(this)}
					fontColor = "black"
					isSecure = {true}
					field = "password2"
					value = {state.password2}
				/>
			</View>
		)
	}
}

class SecondSignPage extends Component {


	constructor(props) {
		super(props);
		this.state = {
			image:null,
			moveX:0,
			moveY:0,
			opacity:1,
			isModalVisible: false
		}
		this._panResponder = {};
		this.image = null;
	}

	componentWillMount() {
		// Alert.alert("sdfdf");
		this._panResponder = PanResponder.create({
			onStartShouldSetPanResponder: (e, gestureState) => {
				if((this.state.image)) {
					return true;
				} else {
					return false;
				}
			},
			onMoveShouldSetPanResponder: (e, gestureState) => {
				return true;	
			},
			onPanResponderGrant: (e, gestureState) => {
				this.setState({opacity:0.5});
			},
			onPanResponderMove: (e, gestureState) => {
				this.setState({
					moveX:gestureState.dx,
					moveY:gestureState.dy
				})
				this._updatePosition();
			},
			onPanResponderRelease: (e, gestureState) => {
				if(gestureState.dx > 150*em || gestureState.dx < -150*em) {
					this.setState({image:null});
					this.props.setImage(null);
				}
				this.setState({
					moveX:0,
					moveY:0
				});
				this._updatePosition();
				this.setState({opacity:1});
			},
			onPanResponderTerminate:(e, gestureState) => {
				this.setState({opacity:1});
			},
		})
	}

	_updatePosition() {
		this.refs.avatar.setNativeProps({
			left:this.state.moveX,
			top:this.state.moveY,
			// zIndex:999,
		})
	}

	onChangeTextField(field, value) {
		//   Alert.alert(field, value);
		this.props.onChangeTextField(field, value);
		// this.setState({[field]:value});
	}

	onDateChangeField(field, value) {
		this.props.onChangeTextField(field, value);
	}

	closeModal() {
		this.setState({isModalVisible: false});
	}

	onPressCamera() {
		ImagePicker.openCamera({
			width: 300,
			height: 400,
			cropping: true,
			freeStyleCropEnabled: true,
			useFrontCamera: true,
			includeBase64: true
		}).then(image => {
			if(image) {
				this.setState({ image: image});
				this.props.setImage(image);
				this.setState({isModalVisible:false});
			}		
		}).catch(err => {
			return false;
		});
	}

	onPressGalary() {
		ImagePicker.openPicker({
			// width: 300,
			// height: 400,
			// cropping: true,
			includeBase64: true,
			useFrontCamera: true,
		}).then(image => {
			if(image) {
				this.setState({image:image});
				this.props.setImage(image);
				this.setState({isModalVisible:false});
			}
		}).catch(err => {
			return false;
		});
	}

	render() {
		const {state} = this.props;
		const defaultAvatar = state.gender == 'male' ? require('../../../commonUI/icon/extra/user.png') :  require('../../../commonUI/icon/extra/user_woman.png')
		return (
			<View>
				<ModalComponent 
					isVisible = {this.state.isModalVisible} 
					title = "Select to crop image." 
					contentType = "SelectAvatar" 
					closeModal = {this.closeModal.bind(this)}
					onPressCamera = {this.onPressCamera.bind(this)}
					onPressGalary = {this.onPressGalary.bind(this)}
				/>
				<DateField title = "Birthday" value = {state.birthday} name = 'birthday' placeholder = "Input your birthday" onChangeField = {this.onDateChangeField.bind(this)} />
				<InputSingleTextFormWithTitle 
					title = 'Job'
					placeholder = "Input your job."
					placeholderTextColor = "grey"
					onChangeText = {this.onChangeTextField.bind(this)}
					fontColor = "black"
					isSecure = {false}
					field = "work"
					value = {state.work}
				/>

				<InputSingleTextFormWithTitle 
					title = 'Certificate'
					placeholder = "Input your citizen card."
					placeholderTextColor = "grey"
					onChangeText = {this.onChangeTextField.bind(this)}
					fontColor = "black"
					field = "citizen_card"
					value = {state.citizen_card}
				/>

				<InputSingleTextFormWithTitle 
					title = 'Phone'
					placeholder = "Input your phone number."
					placeholderTextColor = "grey"
					onChangeText = {this.onChangeTextField.bind(this)}
					fontColor = "black"
					field = "phone_number"
					value = {state.phone_number}
				/>

				<InputMultipleTextFormWithTitle 
					title = "Other"
					placeholder = "Input description about yourself."
					placeholderTextColor = "grey"
					onChangeText = {this.onChangeTextField.bind(this)}
					fontColor = "black"
					field = "others"
					value = {state.others}
					style = {{marginBottom:20}}
					// limit = {5}
				/>

				<View style = {{flexDirection:'row', alignItems:'center'}}>
					<Text style = {{fontSize: 20*em, margin:20*em, width:120*em}}>Avatar</Text>
					<View style = {{flexDirection:'column'}} >
						<View  style = {{borderStyle:'dashed', borderWidth:2, borderColor:'#ccc', alignItems:'center'}}>
							<TouchableOpacity 
								onPress = {() => {
									this.setState({isModalVisible: true});
								}
							}>
								<Image
									{...this._panResponder.panHandlers}
									ref = "avatar"
									// source = {avatar == {}? avatar:require('../../../commonUI/images/注册_图片_人像.png')}
									// source = {isEmpty(this.state.image)? require('../../../commonUI/images/注册_图片_人像.png') : {uri: `data:${this.state.image.mime};base64,${this.state.image.data}`}}
									resizeMode = 'cover'
									source = {isEmpty(this.state.image)? defaultAvatar : {uri: `data:${this.state.image.mime};base64,${this.state.image.data}`}}
									// source = {isEmpty(this.state.image)? {uri: "file:///storage/emulated/0/Pictures/1.jpg"} : {uri: `data:${this.state.image.mime};base64,${this.state.image.data}`}}
									style = {{width:150*em, height:200*em, justifyContent:'center', opacity:this.state.opacity, left:this.state.moveX, top:this.state.moveY}}
								/>
							</TouchableOpacity>
						</View>
					</View>
				</View>
				<View style = {{display:this.state.image ? 'flex' : 'none', alignSelf:'flex-end'}}>	
					<Text style = {{fontSize:20*em}}>
						Hold and swipe out to remove.
					</Text>
				</View>
			</View>
		)
	}
}

class Form extends Component {
	constructor() {
		super();
		this.state = {
			formData: {
				user_phone: '',
				verify_code: ''
			}
		}
	}
	onChangeField(fieldName, fieldValue) {
		let {formData} = this.state;
		formData[fieldName] = fieldValue;
		this.setState({
			...this.state,
			formData: formData
		})
	}
	sendSubmit() {
		this.props.onSubmit();
	}
	render() {
		return (
			<View>
				<ScrollView style={formStyles.formWrapper}>
					<View style={formStyles.formInnerWrapper}>
						<InputField label='手机号' placeholder='请输入' name='user_phone' onChangeField={this.onChangeField.bind(this)} />
						<View style={{position: 'relative'}}>
							<InputField label='验证码' placeholder='输入验证码' name='verify_code' onChangeField={this.onChangeField.bind(this)} />
							<View style={{position: 'absolute', right: 0, top: 12*em}}>
								<SecondaryButton title='发送验证码' onPress={this.props.onPress}/>	
							</View>
						</View>
					</View>
				</ScrollView>
				<View style={actionButtonStyles.container}>
					<PrimaryButton title='下一步' onPress={this.sendSubmit.bind(this)}/>
				</View>
			</View>
		)
	}
}